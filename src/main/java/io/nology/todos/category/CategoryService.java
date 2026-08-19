package io.nology.todos.category;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import io.nology.todos.category.dtos.CreateCategoryRequest;
import io.nology.todos.category.dtos.UpdateCategoryRequest;
import io.nology.todos.category.entities.Category;

@Service
public class CategoryService {
    
    private final CategoryRepository repo;
    private static final long MAX_CATEGORIES = 15;

    public CategoryService(CategoryRepository repo) {
        this.repo = repo;
    }

    public List<Category> findAll() {
        return this.repo.findAll();
    }

    public Optional<Category> findById(Long id) {
        return this.repo.findById(id);
    }

    public Category create(CreateCategoryRequest data) {
        long currentCount = repo.count();
        if(currentCount >= MAX_CATEGORIES) {
            throw new IllegalStateException("Maximum limit of " + MAX_CATEGORIES + " categories reached");
        }
        Category createdCategory = new Category();
        createdCategory.setName(data.getName().trim());
        this.repo.saveAndFlush(createdCategory);
        return createdCategory;
    }

    public Optional<Category> updateById(Long id, UpdateCategoryRequest data) {
        Optional<Category> result = this.findById(id);
        if(result.isEmpty()) {
            return result;
        }
        Category foundCategory = result.get();
        if(data.getName() != null) {
            foundCategory.setName(data.getName().trim());
        }
        this.repo.saveAndFlush(foundCategory);
        return Optional.of(foundCategory);
    }

    public boolean deleteById(Long id) {
        Optional<Category> result = this.findById(id);
        if(result.isEmpty()) {
            return false;
        }
        this.repo.delete(result.get());
        return true;
    }
}
