package com.alliebooks.controllers;

import com.alliebooks.models.RentPayment;
import com.alliebooks.models.Tenant;
import com.alliebooks.services.LeaseService;
import com.alliebooks.services.RentPaymentService;
import com.alliebooks.services.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
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
    public List<RentPayment> getRentPayments(@RequestParam String start, @RequestParam String end, @RequestParam (required=false) UUID leaseId) {
        var startDate = LocalDate.parse(start, REQUEST_DATE_FORMAT);
        var endDate = LocalDate.parse(end, REQUEST_DATE_FORMAT);
        return rentPaymentService.getRentPayments(startDate, endDate, leaseId);
    }
}
