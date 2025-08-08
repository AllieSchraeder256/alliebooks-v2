package com.alliebooks.repositories;

import com.alliebooks.models.RentPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface RentPaymentRepo extends JpaRepository<RentPayment, UUID> {
    List<RentPayment> findByDueOnBetweenAndDeletedFalseOrderByDueOnDesc(LocalDate start, LocalDate end);
    List<RentPayment> findByDueOnBetweenAndLeaseIdAndDeletedFalseOrderByDueOnDesc(LocalDate start, LocalDate end, UUID leaseId);
}
