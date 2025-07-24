package com.alliebooks.controllers;

import com.alliebooks.models.Lease;
import com.alliebooks.models.Tenant;
import com.alliebooks.services.LeaseService;
import com.alliebooks.services.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/tenants")
public class TenantController {
    @Autowired
    private LeaseService leaseService;

    @Autowired
    private TenantService tenantService;

    @GetMapping("/current-leases")
    public List<Lease> getCurrentLeases() {
        return leaseService.getCurrentLeases();
    }

    @GetMapping
    public List<Tenant> getAllTenants() {
        return tenantService.getTenants();
    }

    @PostMapping
    public ResponseEntity<Lease> create(@RequestBody Lease lease) throws URISyntaxException {
        var savedProperty = leaseService.save(lease);
        return ResponseEntity.created(new URI("/Property/" + savedProperty.getId())).body(savedProperty);
    }

}
