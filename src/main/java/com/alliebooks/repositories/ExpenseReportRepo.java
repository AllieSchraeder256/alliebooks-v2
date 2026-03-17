package com.alliebooks.repositories;

import com.alliebooks.models.reports.ExpenseReport;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ExpenseReportRepo {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public List<ExpenseReport> findByYear(String year) {
        String sql = """
                SELECT p.name AS property_name,
                date_part('year', e.paid_on)::int AS year,
                sum(amount) AS total,
                et.name AS expense_type_name
                FROM expenses e
                LEFT JOIN expense_types et on e.expense_type_id = et.id
                LEFT JOIN properties p on e.property_id = p.id
                WHERE e.deleted = false AND date_part('year', e.paid_on)::int = :year
                GROUP BY year, et.name, p.name
                ORDER BY p.name, year desc, et.name""";

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("year", Integer.parseInt(year)); //TODO don't just parse whatever like a hack
        @SuppressWarnings("unchecked")
        List<Object[]> rows = query.getResultList();

        List<ExpenseReport> results = new ArrayList<>(rows.size());
        for (var row : rows) {
            var propertyName = row[0] != null ? row[0].toString() : null;
            var yearNum  = row[1] != null ? row[1].toString() : null;
            var totalStr    = row[2] != null ? row[2].toString() : null;
            var expenseTypeName = row[3] != null ? row[3].toString() : null;

            BigDecimal total = totalStr != null ? new BigDecimal(totalStr) : BigDecimal.ZERO;
            int resultYear = yearNum != null ? Integer.parseInt(yearNum) : 0;

            results.add(new ExpenseReport(propertyName, resultYear, total, expenseTypeName));
        }

        return results;
    }
}