package com.alliebooks.controllers;

import com.alliebooks.models.RentPayment;
import com.alliebooks.models.Tenant;
import com.alliebooks.services.RentPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/rent-payments")
public class RentPaymentController {
    @Autowired
    private RentPaymentService rentPaymentService;

    public final DateTimeFormatter REQUEST_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @GetMapping
    public List<RentPayment> getRentPayments(@RequestParam(required=false) String start,
                                             @RequestParam(required=false) String end,
                                             @RequestParam (required=false) UUID leaseId) throws Exception {

        if (start != null && end != null) {
            var startDate = LocalDate.parse(start, REQUEST_DATE_FORMAT);
            var endDate = LocalDate.parse(end, REQUEST_DATE_FORMAT);
            return rentPaymentService.getRentPayments(startDate, endDate, leaseId);
        } else if (leaseId != null) {
            return rentPaymentService.getRentPayments(leaseId);
        } else {
            throw new Exception("Bad Request, missing parameters");
        }
    }

    @GetMapping("/{id}")
    public RentPayment getById(@PathVariable UUID id) throws Exception {
        var rentPayment = rentPaymentService.findById(id);
        if (rentPayment.isPresent()) {
            return rentPayment.get();
        } else {
            throw new Exception(String.format("Rent payment %s not found", id));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<RentPayment> update(@PathVariable UUID id, @RequestBody RentPayment rentPayment) {
        var paymentOpt = rentPaymentService.findById(id);

        if (paymentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(rentPaymentService.save(rentPayment));
        }
    }
    @PostMapping
    public ResponseEntity<RentPayment> create(@RequestBody RentPayment rentPayment) throws URISyntaxException {
        var saved = rentPaymentService.save(rentPayment);
        return ResponseEntity.created(new URI("/leases/" + saved.getId())).body(saved);
    }
}
