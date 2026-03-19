package com.alliebooks.logs;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class InMemoryLogBuffer {

    private final AtomicLong seq = new AtomicLong(0);
    private final Deque<LogEvent> ring = new ArrayDeque<>();
    private static final int BUFFER_SIZE = 2000;

    public synchronized LogEvent add(LogEvent e) {
        long id = seq.incrementAndGet();
        LogEvent withId = new LogEvent(
                id,
                e.timestamp(),
                e.level(),
                e.logger(),
                e.thread(),
                e.message(),
                e.throwable()
        );
        ring.addLast(withId);
        while (ring.size() > BUFFER_SIZE) {
            ring.removeFirst();
        }
        return withId;
    }

    public synchronized List<LogEvent> since(long lastSeenExclusive) {
        List<LogEvent> out = new ArrayList<>();
        for (LogEvent e : ring) {
            if (e.id() > lastSeenExclusive) {
                out.add(e);
            }
        }
        return out;
    }
}

