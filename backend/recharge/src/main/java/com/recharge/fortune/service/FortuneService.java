package com.recharge.fortune.service;

import com.recharge.fortune.vo.FortuneVO;

public interface FortuneService {
    String generateFortune(FortuneVO vo) throws Exception;
}
