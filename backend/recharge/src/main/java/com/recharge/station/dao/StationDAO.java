package com.recharge.station.dao;

import com.recharge.station.vo.StationVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface StationDAO {
    int mergeStation(StationVO station);

    List<StationVO> getStationsByDistance(Map<String, Object> params);

    List<StationVO> findStationWithCharger();
}
