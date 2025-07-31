package com.alliebooks.repositories;

import com.alliebooks.models.TenantLease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TenantLeaseRepo extends JpaRepository<TenantLease, UUID> {
    List<TenantLease> findByLeaseIdAndDeletedFalse(UUID leaseId);
}

