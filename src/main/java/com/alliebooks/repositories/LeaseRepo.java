package com.alliebooks.repositories;

import com.alliebooks.models.Lease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LeaseRepo extends JpaRepository<Lease, UUID> {
    List<Lease> findByLeaseStartDateIsNotNullAndLeaseEndDateIsNullAndDeletedFalse();
    List<Lease> findByLeaseStartDateIsNullAndLeaseEndDateIsNullAndDeletedFalse();
}

