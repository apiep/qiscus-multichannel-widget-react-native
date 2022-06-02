import { atom, useAtom } from 'jotai';
import * as React from 'react';
import { useMemo } from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useCurrentUser } from '../../hooks';
import { useComputedAtomValue } from '../../hooks/use-computed-atom-value';
import {
  navigationColorThemeAtom,
  navigationTitleColorThemeAtom,
  roomSubtitleConfigAtom,
  roomSubtitleTextAtom,
  roomTitleAtom,
  subtitleAtom,
  titleAtom,
  typingStatusAtom,
} from '../../state';
import { IRoomSubtitleConfig } from '../../types';

type IProps = {
  height?: number;
  title?: string;
  onBack: () => void;
};

export const Header = React.memo(
  function Header({ height, title, onBack }: IProps) {
    const [navigationBgColor] = useAtom(navigationColorThemeAtom);
    const containerStyle: StyleProp<ViewStyle> = useMemo(() => {
      const style = { ...styles.container, backgroundColor: navigationBgColor };
      if (height != null) style.height = height;
      return style;
    }, [navigationBgColor, height]);

    const _title = useTitle(title);
    const _subtitle = useSubtitle();

    return (
      <View style={containerStyle}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Image source={require('../../assets/arrow-left.png')} />
          <Avatar />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <Content title={_title} subtitle={_subtitle} />
        </View>
      </View>
    );
  },
  (prev, next) => prev.title === next.title
);

function Avatar() {
  const user = useCurrentUser();
  const isLoggedIn = useMemo(() => user != null, [user]);
  const avatarUrl = useMemo(
    () =>
      isLoggedIn
        ? require('../../assets/chat_connecting.png')
        : require('../../assets/defaultAvatar.png'),
    [isLoggedIn]
  );

  return (
    <View style={styles.avatarContainer}>
      <Image style={styles.avatar} source={avatarUrl} />
    </View>
  );
}

function Content(props: { title: string; subtitle: string }) {
  const [navigationFgColor] = useAtom(navigationTitleColorThemeAtom);
  const user = useCurrentUser();
  const isConnecting = useMemo(() => user == null, [user]);

  const titleStyle = useMemo(
    () => ({ ...styles.title, color: navigationFgColor }),
    [navigationFgColor]
  );
  const subtitleStyle = useMemo(
    () => ({ ...styles.subtitle, color: navigationFgColor }),
    [navigationFgColor]
  );

  return (
    <View style={styles.content}>
      <Text style={titleStyle}>{props.title}</Text>
      <Text style={subtitleStyle}>
        {isConnecting ? 'Connecting...' : props.subtitle}
      </Text>
    </View>
  );
}

function useTitle(title?: string) {
  return useComputedAtomValue((get) => {
    const roomTitle = get(roomTitleAtom);
    if (roomTitle != null) return roomTitle;
    if (title != null) return title;
    return get(titleAtom);
  });
}

function useSubtitle(subtitle?: string) {
  return useComputedAtomValue((get) => {
    const roomSubtitleConfig = get(roomSubtitleConfigAtom);
    const roomSubtitleText = get(roomSubtitleTextAtom);
    const isTyping = get(typingStatusAtom);

    if (roomSubtitleConfig === IRoomSubtitleConfig.Disabled) return null;
    if (
      (roomSubtitleConfig === IRoomSubtitleConfig.Enabled ||
        roomSubtitleConfig === IRoomSubtitleConfig.Editable) &&
      isTyping
    )
      return 'Typing...';
    if (roomSubtitleConfig === IRoomSubtitleConfig.Enabled)
      return get(subtitleAtom);
    if (
      roomSubtitleConfig === IRoomSubtitleConfig.Editable &&
      roomSubtitleText != null
    )
      return roomSubtitleText;
    if (subtitle != null) return subtitle;
    return get(subtitleAtom);
  });
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backBtn: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatarContainer: {
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
    marginRight: 12,
  },
  contentContainer: { flex: 1 },
  content: {
    marginTop: 0,
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
