package com.alliebooks.repositories;

import com.alliebooks.models.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ExpenseRepo extends JpaRepository<Expense, UUID> {
}
