package com.recharge.follow.service;

import com.recharge.follow.vo.FollowVO;

import java.util.List;

public interface FollowService {

    int insertFollow(FollowVO vo);

    int deleteFollow(FollowVO vo);

    boolean isFollowing(FollowVO vo);

    List<FollowVO> getFollowingList(String followerId);

    List<FollowVO> getFollowerList(String followingId);


}
