package com.recharge.community.service;

import com.recharge.community.dao.CommunityDAO;
import com.recharge.community.vo.CommunityVO;
import com.recharge.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommunityService {

    @Autowired
    private CommunityDAO communityDAO;

    // ★알림 서비스 주입
    @Autowired
    private NotificationService notificationService;

    public List<CommunityVO> selectCategoryList() {
        return communityDAO.selectCategoryList();
    }
    public void insertPost(CommunityVO vo) {
        communityDAO.insertPost(vo);
    }
    //게시글 목록 조회
    public List<CommunityVO> selectPostList() {
        return communityDAO.selectPostList();
    }
    //상세 조회 서비스
    public CommunityVO readPost(int postId, String userId) {
        communityDAO.updateViewCount(postId);

        return communityDAO.selectPostDetail(postId, userId);
    }
    public void deletePost(int postId) {
        communityDAO.deletePost(postId);
    }
    //이미지 데이터만 따로 가져오기
    public byte[] getCommunityImage(int postId) {
        CommunityVO vo = communityDAO.selectCommunityImage(postId);

        if (vo == null) return null;
        return vo.getCommunityImageData();
        }

        public void updatePost(CommunityVO vo) {
            communityDAO.updatePost(vo);
        }

    @Transactional
    public boolean toggleLike(int postId, String userId) {
            //이미 좋아요 눌렀는지 확인
            int count = communityDAO.checkLike(postId, userId);

            if(count>0) {
                //이미 눌렀다면 삭제, 전체 카운트 감소
                communityDAO.deleteLike(postId, userId);
                communityDAO.decreaseLikeCount(postId);
                return false; //현재상태: 안누름
            } else {
                //안눌렀다면->좋아요 등록, 전체 카운트 추가
                communityDAO.insertLike(postId, userId);
                communityDAO.increaseLikeCount(postId);

                //★좋아요 알림 발송
                notificationService.sendNotification(
                        userId,
                        "boardpost",
                        String.valueOf(postId),
                        "LIKE"
                );
                return true;
            }
        }
        public int getLikeCount(int postId) {
            return communityDAO.getLikeCount(postId);
        }
}