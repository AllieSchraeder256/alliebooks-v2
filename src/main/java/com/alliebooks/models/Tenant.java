package com.alliebooks.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name="tenants")
@Getter
@Setter
public class Tenant extends BaseModel {
	
	@Column(name="first_name")
	private String firstName;
	
	@Column(name="last_name")
	private String lastName;

	private String email;

	@Transient
	private boolean hasCurrentLease;

	public boolean isHasCurrentLease() {
		hasCurrentLease = false;
		if (tenantLeases != null) {
			for (var tenantLease : tenantLeases) {
				if (tenantLease.getLease() != null) {
					hasCurrentLease = tenantLease.getLease().isCurrent();
					if (hasCurrentLease) {
						return true;
					}
				}
			}
		}
		return false;
	}

	@OneToMany(mappedBy="tenant")
	@JsonIgnoreProperties("tenant")
	private List<TenantLease> tenantLeases;

	@OneToMany(mappedBy="tenant")
	private List<Note> notes;
}
