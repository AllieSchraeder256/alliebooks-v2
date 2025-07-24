package com.alliebooks.repositories;

import com.alliebooks.models.ExpenseType;
import com.alliebooks.models.Tenant;
import com.alliebooks.models.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UnitRepo extends JpaRepository<Unit, UUID> {
    List<Unit> findByPropertyId(UUID propertyId);
}
