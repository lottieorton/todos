package io.nology.todos.category;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.nology.todos.category.dtos.CreateCategoryRequest;
import io.nology.todos.category.dtos.UpdateCategoryRequest;
import io.nology.todos.category.entities.Category;
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
public class CategoriesController {
    
    private final CategoryService categoryService;

    public CategoriesController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping()
    public ResponseEntity<List<Category>> findAllCategories() {
        List<Category> allCategories = this.categoryService.findAll();
        // System.out.println(allCategories);
        return ResponseEntity.ok(allCategories);
    }
    
    @PostMapping()
    public ResponseEntity<Category> createNewCategory(@RequestBody @Valid CreateCategoryRequest data) {
        Category createdCategory = this.categoryService.create(data);
        return new ResponseEntity<Category>(createdCategory, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Category> updateCategoryById(@PathVariable Long id, @RequestBody @Valid UpdateCategoryRequest data) throws Exception {
        Category result = this.categoryService.updateById(id, data)
        .orElseThrow(() -> new Exception("Could not find category with id " + id));
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoryById(@PathVariable Long id) throws Exception {
        boolean isDeleted = this.categoryService.deleteById(id);
        if(isDeleted) {
            return ResponseEntity.noContent().build();
        }
        throw new Exception("Could not find category with id " + id);
    }
    
    
}
