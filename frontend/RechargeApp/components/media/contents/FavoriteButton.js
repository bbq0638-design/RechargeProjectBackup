import React, {useState} from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const COLORS = {
  primary: '#004E89',
  primaryDark: '#003766',
  yellow: '#F4C10F',
  text: '#000',
  border: '#D1D5DB',
  white: '#FFFFFF',
  shadow: '#000',
};

export default function FavoriteButton({
  type = 'default', // default | square | overlaySmall
  isFavorite,
  onPress,
  style,
}) {
  const [pressed, setPressed] = useState(false);

  // 플레이리스트용 버전
  if (type === 'square') {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[
          styles.squareBox,
          {backgroundColor: isFavorite ? COLORS.primary : COLORS.white},
          style,
        ]}>
        <MaterialCommunityIcons
          name={isFavorite ? 'star' : 'star-outline'}
          size={20}
          color={isFavorite ? COLORS.yellow : COLORS.primary}
        />
      </TouchableOpacity>
    );
  }
  // 앨범아트 즐겨찾기 버튼용
  if (type === 'overlaySmall') {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.overlayBtnNew, style, {backgroundColor: '#004e89'}]}
        activeOpacity={0.9}
        hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
        <MaterialCommunityIcons
          name={isFavorite ? 'star' : 'star-outline'}
          size={20}
          color={isFavorite ? COLORS.yellow : '#F5F5F5'}
        />
      </TouchableOpacity>
    );
  }

  // 영화 상세글용
  const bgColor = pressed
    ? isFavorite
      ? COLORS.primaryDark
      : COLORS.border
    : isFavorite
      ? COLORS.primary
      : COLORS.white;

  const textColor = isFavorite ? COLORS.white : COLORS.text;
  const iconColor = isFavorite ? COLORS.yellow : COLORS.primary;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.defaultButton, {backgroundColor: bgColor}, style]}>
      <View style={styles.row}>
        <MaterialCommunityIcons
          name={isFavorite ? 'star' : 'star-outline'}
          size={20}
          color={iconColor}
        />
        <Text style={[styles.label, {color: textColor}]}>
          {isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  /** default (기존) */
  defaultButton: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,

    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  /** square */
  squareBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** overlaySmall */
  overlayBtnNew: {
    position: 'absolute',
    top: 6,
    right: 6,
    padding: 4,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
