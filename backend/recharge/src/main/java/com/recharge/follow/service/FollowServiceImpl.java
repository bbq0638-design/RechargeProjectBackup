package com.recharge.follow.service;

import com.recharge.follow.dao.FollowDAO;
import com.recharge.follow.vo.FollowVO;
import com.recharge.userfeed.dao.UserFeedDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.recharge.notification.service.NotificationService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FollowServiceImpl implements FollowService {

    @Autowired
    private FollowDAO followDAO;

    @Autowired
    private UserFeedDAO userFeedDAO;

    // ★ 알림 서비스 주입
    @Autowired
    private NotificationService notificationService;

    @Override
    @Transactional
    public int insertFollow(FollowVO vo) {

        // 1. 중복 팔로우 방지
        if (followDAO.countFollow(vo) > 0) {
            return 0;
        }

        // 2. 팔로우 insert
        int result = followDAO.insertFollow(vo);
        if (result == 0) return 0;

        // 3. 상대방 팔로워 +1
        Map<String, Object> followerParam = new HashMap<>();
        followerParam.put("userId", vo.getFollowingId());
        followerParam.put("updatedId", vo.getFollowerId());
        userFeedDAO.increaseFollower(followerParam);

        // 4. 내 팔로잉 +1
        Map<String, Object> followingParam = new HashMap<>();
        followingParam.put("userId", vo.getFollowerId());
        followingParam.put("updatedId", vo.getFollowerId());
        userFeedDAO.increaseFollowing(followingParam);


        System.out.println(">>>> [디버깅] 팔로우 알림 전송 시작! sender: " + vo.getFollowerId()); // 이 로그가 찍혀야 함

        try {
            notificationService.sendNotification(
                    vo.getFollowerId(),   // sender (나)
                    "follow",             // targetType
                    vo.getFollowingId(),  // targetId (상대방 ID)
                    "FOLLOW"              // type
            );
        } catch (Exception e) {
            System.err.println("팔로우 알림 전송 실패: " + e.getMessage());
        }


        return 1;
    }

    @Override
    @Transactional
    public int deleteFollow(FollowVO vo) {

        // 1. 팔로우 상태 확인
        if (followDAO.countFollow(vo) == 0) {
            return 0;
        }

        // 2. 팔로우 delete
        int result = followDAO.deleteFollow(vo);
        if (result == 0) return 0;

        // 3. 상대방 팔로워 -1
        Map<String, Object> followerParam = new HashMap<>();
        followerParam.put("userId", vo.getFollowingId());
        followerParam.put("updatedId", vo.getFollowerId());
        userFeedDAO.decreaseFollower(followerParam);

        // 4. 내 팔로잉 -1
        Map<String, Object> followingParam = new HashMap<>();
        followingParam.put("userId", vo.getFollowerId());
        followingParam.put("updatedId", vo.getFollowerId());
        userFeedDAO.decreaseFollowing(followingParam);

        return 1;
    }

    @Override
    public boolean isFollowing(FollowVO vo) {
        return followDAO.countFollow(vo) > 0;
    }

    @Override
    public List<FollowVO> getFollowingList(String followerId) {
        return followDAO.getFollowingList(followerId);
    }

    @Override
    public List<FollowVO> getFollowerList(String followingId) {
        return followDAO.getFollowerList(followingId);
    }
}
