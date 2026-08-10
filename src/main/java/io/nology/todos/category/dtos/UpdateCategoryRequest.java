package io.nology.todos.category.dtos;

import jakarta.validation.constraints.NotBlank;

public class UpdateCategoryRequest {
    @NotBlank(message = "Category name cannot be empty")
    private String name;

    public UpdateCategoryRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
