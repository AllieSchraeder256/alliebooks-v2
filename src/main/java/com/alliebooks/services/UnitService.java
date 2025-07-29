package com.alliebooks.services;

import com.alliebooks.models.Unit;
import com.alliebooks.repositories.UnitRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UnitService extends BaseCrudService<Unit> {

	@Autowired
	private UnitRepo unitRepo;

	public UnitService(UnitRepo repository) {
		super(repository);
	}

	public List<Unit> findByPropertyId(UUID propertyId) {
		return unitRepo.findByPropertyId(propertyId);
	}
}