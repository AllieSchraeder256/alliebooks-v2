package com.alliebooks.controllers;

import com.alliebooks.models.Lease;
import com.alliebooks.models.forms.LeaseForm;
import com.alliebooks.services.LeaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/leases")
public class LeaseController {
    @Autowired
    private LeaseService leaseService;

    @GetMapping("/current-leases")
    public List<Lease> getCurrentLeases() {
        return leaseService.getCurrentLeases();
    }

    @GetMapping("/old-leases")
    public List<Lease> getOldLeases() {
        return leaseService.getOldLeases();
    }

    @GetMapping("/{id}")
    public Lease getById(@PathVariable UUID id) throws Exception {
        var lease = leaseService.findById(id);
        if (lease.isPresent()) {
            return lease.get();
        }else {
            throw new Exception(String.format("Lease %s not found", id));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lease> update(@PathVariable UUID id, @RequestBody LeaseForm leaseForm) {
        var leaseOpt = leaseService.findById(id);

        if (leaseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            var lease = leaseForm.toModel(leaseOpt.get());
            lease = leaseService.save(lease);
            return ResponseEntity.ok(lease);
        }
    }

    @PostMapping
    public ResponseEntity<Lease> create(@RequestBody LeaseForm leaseForm) throws URISyntaxException {
        var lease = leaseForm.toModel(null);
        var saved = leaseService.save(lease);
        leaseService.saveTenantLeases(saved.getId(), leaseForm.getTenantIds());
        return ResponseEntity.created(new URI("/leases/" + saved.getId())).body(saved);
    }

}
