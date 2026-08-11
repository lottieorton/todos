package io.nology.todos.todo;

import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
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
    private final ModelMapper mapper;

    public TodoService(TodoRepository repo, CategoryService categoryService, ModelMapper mapper) {
        this.repo = repo;
        this.categoryService = categoryService;
        this.mapper = mapper;
    }

    public List<Todo> findAll() {
        return this.repo.findAllWithCategory();
    }

    public Optional<Todo> findById(Long id) {
        return this.repo.findById(id);
    }

    public Todo create(CreateTodoRequest data) {
        Optional<Category> returnedCategory = this.categoryService.findById(data.getCategoryId());
        if(returnedCategory.isEmpty()) {
            throw new UnprocessableContentException("No category with id " + data.getCategoryId());
        }
        Category category = returnedCategory.get();
        Todo createdTodo = this.mapper.map(data, Todo.class);
        createdTodo.setCategory(category);
        this.repo.saveAndFlush(createdTodo);
        return createdTodo;

    }

    public Optional<Todo> updateById(Long id, UpdateTodoRequest data) {
        Optional<Todo> result = this.findById(id);
        if(result.isEmpty()) {
            return result;
        }
        Todo foundTodo = result.get();

        this.mapper.map(data, foundTodo);

        
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
