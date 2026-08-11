package io.nology.todos.category.dtos;

import jakarta.validation.constraints.Pattern;

public class UpdateCategoryRequest {
    @Pattern(regexp = ".*\\S.*", message = "Category name cannot be empty")
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
