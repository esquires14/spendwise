package com.spendwise.repository;

import com.spendwise.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Get all transactions for a user
    List<Transaction> findByUserId(Long userId);

    // Search by description keyword
    List<Transaction> findByUserIdAndDescriptionContainingIgnoreCase(
            Long userId, String keyword);

    // Filter by type (INCOME or EXPENSE)
    List<Transaction> findByUserIdAndType(Long userId, String type);

    // Filter by category
    List<Transaction> findByUserIdAndCategoryId(Long userId, Long categoryId);

    // Filter by date range
    List<Transaction> findByUserIdAndDateBetween(
            Long userId, LocalDate startDate, LocalDate endDate);

    // Search by keyword AND date range (for combined search)
    List<Transaction> findByUserIdAndDescriptionContainingIgnoreCaseAndDateBetween(
            Long userId, String keyword, LocalDate startDate, LocalDate endDate);

    // Get total amount by type for a user in a date range (for reports)
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId " +
            "AND t.type = :type AND t.date BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByUserIdAndTypeAndDateBetween(
            @Param("userId") Long userId,
            @Param("type") String type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    // Get transactions grouped by category for reports
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
            "AND t.date BETWEEN :startDate AND :endDate ORDER BY t.category.name")
    List<Transaction> findByUserIdAndDateRangeOrderByCategory(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}