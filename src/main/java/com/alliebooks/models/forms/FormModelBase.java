package com.alliebooks.models.forms;

import java.io.Serializable;
import java.time.Instant;
import java.time.format.DateTimeParseException;

public class FormModelBase implements Serializable {
    protected Instant parseDateNoTime(String date) throws DateTimeParseException {
        return Instant.parse(date + "T00:00:00.00Z");
    }
}
