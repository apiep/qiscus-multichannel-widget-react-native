import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useEffect } from 'react';
import {
  appIdAtom,
  baseColorThemeAtom,
  channelIdAtom,
  deviceIdAtom,
  emptyBackgroundColorThemeAtom,
  emptyTextColorThemeAtom,
  fieldChatBorderColorThemeAtom,
  fieldChatTextColorThemeAtom,
  leftBubbleColorThemeAtom,
  leftBubbleTextColorThemeAtom,
  navigationColorThemeAtom,
  navigationTitleColorThemeAtom,
  notificationEnabledAtom,
  rightBubbleColorThemeAtom,
  rightBubbleTextColorThemeAtom,
  roomTitleAtom,
  sendContainerBackgroundColorThemeAtom,
  sendContainerColorThemeAtom,
  systemEventTextColorThemeAtom,
  timeBackgroundColorThemeAtom,
  timeLabelTextColorThemeAtom,
} from '../state';
import type { IUseMultichannelWidget } from '../types';
import {
  useSetAvatar,
  useSetHideUIEvent,
  useSetRoomSubTitle,
} from './hooks-helpers';
import { useClearUser } from './use-clear-user';
import { useDebounceValue } from './use-debounce-value';
import { useInitialSetup } from './use-initial-setup';
import { useInitiateChat } from './use-initiate-chat';
import { useSetUser } from './use-set-user';

export function useMultichannelWidget(): IUseMultichannelWidget {
  const [appId] = useAtom(appIdAtom);
  const setUser = useSetUser();
  const initiateChat = useInitiateChat(appId);
  const initialSetup = useInitialSetup();
  const clearUser = useClearUser();
  const setRoomSubTitle = useSetRoomSubTitle();
  const setHideUIEvent = useSetHideUIEvent();
  const setAvatar = useSetAvatar();

  useEffect(() => {
    initialSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setEnableNotification = useUpdateAtom(notificationEnabledAtom);
  const setDeviceId = useUpdateAtom(deviceIdAtom);
  const setChannelId = useUpdateAtom(channelIdAtom);
  const setRoomTitle = useUpdateAtom(roomTitleAtom);

  // theme
  const set_navigationColorThemeAtom = useUpdateAtom(navigationColorThemeAtom);
  const set_appBarColorThemeAtom = useUpdateAtom(navigationTitleColorThemeAtom);
  const set_sendContainerColorThemeAtom = useUpdateAtom(
    sendContainerColorThemeAtom
  );
  const set_fieldChatBorderColorThemeAtom = useUpdateAtom(
    fieldChatBorderColorThemeAtom
  );
  const set_fieldChatTextColorThemeAtom = useUpdateAtom(
    fieldChatTextColorThemeAtom
  );
  const set_sendContainerBackgroundColorThemeAtom = useUpdateAtom(
    sendContainerBackgroundColorThemeAtom
  );
  const set_navigationTitleColorThemeAtom = useUpdateAtom(
    navigationTitleColorThemeAtom
  );
  const set_systemEventTextColorThemeAtom = useUpdateAtom(
    systemEventTextColorThemeAtom
  );
  const set_leftBubbleColorThemeAtom = useUpdateAtom(leftBubbleColorThemeAtom);
  const set_rightBubbleColorThemeAtom = useUpdateAtom(
    rightBubbleColorThemeAtom
  );
  const set_leftBubbleTextColorThemeAtom = useUpdateAtom(
    leftBubbleTextColorThemeAtom
  );
  const set_rightBubbleTextColorThemeAtom = useUpdateAtom(
    rightBubbleTextColorThemeAtom
  );
  const set_timeLabelTextColorThemeAtom = useUpdateAtom(
    timeLabelTextColorThemeAtom
  );
  const set_timeBackgroundColorThemeAtom = useUpdateAtom(
    timeBackgroundColorThemeAtom
  );
  const set_baseColorThemeAtom = useUpdateAtom(baseColorThemeAtom);
  const set_emptyTextColorThemeAtom = useUpdateAtom(emptyTextColorThemeAtom);
  const set_emptyBackgroundColorThemeAtom = useUpdateAtom(
    emptyBackgroundColorThemeAtom
  );

  // @ts-ignore
  return useDebounceValue(
    {
      // @ts-ignore
      initiateChat,
      setUser,
      setDeviceId,
      setChannelId,
      clearUser,
      //
      setEnableNotification,
      setRoomTitle,
      setRoomSubTitle,
      setHideUIEvent,
      setAvatar,

      // Themes
      setNavigationColor: set_navigationColorThemeAtom,
      setAppBarColor: set_appBarColorThemeAtom,
      setSendContainerColor: set_sendContainerColorThemeAtom,
      setFieldChatBorderColor: set_fieldChatBorderColorThemeAtom,
      setFieldChatTextColor: set_fieldChatTextColorThemeAtom,
      setSendContainerBackgroundColor:
        set_sendContainerBackgroundColorThemeAtom,
      setNavigationTitleColor: set_navigationTitleColorThemeAtom,
      setSystemEventTextColor: set_systemEventTextColorThemeAtom,
      setLeftBubbleColor: set_leftBubbleColorThemeAtom,
      setRightBubbleColor: set_rightBubbleColorThemeAtom,
      setLeftBubbleTextColor: set_leftBubbleTextColorThemeAtom,
      setRightBubbleTextColor: set_rightBubbleTextColorThemeAtom,
      setTimeLabelTextColor: set_timeLabelTextColorThemeAtom,
      setTimeBackgroundColor: set_timeBackgroundColorThemeAtom,
      setBaseColor: set_baseColorThemeAtom,
      setEmptyTextColor: set_emptyTextColorThemeAtom,
      setEmptyBackgroundColor: set_emptyBackgroundColorThemeAtom,
    },
    500
  );
}
