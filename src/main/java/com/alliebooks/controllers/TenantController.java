package com.alliebooks.controllers;

import com.alliebooks.models.Lease;
import com.alliebooks.models.Property;
import com.alliebooks.models.Tenant;
import com.alliebooks.services.LeaseService;
import com.alliebooks.services.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {
    @Autowired
    private LeaseService leaseService;

    @Autowired
    private TenantService tenantService;

    @GetMapping("/{id}")
    public Tenant getById(@PathVariable UUID id) throws Exception {
        var tenant = tenantService.findById(id);
        if (tenant.isPresent()) {
            return tenant.get();
        } else {
            throw new Exception(String.format("Tenant %s not found", id));
        }
    }

    @GetMapping
    public List<Tenant> getAllTenants() {
        return tenantService.getTenants();
    }

    @PostMapping
    public ResponseEntity<Tenant> create(@RequestBody Tenant tenant) throws URISyntaxException {
        var saved = tenantService.save(tenant);
        return ResponseEntity.created(new URI("/tenants/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tenant> update(@PathVariable UUID id, @RequestBody Tenant tenant) {
        var currentTenantOpt = tenantService.findById(id);

        if (currentTenantOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            var currentTenant = currentTenantOpt.get();
            currentTenant.setFirstName(tenant.getFirstName());
            currentTenant.setLastName(tenant.getLastName());
            currentTenant.setEmail(tenant.getEmail());
            currentTenant = tenantService.save(tenant);
            return ResponseEntity.ok(currentTenant);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Tenant> delete(@PathVariable UUID id) {
        try {
            tenantService.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
