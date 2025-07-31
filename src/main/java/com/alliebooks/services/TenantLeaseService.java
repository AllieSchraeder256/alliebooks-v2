package com.alliebooks.services;

import com.alliebooks.models.TenantLease;
import com.alliebooks.repositories.TenantLeaseRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TenantLeaseService extends BaseCrudService<TenantLease> {
	private final TenantLeaseRepo repository;

	public TenantLeaseService(TenantLeaseRepo repository) {
		super(repository);
		this.repository	= repository;
	}

	public void deleteByLeaseId(UUID leaseId) throws Exception {
		for(var tenantLease : repository.findByLeaseIdAndDeletedFalse(leaseId)) {
			super.delete(tenantLease.getId());
		}
	}
}
