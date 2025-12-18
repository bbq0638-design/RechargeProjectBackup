import axios from 'axios';
import {Platform} from 'react-native';

const AI_BASE_URL =
  Platform.OS === 'android' ? 'http://192.168.2.15:8000' : 'http://localhost:8000';

const musicAiApi = axios.create({
  baseURL: AI_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 🎵 AI 음악 추천
 */
export const recommendMusic = async text => {
  console.log('====================================');
  console.log('[1] 요청 시작: ', AI_BASE_URL); // 이 로그가 찍히는지 확인하세요
  console.log('[2] 보낼 데이터: ', text);
  console.log('====================================');

  try {
    const res = await musicAiApi.post('/ai/music/recommend', {
      text,
    });
    
    // 성공해야만 이 로그가 보입니다.
    console.log('[3] 응답 성공:', res.data);
    return res.data;

  } catch (error) {
    // 💥 여기서 에러의 정체가 밝혀집니다.
    console.error('====================================');
    console.error('[ERROR] 요청 실패 원인 분석:');
    
    if (error.response) {
      // 서버가 응답은 했으나 4xx, 5xx 에러인 경우
      console.error('- 서버 상태 코드:', error.response.status);
      console.error('- 서버 에러 메시지:', error.response.data);
    } else if (error.request) {
      // 요청은 갔으나 응답을 못 받은 경우 (네트워크 문제)
      console.error('- 서버로 요청은 갔으나 응답이 없음 (네트워크/타임아웃)');
      console.error('- 현재 설정된 URL:', AI_BASE_URL);
    } else {
      // 설정 문제
      console.error('- 요청 설정 중 에러:', error.message);
    }
    console.error('====================================');
    throw error;
  }
};

export default musicAiApi;