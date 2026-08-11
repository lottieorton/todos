package io.nology.todos.todo.dtos;

import java.util.List;

import io.nology.todos.todo.entities.Todo;

public record TodoResponse(Long id, String name, String category) {
    
    public static TodoResponse of(Todo todo) {
        return new TodoResponse(
            todo.getId(), 
            todo.getName(), 
            todo.getCategory().getName()
        );
    }

    public static List<TodoResponse> of(List<Todo> todos) {
        return todos.stream().map(t -> TodoResponse.of(t)).toList();
    }
}
