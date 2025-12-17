package com.recharge.place.dao;

import com.recharge.place.vo.PlaceVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface PlaceDAO {

    int insertPlace(PlaceVO place);

    int existsByKakaoPlaceId(String KakaoPlaceId);

    List<PlaceVO> findPlaceByLocation(
            @Param("lat") Double lat,
            @Param("lng") Double lng,
            @Param("radius") Double radius
    );
}
