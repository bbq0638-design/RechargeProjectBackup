package com.recharge.follow.controller;

import com.recharge.follow.service.FollowService;
import com.recharge.follow.vo.FollowVO;
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

    @PostMapping
    public ResponseEntity<?> follow(@RequestBody FollowVO vo) {
        int result = followService.insertFollow(vo);

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
    public ResponseEntity<List<FollowVO>> getFollowingList(@RequestParam String followerId) {
        return ResponseEntity.ok(followService.getFollowingList(followerId));
    }

    @GetMapping("/follower")
    public ResponseEntity<List<FollowVO>> getFollowerList(@RequestParam String followingId) {
        return ResponseEntity.ok(followService.getFollowerList(followingId));
    }
}

