package com.alliebooks.ocr;

import com.alliebooks.config.NativeLibDiagnostics;
import net.sourceforge.tess4j.Tesseract;
import org.apache.tika.Tika;
import org.apache.tika.mime.MimeType;
import org.apache.tika.mime.MimeTypeException;
import org.apache.tika.mime.MimeTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class TesseractOcr {
    private static final Logger logger = Logger.getLogger(TesseractOcr.class.getName());
    public static final String TRAINING_DATA_PATH = "src/main/resources/tessdata";
    private static Tika tika;
    private final Tesseract tesseract;

    @Autowired
    private OcrParser ocrParser;

    /**
     * If set, we will attempt to preload native .so files from this directory using System.load().
     *
     * This is the most reliable way to ensure lept4j/tess4j bind to the intended
     * liblept/libtesseract pair and avoid the common "undefined symbol" mismatch.
     *
     * Set via either:
     *  - env: ALLIEBOOKS_TESS_NATIVE_DIR
     *  - JVM: -Dalliebooks.tess.nativeDir=/path
     */
    private static final String NATIVE_DIR_ENV = "ALLIEBOOKS_TESS_NATIVE_DIR";
    private static final String NATIVE_DIR_PROP = "alliebooks.tess.nativeDir";

    public TesseractOcr() {
        tika = new Tika();
        tesseract = new Tesseract();
    }

    public ReceiptData doOcr(MultipartFile input) {
        try {
            var file = createTempFile(input);

            // Preload native libs (if configured) BEFORE any lept4j classes initialize.
            preloadNativeLibsIfConfigured();

            tesseract.setVariable("user_defined_dpi", "72");
            tesseract.setDatapath(TRAINING_DATA_PATH);
            tesseract.setLanguage("eng");
            tesseract.setPageSegMode(3);
            tesseract.setOcrEngineMode(1);

            String result = tesseract.doOCR(file);

            // After first successful OCR call, log the resolved native libs.
            NativeLibDiagnostics.dumpLoadedNativeLibMappings("after tesseract.doOCR (success)");

            logger.info(String.format("Read image text=[%s]", result));
            return ocrParser.parse(result);
        } catch (UnsatisfiedLinkError ule) {
            // Critical for debugging: capture what actually got loaded/resolved.
            try {
                NativeLibDiagnostics.dumpLoadedNativeLibMappings("after tesseract.doOCR (UnsatisfiedLinkError)");
            } catch (Exception ignored) {
                // don't hide the original error
            }
            logger.log(Level.SEVERE, "Native library linkage error while running OCR", ule);
            return null;
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Can't create temp file for input stream", e);
            return null;
        }
    }

    private static void preloadNativeLibsIfConfigured() {
        String dir = System.getProperty(NATIVE_DIR_PROP);
        if (dir == null || dir.isBlank()) {
            dir = System.getenv(NATIVE_DIR_ENV);
        }
        if (dir == null || dir.isBlank()) {
            return;
        }

        dir = dir.trim();
        // In practice, loading liblept first tends to avoid resolution falling back to /lib.
        // We try the common SONAME filenames; failures are logged but non-fatal.
        String lept = dir.endsWith("/") ? (dir + "liblept.so.5") : (dir + "/liblept.so.5");
        String tess = dir.endsWith("/") ? (dir + "libtesseract.so.5") : (dir + "/libtesseract.so.5");

        try {
            logger.info("Preloading native library: " + lept);
            System.load(lept);
            logger.info("Preloaded OK: " + lept);
        } catch (UnsatisfiedLinkError e) {
            logger.warning("Could not preload " + lept + ": " + e.getMessage());
        } catch (SecurityException e) {
            logger.warning("Security manager blocked preload of " + lept + ": " + e.getMessage());
        }

        try {
            logger.info("Preloading native library: " + tess);
            System.load(tess);
            logger.info("Preloaded OK: " + tess);
        } catch (UnsatisfiedLinkError e) {
            logger.warning("Could not preload " + tess + ": " + e.getMessage());
        } catch (SecurityException e) {
            logger.warning("Security manager blocked preload of " + tess + ": " + e.getMessage());
        }
    }

    private static File createTempFile(MultipartFile input) throws IOException, MimeTypeException {
        var contentType = tika.detect(input.getBytes());
        MimeTypes allTypes = MimeTypes.getDefaultMimeTypes();
        MimeType type = allTypes.forName(contentType);
        File file = new File("src/main/resources/tempImage" + type.getExtension());
        OutputStream out = new FileOutputStream(file);
        out.write(input.getBytes());
        out.close();
        return file;

    }
}
