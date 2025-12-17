import api from './api';



/**
 * 전체 게시글 목록 조회 //screen
 */
export const getPosts = async () => {
    try {
        const response = await api.get('/community/posts');
        return response.data;
    } catch (error) {
        console.error('[CommunityApi] 게시글 목록 조회 실패:', error);
        throw error;
    }
};



/**
 * 게시글 상세 정보 조회// detail
 * @param {number|string} postId
 */
export const getPostDetail = async (postId, userId) => {
    try {
        const response = await api.get(`/community/post/${postId}`, {
            params: {userId: userId}
        });
        return response.data;
    } catch (error) {
        console.error(`[CommunityApi] 상세 조회 실패 (ID: ${postId}):`, error);
        throw error;
    }
};

/**
 * 게시글 삭제
 * @param {number|string} postId
 */
export const deletePost = async (postId) => {
    try {
        const response = await api.delete(`/community/post/${postId}`);
        return response;
    } catch (error) {
        console.error(`[CommunityApi] 삭제실패 (ID: ${postId}):`, error);
        throw error;
    }
};

/**
 * 게시글 수정
 * @param {number} postId
 * @param {FormData} formData
 */
export const updatePost = async (postId, formData) => {
    try {
        const response = await api.put(`/community/post/${postId}`, formData, {
            headers: {'Content-Type': 'multipart/form-data'},
        });
        return response;
    } catch (error) {
        console.error(`[CommunityApi] 수정 실패 (ID: ${postId}):`, error);
        throw error;
    }
};

/**
 * 게시글 신고
 * @param {number|String} postId
 */
export const reportPost = async (postId) => {
        console.log(`신고 API 호출: ${postId}`);
    return await api.post(`/community/post/${postId}/report`);

};

/**
 * 좋아요 토글 요청
 * @param {number} postId 
 * @param {string} userId 
 */
export const toggleLike = async (postId, userId) => {
    try {
        //POST body에 userId 전달
        const response = await api.post(`/community/post/${postId}/like`, {userId});
        return response.data;
    } catch (error) {
        console.error('좋아요 요청 실패:', error);
        throw error;
    }
};


/**
 * 카테고리 목록 조회 // write
 */
export const getCategories = async () => {
    try {
        const response = await api.get('/community/categories');
        return response.data;
    } catch (error) {
        console.error('[CommunityAPi] 카테고리 조회 실패', error);
        throw error;
    }
};




/**
* 게시글 등록
 * @param {object} postData - { userId, communityTitle, communityContent, categoryCode }
 */
export const createPost = async (postData) => {
    try {
        const response = await api.post('community/post', postData, {
            headers: { 'Content-Type': 'multipart/form-data'},
        });
        return response;
    } catch (error) {
        console.error('[CommunityApi] 글쓰기 실패:', error);
        throw error;
    }
};

