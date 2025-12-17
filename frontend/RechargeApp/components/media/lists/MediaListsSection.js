import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import MediaCards from '../cards/MediaCards';
import Button from '../../common/Button';
import LoadingAnimation from '../../common/LoadingAnimation';

export default function MediaListSection({
  title,
  items = [],
  variant = 'movie', // 'movie' | 'music' | 'post'
  loading = false,
  onPressItem,
  onFavoriteToggle,
  onRecommendPress,
}) {
  return (
    <View style={styles.container}>
      {/* 섹션 제목 */}
      <Text style={styles.sectionTitle}>{title}</Text>

      {/* 가로 스크롤 카드 리스트 */}
      {loading ? (
        <View style={{paddingVertical: 30}}>
          <LoadingAnimation size={100} />
        </View>
      ) : !items || items.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            해당 장르에 등록된 컨텐츠가 없습니다.
          </Text>

          <Button
            type="submit"
            text="추천하러 가기"
            height={44}
            onPress={onRecommendPress}
          />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}>
          {items.map(item => (
            <MediaCards
              key={item.id}
              title={item.title || item.name}
              author={item.author}
              image={
                variant === 'movie'
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path ?? item.image}`
                  : item.image
              }
              variant={variant}
              isFavorite={item.isFavorite}
              onFavoriteToggle={() => onFavoriteToggle?.(item.id)}
              onPress={() => onPressItem?.(item)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  scrollContainer: {
    paddingLeft: 10,
    paddingRight: 4,
  },

  emptyBox: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 219,
  },

  emptyText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 40,
  },
});
