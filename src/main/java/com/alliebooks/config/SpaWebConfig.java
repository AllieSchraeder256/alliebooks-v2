package com.alliebooks.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SpaWebConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        String[] spaRoutes = new String[] {
                "/leases/**",
                "/expenses/**",
                "/rent-payments/**",
                "/properties/**",
                "/tenants/**",
                "/expense-types/**",
                "/admin/**",
                "/ocr-tokens/**",
                "/signup/**",
                "/login/**"
        };
        for (String path : spaRoutes) {
            registry.addViewController(path).setViewName("forward:/index.html");
        }
    }
}

