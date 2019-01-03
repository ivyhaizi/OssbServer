package com.ths.ossb;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.ths.ossb.dao")
public class OssbServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(OssbServerApplication.class, args);
	}

}

