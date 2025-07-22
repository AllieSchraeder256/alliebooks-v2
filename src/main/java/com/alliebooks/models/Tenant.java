package com.alliebooks.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name="rent_payments")
@Getter
@Setter
public class Tenant extends BaseModel {
	
	@Column(name="first_name")
	private String firstName;
	
	@Column(name="last_name")
	private String lastName;

	@Column(name="lease_id")
	private UUID leaseId;
	
	@ManyToOne
	@JoinColumn(name="lease_id", insertable=false, updatable=false)
	private Lease lease;
}
