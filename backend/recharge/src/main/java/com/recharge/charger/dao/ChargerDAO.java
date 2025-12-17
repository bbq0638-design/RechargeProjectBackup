package com.recharge.charger.dao;

import com.recharge.charger.vo.ChargerVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ChargerDAO {

    int existsCharger(@Param("stationId") String stationId,
                      @Param("chargerId") String chargerId);

    int insertCharger(ChargerVO charger);

    int updateCharger(ChargerVO charger);
}
