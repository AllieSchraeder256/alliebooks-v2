package com.alliebooks.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name="expense_types")
@Getter
@Setter
public class ExpenseType extends BaseModel {
	private String name;

	@OneToMany(mappedBy="expenseType")
	private List<Expense> expenses;
}
