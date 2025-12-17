package com.recharge.comment.dao;

import com.recharge.comment.vo.CommentVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommentDAO {

    int insertComment(CommentVO commentVO);
    List<CommentVO> getCommentList(CommentVO commentVO);

    int deleteComment(CommentVO commentVO);

    int updateComment(CommentVO commentVO);
}
