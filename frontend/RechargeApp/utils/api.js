import axios from 'axios';
import {Platform, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

// 백앤드 서버 URL
// Emulator : 10.0.2.2, apk : ip - 192.168.1.127
export const API_BASE_URL =
  Platform.OS === 'android'
    ? 'http://192.168.2.14:18090/api'
    : 'http://192.168.2.14:18090/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

//JwtToken 생성
api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('authToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//회원가입
export const signup = async userData => {
  try {
    console.log('회원가입 요청 데이터', userData);
    const res = await api.post('/user/signup', userData);
    console.log('회원가입 응답:', res.data);
    return res.data;
  } catch (err) {
    console.log('회원가입 실패', err.response?.data || err);
    throw err.response?.data || '회원가입 실패';
  }
};

//아이디 중복체크
export const checkUserId = async userId => {
  const res = await api.get('/user/check-id', {params: {userId}});
  return res.data;
};

//닉네임
export const checkUserNickname = async userNickname => {
  const res = await api.get('/user/check-nickname', {params: {userNickname}});
  return res.data;
};

//로그인
export const login = async userData => {
  try {
    console.log('로그인 요청 데이터:', userData);
    const res = await api.post('/user/login', userData);
    console.log('로그인 응답:', res.data);

    const user = res.data;

    if (user.token) {
      await AsyncStorage.setItem('authToken', user.token);
      await AsyncStorage.setItem('userNickname', user.userNickname);

      //id랑 role 추가
      if (user.userId) {
        await AsyncStorage.setItem('userId', user.userId);

        // FCM 토큰 서버에 저장 (푸시 알림용)
        saveFcmToken(user.userId);
      }
      await AsyncStorage.setItem('userRole', user.userRole || 'USER');
    }
    return user;
  } catch (err) {
    console.log('로그인 실패:', err.response?.data || err);
    throw err.response?.data || '로그인 실패';
  }
};

// 로그아웃
export const logout = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userNickname');
    //추가
    await AsyncStorage.removeItem('userId'); // 추가됨
    await AsyncStorage.removeItem('userRole'); // 추가됨

    console.log('로그아웃 완료');
    return true;
  } catch (err) {
    console.log('로그아웃 중 오류:', err);
    return false;
  }
};

//아이디 찾기
export const findUserId = async userData => {
  try {
    console.log('아이디 찾기 성공: ', userData);
    const res = await api.post('/user/find-id', userData);
    console.log('아이디 찾기 성공:', res.data);
    return res.data;
  } catch (err) {
    console.log('아이디 찾기 실패:', err.response?.data || err);
    throw err.response?.data || '아이디 찾기 실패';
  }
};

//비밀번호 찾기 메일발송
export const findPassword = async userData => {
  try {
    console.log('비밀번호 찾기 요청 데이터:', userData);
    const res = await api.post('/user/find-password', userData);
    console.log('비밀번호 메일 발송 성공:', res.data);
    return res.data;
  } catch (err) {
    console.log('비밀번호 찾기 실패:', err.response?.data || err);
    throw err.response?.data || '비밀번호 찾기 실패';
  }
};

//비밀번호 재설정
export const resetPassword = async resetData => {
  try {
    console.log('비밀번호 재설정 요청 : ', resetData);
    const res = await api.post('/user/reset-password', resetData);
    console.log('비밀번호 재설정 응답:', res.data);
    return res.data;
  } catch (err) {
    console.log('비밀번호 재설정 실패', err.response?.data || err);
    throw err.response?.data || '비밀번호 재설정 실패';
  }
};

//이메일 인증 요청
export const sendEmailAuth = async userEmail => {
  try {
    const res = await api.post('/user/send-email-auth', {userEmail});
    console.log('이메일 인증 요청 성공:', res.data);
    return res.data;
  } catch (err) {
    console.log('이메일 인증요청 실패: ', err.response?.data || err);
    throw err.response?.data || '이메일 인증요청 실패';
  }
};

//이메일 인증 확인
export const verifyEmail = async (email, authCode) => {
  try {
    const payload = {
      userEmail: email,
      emailAuthCode: authCode,
    };

    const res = await api.post('/user/verify-email', payload);
    console.log('이메일 인증 확인 성공:', res.data);
    return res.data;
  } catch (err) {
    console.log('이메일 인증 확인 실패:', err.response?.data || err);
    throw err.response?.data || '이메일 인증 실패';
  }
};

//회원 정보 조회
export const getUserInfo = async userId => {
  try {
    const res = await api.get('/user/getUser', {params: {userId}});
    return res.data;
  } catch (err) {
    console.error('회원 정보 조회 실패:', err);
    throw err;
  }
};

//회원 정보 수정
export const updateUserInfo = async userData => {
  try {
    const res = await api.post('/user/modify', userData);
    return res.data;
  } catch (err) {
    throw err.response?.data || '수정 실패';
  }
};

//profilepw
export const profileResetPassword = async resetData => {
  try {
    console.log('비밀번호 재설정 요청 : ', resetData);
    const res = await api.post('/user/profile-pw', resetData);
    console.log('비밀번호 재설정 응답:', res.data);
    return res.data;
  } catch (err) {
    console.log('비밀번호 재설정 실패', err.response?.data || err);
    throw err.response?.data || '비밀번호 재설정 실패';
  }
};

//회원 탈퇴
export const apiDeleteUser = async userId => {
  const response = await api.delete('/user/delete-user', {
    params: userId,
  });
  return response.data;
};

// FCM 토큰 서버 전송
export const saveFcmToken = async userId => {
  try {
    // 1. 알림 권한 요청 (iOS 및 안드로이드 13+ 대응)
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // 2. 내 핸드폰의 토큰 가져오기
      const token = await messaging().getToken();
      console.log('내 폰의 FCM 토큰:', token);

      // 3. 서버(BackEnd)로 전송하여 DB에 저장
      // (백엔드 UserController에 /fcm-token 엔드포인트가 있어야 함)
      const res = await api.post('/user/fcm-token', {
        userId: userId,
        token: token,
      });
      console.log('서버에 토큰 저장 성공:', res.data);
    } else {
      console.log('알림 권한이 거부되었습니다.');
    }
  } catch (err) {
    // 토큰 저장이 실패해도 로그인은 유지되도록 에러만 찍고 넘어감
    console.error('FCM 토큰 저장 실패:', err);
  }
};

export default api;
