package com.alliebooks.config;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * Logs native library resolution environment at startup.
 *
 * This is helpful when debugging JNA/tess4j issues where the JVM loads
 * unexpected libtesseract/liblept versions from the OS.
 */
@Component
public class NativeLibDiagnostics implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(NativeLibDiagnostics.class);

    @Override
    public void run(ApplicationArguments args) {
        // Keep this as INFO so it shows up by default in server logs.
        log.info("Native library diagnostics (startup)");

        // System properties that impact JNA / native resolution
        log.info("os.name={} os.arch={} java.version={}",
                System.getProperty("os.name"),
                System.getProperty("os.arch"),
                System.getProperty("java.version"));

        logProperty("jna.library.path");
        logProperty("java.library.path");
        logProperty("jna.tmpdir");

        // Env vars commonly involved in linker resolution
        logEnv("LD_LIBRARY_PATH");
        logEnv("DYLD_LIBRARY_PATH");
        logEnv("PATH");
        logEnv("TESSDATA_PREFIX");

        // Print where the process is currently running from (useful for systemd)
        log.info("user.dir={}", System.getProperty("user.dir"));

        dumpLoadedNativeLibMappings("startup");

        // Some routers prefer ldconfig view; safe to attempt and ignore failures.
        tryLogLdconfigMatches();
    }

    private static void logProperty(String key) {
        log.info("{}={}", key, System.getProperty(key));
    }

    private static void logEnv(String key) {
        String val = System.getenv(key);
        if (val != null && !val.isBlank()) {
            log.info("env {}={}", key, val);
        } else {
            log.info("env {} is <unset>", key);
        }
    }

    /**
     * Dump currently loaded native libs of interest by reading /proc/self/maps (Linux only).
     *
     * This is safe to call multiple times. It helps confirm exactly which liblept/libtesseract
     * the JVM ended up using.
     */
    public static void dumpLoadedNativeLibMappings(String reason) {
        String osName = System.getProperty("os.name", "").toLowerCase();
        if (!osName.contains("linux")) {
            log.info("/proc/self/maps dump skipped (not Linux) reason={}", reason);
            return;
        }

        Path maps = Path.of("/proc/self/maps");
        if (!Files.exists(maps)) {
            log.info("/proc/self/maps not present; cannot inspect loaded native libraries reason={}", reason);
            return;
        }

        List<String> matches = new ArrayList<>();
        try {
            for (String line : Files.readAllLines(maps, StandardCharsets.UTF_8)) {
                if (line.contains("libtesseract") || line.contains("liblept") || line.contains("tess4j")) {
                    matches.add(line);
                }
            }
        } catch (IOException e) {
            log.warn("Failed reading /proc/self/maps reason={}", reason, e);
            return;
        }

        if (matches.isEmpty()) {
            log.info("/proc/self/maps: no loaded entries matching libtesseract/liblept/tess4j reason={}", reason);
            return;
        }

        log.info("/proc/self/maps entries containing libtesseract/liblept/tess4j reason={}", reason);
        for (String line : matches) {
            log.info("maps: {}", line);
        }
    }

    private static void tryLogProcMapsMatches() {
        // Backwards compatible: keep this method, but delegate.
        dumpLoadedNativeLibMappings("startup (legacy)");
    }

    private static void tryLogLdconfigMatches() {
        String osName = System.getProperty("os.name", "").toLowerCase();
        if (!osName.contains("linux")) {
            log.info("ldconfig dump skipped (not Linux)");
            return;
        }

        // ldconfig may require root on some distros; don't fail startup if it doesn't work.
        List<String> cmd = List.of("/sbin/ldconfig", "-p");

        Process p;
        try {
            p = new ProcessBuilder(cmd).redirectErrorStream(true).start();
        } catch (IOException e) {
            log.info("ldconfig not available ({}): {}", String.join(" ", cmd), e.getMessage());
            return;
        }

        Map<String, List<String>> hits = new LinkedHashMap<>();
        hits.put("libtesseract", new ArrayList<>());
        hits.put("liblept", new ArrayList<>());

        try (BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = br.readLine()) != null) {
                if (line.contains("libtesseract")) {
                    hits.get("libtesseract").add(line.trim());
                }
                if (line.contains("liblept")) {
                    hits.get("liblept").add(line.trim());
                }
            }
        } catch (IOException e) {
            log.info("Failed reading ldconfig output: {}", e.getMessage());
            return;
        }

        // Wait for the process but ignore exit code
        try {
            p.waitFor();
        } catch (InterruptedException ignored) {
            Thread.currentThread().interrupt();
        }

        log.info("ldconfig -p matches (may be empty depending on container/distro):");
        for (var entry : hits.entrySet()) {
            if (entry.getValue().isEmpty()) {
                log.info("  {}: <none>", entry.getKey());
            } else {
                for (String l : entry.getValue()) {
                    log.info("  {}: {}", entry.getKey(), l);
                }
            }
        }
    }
}
