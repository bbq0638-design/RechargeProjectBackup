import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Button from '../../common/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * AI 추천 버튼
 * @param {String} title        메인제목
 * @param {Function} onPress    시작하기 버튼 클릭 이벤트
 */
function AiRecommendSection({
  title = '영화 AI 추천 받기',
  description = '당신의 취향에 맞는 콘텐츠를 찾아드릴게요!',
  onPress,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.leftBox}>
        {/* 아이콘 영역 */}
        <View style={styles.iconWrapper}>
          <Ionicons name="sparkles-outline" size={22} color="#FFFFFF" />
        </View>
        {/* 텍스트 */}
        <View style={{marginLeft: 12}}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>

      <Button
        type="submit"
        text="시작하기"
        width={90}
        height={40}
        onPress={onPress}
        style={{borderRadius: 20}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: '#E8F1FB',
    borderRadius: 20,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 4},
    elevation: 3,
  },

  leftBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconWrapper: {
    width: 45,
    height: 45,
    borderRadius: 999,
    backgroundColor: '#004E89',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
});

export default AiRecommendSection;
