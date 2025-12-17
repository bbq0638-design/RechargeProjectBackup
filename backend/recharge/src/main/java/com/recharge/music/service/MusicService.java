package com.recharge.music.service;

import com.recharge.music.vo.MusicVO;

import java.util.List;

public interface MusicService {
//한국 Apple Music TOP100 불러와서 DB 저장 (UPSERT)
    List<MusicVO> fetchKoreaTop100AndSave();

// 미국 Apple Music TOP100 불러와서 DB 저장 (UPSERT)
    List<MusicVO> fetchUSTop100AndSave();

//      musicId로 단일 음악 조회
    MusicVO getMusic(Long musicId);

//      전체 음악 조회
    List<MusicVO> getAllMusic();

//      FLAG 기준 음악 리스트 조회 (KR_TOP100, US_TOP100, USER_RECOMMEND 등)
    List<MusicVO> getMusicByFlag(String musicFlag);
}