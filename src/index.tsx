import { PortalProvider } from '@gorhom/portal';
import invariant from 'invariant';
import { useUpdateAtom } from 'jotai/utils';
import React, { useEffect } from 'react';
import { appIdAtom } from './state';
export { Header } from './components/header/index';
export {
  useClearUser,
  useCurrentChatRoom,
  useCurrentUser,
  useDebounceValue,
  useDeleteMessage,
  useDifference,
  useGetUnreadCount,
  useInitiateChat,
  useLoadMoreMessages,
  useMessages,
  useMultichannelWidget,
  useOnMessageDeleted,
  useOnMessageDelivered,
  useOnMessageRead,
  useOnMessageReceived,
  useOnUserTyping,
  useQiscus,
  useSendMessage,
  useSetup,
  useUpdateRoomInfo,
} from './hooks/index';
export { MultichannelWidget } from './screens/multichannel-widget';
export { IAvatarConfig, IRoomSubtitleConfig } from './types';

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}

const WidgetContext = React.createContext(undefined);

type IWidgetProviderProps = {
  appId: string;
  children: React.ReactNode;
};

function WidgetProvider(props: IWidgetProviderProps) {
  const appId = props.appId;
  invariant(appId, 'MultichannelWidgetProvider must have `appId` as a prop');

  const setAppId = useUpdateAtom(appIdAtom);
  useEffect(() => {
    setAppId(appId);
  }, [appId]);

  return (
    <WidgetContext.Provider value={undefined}>
      {props.children}
    </WidgetContext.Provider>
  );
}

export function MultichannelWidgetProvider(props: IWidgetProviderProps) {
  return (
    <PortalProvider>
      <WidgetProvider appId={props.appId}>{props.children}</WidgetProvider>
    </PortalProvider>
  );
}
