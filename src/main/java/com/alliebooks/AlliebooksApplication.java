package com.alliebooks;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class AlliebooksApplication {

	public static void main(String[] args) {
		SpringApplication.run(AlliebooksApplication.class, args);
	}

}
