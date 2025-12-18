package com.recharge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RechargeApplication {

	public static void main(String[] args) {
		SpringApplication.run(RechargeApplication.class, args);
	}

}
