package com.spendwise.controller;

import com.spendwise.dto.TransactionRequest;
import com.spendwise.model.Transaction;
import com.spendwise.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    // GET /api/transactions?userId=1
    @GetMapping
    public ResponseEntity<List<Transaction>> getAll(
            @RequestParam Long userId) {
        return ResponseEntity.ok(transactionService.getAllTransactions(userId));
    }

    // GET /api/transactions/search?userId=1&keyword=grocery
    @GetMapping("/search")
    public ResponseEntity<List<Transaction>> search(
            @RequestParam Long userId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<Transaction> results;

        if (keyword != null && startDate != null && endDate != null) {
            results = transactionService.searchByKeywordAndDateRange(
                    userId, keyword, startDate, endDate);
        } else if (keyword != null) {
            results = transactionService.searchTransactions(userId, keyword);
        } else if (startDate != null && endDate != null) {
            results = transactionService.getByDateRange(userId, startDate, endDate);
        } else {
            results = transactionService.getAllTransactions(userId);
        }
        return ResponseEntity.ok(results);
    }

    // GET /api/transactions/type?userId=1&type=INCOME
    @GetMapping("/type")
    public ResponseEntity<List<Transaction>> getByType(
            @RequestParam Long userId,
            @RequestParam String type) {
        return ResponseEntity.ok(transactionService.getByType(userId, type));
    }

    // POST /api/transactions
    @PostMapping
    public ResponseEntity<?> create(
            @RequestParam Long userId,
            @Valid @RequestBody TransactionRequest request) {
        try {
            if ("INCOME".equalsIgnoreCase(request.getType())) {
                return ResponseEntity.ok(transactionService.createIncome(
                        userId, request.getDescription(), request.getAmount(),
                        request.getDate(), request.getCategoryId(), request.getSource()));
            } else {
                return ResponseEntity.ok(transactionService.createExpense(
                        userId, request.getDescription(), request.getAmount(),
                        request.getDate(), request.getCategoryId(),
                        request.getPaymentMethod()));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT /api/transactions/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestParam Long userId,
            @Valid @RequestBody TransactionRequest request) {
        try {
            return ResponseEntity.ok(transactionService.updateTransaction(
                    id, userId, request.getDescription(), request.getAmount(),
                    request.getDate(), request.getCategoryId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE /api/transactions/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @RequestParam Long userId) {
        try {
            transactionService.deleteTransaction(id, userId);
            return ResponseEntity.ok("Transaction deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}