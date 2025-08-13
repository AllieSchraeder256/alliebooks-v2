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
	private final ImageService imageService;

	public RentPaymentService(RentPaymentRepo repository, ImageService imageService) {
		super(repository);
		this.repository = repository;
        this.imageService = imageService;
    }

	public List<RentPayment> getRentPayments(LocalDate start, LocalDate end, UUID leaseId) {
		var payments = leaseId == null ?
			repository.findByDueOnBetweenAndDeletedFalseOrderByDueOnDesc(start, end)
			: repository.findByDueOnBetweenAndLeaseIdAndDeletedFalseOrderByDueOnDesc(start, end, leaseId);

		for (var payment : payments) {
			payment.setHasImage(imageService.hasImage(payment.getId()));
		}
		return payments;
	}

	public List<RentPayment> getRentPayments(UUID leaseId) {
		var payments = repository.findByLeaseIdAndDeletedFalseOrderByDueOnDesc(leaseId);
		for (var payment : payments) {
			payment.setHasImage(imageService.hasImage(payment.getId()));
		}
		return payments;
	}

	public LocalDate getNextPaymentDueOn(UUID leaseId) {
		var lastPaymentOpt = repository.findFirstByLeaseIdAndDeletedFalseOrderByDueOnDesc(leaseId);
        return lastPaymentOpt.map(rentPayment ->
				rentPayment.getDueOn().plusMonths(1)).orElseGet(LocalDate::now);
    }
}