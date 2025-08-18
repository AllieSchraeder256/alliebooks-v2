package com.alliebooks.services;

import com.alliebooks.models.Expense;
import com.alliebooks.repositories.ExpenseRepo;
import com.alliebooks.repositories.ExpenseRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ExpenseService extends BaseCrudService<Expense> {

	private final ExpenseRepo repository;
	private final ImageService imageService;

	public ExpenseService(ExpenseRepo repository, ImageService imageService) {
		super(repository);
		this.repository = repository;
        this.imageService = imageService;
    }

	public List<Expense> getExpenses(LocalDate start, LocalDate end, UUID propertyId, UUID expenseTypeId, String searchText) {
		var expenses = repository.findByParameters(start, end, propertyId, expenseTypeId, searchText == null ? null : searchText.toLowerCase());

		for (var expense : expenses) {
			expense.setHasImage(imageService.hasImage(expense.getId()));
		}
		return expenses;
	}

	@Override
	public Optional<Expense> findById(UUID id) {
		var expense = super.findById(id);
        expense.ifPresent(e -> e.setHasImage(imageService.hasImage(id)));
		return expense;
	}
}