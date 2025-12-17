import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

import FavoriteButton from '../contents/FavoriteButton';
import {musicImagePath} from '../../../utils/Musicapi';

const MediaCards = ({
  title,
  author,
  image,
  onPress,
  variant,
  isFavorite = false,
  showFavorite = true,
  onFavoriteToggle,
  style,
}) => {
  const resolvedImage =
    variant === 'music' || variant === 'musicChart'
      ? musicImagePath(image, 300)
      : image;

  if (variant === 'musicChart') {
    return (
      <View style={[styles.card, styles.chartCard, style]}>
        {/* 앨범아트 */}
        <View style={styles.imageWrapper}>
          <Image source={{uri: resolvedImage}} style={styles.chartImage} />
        </View>

        {/* 2열 구조 */}
        <View style={styles.rowWrapper}>
          {/* 왼쪽: 제목 + 가수 */}
          <View style={styles.leftColumn}>
            <Text style={styles.titleText} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.artistText} numberOfLines={1}>
              {author}
            </Text>
          </View>

          {/* 오른쪽: FavoriteButton 옮김 */}
          <View style={styles.rightColumn}>
            {showFavorite && (
              <FavoriteButton
                type="overlaySmall"
                isFavorite={isFavorite}
                onPress={onFavoriteToggle}
              />
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.card,
        variant === 'music' ? styles.musicCard : styles.movieCard,
        style,
      ]}>
      {/* 포스터 */}
      <Image
        source={{uri: resolvedImage}}
        style={variant === 'music' ? styles.musicImage : styles.movieImage}
      />

      {/* 제목 */}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {/* 작성자 */}
      {author && (
        <Text style={styles.author} numberOfLines={1}>
          by {author}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
  },

  /* --- 기존 영화 카드 --- */
  movieCard: {
    width: 140,
  },
  movieImage: {
    width: 140,
    height: 200,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: '#e3e3e3',
  },

  /* --- 기존 음악 카드 --- */
  musicCard: {
    width: 140,
  },
  musicImage: {
    width: 140,
    height: 140,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: '#e3e3e3',
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  author: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },

  /* --- 새로운 음악 차트 카드 --- */
  chartCard: {
    width: 140,
  },

  // 앨범아트
  imageWrapper: {
    position: 'relative',
    marginBottom: 10,
  },

  chartImage: {
    width: 140,
    height: 140,
    borderRadius: 14,
    backgroundColor: '#e3e3e3',
  },

  // 즐겨찾기 버튼 (우측 상단)
  favoriteWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },

  // 아래 텍스트 + 아이콘 2열 구조
  rowWrapper: {
    flexDirection: 'row',
    marginTop: 6,
  },

  leftColumn: {
    flex: 1,
    flexDirection: 'column',
  },

  rightColumn: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 제목
  titleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },

  // 가수
  artistText: {
    fontSize: 13,
    color: '#666',
  },
});

export default MediaCards;
