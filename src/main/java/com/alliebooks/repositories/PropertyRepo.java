package com.alliebooks.repositories;

import com.alliebooks.models.Expense;
import com.alliebooks.models.ExpenseType;
import com.alliebooks.models.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PropertyRepo extends JpaRepository<Property, UUID> {
    List<Property> findByDeletedFalseOrderByName();
}
