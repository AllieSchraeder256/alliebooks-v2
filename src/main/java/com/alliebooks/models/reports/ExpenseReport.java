package com.alliebooks.models.reports;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class ExpenseReport {
    private String propertyName;
    private Integer year;
    private BigDecimal total;
    private String expenseTypeName;
}
