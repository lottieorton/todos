package io.nology.todos.todo;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.nology.todos.common.exceptions.NotFoundException;
import io.nology.todos.todo.dtos.CreateTodoRequest;
import io.nology.todos.todo.dtos.TodoResponse;
import io.nology.todos.todo.dtos.UpdateTodoRequest;
import io.nology.todos.todo.entities.Todo;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/todos")
@Tag(name = "Todos controller")
public class TodosController {
    private final TodoService todoService;

    public TodosController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping()
    public ResponseEntity<List<TodoResponse>> findAllTodos(@RequestParam(name = "category", required = false) Long categoryId) {
        List<Todo> todos = this.todoService.findAll(categoryId);
        return ResponseEntity.ok(TodoResponse.of(todos));
        
    }

    @GetMapping("/{id}")
    public ResponseEntity<TodoResponse> findTodoById(@PathVariable Long id) {
        Todo result = this.todoService.findById(id)
        .orElseThrow(() -> new NotFoundException("Could not find todo with id " + id));
        return ResponseEntity.ok(TodoResponse.of(result));
    }
    
    @PostMapping()
    public ResponseEntity<TodoResponse> createTodo(@Valid @RequestBody CreateTodoRequest data) {
        Todo createdTodo = this.todoService.create(data);
        return new ResponseEntity<TodoResponse>(TodoResponse.of(createdTodo), HttpStatus.CREATED);
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<TodoResponse> updateTodoById(@PathVariable Long id, @Valid @RequestBody UpdateTodoRequest data) {
        Todo updatedTodo = this.todoService.updateById(id, data)
        .orElseThrow(() -> new NotFoundException("Could not find todo with id " + id));
        return ResponseEntity.ok(TodoResponse.of(updatedTodo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodoById(@PathVariable Long id) {
        boolean isDeleted = this.todoService.deleteById(id);
        if(isDeleted) {
            return ResponseEntity.noContent().build();
        }
        throw new NotFoundException("Could not find todo with id " + id);
    }
}