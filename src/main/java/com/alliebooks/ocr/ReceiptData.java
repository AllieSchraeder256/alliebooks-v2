package com.alliebooks.ocr;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;
import java.util.logging.Logger;

@Getter
@Setter
public class ReceiptData implements Serializable {
    private static final Logger logger = Logger.getLogger(ReceiptData.class.getName());

    private double amount;
    private String merchant;
    private LocalDate date;
    private UUID expenseTypeId;
    private String rawText;

    public ReceiptData(String rawText) {
        this.rawText = rawText;
    }
}
