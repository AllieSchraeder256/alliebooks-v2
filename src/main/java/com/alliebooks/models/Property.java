package com.alliebooks.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name="properties")
@Getter
@Setter
public class Property extends BaseModel {
    private String name;

    @OneToMany(mappedBy="property")
    @JsonIgnoreProperties("property")
    private List<Unit> units;

    @OneToMany(mappedBy="property")
    @JsonIgnore
    private List<Expense> expenses;
}
