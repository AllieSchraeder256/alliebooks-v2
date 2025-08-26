package com.alliebooks.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name="ocr_tokens")
@Getter
@Setter
public class OcrToken extends BaseModel {
	private String regex;
	private String merchant;

	@Column(name="expense_type_id")
	private UUID expenseTypeId;

	@ManyToOne
	@JoinColumn(name="expense_type_id", insertable=false, updatable=false)
	private ExpenseType expenseType;
}
