package com.recharge.userfeed.service;

import com.recharge.userfeed.vo.UserFeedVO;

public interface UserFeedService {

    UserFeedVO countUserPosts(String userId);
}
