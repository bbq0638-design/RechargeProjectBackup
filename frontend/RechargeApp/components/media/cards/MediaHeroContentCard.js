import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import LoadingAnimation from '../../common/LoadingAnimation';

/**
 * HomeContentCard : 영화/음악 최상단 카드
 * @param {Array<String>} posters - 이미지 url
 * @param {String} title - 메인 제목
 * @param {String} sybtitle - 서브타이틀
 */

function MediaHomeContentCard({posters = [], title, subtitle, loading}) {
  // 로딩 화면
  if (loading || posters.length === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.loadingBox}>
          <LoadingAnimation style={{width: '100%', aspectRatio: 1 / 1.5}} />
        </View>
      </View>
    );
  }

  // 포스터 useState
  const [index, setIndex] = useState(0);

  //   페이드 애니메이션
  const fade = useSharedValue(1);

  // 페이드 애니메이션 스타일
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
  }));

  //   3초 간격 포스터 전환
  useEffect(() => {
    if (posters.length === 0) return;

    const interval = setInterval(() => {
      fade.value = withTiming(0, {duration: 500}, () => {
        runOnJS(changePoster)();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [posters]);

  const changePoster = () => {
    // 다음 포스터 변경
    setIndex(prev => {
      const next = (prev + 1) % posters.length;
      return next;
    });

    // 페이드 인
    fade.value = withTiming(1, {duration: 500});
  };

  const getHighQualityPoster = url => {
    if (!url) return url;
    return url.replace('/w500/', '/w780/');
  };
  const rawPoster = posters.length > 0 ? posters[index] : null;
  const currentPoster = getHighQualityPoster(rawPoster);

  return (
    <View style={styles.card}>
      <Animated.Image
        source={{uri: currentPoster}}
        style={[styles.poster, animatedStyle]}
        resizeMode="cover"
      />
      <View style={styles.textBox}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },

  card: {
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    position: 'relative',
  },

  poster: {
    width: '100%',
    aspectRatio: 1 / 1.5,
    backgroundColor: '#eee',
  },
  textBox: {
    position: 'absolute',
    padding: 20,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#6b7280',
  },
});

export default MediaHomeContentCard;
