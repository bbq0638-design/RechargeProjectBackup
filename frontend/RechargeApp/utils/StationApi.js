import api from './api';

/**
 * @Param {number} lat
 * @Param {number} lng
 * @Param {number} radiusKm
 * @returns {Promise<Array>}
 */
export const getNearbyStations = async (lat, lng, radiusKm = 3.0) => {
  try {
    const response = await api.get('/station/near', {
      params: {lat, lng, radiusKm},
    });
    console.log('🚗 Station Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('충전소 조회 오류:', error);
    throw error;
  }
};

export const getNearbyPlace = async (lat, lng, radiusKm = 1.0) => {
  try {
    const res = await api.get('/place/nearby', {
      params: {lat, lng, radius: radiusKm},
    });
    console.log('place Response:', res.data);
    return res.data;
  } catch (err) {
    console.log('장소 조회 오류', err);
    throw err;
  }
};

/**
 * 🔍 검색어 기반 → 좌표 + 반경 충전소 조회
 * @param {string} keyword
 * @returns {Promise<{lat, lng, stations} | null>}
 */
export const searchStation = async keyword => {
  try {
    const res = await api.get('/station/search', {
      params: {query: keyword, radius: 3},
    });

    if (res.data.status !== 'ok') {
      console.log('검색 결과 없음');
      return null;
    }

    return res.data; // { lat, lng, keyword, stations }
  } catch (err) {
    console.log('충전소 검색 오류:', err);
    return null;
  }
};

export const getAutocomplete = async query => {
  try {
    const res = await api.get('/station/autocomplete', {
      params: {query},
    });

    // 반드시 documents 배열만 반환하기!
    return res.data.documents || [];
  } catch (err) {
    console.log('자동완성 오류', err);
    return [];
  }
};
