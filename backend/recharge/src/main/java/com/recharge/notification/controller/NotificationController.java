package com.recharge.notification.controller;

import com.recharge.notification.service.NotificationService;
import com.recharge.notification.vo.NotificationVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /**
     * 알림 저장 기능(테스트용)
     * 주소: POST http://localhost:8080/api/notification/save
     */
    @PostMapping("/save")
    public String saveNotification(@RequestBody NotificationVO vo) {
        // static 호출이 아닌 인스턴스 메서드 호출로 변경
        notificationService.insertNotification(vo);
        return "알림 저장 성공!";
    }

    @GetMapping("/{userId}")
    public List<NotificationVO> getNotifications(@PathVariable String userId) {
        System.out.println("======== 알림 목록 조회 요청 ========");
        System.out.println("요청한 유저 ID: " + userId);

        List<NotificationVO> list = notificationService.getMyNotifications(userId);

        System.out.println("조회된 알림 개수: " + list.size());
        return list;
    }

    // 알림 읽음 처리
    @PostMapping("/read/{notiId}")
    public void readNotification(@PathVariable Long notiId) {
        notificationService.readNotification(notiId);
    }
}