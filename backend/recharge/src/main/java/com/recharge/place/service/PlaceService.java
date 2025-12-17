package com.recharge.place.service;

import com.recharge.place.vo.PlaceVO;
import java.util.List;

public interface PlaceService {
    List<PlaceVO> getNearbyPlaces(Double lat, Double lng, Double radius);
}
