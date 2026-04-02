package com.spendwise;

import com.spendwise.model.*;
import com.spendwise.repository.*;
import com.spendwise.service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TransactionService transactionService;

    private User testUser;
    private Category testCategory;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("hashedpassword");

        testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("Food & Dining");
        testCategory.setType("EXPENSE");
        testCategory.setUser(testUser);
    }

    @Test
    void testCreateExpense_Success() {
        Expense mockExpense = new Expense();
        mockExpense.setId(1L);
        mockExpense.setDescription("Grocery run");
        mockExpense.setAmount(new BigDecimal("84.20"));
        mockExpense.setDate(LocalDate.now());
        mockExpense.setType("EXPENSE");
        mockExpense.setCategory(testCategory);
        mockExpense.setUser(testUser);
        mockExpense.setPaymentMethod("Card");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(transactionRepository.save(any())).thenReturn(mockExpense);

        Expense result = transactionService.createExpense(
                1L, "Grocery run", new BigDecimal("84.20"),
                LocalDate.now(), 1L, "Card"
        );

        assertNotNull(result);
        assertEquals("Grocery run", result.getDescription());
        assertEquals("EXPENSE", result.getType());
        assertEquals("Card", result.getPaymentMethod());
    }

    @Test
    void testCreateIncome_Success() {
        Category incomeCategory = new Category();
        incomeCategory.setId(2L);
        incomeCategory.setName("Salary");
        incomeCategory.setType("INCOME");
        incomeCategory.setUser(testUser);

        Income mockIncome = new Income();
        mockIncome.setId(2L);
        mockIncome.setDescription("Monthly salary");
        mockIncome.setAmount(new BigDecimal("2100.00"));
        mockIncome.setDate(LocalDate.now());
        mockIncome.setType("INCOME");
        mockIncome.setCategory(incomeCategory);
        mockIncome.setUser(testUser);
        mockIncome.setSource("Employer");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(incomeCategory));
        when(transactionRepository.save(any())).thenReturn(mockIncome);

        Income result = transactionService.createIncome(
                1L, "Monthly salary", new BigDecimal("2100.00"),
                LocalDate.now(), 2L, "Employer"
        );

        assertNotNull(result);
        assertEquals("Monthly salary", result.getDescription());
        assertEquals("INCOME", result.getType());
        assertEquals("Employer", result.getSource());
    }

    @Test
    void testCreateExpense_UserNotFound_ThrowsException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                transactionService.createExpense(
                        99L, "Test", new BigDecimal("10.00"),
                        LocalDate.now(), 1L, "Card"
                )
        );
        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void testPolymorphism_TransactionSummary() {
        Income income = new Income();
        income.setAmount(new BigDecimal("500.00"));
        income.setSource("Freelance");

        Expense expense = new Expense();
        expense.setAmount(new BigDecimal("50.00"));
        expense.setPaymentMethod("Cash");

        assertTrue(income.getTransactionSummary().contains("Income"));
        assertTrue(income.getTransactionSummary().contains("Freelance"));
        assertTrue(expense.getTransactionSummary().contains("Expense"));
        assertTrue(expense.getTransactionSummary().contains("Cash"));
    }
}