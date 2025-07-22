package com.alliebooks.services;

import com.alliebooks.models.Tenant;
import com.alliebooks.models.Unit;
import com.alliebooks.repositories.TenantRepo;
import com.alliebooks.repositories.UnitRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TenantService extends BaseCrudService<Tenant> {

	@Autowired
	private TenantRepo tenantRepo;

	public TenantService(TenantRepo repository) {
		super(repository);
	}
}