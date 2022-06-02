import { useUpdateAtom } from 'jotai/utils';
import { useCallback } from 'react';
import {
  roomSenderAvatarEnabledAtom,
  roomSubtitleConfigAtom,
  roomSubtitleTextAtom,
  roomSystemEventHiddenAtom,
} from '../state';
import {
  IAvatarConfig,
  IChatRoomConfigSetter,
  IRoomSubtitleConfig,
} from '../types';
import { useAtomCallbackWithDeps } from './use-atom-callback-with-deps';

export const useSetRoomSubTitle: () => IChatRoomConfigSetter['setRoomSubTitle'] =
  () => {
    const setRoomSubtitleText = useUpdateAtom(roomSubtitleTextAtom);
    const setRoomSubtitleConfig = useUpdateAtom(roomSubtitleConfigAtom);

    return useCallback(
      (enabled: IRoomSubtitleConfig, subtitle?: string) => {
        setRoomSubtitleConfig(enabled);
        setRoomSubtitleText(subtitle);
      },
      [setRoomSubtitleConfig, setRoomSubtitleText]
    );
  };
export const useSetHideUIEvent = () =>
  useAtomCallbackWithDeps((_, set) => {
    set(roomSystemEventHiddenAtom, true);
  }, []);
export const useSetAvatar = () =>
  useAtomCallbackWithDeps((_, set, arg: IAvatarConfig) => {
    set(roomSenderAvatarEnabledAtom, arg === IAvatarConfig.Enabled);
  }, []);
