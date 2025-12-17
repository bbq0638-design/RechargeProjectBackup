import api from './api';

//댓글 작성
export const writeComment = async (commentData) => {
    try {
        console.log('댓글 작성 요청:', commentData);
        const res = await api.post('/comments', commentData);
        return res.data;
    } catch (err) {
        console.error('댓글 작성 실패:', err.response?.data || err);
        throw err;
    }
};

//댓글 목록 조회
export const getCommentList = async (targetType, targetId) => {
    try {
        const res = await api.get('/comments', {
            params: {
                targetType: targetType,
                targetId: targetId,
            },
        });
        return res.data;
    } catch (err) {
        console.error('댓글 목록 조회 실패:', err.response?.data || err);
        throw err;
    }
};

//댓글 수정
export const updateComment = async (commentData) => {
    try{
        console.log('댓글 수정 요청:', commentData);
        const res = await api.put('/comments', commentData);
        return res.data;
    } catch (err) {
        console.error('댓글 수정 실패:', err.response?.data || err);
        throw err;
    }
};

//댓글 삭제
export const deleteComment = async (commentId, userId, userRole) => {
    try {
        //Delete body를 보내기 위해 data 속성 사용
        const res = await api.delete(`/comments/${commentId}`, {
            data: { 
                userId: userId,
                userRole: userRole
             }
        });
        return res.data;
    } catch (err) {
        console.error('댓글 삭제 실패:', err);
        throw err;
    }
};