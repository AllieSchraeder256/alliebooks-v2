package com.alliebooks.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name="expenses")
@Getter
@Setter
public class Expense extends BaseModel {
	private double amount;
	private String note;
	private String merchant;

	@Column(name="paid_on")
	private LocalDate paidOn;

	@Column(name="image_path")
	private String imagePath;

	@Column(name="property_id", insertable=false, updatable=false)
	private UUID propertyId;

	@ManyToOne
	@JoinColumn(name="property_id")
	private Property property;

	@Column(name="expense_type_id", insertable=false, updatable=false)
	private UUID expenseTypeId;

	@ManyToOne
	@JoinColumn(name="expense_type_id")
	private ExpenseType expenseType;

}
