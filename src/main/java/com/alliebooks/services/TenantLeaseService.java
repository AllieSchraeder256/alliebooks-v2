package com.alliebooks.services;

import com.alliebooks.models.TenantLease;
import com.alliebooks.repositories.TenantLeaseRepo;
import org.springframework.stereotype.Service;

@Service
public class TenantLeaseService extends BaseCrudService<TenantLease> {

	public TenantLeaseService(TenantLeaseRepo repository) {
		super(repository);
	}
}
