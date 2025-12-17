package com.recharge.community.dao;

import com.recharge.community.vo.CommunityVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommunityDAO {
    //카테고리 목록 조회
    List<CommunityVO> selectCategoryList();

    //글 등록(추가됨)
    int insertPost(CommunityVO vo);

    List<CommunityVO> selectPostList();

    int updateViewCount(int postId);
    CommunityVO selectPostDetail(@Param("postId") int postId, @Param("userId") String userId);

    int deletePost(int postId);

    CommunityVO selectCommunityImage(int postId);

    int updatePost(CommunityVO vo);

    //좋아요 관련 메서드
    int checkLike(@Param("postId") int postId, @Param("userId") String userId);
    void insertLike(@Param("postId") int postId, @Param("userId") String userId);
    void deleteLike(@Param("postId") int postId, @Param("userId") String userId);

    void increaseLikeCount(int postId);
    void decreaseLikeCount(int postId);
    int getLikeCount(int postId);
}
