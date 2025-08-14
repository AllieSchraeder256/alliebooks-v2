package com.alliebooks.controllers;

import com.alliebooks.models.Expense;
import com.alliebooks.services.ExpenseService;
import com.alliebooks.services.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {
    @Autowired
    private ExpenseService expenseService;
    @Autowired
    private ImageService imageService;

    public final DateTimeFormatter REQUEST_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @GetMapping
    public List<Expense> getExpenses(
             @RequestParam String start,
             @RequestParam String end,
             @RequestParam (required=false) String searchText,
             @RequestParam (required=false) UUID propertyId,
             @RequestParam (required=false) UUID expenseTypeId) throws Exception {

        if (start != null && end != null) {
            var startDate = LocalDate.parse(start, REQUEST_DATE_FORMAT);
            var endDate = LocalDate.parse(end, REQUEST_DATE_FORMAT);
            return expenseService.getExpenses(startDate, endDate, propertyId, expenseTypeId, searchText);
        } else {
            throw new Exception("Bad Request, missing parameters");
        }
    }

    @GetMapping("/{id}")
    public Expense getById(@PathVariable UUID id) throws Exception {
        var expense = expenseService.findById(id);
        if (expense.isPresent()) {
            return expense.get();
        } else {
            throw new Exception(String.format("Expense %s not found", id));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> update(
              @PathVariable UUID id,
              @RequestPart Expense expense,
              @RequestPart(required = false) MultipartFile imageFile) throws URISyntaxException, IOException {
        var expenseOpt = expenseService.findById(id);

        if (expenseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            var saved = expenseService.save(expense);
            if (imageFile != null) {
                imageService.saveExpense(saved.getId(), imageFile);
            }
            return ResponseEntity.ok(saved);
        }
    }
    @PostMapping
    public ResponseEntity<Expense> create(
            @RequestPart Expense expense,
            @RequestPart(required = false) MultipartFile imageFile) throws URISyntaxException, IOException {
        var saved = expenseService.save(expense);
        if (imageFile != null) {
            imageService.saveExpense(saved.getId(), imageFile);
        }
        return ResponseEntity.created(new URI("/expenses/" + saved.getId())).body(saved);
    }
}
