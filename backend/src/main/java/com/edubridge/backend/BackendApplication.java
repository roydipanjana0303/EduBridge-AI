package com.edubridge.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.edubridge", "com.edubridge.backend", "com.edubridge.chat", "com.edubridge.voice", "com.edubridge.config"})
@EnableJpaRepositories(basePackages = {"com.edubridge.backend", "com.edubridge.chat"})
@EntityScan(basePackages = {"com.edubridge.backend", "com.edubridge.chat"})
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
