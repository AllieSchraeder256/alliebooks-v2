package com.alliebooks.logs;

import ch.qos.logback.classic.spi.IThrowableProxy;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.AppenderBase;
import java.time.Instant;

public class LogbackSseAppender extends AppenderBase<ILoggingEvent> {

    static InMemoryLogBuffer buffer;
    static LiveLogSseHub hub;

    @Override
    protected void append(ILoggingEvent event) {
        if (buffer == null || hub == null) {
            return;
        }

        String throwable = null;
        IThrowableProxy tp = event.getThrowableProxy();
        if (tp != null) {
            throwable = tp.getClassName() + ": " + tp.getMessage();
        }

        var e = new LogEvent(
                0,
                Instant.ofEpochMilli(event.getTimeStamp()),
                event.getLevel().toString(),
                event.getLoggerName(),
                event.getThreadName(),
                event.getFormattedMessage(),
                throwable
        );

        hub.broadcast(buffer.add(e));
    }
}

