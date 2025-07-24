package com.alliebooks.services;

import com.alliebooks.models.Lease;
import com.alliebooks.repositories.LeaseRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class LeaseService extends BaseCrudService<Lease> {

	@Autowired
	private LeaseRepo leaseRepo;

	@Autowired
	private TenantService tenantService;

	public LeaseService(LeaseRepo repository) {
		super(repository);
	}

	public List<Lease> getCurrentLeases() {
		return leaseRepo.findByCurrentTrueAndDeletedFalse();
	}

	@Override
	public Lease save(Lease lease) {
		var createdLease = super.save(lease);
		return createdLease;
	}
}
