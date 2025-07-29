package com.alliebooks.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name="leases")
@Getter
@Setter
public class Lease extends BaseModel {
	private double balance;

	@Column(name="start_date")
	private Instant startDate;

	@Column(name="end_date")
	private Instant endDate;

	private boolean current;

	private double rent;

	private double deposit;

	@Column(name="deposit_paid_date")
	private Instant depositPaidDate;

	@Column(name="deposit_returned")
	private Double depositReturned;

	@Column(name="deposit_return_date")
	private Instant depositReturnDate;

	@Column(name="unit_id")
	private UUID unitId;
	
	@ManyToOne
	@JoinColumn(name="unit_id", insertable=false, updatable=false)
	private Unit unit;

	@OneToMany(mappedBy="lease")
	@JsonIgnore
	private List<RentPayment> rentPayments;

	@OneToMany(mappedBy="lease")
	@JsonIgnoreProperties("lease")
	private List<TenantLease> tenantLeases;
}
