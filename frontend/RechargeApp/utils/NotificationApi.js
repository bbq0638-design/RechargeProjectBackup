import api from './api'; 

//내 알림목록 조회
export const getNotifications = async (userId) => {
    try {
        console.log(`[알림 API] 목록 조회 요청: userId=${userId}`);
        const res = await api.get(`/notification/${userId}`);
        return res.data;
        } catch (err) {
            console.error('[알림 API] 목록 조회 실패:', err);
            throw err.response?.data || '알림 조회 실패';
        }
    };
//알림 읽음 처리
export const readNotification = async (notiId) => {
    try {
        console.log(`[알림 API] 읽은 처리 요청: notiId=${notiId}`);
        const res = await api.post(`/notification/read/${notiId}`);
        return res.data;
    } catch (err) {
        console.error(`[알림 API] 읽음 처리 실패:`, err);
        throw err.response?.data || '알림 읽음 처리 실패';
          }
};

