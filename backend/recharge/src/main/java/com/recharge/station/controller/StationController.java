package com.recharge.station.controller;

import com.recharge.station.service.StationService;
import com.recharge.station.service.StationServiceImpl;
import com.recharge.station.vo.StationVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/station")
public class StationController {

    @Autowired
    private StationService stationService;

    @GetMapping("/update")
    public ResponseEntity<String> updateStation(){
        int result = stationService.updateStationData();
        return ResponseEntity.ok("충남 춘전소 저장 완료: "+result+"건");
    }

    @GetMapping("/near")
    public ResponseEntity<List<StationVO>> getStationsByDistance(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "3.0") double radius
    ) {
        List<StationVO> stations = stationService.getStationByDistance(lat, lng, radius);
        return ResponseEntity.ok(stations);
    }

    @GetMapping ("/with-charger")
    public ResponseEntity<List<StationVO>> getStationWithCharger() {
        return ResponseEntity.ok(stationService.getStationsWithCharger());
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchStationByKeyword(
            @RequestParam String query,
            @RequestParam(defaultValue = "3.0") double radius
    ) {
        Map<String, Object> result = stationService.searchStationsByAddress(query, radius);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<Map<String, Object>> autocomplete(
            @RequestParam String query
    ) {
        List<Map<String, Object>> docs = stationService.getAutocomplete(query);

        Map<String, Object> result = new HashMap<>();
        result.put("documents", docs);

        return ResponseEntity.ok(result);
    }


}
