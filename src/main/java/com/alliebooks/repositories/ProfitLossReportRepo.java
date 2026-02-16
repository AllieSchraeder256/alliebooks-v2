package com.alliebooks.repositories;

import com.alliebooks.models.reports.ProfitLossReport;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ProfitLossReportRepo {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public List<ProfitLossReport> findByYear(String year) {
        String sql = """
                SELECT COALESCE(SUM(expense_total), 0) AS expense_total,
                       COALESCE(SUM(income_total), 0)  AS income_total,
                       year,
                       property_name
                FROM (
                  SELECT SUM(e.amount) AS expense_total, 0::numeric AS income_total,
                         date_part('year', e.paid_on)::int AS year, p.name AS property_name
                  FROM expenses e
                  LEFT JOIN properties p ON e.property_id = p.id
                  WHERE e.deleted = false
                  GROUP BY date_part('year', e.paid_on), p.name
                  UNION ALL
                  SELECT 0::numeric AS expense_total, SUM(rp.amount) AS income_total,
                         date_part('year', rp.received_on)::int AS year, p.name AS property_name
                  FROM rent_payments rp
                  LEFT JOIN leases l ON l.id = rp.lease_id
                  LEFT JOIN units u ON u.id = l.unit_id
                  LEFT JOIN properties p ON p.id = u.property_id
                  WHERE rp.deleted = false
                  GROUP BY date_part('year', rp.received_on), p.name
                ) t
                WHERE year = :year
                GROUP BY year, property_name
                ORDER BY year DESC, property_name""";

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("year", Integer.parseInt(year)); //TODO don't just parse whatever like a hack
        @SuppressWarnings("unchecked")
        List<Object[]> rows = query.getResultList();

        List<ProfitLossReport> results = new ArrayList<>(rows.size());
        for (var row : rows) {
            var expenseStr = row[0] != null ? row[0].toString() : null;
            var incomeStr  = row[1] != null ? row[1].toString() : null;
            var yearNum    = row[2] != null ? row[2].toString() : null;
            var propertyName = row[3] != null ? row[3].toString() : null;

            BigDecimal expenseTotal = expenseStr != null ? new BigDecimal(expenseStr) : BigDecimal.ZERO;
            BigDecimal incomeTotal  = incomeStr  != null ? new BigDecimal(incomeStr)  : BigDecimal.ZERO;
            int resultYear = yearNum != null ? Integer.parseInt(yearNum) : 0;

            results.add(new ProfitLossReport(expenseTotal, incomeTotal, resultYear, propertyName));
        }

        return results;
    }
}