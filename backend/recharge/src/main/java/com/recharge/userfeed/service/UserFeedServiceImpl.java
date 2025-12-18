package com.recharge.userfeed.service;

import com.recharge.userfeed.dao.UserFeedDAO;
import com.recharge.userfeed.vo.UserFeedVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 트랜잭션 추가 권장

@Service
@RequiredArgsConstructor
public class UserFeedServiceImpl implements UserFeedService {

    private final UserFeedDAO userFeedDAO;

    // 마이페이지 게시글 수 카운트
    @Override
    public UserFeedVO countUserPosts(String userId) {

        UserFeedVO feed = userFeedDAO.selectUserFeed(userId);

        if (feed == null) {
            // ★ 수정된 부분: 에러 방지 안전벨트 착용
            try {
                feed = new UserFeedVO();
                feed.setUserId(userId);
                userFeedDAO.insertUserFeed(feed);
            } catch (Exception e) {
                // 이미 존재해서 에러가 나면 무시하고 넘어감 (쿨하게 Pass)
                System.out.println("피드가 이미 존재합니다. 생성을 건너뜁니다.");
            }
        }

        // 이후 로직은 그대로 진행
        int totalPosts = userFeedDAO.countUserPosts(userId);

        userFeedDAO.updateTotalCount(userId, totalPosts);

        // feed가 null일 경우(위에서 insert 실패했더라도) 다시 조회해서 채워줌
        if (feed == null) {
            feed = userFeedDAO.selectUserFeed(userId);
        } else {
            feed.setTotalCount(totalPosts);
        }

        return feed;
    }
}