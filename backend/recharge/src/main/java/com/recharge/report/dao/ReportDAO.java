package com.recharge.report.dao;

import com.recharge.report.vo.ReportVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Mapper
@Repository

public interface ReportDAO {

    // 신고 등록
    int insertReport(ReportVO report);

    // 이미 신고했는지 확인 (중복 신고 방지)
    int isReported(Map<String, Object> map);

    // 현재 신고 ID 최댓값 조회
    int getMaxReportId();

    // 전체 신고 목록 조회
    List<ReportVO> getAllReports();

    // 신고 상태 업데이트
    int updateReportStatus(ReportVO report);

    // 특정 대상 신고 목록 (관리자, 상세조회)
    List<ReportVO> getReportsByTarget(Map<String, Object> map);
}
