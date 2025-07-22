package com.alliebooks.services;

import com.alliebooks.models.ExpenseType;
import com.alliebooks.repositories.ExpenseTypeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseTypeService extends BaseCrudService<ExpenseType> {
	
	@Autowired
	private ExpenseTypeRepo expenseTypeRepo;

	public ExpenseTypeService(ExpenseTypeRepo repository) {
		super(repository);
	}

	public List<ExpenseType> getExpenseTypes() {
		return expenseTypeRepo.findByDeletedFalseOrderByName();
	}
}
