package com.recharge.report.service;

import com.recharge.report.dao.ReportDAO;
import com.recharge.report.vo.ReportVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private ReportDAO reportDAO;

    /**
     * 신고 등록 (중복 신고 방지 포함)
     */
    public Map<String, Object> submitReport(ReportVO report) {

        Map<String, Object> response = new HashMap<>();

        // 1. 중복 신고 체크
        Map<String, Object> checkMap = new HashMap<>();
        checkMap.put("targetType", report.getReportTargetType());
        checkMap.put("targetId", report.getReportTargetId());
        checkMap.put("userId", report.getUserId());

        int isReported = reportDAO.isReported(checkMap);

        if (isReported > 0) {
            response.put("status", "ALREADY_REPORTED");
            response.put("message", "이미 신고한 게시글입니다.");
            return response;
        }

        // 2. 신고 ID 생성 (기존 로직 유지)
        int maxId = reportDAO.getMaxReportId();
        int nextId = maxId + 1;
        report.setReportId(nextId);

        // 생성자 정보 자동 설정
        report.setCreateId(report.getUserId());
        report.setUpdatedId(report.getUserId());

        // 3. 신고 등록
        reportDAO.insertReport(report);

        response.put("status", "SUCCESS");
        response.put("message", "신고가 정상적으로 접수되었습니다.");
        response.put("reportId", nextId);

        return response;
    }

    /**
     * 관리자 전체 신고 목록 조회
     */
    public List<ReportVO> getAllReports() {
        return reportDAO.getAllReports();
    }

    /**
     * 관리자 신고 상태 변경
     */
    public boolean updateReportStatus(ReportVO report) {

        // 업데이트 실행
        int updated = reportDAO.updateReportStatus(report);

        return updated > 0;
    }
}
