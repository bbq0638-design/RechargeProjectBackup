package com.recharge.station.service;

import com.recharge.station.vo.StationVO;

import java.util.List;
import java.util.Map;

public interface StationService {
    int updateStationData();

    List<StationVO> getStationByDistance(double lat, double lng, double radiusKm);

    List<StationVO> getStationsWithCharger();

    Map<String, Object> searchStationsByAddress(String query, double radiusKm);

    List<Map<String, Object>> getAutocomplete(String query);

}
