package com.alliebooks.services;
import com.alliebooks.models.reports.ProfitLossReport;
import com.alliebooks.repositories.ProfitLossReportRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

	@Autowired
	private ProfitLossReportRepo profitLossReportRepo;

	public List<ProfitLossReport> getProfitLossReport(String year) {
		return profitLossReportRepo.findByYear(year);
	}
}