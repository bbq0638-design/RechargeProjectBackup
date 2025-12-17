import axios from 'axios';
import { API_BASE_URL } from './api';


const NOTICE_BASE_URL = API_BASE_URL.replace('/api', '');

export const getNotices = async () => {
    try {
        const res = await axios.get(`${NOTICE_BASE_URL}/notice/list`);
        return res.data.map(n => ({
            id: n.noticeId,
            title: n.noticeTitle,
            content: n.noticeContent,
            userId: n.userId,
            viewCount: n.noticeViewCount,
            createDate: n.createDate,
            createId: n.createId,
            updatedDate: n.updatedDate,
            updatedId: n.updatedId
        }));
    } catch (err) {
        console.error('공지사항 목록 조회 실패:', err);
        return [];
    }
};

export const getNoticeDetail = async (noticeId) => {
    const res = await axios.get(`${NOTICE_BASE_URL}/notice/${noticeId}`);
    return res.data;
};

export const insertNotice = async (notice) => {
    return await axios.post(`${NOTICE_BASE_URL}/notice/insertNotice`, notice);
};

export const editNotice = async (notice) => {
    return await axios.put(`${NOTICE_BASE_URL}/notice/edit`, notice);
};

export const deleteNotice = async (noticeId) => {
    return await axios.delete(`${NOTICE_BASE_URL}/notice/delete/${noticeId}`);
};

export const incrementNoticeViewCount = async (noticeId) => {
    try {
        const res = await axios.post(`${NOTICE_BASE_URL}/notice/${noticeId}/view`);
        return res.data;
    } catch (err) {
        console.error('조회수 증가 실패:', err);
        throw err;
    }
};