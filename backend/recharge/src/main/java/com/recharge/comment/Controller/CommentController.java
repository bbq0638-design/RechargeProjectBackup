package com.recharge.comment.Controller;

import com.recharge.comment.service.CommentService;
import com.recharge.comment.vo.CommentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    //댓글 등록API

    @PostMapping
    public String writeComment(@RequestBody CommentVO commentVO) {
        System.out.println("댓글 등록 요청 받음: " + commentVO);
        System.out.println("Target: " + commentVO.getTargetType() + "/" + commentVO.getTargetId());
        System.out.println("User:" + commentVO.getUserId());

        boolean isSuccess = commentService.writeComment(commentVO);

        if (isSuccess) {
            return "SUCCESS";
        } else {
            return "FAIL";
        }
    }

    //댓글 목록 조회
    @GetMapping
    public List<CommentVO> getComments(@RequestParam String targetType,
                                       @RequestParam String targetId) {
        return commentService.getCommentList(targetType, targetId);
    }

    // URL: DELETE /api/comments/{commentId}     {commentId}는 데이터 고정된 주소가 아니라 변수임
    // Body: { "userId": "user1" }
    @DeleteMapping("/{commentId}")
    public String deleteComment(@PathVariable int commentId, @RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        String userRole = body.get("userRole");

        System.out.println("삭제 요청 - Id: " + commentId + ", User: " + userId);

        boolean isSuccess = commentService.deleteComment(commentId, userId ,userRole);
        return isSuccess ? "SUCCESS" : "FAIL";
    }
    //댓글 수정
    @PutMapping
    public String updateComment(@RequestBody CommentVO commentVO) {
        System.out.println("수정 요청: "+ commentVO);
        boolean isSuccess = commentService.updateComment(commentVO);

        if (isSuccess) {
            return "SUCCESS";
        } else {
            return "FAIL";
        }
    }
}
