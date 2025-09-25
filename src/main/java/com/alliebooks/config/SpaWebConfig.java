package com.alliebooks.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SpaWebConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Client-side (React) routes. Do NOT include /api here.
        String[] spaRoutes = new String[] {
                "/leases",
                "/expenses",
                "/rent-payments",
                "/properties",
                "/tenants",
                "/expense-types",
                "/admin",
                "/ocr-tokens",
                "/signup",
                "/login"
        };
        for (String base : spaRoutes) {
            // Exact path
            registry.addViewController(base).setViewName("forward:/index.html");
            // Trailing slash
            registry.addViewController(base + "/").setViewName("forward:/index.html");
            // Any nested client-side route under this base
            registry.addViewController(base + "/**").setViewName("forward:/index.html");
        }
    }
}
