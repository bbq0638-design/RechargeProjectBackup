package com.recharge.follow.controller;

import com.recharge.follow.service.FollowService;
import com.recharge.follow.vo.FollowVO;
import com.recharge.notification.service.NotificationService; // [추가] 알림 서비스 임포트
import com.recharge.userfeed.dao.UserFeedDAO;
import com.recharge.userfeed.vo.UserFeedVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    @Autowired
    private FollowService followService;

    @Autowired
    private UserFeedDAO userFeedDAO; // ✅ 조회만(카운트 증감은 서비스에서 이미 처리)

    @Autowired
    private NotificationService notificationService; // [추가] 알림 서비스 주입

    @PostMapping
    public ResponseEntity<?> follow(@RequestBody FollowVO vo) {
        // 1. 팔로우 실행 (DB 저장)
        int result = followService.insertFollow(vo);

        // 2. [추가] 팔로우 성공 시 알림 전송 로직
        if (result > 0) {
            try {
                // sendNotification(보내는사람ID, 타겟타입, 받는사람ID, 알림타입)
                // "follow" 타입은 NotificationService에서 "마이페이지" 제목 및 타겟 ID 처리가 되어있음
                notificationService.sendNotification(vo.getFollowerId(), "follow", vo.getFollowingId(), "FOLLOW");
                System.out.println("====== 팔로우 알림 전송 완료 ======");
            } catch (Exception e) {
                System.out.println("팔로우 알림 전송 중 오류 발생: " + e.getMessage());
                e.printStackTrace();
                // 알림 실패가 팔로우 실패로 이어지지는 않도록 예외 처리만 함
            }
        }

        Map<String, Object> res = new HashMap<>();
        res.put("success", result > 0);
        res.put("message", result > 0 ? "팔로우 성공" : "이미 팔로우 중 입니다");

        // ✅ 상대방 feed 다시 조회해서 최신 카운트 내려줌
        if (vo.getFollowingId() != null) {
            UserFeedVO feed = userFeedDAO.selectUserFeed(vo.getFollowingId());
            res.put("feed", feed);
        }

        return ResponseEntity.ok(res);
    }

    @DeleteMapping
    public ResponseEntity<?> unfollow(
            @RequestParam String followerId,
            @RequestParam String followingId
    ) {
        FollowVO vo = new FollowVO();
        vo.setFollowerId(followerId);
        vo.setFollowingId(followingId);

        int result = followService.deleteFollow(vo);

        Map<String, Object> res = new HashMap<>();
        res.put("success", result > 0);
        res.put("message", result > 0 ? "언팔로우 완료" : "팔로우 상태가 아닙니다.");

        // ✅ 상대방 feed 다시 조회해서 최신 카운트 내려줌
        UserFeedVO feed = userFeedDAO.selectUserFeed(followingId);
        res.put("feed", feed);

        return ResponseEntity.ok(res);
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkFollow(
            @RequestParam String followerId,
            @RequestParam String followingId
    ) {
        FollowVO vo = new FollowVO();
        vo.setFollowerId(followerId);
        vo.setFollowingId(followingId);

        boolean isFollowing = followService.isFollowing(vo);

        Map<String, Object> res = new HashMap<>();
        res.put("isFollowing", isFollowing);

        return ResponseEntity.ok(res);
    }

    @GetMapping("/following")
    public ResponseEntity<List<FollowVO>> getFollowingList(
            @RequestParam String followerId,
            @RequestParam String myUserId) { // 여기도 추가!
        return ResponseEntity.ok(followService.getFollowingList(followerId, myUserId));
    }

    @GetMapping("/follower")
    public ResponseEntity<List<FollowVO>> getFollowerList(
            @RequestParam String followingId,
            @RequestParam String myUserId) { // 내 아이디 추가
        return ResponseEntity.ok(followService.getFollowerList(followingId, myUserId));
    }
}