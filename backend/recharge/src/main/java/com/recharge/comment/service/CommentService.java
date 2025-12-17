package com.recharge.comment.service;

import com.recharge.comment.dao.CommentDAO;
import com.recharge.comment.vo.CommentVO;
import com.recharge.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentDAO commentDAO;

    //★알림 기능을 사용하기 위해 주입
    @Autowired
    private NotificationService notificationService;

    public boolean writeComment(CommentVO commentVO) {
        //DB에 댓글 저장
        int result = commentDAO.insertComment(commentVO);
        //저장이 성공했으면(1) 알림 발송
        if (result > 0) {
            //알림보내기
            notificationService.sendNotification(
                    commentVO.getUserId(),
                    commentVO.getTargetType(),
                    commentVO.getTargetId(),
                    "comment"
            );
            return true;
        }
        return false;
    }

    public List<CommentVO> getCommentList(String targetType, String targetId) {
        CommentVO vo = new CommentVO();
        vo.setTargetType(targetType);
        vo.setTargetId(targetId);
        return commentDAO.getCommentList(vo);
    }

    public boolean deleteComment(int commentId, String userId, String userRole) {
        CommentVO vo = new CommentVO();
        vo.setCommentId(commentId);
        vo.setUserId(userId);
        vo.setUserRole(userRole);

        return commentDAO.deleteComment(vo) > 0;
    }
    public boolean updateComment(CommentVO commentVO) {
        //업데이트된 행이 1개 이상이면 true(성공)
        return commentDAO.updateComment(commentVO) > 0;
    }
}
