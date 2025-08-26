package com.alliebooks.services;

import com.alliebooks.models.ExpenseType;
import com.alliebooks.repositories.ExpenseTypeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ExpenseTypeService extends BaseCrudService<ExpenseType> {
	
	@Autowired
	private ExpenseTypeRepo expenseTypeRepo;

	public ExpenseTypeService(ExpenseTypeRepo repository) {
		super(repository);
	}

	@Cacheable(cacheNames = "expenseTypes")
	public List<ExpenseType> getExpenseTypes() {
		return expenseTypeRepo.findByDeletedFalseOrderByName();
	}

	@Override
	@Cacheable(cacheNames = "expenseTypeById", key = "#id")
	public Optional<ExpenseType> findById(UUID id) {
		return super.findById(id);
	}

	@Override
	@Caching(
		put = { @CachePut(cacheNames = "expenseTypeById", key = "#result.id") },
		evict = { @CacheEvict(cacheNames = "expenseTypes", allEntries = true) }
	)
	public ExpenseType save(ExpenseType entity) {
		return super.save(entity);
	}

	@Override
	@Caching(
		evict = {
			@CacheEvict(cacheNames = "expenseTypes", allEntries = true),
			@CacheEvict(cacheNames = "expenseTypeById", key = "#id")
		}
	)
	public ExpenseType delete(UUID id) throws Exception {
		return super.delete(id);
	}
}
