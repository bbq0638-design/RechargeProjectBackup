import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../common/Button';
import IconButton from '../../common/iconButton';
import UserPostActionBar from '../../common/UserPostActionBar';

function MovieInfo({
  movie,
  viewType = 'movie',
  isMine = false,
  isAdmin = false,
  onEdit,
  onDelete,
  onReport,
}) {
  if (!movie) return null;

  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  const showOverview = viewType !== 'postWrite';

  const showActionBar = viewType === 'postDetail';

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        {/* 제목 */}
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {movie.title}
        </Text>
        {/* 게시글 액션 버튼 */}
        {showActionBar && (
          <UserPostActionBar
            isMine={isMine}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={onDelete}
            onReport={onReport}
            style={styles.actionRow}
          />
        )}
      </View>

      {/* 포스터 + 오른쪽 정보 */}
      <View style={styles.row}>
        <Image source={{uri: posterUrl}} style={styles.poster} />

        <View style={styles.infoRight}>
          {/* 상단: 감독 / 출연 */}
          <View style={styles.topBox}>
            {movie.director && (
              <Text style={styles.metaText}>
                <Text style={styles.metaLabel}>감독: </Text>
                {movie.director}
              </Text>
            )}

            {movie.actors && (
              <Text style={[styles.metaText, {marginTop: 6}]}>
                <Text style={styles.metaLabel}>출연: </Text>
                {movie.actors}
              </Text>
            )}
          </View>

          {/* 하단: chipRow 4개 → 2행 2열 */}
          <View style={styles.bottomBox}>
            {/* 평점 */}
            <View style={styles.chipRow}>
              <MaterialCommunityIcons name="star" size={16} color="#f4c10f" />
              <Text style={styles.chipText}>
                {movie.vote_average?.toFixed(1)}
              </Text>
            </View>

            {/* 장르 (2개만) */}
            <View style={styles.chipRow}>
              <MaterialCommunityIcons
                name="movie-open"
                size={16}
                color="#004e89"
              />
              <Text style={styles.chipText}>
                {movie.genres?.[0]?.name || '장르 없음'}
              </Text>
            </View>

            {/* 개봉일 */}
            <View style={styles.releaseRow}>
              <MaterialCommunityIcons
                name="calendar-month"
                size={18}
                color="#004e89"
              />
              <Text style={styles.releaseText}>
                {`${movie.release_date?.slice(0, 4)}년 ${movie.release_date?.slice(5, 7)}월 ${movie.release_date?.slice(8, 10)}일 개봉`}
              </Text>
            </View>

            {/* 러닝타임 */}
            {movie.runtime && (
              <View style={styles.chipRow}>
                <MaterialCommunityIcons
                  name="clock-time-three"
                  size={16}
                  color="#004E89"
                />
                <Text style={styles.chipText}>{movie.runtime}분</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* 유튜브 트레일러 */}
      <View style={{alignItems: 'center', marginTop: 20}}>
        <Button
          type="submit"
          text="🎬 트레일러 보러가기"
          width="100%"
          onPress={() =>
            Linking.openURL(
              `https://m.youtube.com/results?search_query=${encodeURIComponent(
                movie.title + ' trailer',
              )}`,
            )
          }
        />
      </View>

      {/* 줄거리 */}
      {showOverview && movie.overview && (
        <View style={styles.section}>
          <Text style={styles.sectionOverview}>{movie.overview}</Text>
        </View>
      )}
    </View>
  );
}

export default MovieInfo;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    elevation: 2,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    flexShrink: 1,
    color: '#111',
    maxWidth: '60%',
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    marginRight: 0.5,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  row: {
    flexDirection: 'row',
  },

  poster: {
    width: 120,
    height: 180,
    borderRadius: 10,
    backgroundColor: '#e2e2e2',
  },

  infoRight: {
    flex: 1,
    marginLeft: 14,
    height: 180,
    justifyContent: 'space-between',
  },

  metaLabel: {
    fontWeight: '700',
    color: '#111',
  },

  metaText: {
    fontSize: 13,
    color: '#444',
    flexShrink: 1,
  },

  topBox: {
    flexShrink: 1,
  },

  /* ★ 2행 2열 레이아웃 */
  bottomBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    width: '48%', // 2개씩 배치
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  chipText: {
    fontSize: 9,
    color: '#333',
    marginLeft: 4,
  },

  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    color: '#222',
  },
  sectionOverview: {
    fontSize: 13,
    lineHeight: 18,
    color: '#555',
  },

  releaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#eaeaea',
    gap: 6,
    width: '100%',
  },

  releaseText: {
    fontSize: 12,
    color: '#333',
    marginLeft: 4,
  },
});
