package com.alliebooks.services;

import com.alliebooks.models.Lease;
import com.alliebooks.models.Tenant;
import com.alliebooks.models.Unit;
import com.alliebooks.repositories.TenantRepo;
import com.alliebooks.repositories.UnitRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TenantService extends BaseCrudService<Tenant> {

	@Autowired
	private TenantRepo tenantRepo;

	public TenantService(TenantRepo repository) {
		super(repository);
	}

	public List<Tenant> getTenants() {
		return tenantRepo.findByDeletedFalse();
	}
}