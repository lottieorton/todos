package io.nology.todos.category;

import org.springframework.data.jpa.repository.JpaRepository;

import io.nology.todos.category.entities.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    
}
