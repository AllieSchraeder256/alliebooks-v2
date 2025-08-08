package com.alliebooks.services;

import com.alliebooks.models.Lease;
import com.alliebooks.models.TenantLease;
import com.alliebooks.models.forms.CurrentLeaseSummary;
import com.alliebooks.repositories.LeaseRepo;
import com.alliebooks.repositories.TenantLeaseRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.logging.Logger;

@Service
public class LeaseService extends BaseCrudService<Lease> {

	@Autowired
	private LeaseRepo leaseRepo;

	@Autowired
	private TenantLeaseService tenantLeaseService;

	@Autowired
	private TenantService tenantService;

	@Autowired
	private RentPaymentService rentPaymentService;

	public LeaseService(LeaseRepo repository) {
		super(repository);
	}

	public List<Lease> getCurrentLeases() {
		var leases = leaseRepo.findByCurrentAndDeletedFalse(true);
		for(var lease : leases) {
			lease.setNextPaymentDueOn(rentPaymentService.getNextPaymentDueOn(lease.getId()));
		}
		return leases;
	}

	@Override
	public Optional<Lease> findById(UUID id) {
		var leaseOpt = super.findById(id);
        leaseOpt.ifPresent(lease ->
				lease.setNextPaymentDueOn(rentPaymentService.getNextPaymentDueOn(lease.getId())));
		return leaseOpt;
	}

	public List<CurrentLeaseSummary> getCurrentLeaseSummary() {
		var list = new ArrayList<CurrentLeaseSummary>();
		for (var lease : leaseRepo.findByCurrentAndDeletedFalse(true)) {
			if (lease.getUnit() == null || lease.getUnit().getProperty() == null || lease.getTenantLeases() == null) {
				//TODO log bad data in here
				continue;
			}

			var tenants = "";
			for (var tenantLease : lease.getTenantLeases()) {
				//TODO more bad data
				if (tenantLease.getTenant() != null) {
					tenants += String.format("%s %s, ", tenantLease.getTenant().getFirstName(), tenantLease.getTenant().getLastName());
				}
			}
			if (!tenants.isEmpty()) {
				tenants = tenants.substring(0, tenants.lastIndexOf(", "));
			}
			list.add(new CurrentLeaseSummary(lease.getId(),
					String.format("%s - %s - %s",
						lease.getUnit().getProperty().getName(),
						lease.getUnit().getName(),
						tenants)));
		}
		return list;
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
