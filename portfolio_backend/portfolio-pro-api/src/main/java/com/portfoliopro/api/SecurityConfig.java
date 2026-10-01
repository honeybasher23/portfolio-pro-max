package com.portfoliopro.api;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Enable CORS to allow the @CrossOrigin annotation on your controller to function
            .cors(Customizer.withDefaults()) 
            // Disable CSRF protection so POST requests are accepted without tokens
            .csrf(AbstractHttpConfigurer::disable)
            // Permit all incoming requests without requiring login credentials
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            
        return http.build();
    }
}