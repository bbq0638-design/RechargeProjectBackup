package com.recharge.userfeed.dao;

import com.recharge.userfeed.vo.UserFeedVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Map;

@Mapper
public interface UserFeedDAO {

    int countUserPosts(@Param("userId") String userId);

    int insertUserFeed(UserFeedVO vo);

    UserFeedVO selectUserFeed(@Param("userId") String userId);

    int updateTotalCount(@Param("userId") String userId, @Param("totalCount") int totalCount);

    int increaseFollower(Map<String, Object> param);

    int decreaseFollower(Map<String, Object> param);

    int increaseFollowing(Map<String, Object> param);

    int decreaseFollowing(Map<String, Object> param);
}
