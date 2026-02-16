package com.alliebooks.controllers;

import com.alliebooks.models.reports.ProfitLossReport;
import com.alliebooks.services.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @GetMapping("/profit-loss")
    public List<ProfitLossReport> getProfitLoss(
             @RequestParam(required = false) String year) throws Exception {

        return reportService.getProfitLossReport(year);
    }
}
