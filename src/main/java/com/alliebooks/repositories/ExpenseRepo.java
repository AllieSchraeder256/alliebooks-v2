package com.alliebooks.repositories;

import com.alliebooks.models.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseRepo extends JpaRepository<Expense, UUID> {
    static final String QUERY = """
            select expense from Expense expense where paidOn between :start and :end
            and (:propertyId is null or propertyId = :propertyId)
            and (:expenseTypeId is null or expenseTypeId = :expenseTypeId)
            and (:searchText is null or merchant like %:searchText% or note like %:searchText%)
            order by paidOn desc, expenseTypeId, propertyId
            """;
    @Query(QUERY)
    public List<Expense> findByParameters(
            @Param("start") LocalDate start,
            @Param("end") LocalDate end,
            @Param("propertyId") UUID propertyId,
            @Param("expenseTypeId") UUID expenseTypeId,
            @Param("searchText") String searchText);
}
