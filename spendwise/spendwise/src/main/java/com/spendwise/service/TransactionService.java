package com.spendwise.service;

import com.spendwise.model.*;
import com.spendwise.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    // Get all transactions for a user
    public List<Transaction> getAllTransactions(Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    // Search transactions by keyword
    public List<Transaction> searchTransactions(Long userId, String keyword) {
        return transactionRepository
                .findByUserIdAndDescriptionContainingIgnoreCase(userId, keyword);
    }

    // Filter by type
    public List<Transaction> getByType(Long userId, String type) {
        return transactionRepository.findByUserIdAndType(userId, type);
    }

    // Filter by category
    public List<Transaction> getByCategory(Long userId, Long categoryId) {
        return transactionRepository.findByUserIdAndCategoryId(userId, categoryId);
    }

    // Filter by date range
    public List<Transaction> getByDateRange(Long userId,
                                            LocalDate startDate, LocalDate endDate) {
        return transactionRepository
                .findByUserIdAndDateBetween(userId, startDate, endDate);
    }

    // Search by keyword and date range combined
    public List<Transaction> searchByKeywordAndDateRange(Long userId,
                                                         String keyword, LocalDate startDate, LocalDate endDate) {
        return transactionRepository
                .findByUserIdAndDescriptionContainingIgnoreCaseAndDateBetween(
                        userId, keyword, startDate, endDate);
    }

    // Create income transaction
    @Transactional
    public Income createIncome(Long userId, String description,
                               BigDecimal amount, LocalDate date, Long categoryId, String source) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Income income = new Income();
        income.setDescription(description);
        income.setAmount(amount);
        income.setDate(date);
        income.setType("INCOME");
        income.setCategory(category);
        income.setUser(user);
        income.setSource(source);
        return (Income) transactionRepository.save(income);
    }

    // Create expense transaction
    @Transactional
    public Expense createExpense(Long userId, String description,
                                 BigDecimal amount, LocalDate date, Long categoryId, String paymentMethod) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Expense expense = new Expense();
        expense.setDescription(description);
        expense.setAmount(amount);
        expense.setDate(date);
        expense.setType("EXPENSE");
        expense.setCategory(category);
        expense.setUser(user);
        expense.setPaymentMethod(paymentMethod);
        return (Expense) transactionRepository.save(expense);
    }

    // Update a transaction
    @Transactional
    public Transaction updateTransaction(Long transactionId, Long userId,
                                         String description, BigDecimal amount, LocalDate date, Long categoryId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        if (!transaction.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        transaction.setDescription(description);
        transaction.setAmount(amount);
        transaction.setDate(date);
        transaction.setCategory(category);
        return transactionRepository.save(transaction);
    }

    // Delete a transaction
    @Transactional
    public void deleteTransaction(Long transactionId, Long userId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        if (!transaction.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        transactionRepository.deleteById(transactionId);
    }
}