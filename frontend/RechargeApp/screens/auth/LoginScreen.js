import React, {useState, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable, Platform, Alert, TouchableOpacity } from 'react-native';
import TextInput from '../../components/common/TextInput';
import Button from '../../components/common/Button';
import {login} from '../../utils/api';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveFcmToken } from '../../utils/api';
import { login as kakaoLogin } from '@react-native-seoul/kakao-login';
import api from '../../utils/api';

export default function LoginScreen({navigation, route}) {
  const [userId, setUserId] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const passwordRef = useRef(null);
  const { setIsLoggedIn, setUserRole, setUserId: setGlobalUserId } = route.params || {};


  
  // 2. 카카오 로그인 핸들러
  const handleKakaoLogin = async () => {
    // 💡 버튼이 눌렸는지 화면에서 즉시 확인
    try {
      const token = await kakaoLogin();
      console.log("1. 카카오 인증 성공:", token.accessToken);

      const res = await api.post('/user/kakao-login', {
        accessToken: token.accessToken
      });

      const user = res.data;
      if (user.token) {
        await AsyncStorage.setItem('authToken', user.token);
        await AsyncStorage.setItem('userId', user.userId);
        if (setIsLoggedIn) setIsLoggedIn(true);
      }
    } catch (err) {
      console.error("카카오 로그인 에러:", err);
      Alert.alert("로그인 실패", "카카오 인증 중 오류가 발생했습니다.");
    }
  };


  // 3. 일반 로그인 핸들러
  const handleLogin = async () => {
    try {
      const user = await login({ userId, userPwd, deviceOs: Platform.OS });
      await AsyncStorage.setItem('authToken', user.token);
      setIsLoggedIn(true);
    } catch (error) {
      Alert.alert('로그인 실패', '아이디 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>로그인</Text>
        <Text style={styles.subText}>Re:charge에 오신 것을 환영합니다.</Text>
      </View>

 

      <View style={styles.centerBox}>
        <TextInput
          placeholder="아이디를 입력하세요."
          width="85%"
          value={userId}
          onChangeText={setUserId}
          style={styles.idInput}
        />
        <TextInput
          ref={passwordRef}
          placeholder="비밀번호를 입력하세요."
          width="85%"
          value={userPwd}
          onChangeText={setUserPwd}
          secureTextEntry
        />
        <Button text="로그인" type="submit" width="85%" style={{marginTop: 25}} onPress={handleLogin} />

        

        {/* 카카오 로그인 버튼 */}
        <TouchableOpacity style={styles.kakaoButton} onPress={handleKakaoLogin}>
            <Text style={styles.kakaoText}>카카오로 시작하기</Text>
        </TouchableOpacity>

      <View style={styles.divider}>
          <View style={styles.line} /><Text style={styles.orText}>또는</Text><View style={styles.line} />
      </View>

      {/* 아이디/비밀번호 찾기 영역 */}
        <View style={styles.findArea}>
          <Pressable onPress={() => navigation.navigate('FindIdScreen')}>
            {({pressed}) => (
              <Text
                style={[
                  styles.findText,
                  {textDecorationLine: 'underline'},
                  pressed && styles.pressedText,
                ]}>
                아이디
              </Text>
            )}
          </Pressable>
            <Text style={styles.findAreaText}>또는</Text>
          <Pressable onPress={() => navigation.navigate('FindPwdScreen')}>
            {({pressed}) => (
              <Text
                style={[
                  styles.findText,
                  {textDecorationLine: 'underline'},
                  pressed && styles.pressedText,
                ]}>
                비밀번호
              </Text>
            )}
          </Pressable>

          <Text style={styles.findAreaText}>를 잊으셨나요?</Text>
        </View>

        {/* 가입하기 영역 */}
        <View style={styles.findArea}>
          <Text style={styles.findAreaText}>계정이 없으시다면</Text>
          <Pressable
            onPress={() => navigation.navigate('TermsAgreementScreen')}>
            {({pressed}) => (
              <Text
                style={[
                  styles.findText,
                  {textDecorationLine: 'underline'},
                  pressed && styles.pressedText,
                ]}>
                가입하기
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 30 },
  headerText: { fontSize: 35, fontWeight: 'bold', color: '#004E89' },
  subText: { fontSize: 13, color: '#374151' },
  centerBox: { width: '100%', alignItems: 'center' },
  idInput: { marginBottom: 15 },
  kakaoButton: {
  backgroundColor: '#FEE500', // Official Kakao Yellow
  width: '85%',
  height: 48,
  borderRadius: 8,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 10,
  elevation: 2, 
},
  kakaoText: { color: 'rgba(0, 0, 0, 0.85)', fontSize: 16, fontWeight: 'bold' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, width: '85%' },
  line: { flex: 1, height: 1, backgroundColor: '#eee' },
  orText: { marginHorizontal: 10, color: '#999' },
   findArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
  },
  findText: {
    color: '#004E89',
    fontWeight: '800',
  },
  findAreaText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    paddingRight: 3,
    paddingLeft: 3,
  },
  pressedText: {
    opacity: 0.6, // 눌렸을 때 시각적 피드백
  },
});