package com.spendwise.repository;

import com.spendwise.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Gets all categories
    List<Category> findByUserId(Long userId);

    // Gets categories by type
    List<Category> findByUserIdAndType(Long userId, String type);

    // Checks if category name already exists
    boolean existsByNameAndUserId(String name, Long userId);

    // Finds by name and user
    Optional<Category> findByNameAndUserId(String name, Long userId);
}