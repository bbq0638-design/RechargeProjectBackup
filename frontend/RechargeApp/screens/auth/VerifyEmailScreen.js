import React from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import Button from '../../components/common/Button';
import {verifyEmail} from '../../utils/api';

export default function VerifyEmailScreen({route, navigation}) {
  const {userEmail, authCode} = route.params;

  const handleVerify = async () => {
    try {
      const result = await verifyEmail(userEmail, authCode);

      if (result) {
        Alert.alert(
          '이메일 인증 완료!',
          '회원가입 화면으로 돌아가 나머지 정보를 입력해주세요!',
        );

        // 🔥 SignUpScreen 으로 돌아가서 emailVerified = true 설정
        navigation.navigate('SignUpScreen', {
          emailVerified: true,
          userEmail, // 이메일 유지
        });
      } else {
        Alert.alert('인증 실패', '유효하지 않거나 만료된 인증 요청입니다.');
      }
    } catch (err) {
      console.log('이메일 인증 실패:', err);
      Alert.alert('오류', '인증 처리 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>이메일 인증</Text>
      <Text style={styles.description}>
        아래 정보를 확인한 후{'\n'}인증 완료 버튼을 눌러주세요.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>이메일</Text>
        <Text style={styles.infoValue}>{userEmail}</Text>

        <Text style={[styles.infoLabel, {marginTop: 14}]}>인증 코드</Text>
        <Text style={styles.infoValue}>{authCode}</Text>
      </View>

      <Button
        text="인증 완료"
        type="submit"
        width="85%"
        style={{marginTop: 30}}
        onPress={handleVerify}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F5F9FF',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#004E89',
  },
  description: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 25,
    color: '#374151',
    fontSize: 15,
  },
  infoBox: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginTop: 4,
  },
});
