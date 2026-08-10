package io.nology.todos.category.dtos;

import java.util.List;

import io.nology.todos.category.entities.Category;

public record CategoryResponse(Long id, String name) {
    
    public static CategoryResponse of(Category category) {
        return new CategoryResponse(category.getId(), category.getName());
    }

    public static List<CategoryResponse> of(List<Category> categories) {
        return categories.stream().map(c -> CategoryResponse.of(c)).toList();
    }
}
