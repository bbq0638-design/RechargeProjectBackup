package com.recharge.charger.service;

import com.recharge.charger.vo.ChargerVO;

public interface ChargerService {
    void saveOrUpdate(ChargerVO charger);

    int updateChargerData();
}
