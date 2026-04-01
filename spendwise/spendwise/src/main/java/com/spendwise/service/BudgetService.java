package com.spendwise.service;

import com.spendwise.model.Budget;
import com.spendwise.model.Category;
import com.spendwise.model.User;
import com.spendwise.repository.BudgetRepository;
import com.spendwise.repository.CategoryRepository;
import com.spendwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    // Get all budgets for a user
    public List<Budget> getBudgetsByUser(Long userId) {
        return budgetRepository.findByUserId(userId);
    }

    // Get budgets for a specific month
    public List<Budget> getBudgetsByMonth(Long userId, YearMonth month) {
        return budgetRepository.findByUserIdAndMonth(userId, month);
    }

    // Create a budget
    @Transactional
    public Budget createBudget(Long userId, Long categoryId,
                               BigDecimal amount, YearMonth month) {
        if (budgetRepository.existsByUserIdAndCategoryIdAndMonth(
                userId, categoryId, month)) {
            throw new RuntimeException(
                    "Budget already exists for this category and month");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Budget budget = new Budget();
        budget.setAmount(amount);
        budget.setMonth(month);
        budget.setCategory(category);
        budget.setUser(user);
        return budgetRepository.save(budget);
    }

    // Update a budget
    @Transactional
    public Budget updateBudget(Long budgetId, Long userId, BigDecimal amount) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        if (!budget.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        budget.setAmount(amount);
        return budgetRepository.save(budget);
    }

    // Delete a budget
    @Transactional
    public void deleteBudget(Long budgetId, Long userId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        if (!budget.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        budgetRepository.deleteById(budgetId);
    }
}