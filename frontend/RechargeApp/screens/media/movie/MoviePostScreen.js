import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';

import MediaSearchBar from '../../../components/media/contents/MediaSearchBar';
import MovieInfo from '../../../components/media/contents/MovieInfo';
import LoadingAnimation from '../../../components/common/LoadingAnimation';
import Button from '../../../components/common/Button';
import TextArea from '../../../components/common/TextArea';
import {
  fetchMovieDetail,
  createMoviePost,
  fetchMoviePostDetail,
  updateMoviePost,
} from '../../../utils/Movieapi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MoviePostScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  // 수정 모드 확인
  const {postId = null, editMode = false} = route.params ?? {};

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [userId, setUserId] = useState(null);

  const fadeAnim = useState(new Animated.Value(0))[0];

  const isSubmitDisabled = !selectedMovie || !reason.trim();

  // 선택 애니메이션
  useEffect(() => {
    if (!selectedMovie) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedMovie]);

  // 아이디 가져오기
  useEffect(() => {
    const loadUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    loadUserId();
  }, []);

  // 수정 모드일 경우 기존 게시글 데이터 불러오기
  useEffect(() => {
    if (editMode && postId) {
      loadPostData(postId);
    }
  }, [editMode, postId]);

  // 기존 글 불러와서 input을 채워보아요
  const loadPostData = async id => {
    try {
      setLoading(true);

      const post = await fetchMoviePostDetail(id);

      setSelectedMovieId(post.movieId);
      setSelectedMovie(mapMovieData(post));
      setReason(post.moviePostText);
    } catch (err) {
      console.log('게시글 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };
  // api -> movieinfo 구조로 변환
  const mapMovieData = data => ({
    title: data.movieTitle,
    poster_path: data.moviePoster,
    vote_average: data.movieScore,
    overview: data.movieComment,
    release_date: data.movieDate,
    director: data.movieDirector,
    actors: data.movieActor,
    genres: data.genreName ? [{name: data.genreName}] : [],
  });

  /* 백엔드 상세 호출 */
  const loadMovieDetail = async movieId => {
    try {
      setLoading(true);
      const detail = await fetchMovieDetail(movieId);
      return mapMovieData(detail); // ⭐ 변환 적용
    } finally {
      setLoading(false);
    }
  };

  // 검색한 영화 선택
  const handleMovieSelect = useCallback(
    async movie => {
      const id = movie.movieId ?? movie.id;
      setSelectedMovieId(id);

      const detail = await loadMovieDetail(id);
      setSelectedMovie(detail);
    },
    [loadMovieDetail],
  );
  // 게시글 등록
  const handleSubmit = async () => {
    if (editMode) {
      // 수정(update)
      try {
        await updateMoviePost(postId, {
          movieId: selectedMovieId,
          moviePostTitle: selectedMovie.title,
          moviePostText: reason,
          updatedId: userId,
        });

        Alert.alert('수정 완료', '게시글이 수정되었습니다.');

        navigation.push('MovieDetail', {
          movieId: postId,
          type: 'post',
        });
      } catch (err) {
        console.log('수정 실패:', err);
      }
      return;
    }

    // 신규 등록(create)
    try {
      const newPostId = await createMoviePost({
        userId,
        movieId: selectedMovieId,
        moviePostTitle: selectedMovie.title,
        moviePostText: reason,
      });

      navigation.navigate('MovieDetail', {
        movieId: newPostId,
        type: 'post',
      });
    } catch (err) {
      console.log('등록 실패:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* 고정된 검색창 */}
      <View style={styles.searchWrapper}>
        <MediaSearchBar
          type="movie"
          placeholder="영화 제목을 검색하세요"
          hideResults={false}
          onSelect={handleMovieSelect}
        />
      </View>

      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* 안내 박스 */}
        {!loading && !selectedMovie && (
          <Animated.View style={[styles.infoBox, {opacity: fadeAnim}]}>
            <Text style={styles.infoTitle}>영화 검색을 시작해보세요</Text>
            <Text style={styles.infoDesc}>
              검색창에 영화 제목을 입력하면 정보를 보여드릴게요
            </Text>
          </Animated.View>
        )}

        {/* 로딩 */}
        {loading && <LoadingAnimation style={{marginTop: 20}} />}

        {/* 영화 상세 */}
        {!loading && selectedMovie && (
          <View style={{marginTop: 20}}>
            <MovieInfo movie={selectedMovie} viewType="postWrite" />

            <Button
              type="submit"
              text="영화 다시 선택하기 ✨"
              height={44}
              onPress={() => {
                setSelectedMovie(null);
                setReason('');
              }}
              style={{marginBottom: 16}}
            />
          </View>
        )}

        {/* 추천 이유 */}
        <Text style={styles.reasonLabel}>이 영화를 추천하는 이유</Text>

        <TextArea
          value={reason}
          onChangeText={setReason}
          placeholder="이 영화를 추천하는 이유를 작성해주세요"
          maxLength={300}
          autoGrow={false}
          style={{marginTop: 8, height: 130}}
        />

        {/* 제출 */}
        <Button
          type="submit"
          text={editMode ? '게시글 수정하기' : '추천글 등록하기'}
          height={48}
          disabled={isSubmitDisabled}
          onPress={handleSubmit}
          style={{marginTop: 20, marginBottom: 40}}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  /* 🔥 검색창 absolute 고정 */
  searchWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: '#FAFAFA',
    zIndex: 9999,
    elevation: 9999,
  },

  content: {
    paddingTop: 90, // 🔥 검색창 높이만큼 아래로 내림
    paddingHorizontal: 16,
    paddingBottom: 40,
    backgroundColor: '#FAFAFA',
  },

  infoBox: {
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    minHeight: 300,
    justifyContent: 'center',
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },

  infoDesc: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },

  reasonLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginTop: 20,
  },
});
