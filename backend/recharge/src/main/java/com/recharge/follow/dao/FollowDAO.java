package com.recharge.follow.dao;

import com.recharge.follow.vo.FollowVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FollowDAO {

    int insertFollow(FollowVO vo);

    int deleteFollow(FollowVO vo);

    int countFollow(FollowVO vo);

    List<FollowVO> getFollowerList(String followingId);

    List<FollowVO> getFollowingList(String followerId);
}
