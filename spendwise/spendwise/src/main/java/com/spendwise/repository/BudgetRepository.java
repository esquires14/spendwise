package com.spendwise.repository;

import com.spendwise.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    // Gets all budgets
    List<Budget> findByUserId(Long userId);

    // Gets budgets for specific months
    List<Budget> findByUserIdAndMonth(Long userId, YearMonth month);

    // Gets budget for a specific category and month
    Optional<Budget> findByUserIdAndCategoryIdAndMonth(
            Long userId, Long categoryId, YearMonth month);

    // Checks if budget already exists
    boolean existsByUserIdAndCategoryIdAndMonth(
            Long userId, Long categoryId, YearMonth month);
}