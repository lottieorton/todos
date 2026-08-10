package io.nology.todos.category.dtos;

import jakarta.validation.constraints.NotBlank;

public class CreateCategoryRequest {
    @NotBlank(message = "Category name cannot be empty")
    private String name;

    public CreateCategoryRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
