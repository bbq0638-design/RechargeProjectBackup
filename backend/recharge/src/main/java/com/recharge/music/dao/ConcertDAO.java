package com.recharge.music.dao;

import com.recharge.music.vo.ConcertVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ConcertDAO {
    void insertConcert(ConcertVO vo);
    void deleteAllConcerts();
    List<ConcertVO> selectTopConcerts();
}
