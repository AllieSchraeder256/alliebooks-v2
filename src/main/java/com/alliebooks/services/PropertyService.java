package com.alliebooks.services;

import com.alliebooks.models.Property;
import com.alliebooks.repositories.PropertyRepo;
import com.alliebooks.repositories.UnitRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PropertyService extends BaseCrudService<Property> {
	
	@Autowired
	private PropertyRepo propertyRepo;

	@Autowired
	private UnitService unitService;

	public PropertyService(PropertyRepo repository) {
		super(repository);
	}

	public List<Property> getProperties() {
		return propertyRepo.findByDeletedFalseOrderByName();
	}
	@Override
	public Property save(Property property) {
		var createdProperty = super.save(property);

		for (var unit : property.getUnits()) {
			unit.setPropertyId(createdProperty.getId());
			unit.setProperty(property);
			unitService.save(unit);
		}
		return createdProperty;
	}

	@Override
	public Property delete(UUID id) throws Exception {
		var propertyOpt = findById(id);
		if (propertyOpt.isPresent()) {
			for (var unit : propertyOpt.get().getUnits()) {
				unitService.delete(unit);
			}
			return super.delete(propertyOpt.get());
		} else {
			throw new Exception("Unable to delete property " + id);
		}
	}
}
