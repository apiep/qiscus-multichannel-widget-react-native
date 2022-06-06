import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import invariant from 'invariant';
import { useAtomCallback } from 'jotai/utils';
import { useMemo, useRef } from 'react';
import {
  channelIdAtom,
  currentUserAtom,
  deviceIdAtom,
  messageExtrasAtom,
  optionsAtom,
  qiscusAtom,
  roomIdAtom,
  STORAGE,
  userConfigAvatarAtom,
  userConfigDisplayNameAtom,
  userConfigIdAtom,
  userConfigPropertiesAtom,
} from '../state';
import type { InitiateChatOptions } from '../types';
import { useAtomCallbackWithDeps } from './use-atom-callback-with-deps';
import { useCurrentUser } from './use-current-user';
import { useGetSessions } from './use-get-sessions';
import { useSetup } from './use-setup';
import { useUpdateRoomInfo } from './use-update-room-info';

const resolvedText = 'admin marked this conversation as resolved' as const;

export function useInitiateChat(appId?: string | undefined) {
  const isInitiating = useRef(false);
  const user = useCurrentUser();
  const isLoggedIn = useMemo(() => user != null, [user]);

  const setup = useSetup();
  const initiateChat_ = _useInitiateChat();

  const initiateChat = useAtomCallbackWithDeps(
    async (get) => {
      if (isInitiating.current === true) return;
      if (isLoggedIn === true) return;

      console.log('isInitiating', isInitiating.current);
      isInitiating.current = true;

      const userId = get(userConfigIdAtom);

      invariant(
        appId,
        'Missing `appId`, make sure you wrap your application inside `MultichannelWidgetProvider`'
      );
      invariant(
        userId,
        'Missing `userId`, make sure you have invoked `setUser` method'
      );

      const displayName = get(userConfigDisplayNameAtom);
      const deviceId = get(deviceIdAtom);
      const channelId = get(channelIdAtom);
      const avatar = get(userConfigAvatarAtom);
      const userProperties = get(userConfigPropertiesAtom);

      await setup(appId!);
      await initiateChat_({
        userId: userId!,
        name: displayName ?? userId!,
        deviceId,
        channelId,
        avatar,
        userProperties,
      });
    },
    [appId]
  );

  return initiateChat;
}

function _useInitiateChat() {
  const updateRoomInfo = useUpdateRoomInfo();
  const getSessions = useGetSessions();

  let cb = useAtomCallback(async (get, set, arg: InitiateChatOptions) => {
    const qiscus = get(qiscusAtom);
    const opts = get(optionsAtom);
    const currentUser = get(currentUserAtom);
    const lastRoomId = get(roomIdAtom);

    if (currentUser != null && lastRoomId != null) {
      const [room, messages] = await updateRoomInfo();

      const lastMessageText1 = room?.lastMessage?.text;
      const lastMessageText2 = messages[messages.length - 1]?.text;

      const lastMessageResolved = [lastMessageText1, lastMessageText2]
        .map((it) => it?.toLowerCase())
        .some((it) => it?.includes(resolvedText) === true);
      const roomExtrasResolved = room?.extras?.is_resolved === true;

      const isResolved = roomExtrasResolved || lastMessageResolved;
      const isSessional = isResolved ? await getSessions() : false;

      console.log(
        `room are resolved(${isResolved}) and sessional(${isSessional})`
      );
      if (!isSessional) {
        console.log('room are not sessional, using existing room');
        await updateRoomInfo();
        return currentUser;
      }
    }

    const nonce = await qiscus.getJWTNonce();
    let data = {
      app_id: qiscus.appId,
      user_id: arg.userId,
      name: arg.name,
      avatar: arg.avatar,
      sdk_user_extras: arg.extras,
      user_properties: arg.userProperties,
      nonce,
    };

    // @ts-ignore
    if (arg.channelId != null) data.channel_id = arg.channelId;

    const baseUrl = opts.baseURLMultichannel;
    const resp = await axios
      .post(`${baseUrl}/api/v2/qiscus/initiate_chat`, data)
      .then((r) => r.data.data)
      .catch((e) => {
        throw new Error(JSON.parse(e.request.response).errors.message);
      });

    const { identity_token, customer_room } = resp;
    const roomId = Number(customer_room.room_id);
    const user = await qiscus.setUserWithIdentityToken(identity_token);
    const userToken = qiscus.token;

    await AsyncStorage.multiSet([
      [STORAGE.lastRoomId, roomId.toString()],
      [STORAGE.lastUserId, user.id],
      [STORAGE.lastUserData, JSON.stringify(user)],
      [STORAGE.lastUserToken, userToken],
      [STORAGE.lastAppId, qiscus.appId],
    ]);

    if (arg.deviceId != null) {
      await qiscus.registerDeviceToken(arg.deviceId, false);
    }

    set(roomIdAtom, roomId);
    set(messageExtrasAtom, arg.messageExtras);
    set(currentUserAtom, (_) => user);

    await updateRoomInfo();

    return user;
  });

  return cb;
}
