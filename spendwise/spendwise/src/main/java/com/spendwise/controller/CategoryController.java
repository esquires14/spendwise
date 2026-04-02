package com.spendwise.controller;

import com.spendwise.dto.CategoryRequest;
import com.spendwise.model.Category;
import com.spendwise.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // GET /api/categories?userId=1
    @GetMapping
    public ResponseEntity<List<Category>> getAll(@RequestParam Long userId) {
        return ResponseEntity.ok(categoryService.getCategoriesByUser(userId));
    }

    // GET /api/categories/type?userId=1&type=EXPENSE
    @GetMapping("/type")
    public ResponseEntity<List<Category>> getByType(
            @RequestParam Long userId,
            @RequestParam String type) {
        return ResponseEntity.ok(categoryService.getCategoriesByType(userId, type));
    }

    // POST /api/categories
    @PostMapping
    public ResponseEntity<?> create(
            @RequestParam Long userId,
            @Valid @RequestBody CategoryRequest request) {
        try {
            return ResponseEntity.ok(categoryService.createCategory(
                    userId, request.getName(), request.getType()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT /api/categories/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestParam Long userId,
            @Valid @RequestBody CategoryRequest request) {
        try {
            return ResponseEntity.ok(categoryService.updateCategory(
                    id, userId, request.getName(), request.getType()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE /api/categories/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @RequestParam Long userId) {
        try {
            categoryService.deleteCategory(id, userId);
            return ResponseEntity.ok("Category deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}