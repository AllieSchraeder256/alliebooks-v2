package com.alliebooks.services;

import com.alliebooks.models.Tenant;
import com.alliebooks.repositories.TenantRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

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

	public boolean tenantExists(UUID tenantId) {
		return tenantRepo.existsByIdAndDeletedFalse(tenantId);
	}
}