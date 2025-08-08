package com.alliebooks.services;

import com.alliebooks.models.RentPayment;
import com.alliebooks.repositories.RentPaymentRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class RentPaymentService extends BaseCrudService<RentPayment> {

	private final RentPaymentRepo repository;

	public RentPaymentService(RentPaymentRepo repository) {
		super(repository);
		this.repository = repository;
	}

	public List<RentPayment> getRentPayments(LocalDate start, LocalDate end, UUID leaseId) {
		return leaseId == null ?
			repository.findByDueOnBetweenAndDeletedFalseOrderByDueOnDesc(start, end)
			: repository.findByDueOnBetweenAndLeaseIdAndDeletedFalseOrderByDueOnDesc(start, end, leaseId);
	}
}