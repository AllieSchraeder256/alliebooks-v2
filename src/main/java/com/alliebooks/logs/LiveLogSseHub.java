package com.alliebooks.logs;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
public class LiveLogSseHub {

    private static final Logger log = LoggerFactory.getLogger(LiveLogSseHub.class);

    private final Map<String, SseEmitter> clients = new ConcurrentHashMap<>();

    public SseEmitter register(String clientId) {
        final long TIMEOUT_MS = 1800000;
        SseEmitter emitter = new SseEmitter(TIMEOUT_MS);
        clients.put(clientId, emitter);

        emitter.onCompletion(() -> clients.remove(clientId));
        emitter.onTimeout(() -> clients.remove(clientId));
        emitter.onError(_e -> clients.remove(clientId));

        return emitter;
    }

    public void broadcast(LogEvent e) {
        for (Map.Entry<String, SseEmitter> entry : clients.entrySet()) {
            SseEmitter emitter = entry.getValue();
            try {
                emitter.send(SseEmitter.event()
                        .name("log")
                        .id(Long.toString(e.id()))
                        .data(e));
            } catch (IOException ex) {
                log.error("SSE send failed; closing client {}", entry.getKey(), ex);
                emitter.complete();
                clients.remove(entry.getKey());
            }
        }
    }}

