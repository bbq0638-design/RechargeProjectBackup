package com.recharge.userfeed.service;

import com.recharge.userfeed.dao.UserFeedDAO;
import com.recharge.userfeed.vo.UserFeedVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserFeedServiceImpl implements UserFeedService{

    private final UserFeedDAO userFeedDAO;
//    마이페이지 게시글 수 카운트
    @Override
    public UserFeedVO countUserPosts(String userId) {

        UserFeedVO feed = userFeedDAO.selectUserFeed(userId);

        if (feed == null) {
            feed = new UserFeedVO();
            feed.setUserId(userId);

            userFeedDAO.insertUserFeed(feed);
        }

        int totalPosts = userFeedDAO.countUserPosts(userId);

        userFeedDAO.updateTotalCount(userId, totalPosts);

        feed.setTotalCount(totalPosts);

        return feed;
    }

}
