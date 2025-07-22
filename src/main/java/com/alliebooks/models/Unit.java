package com.alliebooks.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name="units")
@Getter
@Setter
public class Unit extends BaseModel {
    private String name;

    @Column(name="current_rent")
    private double currentRent;

    @Column(name="property_id", insertable=false, updatable=false)
    private UUID propertyId;

    @ManyToOne
    @JoinColumn(name="property_id")
    @JsonIgnore
    private Property property;

    @OneToMany(mappedBy="unit")
    @JsonIgnore
    private List<Lease> leases;
}
