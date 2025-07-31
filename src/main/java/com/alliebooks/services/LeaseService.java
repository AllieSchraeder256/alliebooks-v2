package com.alliebooks.services;

import com.alliebooks.models.Lease;
import com.alliebooks.models.TenantLease;
import com.alliebooks.repositories.LeaseRepo;
import com.alliebooks.repositories.TenantLeaseRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;

@Service
public class LeaseService extends BaseCrudService<Lease> {

	@Autowired
	private LeaseRepo leaseRepo;

	@Autowired
	private TenantLeaseService tenantLeaseService;

	@Autowired
	private TenantService tenantService;

	public LeaseService(LeaseRepo repository) {
		super(repository);
	}

	public List<Lease> getCurrentLeases() {
		return leaseRepo.findByCurrentAndDeletedFalse(true);
	}

	public List<Lease> getOldLeases() {
		return leaseRepo.findByCurrentAndDeletedFalse(false);
	}

	public void saveTenantLeases(UUID leaseId, List<UUID> tenantIds) {
		for (UUID tenantId : tenantIds) {
			if (tenantService.tenantExists(tenantId)) {
				var tenantLease = new TenantLease();
				tenantLease.setLeaseId(leaseId);
				tenantLease.setTenantId(tenantId);
				tenantLeaseService.save(tenantLease);
			}
			//TODO logging if this fails
		}
	}

	@Override
	public Lease delete(UUID id) throws Exception {
		tenantLeaseService.deleteByLeaseId(id);
		return super.delete(id);
	}
}
