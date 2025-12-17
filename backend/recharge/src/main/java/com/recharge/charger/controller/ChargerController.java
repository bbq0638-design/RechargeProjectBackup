package com.recharge.charger.controller;

import com.recharge.charger.service.ChargerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/charger")
public class ChargerController {

    @Autowired
    private ChargerService chargerService;

    @GetMapping("/update")
    @PostMapping("/update")
        public ResponseEntity<String> updateChargerData() {
            int updateCount = chargerService.updateChargerData();
            return ResponseEntity.ok("충전기 데이터 완료:" + updateCount);

    }
}
