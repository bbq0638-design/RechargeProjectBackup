import api from './api';

/**
 * 운세 생성 API
 * @param {Object} payload
 * @param {"saju" | "today" | "star" | "zodiac"} payload.type - 운세 종류
 * @param {string} payload.gender - 성별
 * @param {string} payload.birth - YYYY-MM-DD
 * @param {string} payload.birthTime - 태어난 시간
 * @param {string} payload.calendar - 양력 or 음력
 * @returns {Promise<string>} AI 응답 텍스트
 */

export const getFortune = async payload => {
  try {
    console.log('운세 요청 데이터: ', payload);

    const res = await api.post('/fortune/generate', payload);
    console.log('운세 응답: ', res.data);

    // 🔥 백엔드는 순수 텍스트만 반환하므로 바로 res.data 사용
    return typeof res.data === 'string' ? res.data : '운세 결과 없음';
  } catch (err) {
    console.log('운세 생성 오류', err.response?.data || err);
    throw err.response?.data || '운세 생성 실패';
  }
};