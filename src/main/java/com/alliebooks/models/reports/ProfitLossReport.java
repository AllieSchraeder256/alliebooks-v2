package com.alliebooks.models.reports;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class ProfitLossReport {
    private BigDecimal expenseTotal;
    private BigDecimal incomeTotal;
    private Integer year;
    private String propertyName;
}
