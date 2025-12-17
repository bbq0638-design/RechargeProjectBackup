package com.recharge.userfeed.controller;

import com.recharge.userfeed.service.UserFeedService;
import com.recharge.userfeed.vo.UserFeedVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/userfeed")
@RequiredArgsConstructor
public class UserFeedController {

    private final UserFeedService userFeedService;

    @GetMapping("/{userId}")
    public UserFeedVO getUserFeed(@PathVariable String userId) {
        return userFeedService.countUserPosts(userId);
    }

}
