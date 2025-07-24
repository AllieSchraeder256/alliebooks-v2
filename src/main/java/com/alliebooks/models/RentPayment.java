package com.alliebooks.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="rent_payments")
@Getter
@Setter
public class RentPayment extends BaseModel {
	private double amount;
	private String note;
	
	@Column(name="received_date")
	private Instant receivedDate;

	@Column(name="due_date")
	private Instant dueDate;

	@Column(name="image_path")
	private String imagePath;

	@Column(name="lease_id")
	private UUID leaseId;
	
	@ManyToOne
	@JoinColumn(name="lease_id", insertable=false, updatable=false)
	private Lease lease;
}
