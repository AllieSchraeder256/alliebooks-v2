package com.alliebooks.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name="tenant_leases")
@Getter
@Setter
public class TenantLease extends BaseModel {
	@Column(name="tenant_id")
	private UUID tenant_id;

	@ManyToOne
	@JoinColumn(name="tenant_id", insertable=false, updatable=false)
	@JsonIgnoreProperties("tenantLeases")
	private Tenant tenant;

	@Column(name="lease_id")
	private UUID leaseId;
	
	@ManyToOne
	@JoinColumn(name="lease_id", insertable=false, updatable=false)
	@JsonIgnoreProperties("tenantLeases")
	private Lease lease;
}
