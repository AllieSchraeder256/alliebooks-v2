package com.alliebooks.controllers;

import com.alliebooks.models.ExpenseType;
import com.alliebooks.models.Property;
import com.alliebooks.services.PropertyService;
import com.alliebooks.services.UnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {
    @Autowired
    private PropertyService propertyService;

    @Autowired
    private UnitService unitService;

    @GetMapping
    public List<Property> getProperties() {
        return propertyService.getProperties();
    }

    @GetMapping("/{id}")
    public Property getProperty(@PathVariable UUID id) throws Exception {
        var propertyOpt = propertyService.findById(id);
        if (propertyOpt.isPresent()) {
            return propertyOpt.get();
        } else {
            throw new Exception("Property not found with id: " + id);
        }
    }

    @PostMapping
    public ResponseEntity<Property> create(@RequestBody Property expenseType) throws URISyntaxException {
        var savedProperty = propertyService.save(expenseType);
        return ResponseEntity.created(new URI("/Property/" + savedProperty.getId())).body(savedProperty);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Property> update(@PathVariable UUID id, @RequestBody Property property) {
        var currentPropertyOpt = propertyService.findById(id);

        if (currentPropertyOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            var currentProperty = currentPropertyOpt.get();
            currentProperty.setName(property.getName());
            currentProperty = propertyService.save(property);
            return ResponseEntity.ok(currentProperty);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ExpenseType> delete(@PathVariable UUID id) {
        try {
            propertyService.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
