import api from './api';

export const followUser = async (followerId, followingId) => {
  try {
    const payload = {
      followerId,
      followingId,
      createId: followerId,
      updatedId: followerId,
    };

    const res = await api.post('/follow', payload);
    return res.data;
  } catch (err) {
    console.log('팔로우 실패', err.response?.data || err);
    throw err.response?.data || '팔로우 실패';
  }
};

export const unfollowUser = async (followerId, followingId) => {
  try {
    const res = await api.delete('/follow', {
      params: {followerId, followingId},
    });

    return res.data;
  } catch (err) {
    console.log('언팔로우 실패', err.response?.data || err);
    throw err.response?.data || '언팔로우 실패';
  }
};

export const checkFollow = async (followerId, followingId) => {
  try {
    const res = await api.get('/follow/check', {
      params: {followerId, followingId},
    });

    return res.data.isFollowing;
  } catch (err) {
    console.log('팔로우 여부 확인 실패', err);
    return false;
  }
};

export const getFollowingList = async followerId => {
  try {
    const res = await api.get('/follow/following', {
      params: {followerId},
    });

    return res.data;
  } catch (err) {
    console.log('팔로잉 목록 조회 실패', err);
    return [];
  }
};

export const getFollowerList = async followingId => {
  try {
    const res = await api.get('/follow/follower', {
      params: {followingId},
    });

    return res.data;
  } catch (err) {
    console.log('팔로워 목록 조회 실패', err);
    return [];
  }
};
