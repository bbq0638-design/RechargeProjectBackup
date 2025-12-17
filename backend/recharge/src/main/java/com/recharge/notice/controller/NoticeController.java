package com.recharge.notice.controller;

import com.recharge.notice.service.NoticeService;
import com.recharge.notice.vo.NoticeVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/notice")

public class NoticeController {

     @Autowired
    private NoticeService noticeService;

     @PostMapping("/insertNotice")
     public ResponseEntity<Map<String, Object>> insertNotice(@RequestBody NoticeVO noticeVO){
         Map<String, Object> response = new HashMap<>();

         try{
             Long newId = noticeService.insertNotice(noticeVO);
             response.put("success", true);
             response.put("message", "새공지사항이 등록되었습니다");
             response.put("noticeId", newId);
             return ResponseEntity.ok(response);

         }catch(Exception e) {
             response.put("success",false);
             response.put("message", e.getMessage());
             return ResponseEntity.badRequest().body(response);
         }
     }
        @GetMapping("/list")
         public ResponseEntity<List<NoticeVO>> getNoticeList(){
         List<NoticeVO> noticeList = noticeService.getNoticeList();
         return ResponseEntity.ok(noticeList);
     }

        @GetMapping("/{noticeId}")
         public ResponseEntity<NoticeVO> getNoticeDetail(@PathVariable Long noticeId) {
         NoticeVO notice = noticeService.getNoticeDetail(noticeId);
         return ResponseEntity.ok(notice);
     }

    // 공지 수정
    @PutMapping("/edit")
    public ResponseEntity<Map<String, Object>> editNotice(@RequestBody NoticeVO noticeVO) {
        Map<String, Object> response = new HashMap<>();
        try {
            int result = noticeService.editNoticeDetail(noticeVO);
            response.put("success", result > 0);
            response.put("message", result > 0 ? "공지사항이 수정되었습니다." : "수정 실패");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 공지 삭제
    @DeleteMapping("/delete/{noticeId}")
    public ResponseEntity<Map<String, Object>> deleteNotice(@PathVariable Long noticeId) {
        Map<String, Object> response = new HashMap<>();
        try {
            int result = noticeService.deleteNoticeDetail(noticeId);
            response.put("success", result > 0);
            response.put("message", result > 0 ? "공지사항이 삭제되었습니다." : "삭제 실패");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 공지 조회수 증가
    @PostMapping("/{noticeId}/view")
    public ResponseEntity<Map<String, Object>> incrementNoticeView(@PathVariable Long noticeId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Long updatedCount = noticeService.incrementViewCount(noticeId);
            response.put("success", true);
            response.put("message", "조회수가 증가했습니다.");
            response.put("viewCount", updatedCount); // 현재 조회수 반환
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }


}


