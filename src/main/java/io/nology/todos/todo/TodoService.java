package io.nology.todos.todo;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import io.nology.todos.category.CategoryService;
import io.nology.todos.category.entities.Category;
import io.nology.todos.common.exceptions.UnprocessableContentException;
import io.nology.todos.todo.dtos.CreateTodoRequest;
import io.nology.todos.todo.dtos.UpdateTodoRequest;
import io.nology.todos.todo.entities.Todo;

@Service
public class TodoService {
    
    private final TodoRepository repo;
    private final CategoryService categoryService;

    public TodoService(TodoRepository repo, CategoryService categoryService) {
        this.repo = repo;
        this.categoryService = categoryService;
    }

    public List<Todo> findAll() {
        return this.repo.findAllWithCategory();
    }

    public Optional<Todo> findById(Long id) {
        return this.repo.findById(id);
    }

    public Todo create(CreateTodoRequest data) {
        Todo createdTodo = new Todo();
        createdTodo.setName(data.getName());
        Optional<Category> returnedCategory = this.categoryService.findById(data.getCategoryId());
        if(returnedCategory.isEmpty()) {
            throw new UnprocessableContentException("No category with id " + data.getCategoryId());
        }
        createdTodo.setCategory(returnedCategory.get());
        this.repo.saveAndFlush(createdTodo);
        return createdTodo;
    }

    public Optional<Todo> updateById(Long id, UpdateTodoRequest data) {
        Optional<Todo> result = this.findById(id);
        if(result.isEmpty()) {
            return result;
        }
        Todo foundTodo = result.get();
        if(data.getName() != null) {
            foundTodo.setName(data.getName().trim());
        }
        if(data.getCategoryId() != null) {
            Optional<Category> returnedCategory = this.categoryService.findById(data.getCategoryId());
            if(returnedCategory.isEmpty()) {
                throw new UnprocessableContentException("No category with id " + data.getCategoryId());
            }
            foundTodo.setCategory(returnedCategory.get());
        }
        this.repo.saveAndFlush(foundTodo);
        return Optional.of(foundTodo);
    }

    public boolean deleteById(Long id) {
        Optional<Todo> result = this.findById(id);
        if(result.isEmpty()) {
            return false;
        }
        this.repo.delete(result.get());
        return true;
    }

}
