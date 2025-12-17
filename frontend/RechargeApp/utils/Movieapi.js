import api from './api';

// 신규 영화 조회
export const fetchUpcomingMovies = async () => {
  try {
    const res = await api.get('/movie/upcoming');
    return res.data;
  } catch (err) {
    console.log('신규 영화 조회 실패', err.response?.data || err);
    throw err.response?.data || '신규 영화 조회 실패';
  }
};

export const fetchPopularMovies = async () => {
  try {
    const res = await api.get('/movie/popular');
    return res.data;
  } catch (err) {
    console.log('인기영화 조회 실패', err.response?.data || err);
    throw err.response?.data || '인기영화 조회 실패';
  }
};

export const fetchMovieDetail = async movieId => {
  try {
    const res = await api.get(`/movie/${movieId}`);
    return res.data;
  } catch (err) {
    console.log('영화 상세 조회 실패', err.response?.data || err);
    throw err.response?.data || '영화 상세 조회 실패';
  }
};

export const searchMovies = async query => {
  try {
    const res = await api.get('/movie/search', {
      params: {query},
    });
    return res.data;
  } catch (err) {
    console.log('영화 검색 실패', err.response?.data || err);
    throw err.response?.data || '영화 검색 실패';
  }
};

export const createMoviePost = async postData => {
  try {
    const res = await api.post('/moviepost', postData);
    return res.data;
  } catch (err) {
    console.log('게시글 등록 실패', err.response?.data || err);
    throw err.response?.data || '게시글 등록 실패';
  }
};

export const fetchMoviePostList = async () => {
  const res = await api.get('/moviepost');
  return res.data;
};

export const fetchMoviePostDetail = async postId => {
  const res = await api.get(`/moviepost/${postId}`);
  return res.data;
};

export const fetchSimilarMovies = async movieId => {
  try {
    const res = await api.get(`/movie/${movieId}/similar`);
    return res.data;
  } catch (err) {
    console.log('유사 영화 조회 실패', err.response?.data || err);
    throw err.response?.data || '유사 영화 조회 실패';
  }
};

export const fetchUserMoviePosts = async userId => {
  const res = await api.get(`/moviepost/user/${userId}`);
  return res.data;
};

// 게시글 수정
export const updateMoviePost = async (postId, data) => {
  try {
    const res = await api.put(`/moviepost/${postId}`, data);
    return res.data;
  } catch (err) {
    console.log('게시글 수정 실패', err.response?.data || err);
    throw err.response?.data || '게시글 수정 실패';
  }
};

// 게시글 삭제
export const deleteMoviePost = async postId => {
  try {
    const res = await api.delete(`/moviepost/${postId}`);
    return res.data;
  } catch (err) {
    console.log('게시글 삭제 실패', err.response?.data || err);
    throw err.response?.data || '게시글 삭제 실패';
  }
};
