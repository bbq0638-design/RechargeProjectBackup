import React, {useEffect, useState, useRef} from 'react';
import {Text, View, StyleSheet, ScrollView, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CommentSection from '../../../components/common/CommentSection';
import MovieInfo from '../../../components/media/contents/MovieInfo';
import FavoriteButton from '../../../components/media/contents/FavoriteButton';
import UserRecommendBox from '../../../components/media/contents/UserRecommendBox';
import ReportModal from '../../../components/common/ReportModal';
import {
  fetchMovieDetail,
  fetchMoviePostDetail,
  deleteMoviePost,
} from '../../../utils/Movieapi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingAnimation from '../../../components/common/LoadingAnimation';
import MovieOtherPostsSection from '../../../components/media/lists/MovieOtherPostsSection';
import MovieSimilarSection from '../../../components/media/lists/MovieSimilarSection';
import {toggleBookmark, checkBookmark} from '../../../utils/BookmarkApi';
import {submitReport} from '../../../utils/ReportApi';

export default function MovieDetail({route}) {
  const {movieId, type} = route.params;
  const [movie, setMovie] = useState(null);
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [showSimilar, setShowSimilar] = useState(false);
  const [isReportModalVisible, setReportModalVisible] = useState(false);
  const scrollRef = useRef(null);

  const isUserPost = type === 'post';
  const isMine = movie?.userId === loggedInUserId;
  const isAdmin = loggedInUserId === 'admin';

  // 이동 시 맨 위로
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({y: 0, animated: true});
    }, 0);
  }, [movieId]);

  // 인기 및 게시글 구분
  useEffect(() => {
    const load = async () => {
      const id = await AsyncStorage.getItem('userId');
      setLoggedInUserId(id);

      const data =
        type === 'popular'
          ? await fetchMovieDetail(movieId)
          : await fetchMoviePostDetail(movieId);

      setMovie(data);

      if (id && data) {
        const targetType = type === 'post' ? 'moviepost' : 'movie';
        const targetId = type === 'post' ? data.moviePostId : data.movieId;

        const bookmarked = await checkBookmark({
          userId: id,
          targetType,
          targetId,
        });

        setIsFavorite(bookmarked);
      }
    };

    load();
  }, [movieId]);

  // 백엔드에서 불러올 영화 데이터
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

  if (!movie)
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <LoadingAnimation size={140} />
      </View>
    );

  // 수정 이동
  const handleEdit = () => {
    navigation.navigate('MoviePostScreen', {
      postId: movie.moviePostId,
      editMode: true,
    });
  };

  // 삭제
  const handleDelete = async () => {
    Alert.alert('삭제하시겠어요?', '삭제 후에는 복구할 수 없습니다.', [
      {text: '취소'},
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMoviePost(movie.moviePostId);
            navigation.goBack(); // 목록으로 이동
          } catch (err) {
            console.log('삭제 실패:', err);
          }
        },
      },
    ]);
  };

  // 신고 제출
  const handleReportPress = () => {
    if (!loggedInUserId) {
      Alert.alert('알림', '로그인이 필요한 서비스입니다.');
      return;
    }

    setReportModalVisible(true);
  };

  const handleReportSubmit = async reason => {
    setReportModalVisible(false);

    try {
      const res = await submitReport({
        reportTargetType: 'moviepost',
        reportTargetId: movie.moviePostId,
        userId: loggedInUserId,
        reportTargetUserId: movie.userId,
        reportReason: reason,
      });

      if (res.status === 'SUCCESS') {
        Alert.alert('완료', '신고가 정상적으로 접수되었습니다.');
      } else if (res.status === 'ALREADY_REPORTED') {
        Alert.alert('알림', '이미 신고하신 게시글입니다.');
      } else {
        Alert.alert('실패', '신고에 실패했습니다.');
      }
    } catch (e) {
      Alert.alert('오류', '통신 중 문제가 발생했습니다.');
    }
  };

  if (!movie) {
    return (
      <View style={styles.loading}>
        <LoadingAnimation size={140} />
      </View>
    );
  }

  const handlePressNickname = async () => {
    if (!movie) return;

    const myUserId = await AsyncStorage.getItem('userId');

    if (myUserId === movie.userId) {
      navigation.navigate('MyPage');
    } else {
      navigation.navigate('YourPageScreen', {
        targetUserId: movie.userId,
        targetUserNickname: movie.userNickname,
      });
    }
  };

  return (
    <ScrollView
      ref={ref => (scrollRef.current = ref)}
      style={styles.container}
      contentContainerStyle={{paddingBottom: 50}}
      showsVerticalScrollIndicator={false}>
      {/* ⭐ 영화 정보 */}
      <MovieInfo
        movie={mapMovieData(movie)}
        viewType={isUserPost ? 'postDetail' : 'movie'}
        isMine={isMine} // 로그인 후 비교 예정
        isAdmin={isAdmin}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReport={handleReportPress}
      />

      {/* 즐겨찾기 */}
      <FavoriteButton
        isFavorite={isFavorite}
        onPress={async () => {
          if (!loggedInUserId || !movie) return;

          const result = await toggleBookmark({
            userId: loggedInUserId,
            targetType: type === 'post' ? 'moviepost' : 'movie',
            targetId: type === 'post' ? movie.moviePostId : movie.movieId,
          });

          setIsFavorite(Boolean(result));
        }}
        style={{marginTop: 10}}
      />

      {/* 추천 이유 컴포넌트 */}
      {isUserPost && (
        <UserRecommendBox
          reason={movie.moviePostText}
          nickname={movie.userNickname}
          style={{marginTop: 20}}
          onPressNickname={handlePressNickname}
        />
      )}

      {/* ⭐ 댓글 */}
      {movie && (
        <View style={{marginTop: 10}}>
          <CommentSection
            targetType={isUserPost ? 'moviepost' : 'movie'}
            targetId={isUserPost ? movie.moviePostId : movie.movieId}
            currentUserId={loggedInUserId}
          />
        </View>
      )}
      {/* 비슷한 장르 및 게시글 작성자의 다른 게시글 이동, 게시글 없으면 비슷한 장르로 자동 변경 */}
      {/* 이용자 게시글이면 → 다른 게시글 먼저 */}
      {isUserPost && !showSimilar && (
        <MovieOtherPostsSection
          userId={movie.userId}
          onEmpty={() => setShowSimilar(true)}
          onPressItem={post =>
            navigation.push('MovieDetail', {
              movieId: post.moviePostId,
              type: 'post',
            })
          }
        />
      )}

      {/* 게시글 없으면 → 비슷한 영화 */}
      {(!isUserPost || showSimilar) && (
        <MovieSimilarSection
          movieId={movieId}
          onPressItem={movie =>
            navigation.push('MovieDetail', {
              movieId: movie.id,
              type: 'popular',
            })
          }
        />
      )}

      <ReportModal
        isVisible={isReportModalVisible}
        onClose={() => setReportModalVisible(false)}
        onSubmit={handleReportSubmit}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 16,
  },
});
