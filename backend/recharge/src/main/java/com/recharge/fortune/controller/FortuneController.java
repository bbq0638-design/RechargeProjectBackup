package com.recharge.fortune.controller;

import com.recharge.fortune.service.FortuneService;
import com.recharge.fortune.vo.FortuneVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fortune")
public class FortuneController {

    @Autowired
    private FortuneService fortuneService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateFortune(@RequestBody FortuneVO vo) {

        try {
            String result = fortuneService.generateFortune(vo);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("운세 오류: " + e.getMessage());
        }
    }
}
