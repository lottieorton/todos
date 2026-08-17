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
       
    public List<Todo> findAll(Long categoryId) {
        if(categoryId == null) {
            return this.repo.findAllWithCategory();
        }
        resolveCategory(categoryId);
        return this.repo.findByCategoryId(categoryId);
    }

    public Optional<Todo> findById(Long id) {
        return this.repo.findById(id);
    }

    public Todo create(CreateTodoRequest data) {
        Category foundCategory = resolveCategory(data.getCategoryId());
        Todo createdTodo = this.mapper.map(data, Todo.class);
        createdTodo.setCategory(foundCategory);
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
            Category foundCategory = resolveCategory(data.getCategoryId());
            foundTodo.setCategory(foundCategory);
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

    private Category resolveCategory(Long id) {
        Optional<Category> returnedCategory = this.categoryService.findById(id);
        if(returnedCategory.isEmpty()) {
            throw new UnprocessableContentException("No category with id " + id);
        }
        return returnedCategory.get();
    }


}
