package com.alliebooks.logs;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.Instant;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;

@RestController
public class RawSseLogController {

    private static final Logger log = LoggerFactory.getLogger(RawSseLogController.class);

    private final InMemoryLogBuffer buffer;

    public RawSseLogController(InMemoryLogBuffer buffer) {
        this.buffer = buffer;
    }

    @GetMapping(path = "/api/admin/logs/stream-raw")
    public void streamRaw(
            @RequestParam(name = "sinceId", defaultValue = "0") long sinceId,
            HttpServletResponse response
    ) throws IOException {

        response.setStatus(200);
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/event-stream");
        response.setHeader(HttpHeaders.CACHE_CONTROL, "no-cache");
        response.setHeader("X-Accel-Buffering", "no");
        response.setHeader(HttpHeaders.CONNECTION, "keep-alive");
        response.setHeader(HttpHeaders.CONTENT_ENCODING, "identity");

        PrintWriter out = response.getWriter();

        out.print("event: hello\n");
        out.print("data: connected@" + Instant.now() + "\n\n");
        out.flush();

        long cursor = sinceId;

        // Replay buffered events first.
        List<LogEvent> replay = buffer.since(cursor);
        for (LogEvent e : replay) {
            writeLogEvent(out, e);
            cursor = Math.max(cursor, e.id());
        }
        out.flush();

        log.info("SSE client connected sinceId={}", sinceId);

        // Main loop: poll buffer periodically and write any new events.
        // This blocks the request thread; acceptable for an admin-only debug stream.
        try {
            while (true) {
                List<LogEvent> next = buffer.since(cursor);
                for (LogEvent e : next) {
                    writeLogEvent(out, e);
                    cursor = Math.max(cursor, e.id());
                }

                // keepalive comment so intermediaries don't buffer/timeout idle connections
                out.print(": ka " + Instant.now() + "\n\n");
                out.flush();

                try {
                    Thread.sleep(1500);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        } catch (Exception ex) {
            log.info("SSE client disconnected");
        }
    }

    private static void writeLogEvent(PrintWriter out, LogEvent e) {
        out.print("id: " + e.id() + "\n");
        out.print("event: log\n");

        String json = "{"
                + "\"id\":" + e.id() + ","
                + "\"timestamp\":\"" + safe(e.timestamp() == null ? null : e.timestamp().toString()) + "\","
                + "\"level\":\"" + safe(e.level()) + "\","
                + "\"logger\":\"" + safe(e.logger()) + "\","
                + "\"thread\":\"" + safe(e.thread()) + "\","
                + "\"message\":\"" + safe(e.message()) + "\","
                + "\"throwable\":\"" + safe(e.throwable()) + "\""
                + "}";

        out.print("data: " + json + "\n\n");
    }

    private static String safe(String s) {
        if (s == null) return "";
        return s
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\r", "\\r")
                .replace("\n", "\\n");
    }
}
