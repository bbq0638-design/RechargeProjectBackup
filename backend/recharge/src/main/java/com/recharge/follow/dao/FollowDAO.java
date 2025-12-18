package com.recharge.follow.dao;

import com.recharge.follow.vo.FollowVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface FollowDAO {

    int insertFollow(FollowVO vo);

    int deleteFollow(FollowVO vo);

    int countFollow(FollowVO vo);

    List<FollowVO> getFollowerList(Map<String, Object> params); // ★ String -> Map 변경

    List<FollowVO> getFollowingList(Map<String, Object> params); // ★ String -> Map 변경
}
