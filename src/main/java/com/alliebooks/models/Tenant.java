package com.alliebooks.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
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

	@OneToMany(mappedBy="tenant")
	@JsonIgnoreProperties("tenant")
	private List<TenantLease> tenantLeases;
}
