import api from './api';

// 1️⃣ 신고 목록 조회 (관리자용)
export const loadReportedList = async () => {
  try {
    const response = await api.get(`/report/admin/list`);
    console.log("loadReportedList response:", response.data);
    return response.data; // 실제 배열 반환; // 신고 목록 반환
  } catch (error) {
    console.error("loadReportedList error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "신고 목록을 가져오는 데 실패했습니다.");
  }
};

// 2️⃣ 신고 상태 변경 (관리자용)
export const updateReportStatus = async (reportId, reportStatus, updatedId) => {
  try {
    const response = await api.put(`/report/admin/status`, {
      reportId,
      reportStatus,
      updatedId
    });
    return response.data; // 상태 변경 결과 반환
  } catch (error) {
    console.error("updateReportStatus error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "신고 처리 상태를 변경하는 데 실패했습니다.");
  }
};

// 3️⃣ 신고 등록 (사용자용)
export const submitReport = async (reportData) => {
  try {
    const response = await api.post(`/report`, reportData);
    return response.data; // 신고 접수 결과 반환
  } catch (error) {
    console.error("submitReport error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "신고 등록에 실패했습니다.");
  }
};