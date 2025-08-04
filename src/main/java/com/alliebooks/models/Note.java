package com.alliebooks.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name="notes")
@Getter
@Setter
public class Note extends BaseModel {
	
	private String note;

	@Column(name="lease_id")
	private UUID leaseId;

	@ManyToOne
	@JoinColumn(name="lease_id", insertable=false, updatable=false)
	@JsonIgnore
	private Lease lease;

	@Column(name="tenant_id")
	private UUID tenantId;

	@ManyToOne
	@JoinColumn(name="tenant_id", insertable=false, updatable=false)
	@JsonIgnore
	private Tenant tenant;
}
