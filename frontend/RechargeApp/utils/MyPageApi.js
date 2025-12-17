import api from './api';

// 유저 피드 조회
export const getUserFeed = async userId => {
  try {
    const res = await api.get(`/userfeed/${userId}`);
    console.log('userfeed 조회 성공', res.data);
    return res.data;
  } catch (err) {
    console.log('userfeed 조회 실패', err.response?.data || err);
    throw err.response?.data || 'UserFeed 조회 실패';
  }
};
