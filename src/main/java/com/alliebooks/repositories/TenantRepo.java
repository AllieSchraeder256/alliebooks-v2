package com.alliebooks.repositories;

import com.alliebooks.models.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TenantRepo extends JpaRepository<Tenant, UUID> {
    List<Tenant> findByDeletedFalse();
}
