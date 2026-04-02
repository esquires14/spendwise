package com.spendwise.controller;

import com.spendwise.dto.BudgetRequest;
import com.spendwise.model.Budget;
import com.spendwise.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    // GET /api/budgets?userId=1
    @GetMapping
    public ResponseEntity<List<Budget>> getAll(@RequestParam Long userId) {
        return ResponseEntity.ok(budgetService.getBudgetsByUser(userId));
    }

    // GET /api/budgets/month?userId=1&month=2026-04
    @GetMapping("/month")
    public ResponseEntity<List<Budget>> getByMonth(
            @RequestParam Long userId,
            @RequestParam String month) {
        return ResponseEntity.ok(
                budgetService.getBudgetsByMonth(userId, YearMonth.parse(month)));
    }

    // POST /api/budgets
    @PostMapping
    public ResponseEntity<?> create(
            @RequestParam Long userId,
            @Valid @RequestBody BudgetRequest request) {
        try {
            return ResponseEntity.ok(budgetService.createBudget(
                    userId, request.getCategoryId(),
                    request.getAmount(), request.getMonth()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT /api/budgets/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestParam Long userId,
            @Valid @RequestBody BudgetRequest request) {
        try {
            return ResponseEntity.ok(
                    budgetService.updateBudget(id, userId, request.getAmount()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE /api/budgets/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @RequestParam Long userId) {
        try {
            budgetService.deleteBudget(id, userId);
            return ResponseEntity.ok("Budget deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}