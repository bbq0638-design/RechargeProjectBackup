import React from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import IconButton from '../common/iconButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PlaceItem({
  name,
  address1,
  address2,
  phone,
  onPressKakao,
  onPressNaver,
}) {
  const fullAddress = `${address1} ${address2 || ''}`.trim();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* 🔵 오른쪽 텍스트 */}
        <View style={styles.content}>
          <Text style={styles.title}>{name}</Text>

          {/* 🔵 주소 */}
          <View style={styles.row}>
            <IconButton
              type="charge"
              size={16}
              color="#6B7280"
              style={{marginLeft: -9}}
            />
            <Text style={styles.subText}>{fullAddress}</Text>
          </View>
          {/* 🔵 전화번호 (있으면만 출력) */}
          {phone ? <Text style={styles.subText}>{phone}</Text> : null}

          {/* 🔵 지도 이동 버튼 2개 */}
          <View style={styles.buttonRow}>
            {/* 카카오맵 버튼 */}
            <Pressable
              onPress={onPressKakao}
              style={({pressed}) => [
                styles.mapButton,
                pressed && {backgroundColor: '#004E89', borderColor: '#004E89'},
              ]}>
              {({pressed}) => (
                <>
                  <Image
                    source={require('../../assets/images/kakao-logo.png')}
                    style={styles.mapIcon}
                  />
                  <Text
                    style={[
                      styles.mapButtonText,
                      pressed && {color: '#FFFFFF'},
                    ]}>
                    카카오맵으로 이동
                  </Text>
                </>
              )}
            </Pressable>

            {/* 버튼 사이 간격 */}
            <View style={{width: 10}} />

            {/* 네이버맵 버튼 */}
            <Pressable
              onPress={onPressNaver}
              style={({pressed}) => [
                styles.mapButton,
                pressed && {backgroundColor: '#004E89', borderColor: '#004E89'},
              ]}>
              {({pressed}) => (
                <>
                  <Image
                    source={require('../../assets/images/naver-logo.png')}
                    style={styles.mapIcon}
                  />
                  <Text
                    style={[
                      styles.mapButtonText,
                      pressed && {color: '#FFFFFF'},
                    ]}>
                    네이버지도로 이동
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bebebeff',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 2},
  },
  image: {
    width: 100,
    height: 110,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },

  /* 지도 버튼 */
  buttonRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '49%',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 1},
  },
  mapIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: 6,
  },
  mapButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
  },
});
