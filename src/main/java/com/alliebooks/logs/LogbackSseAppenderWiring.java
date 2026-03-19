package com.alliebooks.logs;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LogbackSseAppenderWiring {

    private final InMemoryLogBuffer buffer;
    private final LiveLogSseHub hub;

    public LogbackSseAppenderWiring(InMemoryLogBuffer buffer, LiveLogSseHub hub) {
        this.buffer = buffer;
        this.hub = hub;
    }

    @PostConstruct
    void wire() {
        LogbackSseAppender.buffer = buffer;
        LogbackSseAppender.hub = hub;
    }
}

