package com.alliebooks.controllers;

import com.alliebooks.models.OcrToken;
import com.alliebooks.services.OcrTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/ocr-tokens")
public class OcrTokenController {
    @Autowired
    private OcrTokenService ocrTokenService;

    @GetMapping
    public List<OcrToken> getOcrTokens() {
        return ocrTokenService.getOcrTokens();
    }

    @GetMapping("/{id}")
    public OcrToken getOcrToken(@PathVariable UUID id) throws Exception {
        var ocrTokenOption = ocrTokenService.findById(id);
        if (ocrTokenOption.isPresent()) {
            return ocrTokenOption.get();
        } else {
            throw new Exception("OcrToken not found with id: " + id);
        }
    }

    @PostMapping
    public ResponseEntity<OcrToken> create(@RequestBody OcrToken ocrToken) throws URISyntaxException {
        OcrToken savedOcrToken = ocrTokenService.save(ocrToken);
        return ResponseEntity.created(new URI("/OcrTokens/" + savedOcrToken.getId())).body(savedOcrToken);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OcrToken> update(@PathVariable UUID id, @RequestBody OcrToken ocrToken) {
        var currentOcrToken = ocrTokenService.findById(id)
                    .orElseThrow(RuntimeException::new);
        currentOcrToken.setRegex(ocrToken.getRegex());
        currentOcrToken.setMerchant(ocrToken.getMerchant());
        currentOcrToken.setExpenseTypeId(ocrToken.getExpenseTypeId());
        currentOcrToken = ocrTokenService.save(currentOcrToken);

        return ResponseEntity.ok(currentOcrToken);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<OcrToken> delete(@PathVariable UUID id) {
        try {
            ocrTokenService.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }
}
