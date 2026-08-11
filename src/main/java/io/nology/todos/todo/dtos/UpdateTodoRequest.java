package io.nology.todos.todo.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;

public class UpdateTodoRequest {
    @Pattern(regexp = ".\\S.*", message = "Todo name cannot be empty")
    private String name;
    
    @Min(1)
    private Long categoryId;

    public UpdateTodoRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}
