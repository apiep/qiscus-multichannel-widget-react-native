import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  currentUserAtom,
  lastUserTokenAtom,
  qiscusAtom,
  roomIdAtom,
  STORAGE,
} from '../state';
import type { Account } from '../types';
import { useAtomCallbackWithDeps } from './use-atom-callback-with-deps';
import { useSetUser } from './use-set-user';
import { useUpdateRoomInfo } from './use-update-room-info';

export function useInitialSetup() {
  const setUser = useSetUser();
  const updateRoomInfo = useUpdateRoomInfo();

  const initialSetup = useAtomCallbackWithDeps(async (get, set) => {
    const qiscus = get(qiscusAtom);
    const lastUserData: Account | undefined = await AsyncStorage.getItem(
      STORAGE.lastUserData
    ).then((it) => (it != null ? JSON.parse(it) : undefined));
    const lastUserToken = await AsyncStorage.getItem(STORAGE.lastUserToken);
    const lastRoomId = await AsyncStorage.getItem(STORAGE.lastRoomId);
    const lastAppId = await AsyncStorage.getItem(STORAGE.lastAppId);

    if (lastUserData != null && lastUserToken != null) {
      setUser({
        userId: lastUserData.id,
        displayName: lastUserData.name,
        avatarUrl: lastUserData.avatarUrl,
        userProperties: lastUserData.extras,
      });
      set(lastUserTokenAtom, lastUserToken);
      set(currentUserAtom, lastUserData);

      // Internal code should not be used unless you know what you are doing
      // @ts-ignore
      qiscus.storage.setAppId(lastAppId);
      // @ts-ignore
      qiscus.storage.setCurrentUser(lastUserData);
      // @ts-ignore
      qiscus.storage.setToken(lastUserToken);
    }

    if (lastRoomId != null) {
      set(roomIdAtom, parseInt(lastRoomId, 10));
    }

    await updateRoomInfo();
  }, []);

  return initialSetup;
}
