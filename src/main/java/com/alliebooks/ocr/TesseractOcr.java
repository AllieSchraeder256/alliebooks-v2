package com.alliebooks.ocr;

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

    public TesseractOcr() {
        tika = new Tika();
        tesseract = new Tesseract();
    }

    public ReceiptData doOcr(MultipartFile input) {
        try {
            var file = createTempFile(input);

            tesseract.setVariable("user_defined_dpi", "72");
            tesseract.setDatapath(TRAINING_DATA_PATH);
            tesseract.setLanguage("eng");
            tesseract.setPageSegMode(3);
            tesseract.setOcrEngineMode(1);
            String result = tesseract.doOCR(file);

            logger.info(String.format("Read image text=[%s]", result));
            return ocrParser.parse(result);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Can't create temp file for input stream", e);
            return null;
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
