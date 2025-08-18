package com.alliebooks.ocr;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
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

@Getter
@Setter
public class ReceiptData implements Serializable {
    private static final Logger logger = Logger.getLogger(ReceiptData.class.getName());

    private double amount;
    private String merchant;
    private LocalDate date;
    private String rawText;

    public ReceiptData(String rawText) {
        this.rawText = rawText;
        amount = parseAmount();
        merchant = parseMerchant();
        date = parseDate();
    }

    private double parseAmount() {
        double highest = 0.0;
        for (var match : matches("TOTAL:?\\ *\\$?(\\d*\\.\\d{2})")) {
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

    private String parseMerchant() {
        if (!matches("(lowe's)").isEmpty()) {
            return "Lowe's";
        }

        if (!matches("(41 SPRING ST\\. WILKES\\-BARRE)", "home depot", "(How doers.*get more done)").isEmpty()) {
            return "Home Depot";
        }

        if (!matches("(ace hardware)").isEmpty()) {
            return "Lowe's";
        }
        logger.info("Unable top parse merchant");
        return null;
    }

    private LocalDate parseDate() {
        var matches = matches("([0-9]{2}\\/[0-9]{2}\\/[0-9]{2})\\ ", "([0-9]{2}\\/[0-9]{2}\\/20[0-9]{2})");

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

    private Set<String> matches(String... regexes){
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
