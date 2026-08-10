package io.nology.todos.category;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.nology.todos.category.dtos.CategoryResponse;
import io.nology.todos.category.dtos.CreateCategoryRequest;
import io.nology.todos.category.dtos.UpdateCategoryRequest;
import io.nology.todos.category.entities.Category;
import io.nology.todos.common.exceptions.NotFoundException;
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
@RequestMapping("/categories")
@Tag(name = "Categories controller")
public class CategoriesController {
    
    private final CategoryService categoryService;

    public CategoriesController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping()
    public ResponseEntity<List<CategoryResponse>> findAllCategories() {
        List<Category> allCategories = this.categoryService.findAll();
        return ResponseEntity.ok(CategoryResponse.of(allCategories));
    }
    
    @PostMapping()
    public ResponseEntity<CategoryResponse> createNewCategory(@RequestBody @Valid CreateCategoryRequest data) {
        Category createdCategory = this.categoryService.create(data);
        return new ResponseEntity<CategoryResponse>(CategoryResponse.of(createdCategory), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategoryById(@PathVariable Long id, @RequestBody @Valid UpdateCategoryRequest data) {
        Category result = this.categoryService.updateById(id, data)
        .orElseThrow(() -> new NotFoundException("Could not find category with id " + id));
        return ResponseEntity.ok(CategoryResponse.of(result));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoryById(@PathVariable Long id) {
        boolean isDeleted = this.categoryService.deleteById(id);
        if(isDeleted) {
            return ResponseEntity.noContent().build();
        }
        throw new NotFoundException("Could not find category with id " + id);
    }
    
    
}
