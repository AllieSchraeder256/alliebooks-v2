package com.alliebooks.logs;

import java.time.Instant;

public record LogEvent(
        long id,
        Instant timestamp,
        String level,
        String logger,
        String thread,
        String message,
        String throwable
) {
}

