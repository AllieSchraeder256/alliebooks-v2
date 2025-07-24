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

	@Column(name="startDate")
	private Instant startDate;

	@Column(name="endDate")
	private Instant endDate;

	private boolean current;

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
