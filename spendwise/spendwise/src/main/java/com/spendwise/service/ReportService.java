package com.spendwise.service;

import com.spendwise.model.Transaction;
import com.spendwise.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final TransactionRepository transactionRepository;

    public Map<String, Object> generateReport(Long userId,
                                              LocalDate startDate, LocalDate endDate) {

        List<Transaction> transactions = transactionRepository
                .findByUserIdAndDateRangeOrderByCategory(userId, startDate, endDate);

        // Calculate totals
        BigDecimal totalIncome = transactionRepository
                .sumAmountByUserIdAndTypeAndDateBetween(
                        userId, "INCOME", startDate, endDate);
        BigDecimal totalExpenses = transactionRepository
                .sumAmountByUserIdAndTypeAndDateBetween(
                        userId, "EXPENSE", startDate, endDate);

        if (totalIncome == null) totalIncome = BigDecimal.ZERO;
        if (totalExpenses == null) totalExpenses = BigDecimal.ZERO;

        BigDecimal netBalance = totalIncome.subtract(totalExpenses);

        // Group transactions by category
        Map<String, BigDecimal> byCategory = new LinkedHashMap<>();
        for (Transaction t : transactions) {
            String categoryName = t.getCategory() != null
                    ? t.getCategory().getName() : "Uncategorized";
            byCategory.merge(categoryName, t.getAmount(), BigDecimal::add);
        }

        // Build report object
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("title", "SpendWise Financial Summary Report");
        report.put("generatedAt", LocalDateTime.now().toString());
        report.put("periodStart", startDate.toString());
        report.put("periodEnd", endDate.toString());
        report.put("totalIncome", totalIncome);
        report.put("totalExpenses", totalExpenses);
        report.put("netBalance", netBalance);
        report.put("transactionCount", transactions.size());
        report.put("transactions", transactions);
        report.put("byCategory", byCategory);

        return report;
    }
}