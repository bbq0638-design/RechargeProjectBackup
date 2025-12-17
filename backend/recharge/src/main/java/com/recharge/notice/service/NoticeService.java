package com.recharge.notice.service;

import com.recharge.notice.dao.NoticeDAO;
import com.recharge.notice.vo.NoticeVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Transactional
@Service
public class NoticeService {

    @Autowired
    private NoticeDAO noticeDAO;

    // 공지 등록
    public Long insertNotice(NoticeVO noticeVO) {
        noticeDAO.insertNotice(noticeVO);
        return noticeVO.getNoticeId();
    }

    // 공지 목록
    public List<NoticeVO> getNoticeList() {
        return noticeDAO.getNoticeList();
    }

    // 공지 상세
    public NoticeVO getNoticeDetail(Long noticeId) {
        return noticeDAO.getNoticeDetail(noticeId);
    }

    // 공지 수정
    public int editNoticeDetail(NoticeVO noticeVO) {
        return noticeDAO.editNoticeDetail(noticeVO);
    }

    // 공지 삭제
    public int deleteNoticeDetail(Long noticeId) {
        return noticeDAO.deleteNoticeDetail(noticeId);
    }

    public Long incrementViewCount(Long noticeId) {
        noticeDAO.incrementViewCount(noticeId); // 조회수 증가
        return noticeDAO.getNoticeDetailViewCount(noticeId); // 증가 후 조회수 반환
    }

}
