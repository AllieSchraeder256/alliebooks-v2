package com.alliebooks.controllers;

import com.alliebooks.models.Lease;
import com.alliebooks.services.LeaseService;
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

    @GetMapping("/current-leases")
    public List<Lease> getCurrentLeases() {
        return leaseService.getCurrentLeases();
    }
    @GetMapping("/unleased")
    public List<Lease> getUnleasedTenants() {
        return leaseService.getUnleasedTenants();
    }

    @PostMapping
    public ResponseEntity<Lease> create(@RequestBody Lease lease) throws URISyntaxException {
        var savedProperty = leaseService.save(lease);
        return ResponseEntity.created(new URI("/Property/" + savedProperty.getId())).body(savedProperty);
    }

}
