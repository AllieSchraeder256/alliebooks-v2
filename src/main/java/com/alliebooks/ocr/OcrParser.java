package com.alliebooks.ocr;

import com.alliebooks.models.OcrToken;
import com.alliebooks.services.OcrTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class OcrParser {
    private static final Logger logger = Logger.getLogger(OcrParser.class.getName());

    @Autowired
    private OcrTokenService ocrTokenService;

    public ReceiptData parse(String rawText) {
        var data = new ReceiptData(rawText);
        data.setAmount(parseAmount(rawText));
        data.setDate(parseDate(rawText));

        var token = parseMerchant(rawText);
        if (token != null) {
            data.setMerchant(token.getMerchant());
            data.setExpenseTypeId(token.getExpenseTypeId());
        }
        return data;
    }

    private double parseAmount(String rawText) {
        double highest = 0.0;
        for (var match : matches(rawText,"TOTAL:?\\ *\\$?(\\d*\\.\\d{2})")) {
            try {
                double amount = Double.parseDouble(match);
                if (amount > highest) {
                    highest = amount;
                }
            } catch (NumberFormatException e) {
                logger.info(String.format("Bad text parse! Not a number: [%s]", match));
            }
        }
        return highest;
    }

    private OcrToken parseMerchant(String rawText) {
        var tokens = ocrTokenService.getOcrTokens();
        for (var token : tokens) {
            if (!matches(rawText, token.getRegex()).isEmpty()) {
                return token;
            }
        }

        logger.info("Unable top parse merchant");
        return null;
    }

    private LocalDate parseDate(String rawText) {
        var matches = matches(rawText, "([0-9]{2}\\/[0-9]{2}\\/[0-9]{2})\\ ", "([0-9]{2}\\/[0-9]{2}\\/20[0-9]{2})");

        var dateTimeFormatterBuilder = new DateTimeFormatterBuilder()
                .append(DateTimeFormatter.ofPattern("[MM/dd/yyyy][MM/dd/yy][dd-MM-yyyy][yyyy/MM/dd]"));
        var dateTimeFormatter = dateTimeFormatterBuilder.toFormatter();

        var dates = new HashSet<LocalDate>();
        for (var match : matches) {
            try {
                dates.add(LocalDate.parse(match.trim(), dateTimeFormatter));
            } catch (DateTimeParseException e) {
                logger.info(String.format("Bad text parse! Not a date: [%s]", match));
            }
        }
        if (!dates.isEmpty()) {
            LocalDate now = LocalDate.now();
            return dates.stream()
                .min(Comparator.comparingLong(d -> Math.abs(d.toEpochDay() - now.toEpochDay())))
                .get();
        }
        return null;
    }

    private Set<String> matches(String rawText, String... regexes){
        var set = new HashSet<String>();
        for (var regex : regexes) {
            Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(rawText);
            while (matcher.find()) {
                if (matcher.groupCount() >= 1 && matcher.group(1) != null) {
                    set.add(matcher.group(1));
                } else {
                    set.add(matcher.group());
                }
            }

        }
        logger.info(String.format("Found groups %s", set));
        return set;
    }
}
