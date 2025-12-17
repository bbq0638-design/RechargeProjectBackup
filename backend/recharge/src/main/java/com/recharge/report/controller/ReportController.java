package com.recharge.report.controller;

import com.recharge.report.service.ReportService;
import com.recharge.report.vo.ReportVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/report")

public class ReportController {

    @Autowired
    private ReportService reportService;

    /**
     * 사용자 신고 등록
     * - 중복 신고 방지 로직 포함
     */
    @PostMapping
    public ResponseEntity<?> submitReport(@RequestBody ReportVO report) {

        Map<String, Object> result = reportService.submitReport(report);

        return ResponseEntity.ok(result);
    }


    /**
     * 관리자 신고 전체 목록 조회
     */
    @GetMapping("/admin/list")
    public ResponseEntity<List<ReportVO>> getAllReports() {
        List<ReportVO> reports = reportService.getAllReports();
        return ResponseEntity.ok(reports);
    }


    /**
     * 관리자 신고 상태 업데이트
     * (처리 완료, 삭제, 문제 없음 등)
     */
    @PutMapping("/admin/status")
    public ResponseEntity<?> updateReportStatus(@RequestBody ReportVO report) {

        boolean updated = reportService.updateReportStatus(report);

        if (!updated) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "FAIL",
                    "message", "신고 상태 변경 실패 (존재하지 않는 reportId)"
            ));
        }

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "신고 상태가 [" + report.getReportStatus() + "] 로 변경되었습니다."
        ));
    }
}
