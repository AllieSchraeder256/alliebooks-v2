package com.alliebooks.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name="rent_payments")
@Getter
@Setter
public class RentPayment extends BaseModel {
	private double amount;
	private String note;
	
	@Column(name="received_on")
	private LocalDate receivedOn;

	@Column(name="due_on")
	private LocalDate dueOn;

	@Column(name="image_path")
	private String imagePath;

	@Column(name="lease_id")
	private UUID leaseId;
	
	@ManyToOne
	@JoinColumn(name="lease_id", insertable=false, updatable=false)
	@JsonIgnoreProperties("tenantLeases")
	private Lease lease;

	@Transient
	private String tenants;
}
