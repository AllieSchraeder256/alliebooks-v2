package com.alliebooks.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name="rent_payments")
@Getter
@Setter
public class Lease extends BaseModel {
	private double balance;

	@Column(name="lease_start")
	private Instant leaseStartDate;

	@Column(name="lease_end")
	private Instant leaseEndDate;

	@Column(name="unit_id")
	private UUID unitId;
	
	@ManyToOne
	@JoinColumn(name="unit_id", insertable=false, updatable=false)
	private Unit unit;

	@OneToMany(mappedBy="lease")
	@JsonIgnore
	private List<RentPayment> rentPayments;

	@OneToMany(mappedBy="lease")
	private List<Tenant> tenants;
}
