import React, {useState, useEffect, useCallback} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import MediaHomeContentCard from '../../../components/media/cards/MediaHeroContentCard';
import AiRecommendSection from '../../../components/media/cards/AiRecommendCard';
import Button from '../../../components/common/Button';
import GenreSelector from '../../../components/media/cards/GenreSelector';
import MediaListSection from '../../../components/media/lists/MediaListsSection';
import AiRecommendModal from '../../../components/media/contents/AiRecommendModal';
import {
  fetchAllMusic,
  fetchAllMusicPosts,
  fetchTopConcerts,
} from '../../../utils/Musicapi';
import {fetchUserBookmarks, toggleBookmark} from '../../../utils/BookmarkApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MUSIC_GENRES = [
  {id: 'ALL', name: '전체'},
  {id: 'MUSIC1', name: '국내'},
  {id: 'MUSIC2', name: '해외'},
];

function FindMusicScreen() {
  const navigation = useNavigation();
  const [showAimodal, setShowAiModal] = useState(false);

  const [allMusic, setAllMusic] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [favoriteMap, setFavoriteMap] = useState({});
  const [userMusicPosts, setUserMusicPosts] = useState([]);
  const [concertPosters, setConcertPosters] = useState([]);

  const toggleFavorite = async musicId => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return;

    setAllMusic(prev =>
      prev.map(item =>
        item.id === musicId ? {...item, isFavorite: !item.isFavorite} : item,
      ),
    );

    try {
      const result = await toggleBookmark({
        userId,
        targetType: 'music',
        targetId: musicId,
      });

      // 서버 기준으로 보정
      setAllMusic(prev =>
        prev.map(item =>
          item.id === musicId ? {...item, isFavorite: Boolean(result)} : item,
        ),
      );
    } catch (e) {
      // 실패 시 롤백
      setAllMusic(prev =>
        prev.map(item =>
          item.id === musicId ? {...item, isFavorite: !item.isFavorite} : item,
        ),
      );
      console.log('music bookmark toggle error:', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUserPosts();
      loadAllMusic();
    }, []),
  );

  const loadAllMusic = async () => {
    try {
      const data = await fetchAllMusic();
      const userId = await AsyncStorage.getItem('userId');

      const formatted = data.map(m => ({
        id: m.musicId,
        title: m.musicTitle,
        author: m.musicSinger,
        image: m.musicImagePath,
        categoryId: m.commonCategoryId,
        isFavorite: false,
      }));

      if (userId && formatted.length > 0) {
        const bookmarks = await fetchUserBookmarks(userId);

        const bookmarkedIds = new Set(
          bookmarks
            .filter(b => b.bookmarkTargetType === 'music')
            .map(b => b.bookmarkTargetId),
        );

        setAllMusic(
          formatted.map(m => ({
            ...m,
            isFavorite: bookmarkedIds.has(m.id),
          })),
        );
      } else {
        setAllMusic(formatted);
      }

      setLoading(false);
    } catch (err) {
      console.log('전체 음악 로딩 실패:', err);
      setLoading(false);
    }
  };
  const filteredMusic =
    selectedCategory === 'ALL'
      ? allMusic
      : allMusic.filter(m => m.categoryId === selectedCategory);

  const loadUserPosts = async () => {
    try {
      const data = await fetchAllMusicPosts();

      const posts = data.map(post => {
        return {
          id: post.musicPostId,
          postId: post.musicPostId,
          title: post.musicPostTitle,
          author: post.userNickname || post.userId,
          image: post.firstImagePath,
        };
      });

      setUserMusicPosts(posts);
    } catch (err) {
      console.log('이용자 추천 음악 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    const loadConcerts = async () => {
      try {
        const data = await fetchTopConcerts();
        const posters = data.map(item => item.poster);
        setConcertPosters(posters);
      } catch (err) {
        console.log('콘서트 불러오기 실패:', err);
      }
    };

    loadConcerts();
  }, []);

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 상단 히어로 섹션 */}
        <MediaHomeContentCard
          title="콘서트 정보"
          subtitle="출처: 공연예술통합전산망"
          posters={concertPosters}
        />
        {/* AI 추천 */}
        <AiRecommendSection
          title="음악 AI 추천 받기"
          onPress={() => setShowAiModal(true)}
        />
        {/* 해외/국내 선택 */}
        <GenreSelector
          genres={MUSIC_GENRES}
          onSelect={genre => {
            setSelectedCategory(genre.id);
          }}
        />

        {/* 인기 음악 spotify 이용 예정 */}
        <MediaListSection
          title="인기 음악"
          items={filteredMusic}
          variant="musicChart"
          onFavoriteToggle={toggleFavorite}
        />

        {/* 이용자 추천 음악 */}
        <MediaListSection
          title="이용자 추천 음악"
          items={userMusicPosts}
          variant="music"
          onPressItem={music =>
            navigation.navigate('MusicDetail', {postId: music.postId})
          }
        />

        <View style={styles.bottomArea}>
          <Button
            type="submit"
            text="음악 추천하러 가기"
            height={50}
            onPress={() => navigation.navigate('MusicPostScreen')}
          />
        </View>
      </ScrollView>
      {/* Ai 추천 모달 */}
      <AiRecommendModal
        visible={showAimodal}
        onClose={() => setShowAiModal(false)}
        contentType="musicChart"
        onResultPress={(item, type) => {
          navigation.navigate('MusicDetail', {musicId: item.id});
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9F9',
  },
  bottomArea: {
    paddingHorizontal: 16,
    paddingVertical: 30,
  },
});

export default FindMusicScreen;
