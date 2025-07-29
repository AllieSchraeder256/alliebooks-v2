package com.alliebooks.controllers;

import com.alliebooks.models.Tenant;
import com.alliebooks.services.LeaseService;
import com.alliebooks.services.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/tenants")
public class TenantController {
    @Autowired
    private LeaseService leaseService;

    @Autowired
    private TenantService tenantService;


    @GetMapping
    public List<Tenant> getAllTenants() {
        return tenantService.getTenants();
    }

    /*@PostMapping
    public ResponseEntity<Lease> create(@RequestBody LeaseForm leaseForm) throws URISyntaxException {
        var saved = leaseService.save(lease);
        return ResponseEntity.created(new URI("/tenants/" + saved.getId())).body(saved);
    }*/
}
