package com.alliebooks.controllers;

import com.alliebooks.models.ExpenseType;
import com.alliebooks.services.BaseCrudService;
import com.alliebooks.services.ExpenseTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/expense-types")
public class ExpenseTypeController {
    @Autowired
    private ExpenseTypeService expenseTypeService;

    private static final Logger logger = Logger.getLogger(ExpenseTypeController.class.getName());

    @GetMapping
    public List<ExpenseType> getExpenseTypes() {
        return expenseTypeService.getExpenseTypes();
    }

    @GetMapping("/{id}")
    public ExpenseType getExpenseType(@PathVariable UUID id) throws Exception {
        logger.info("Test logger GET");
        var expenseTypeOption = expenseTypeService.findById(id);
        if (expenseTypeOption.isPresent()) {
            return expenseTypeOption.get();
        } else {
            throw new Exception("ExpenseType not found with id: " + id);
        }
    }

    @PostMapping
    public ResponseEntity<ExpenseType> create(@RequestBody ExpenseType expenseType) throws URISyntaxException {
        logger.info("Test logger POST");
        ExpenseType savedExpenseType = expenseTypeService.save(expenseType);
        return ResponseEntity.created(new URI("/ExpenseTypes/" + savedExpenseType.getId())).body(savedExpenseType);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseType> update(@PathVariable UUID id, @RequestBody ExpenseType expenseType) {
        var currentExpenseType = expenseTypeService.findById(id)
                    .orElseThrow(RuntimeException::new);
        currentExpenseType.setName(expenseType.getName());
        currentExpenseType = expenseTypeService.save(currentExpenseType);

        return ResponseEntity.ok(currentExpenseType);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ExpenseType> delete(@PathVariable UUID id) {
        try {
            expenseTypeService.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }
}
