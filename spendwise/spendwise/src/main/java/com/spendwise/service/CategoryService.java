package com.spendwise.service;

import com.spendwise.model.Category;
import com.spendwise.model.User;
import com.spendwise.repository.CategoryRepository;
import com.spendwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    // Get all categories for a user
    public List<Category> getCategoriesByUser(Long userId) {
        return categoryRepository.findByUserId(userId);
    }

    // Get categories by type
    public List<Category> getCategoriesByType(Long userId, String type) {
        return categoryRepository.findByUserIdAndType(userId, type);
    }

    // Create a new category
    @Transactional
    public Category createCategory(Long userId, String name, String type) {
        if (categoryRepository.existsByNameAndUserId(name, userId)) {
            throw new RuntimeException("Category with this name already exists");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = new Category();
        category.setName(name);
        category.setType(type.toUpperCase());
        category.setUser(user);
        return categoryRepository.save(category);
    }

    // Update a category
    @Transactional
    public Category updateCategory(Long categoryId, Long userId, String name, String type) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        if (!category.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        category.setName(name);
        category.setType(type.toUpperCase());
        return categoryRepository.save(category);
    }

    // Delete a category
    @Transactional
    public void deleteCategory(Long categoryId, Long userId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        if (!category.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        categoryRepository.deleteById(categoryId);
    }
}
