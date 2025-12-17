import React, {useRef, useCallback, useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, Text, Dimensions} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import MediaCards from '../../media/cards/MediaCards';
import MediaTab from '../buttontabs/MediaTab';
import {fetchUserBookmarks, toggleBookmark} from '../../../utils/BookmarkApi';
import {fetchMoviePostList} from '../../../utils/Movieapi';

const {width} = Dimensions.get('window');

export default function FavoriteMediaList({
  userId,
  onPressItem,
  hideFavorite = false,
}) {
  const [activeTab, setActiveTab] = useState('movie');
  const scrollRef = useRef(null);

  const [movies, setMovies] = useState([]);
  const [music, setMusic] = useState([]);

  const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

  const normalizeBookmark = bm => {
    switch (bm.bookmarkTargetType) {
      case 'movie':
        return {
          id: bm.bookmarkTargetId,
          title: bm.title,
          image: bm.image,
          type: 'movie',
        };

      case 'music':
        return {
          id: bm.bookmarkTargetId,
          title: bm.musicTitle,
          author: bm.musicSinger,
          image: bm.musicImagePath,
          type: 'music',
        };

      case 'musiclist':
        return {
          id: bm.musicListId,
          title: bm.listMusicTitle,
          author: bm.listMusicSinger,
          image: bm.listMusicImage,
          type: 'musiclist',
        };

      default:
        return null;
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!userId) return;

      const loadBookmarks = async () => {
        try {
          const bookmarks = await fetchUserBookmarks(userId);

          // 🔹 movie / music
          const movieItems = [];
          const musicItems = [];

          bookmarks.forEach(bm => {
            const normalized = normalizeBookmark(bm);
            if (!normalized) return;

            if (normalized.type === 'movie') movieItems.push(normalized);
            if (
              normalized.type === 'music' ||
              normalized.type === 'musiclist'
            ) {
              musicItems.push(normalized);
            }
          });

          // 🔹 moviepost
          const moviePostIds = new Set(
            bookmarks
              .filter(b => b.bookmarkTargetType === 'moviepost')
              .map(b => b.bookmarkTargetId),
          );

          if (moviePostIds.size > 0) {
            const posts = await fetchMoviePostList();

            const moviePostItems = posts
              .filter(p => moviePostIds.has(p.moviePostId))
              .map(p => ({
                id: p.moviePostId,
                title: p.moviePostTitle,
                image: p.moviePoster, // ⭐ 이미 TMDB 적용됨
                author: p.userNickname, // ⭐ 닉네임 포함
                type: 'moviepost',
              }));

            setMovies([...movieItems, ...moviePostItems]);
          } else {
            setMovies(movieItems);
          }

          setMusic(musicItems);
        } catch (e) {
          console.log('즐겨찾기 불러오기 실패:', e);
        }
      };

      loadBookmarks();
    }, [userId]),
  );

  const handleTabPress = useCallback(tab => {
    setActiveTab(tab);
    scrollRef.current?.scrollTo({
      x: tab === 'movie' ? 0 : width,
      animated: true,
    });
  }, []);

  const handleScrollEnd = useCallback(e => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / width);
    setActiveTab(pageIndex === 0 ? 'movie' : 'music');
  }, []);

  return (
    <View style={styles.container}>
      <MediaTab activeTab={activeTab} onChangeTab={handleTabPress} />

      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        style={styles.pager}>
        {/* 🎬 영화 */}
        <View style={[styles.page, {width}]}>
          <ScrollView contentContainerStyle={styles.grid}>
            {movies.length > 0 ? (
              movies.map(item => (
                <MediaCards
                  key={`${item.type}-${item.id}`}
                  title={item.title}
                  author={item.author}
                  image={item.image}
                  variant="movie"
                  onPress={() => onPressItem?.(item, item.type)}
                />
              ))
            ) : (
              <Text style={styles.empty}>즐겨찾기한 영화가 없습니다.</Text>
            )}
          </ScrollView>
        </View>

        {/* 🎵 음악 */}
        <View style={[styles.page, {width}]}>
          <ScrollView contentContainerStyle={styles.grid}>
            {music.length > 0 ? (
              music.map(item => (
                <MediaCards
                  key={`${item.type}-${item.id}`}
                  title={item.title}
                  author={item.author}
                  image={item.image}
                  variant="musicChart"
                  showFavorite={!hideFavorite}
                  isFavorite={true} // ⭐ 항상 true
                  onFavoriteToggle={async () => {
                    try {
                      await toggleBookmark({
                        userId,
                        targetType: item.type, // music | musiclist
                        targetId: item.id,
                      });

                      // ⭐ UI에서 즉시 제거
                      setMusic(prev =>
                        prev.filter(
                          m => !(m.type === item.type && m.id === item.id),
                        ),
                      );
                    } catch (e) {
                      console.log('즐겨찾기 해제 실패:', e);
                    }
                  }}
                />
              ))
            ) : (
              <Text style={styles.empty}>즐겨찾기한 음악이 없습니다.</Text>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  pager: {
    marginTop: 20,
  },
  page: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 5,
    paddingBottom: 50,
    marginLeft: 15,
  },
  card: {
    marginBottom: 22,
    marginRight: 16,
  },
  empty: {
    textAlign: 'center',
    color: '#777',
    fontSize: 14,
    paddingVertical: 40,
  },
});