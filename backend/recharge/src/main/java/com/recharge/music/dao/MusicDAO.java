package com.recharge.music.dao;

import com.recharge.music.vo.MusicVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MusicDAO {
//  신규 음악 차트 저장
    void insertMusic(MusicVO vo);
// 인기 음악 업데이트
    void updateMusic(MusicVO vo);

//    musicId 존재 여부 체크
    int existsMusic(Long musicId);

//  단일 음악 조회
    MusicVO selectMusicById(Long musicId);

//    전체 음악 조회
    List<MusicVO> selectAllMusic();
// 플래그로 음악 조회
    List<MusicVO> selectMusicByFlag(String musicFlag);

// 최신 한국 탑 100 업데이트 조회
    String getLatestUsUpdateDate();
// 최신 팝 100 업데이트 조회
    String getLatestKrUpdateDate();

//    해당 flag 기존 데이터 삭제
    void deleteByFlag(String musicFlag);
}
