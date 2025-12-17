package com.recharge.notice.dao;

import com.recharge.notice.vo.NoticeVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper

public interface NoticeDAO {
    //공지 등록
    void insertNotice(NoticeVO noticeVO);

    //공지 목록
    List<NoticeVO> getNoticeList();

    //공지 상세
    NoticeVO getNoticeDetail(Long noticeId);

    //공지 수정
    int editNoticeDetail(NoticeVO noticeVO);

    //공지 삭제
    int deleteNoticeDetail(Long noticeId);

    // 공지 조회수 증가
    void incrementViewCount(Long noticeId);

    // 현재 조회수 반환
    Long getNoticeDetailViewCount(Long noticeId);


}