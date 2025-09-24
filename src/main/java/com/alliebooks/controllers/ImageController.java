package com.alliebooks.controllers;

import com.alliebooks.models.Image;
import com.alliebooks.ocr.ReceiptData;
import com.alliebooks.ocr.TesseractOcr;
import com.alliebooks.services.ImageService;
import java.util.logging.Level;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/images")
public class ImageController {
    private static final Logger logger = Logger.getLogger(ImageController.class.getName());

    @Autowired
    private ImageService imageService;

    @Autowired
    private TesseractOcr ocr;

    @GetMapping()
    public ResponseEntity<Image> getImage(@RequestParam UUID resourceId) {
        var imageOption = imageService.getForResource(resourceId);
        return imageOption.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/ocr")
    public ResponseEntity<ReceiptData> ocr(@RequestParam("file") MultipartFile imageFile) {
        return ResponseEntity.ok(ocr.doOcr(imageFile));
    }
}