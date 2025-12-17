import React, {useState} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ICONS = {
  movie: 'movie-open',
  music: 'music',
  board: 'comment-outline',
  alarm: 'bell-outline',
  notice: 'bullhorn-outline',
  mypage: 'account-outline',
  logout: 'logout',
  profileEdit: 'pencil-box-outline',
  commentDelete: 'trash-can-outline',
  commentEdit: 'pencil-outline',
  like: {
    on: 'heart',
    off: 'heart-outline',
  },
  fortune: 'star-four-points-outline',
  charge: 'map-marker-outline',
  currentLocation: 'crosshairs-gps',
  report: 'alarm-light-outline',
  filter: 'tune-variant',
  search: 'magnify',
  setting: 'cog',
  play: 'play-circle',
};

export default function IconButton({
  type,
  size = 24,
  color = '#333',
  onPress,
  toggled = false,
  style,
}) {
  const [pressed, setPressed] = useState(false);

  const iconName =
    type === 'like' ? (toggled ? ICONS.like.on : ICONS.like.off) : ICONS[type];

  const iconColor = type === 'like' ? (toggled ? '#FF3B30' : color) : color;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.button, style, pressed && styles.pressedBackground]}>
      <MaterialCommunityIcons name={iconName} size={size} color={iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    borderRadius: 8,
  },
  pressedBackground: {
    backgroundColor: '#e5e5e5',
  },
});