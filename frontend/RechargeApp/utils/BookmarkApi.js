import api from './api';

export const toggleBookmark = async ({userId, targetType, targetId}) => {
  const res = await api.post('/bookmarks/toggle', {
    userId,
    bookmarkTargetType: targetType.toLowerCase(),
    bookmarkTargetId: targetId,
  });
  return res.data;
};

export const checkBookmark = async ({userId, targetType, targetId}) => {
  const res = await api.get('/bookmarks/check', {
    params: {
      userId,
      targetType: targetType.toLowerCase(),
      targetId,
    },
  });
  return res.data;
};

export const fetchBookmarkStatusMap = async ({
  userId,
  targetType,
  targetIds,
}) => {
  const res = await api.post(`/bookmarks/status`, targetIds, {
    params: {
      userId,
      targetType: targetType.toLowerCase(),
    },
  });
  return res.data;
};

export const fetchUserBookmarks = async userId => {
  const res = await api.get(`/bookmarks/user/${userId}`);
  return res.data;
};
