package io.nology.todos.category;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import io.nology.todos.category.dtos.CreateCategoryRequest;
import io.nology.todos.category.dtos.UpdateCategoryRequest;
import io.nology.todos.category.entities.Category;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {
    @Mock
    private CategoryRepository repo;

    @Spy
    @InjectMocks
    private CategoryService categoryService;

    @Test
    public void findAll_CallsFindAll() {
        this.categoryService.findAll();
        verify(this.repo).findAll();
    }

    @Test
    public void findById_CallsFindByIdWithCorrectArg() {
        this.categoryService.findById(1L);
        verify(this.repo).findById(1L);
    }

    @Test
    public void create_WhenCategoryLimitNotReached_TrimsNameAndSavesCategoryInDB() {
        // arrange
        CreateCategoryRequest data = new CreateCategoryRequest();
        data.setName("  New category   ");

        when(this.repo.saveAndFlush(any(Category.class))).thenAnswer(c -> {
            Category category = c.getArgument(0);
            category.setId(1L);
            return category;
        });

        // act
        Category result = this.categoryService.create(data);
        // assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("New category", result.getName());

        verify(this.repo).saveAndFlush(argThat(category -> category.getName().equals("New category")));
    }

    @Test
    public void create_WhenCategoryLimitReached_ThrowsExcpetion() {
        // arrange
        CreateCategoryRequest data = new CreateCategoryRequest();
        data.setName("New category");
        when(this.repo.count()).thenReturn(15L);

        // assert
        assertThrows(IllegalStateException.class, () -> this.categoryService.create(data));
        verify(this.repo, never()).saveAndFlush(any(Category.class));
    }

    @Test
    public void updateById_WhenCategoryExistsAndNameNotNull_SavesUpdatedCategoryInDB() {
        // arrange
        Long id = 1L;

        UpdateCategoryRequest data = new UpdateCategoryRequest();
        data.setName("   Updated category  ");

        Category testCategory = new Category();
        testCategory.setId(id);
        testCategory.setName("Old category");
        when(this.repo.findById(id)).thenReturn(Optional.of(testCategory));

        // act
        Optional<Category> result = this.categoryService.updateById(id, data);

        // assert
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        assertEquals("Updated category", result.get().getName());
        verify(this.categoryService).findById(1L);
        verify(this.repo).saveAndFlush(argThat(category -> category.getName().equals("Updated category")));
    }

    @Test
    public void updateById_WhenCategoryDoesNotExist_DoesNotSaveToDB() {
        // arrange
        UpdateCategoryRequest data = new UpdateCategoryRequest();
        when(this.repo.findById(anyLong())).thenReturn(Optional.empty());

        // act
        Optional<Category> result = this.categoryService.updateById(1L, data);

        // assert
        assertTrue(result.isEmpty());
        verify(this.categoryService).findById(1L);
        verify(this.repo, never()).saveAndFlush(any(Category.class));
    }

    @Test
    public void updateById_WhenNameIsNull_SavesSameCategoryToDB() {
        // arrange
        Long id = 1L;

        UpdateCategoryRequest data = new UpdateCategoryRequest();

        Category testCategory = new Category();
        testCategory.setId(id);
        testCategory.setName("Old category");
        when(this.repo.findById(id)).thenReturn(Optional.of(testCategory));

        // act
        Optional<Category> result = this.categoryService.updateById(id, data);

        // assert
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        assertEquals("Old category", result.get().getName());
        verify(this.categoryService).findById(1L);
        verify(this.repo).saveAndFlush(testCategory);
    }

    @Test
    public void deleteById_WhenCategoryExists_DeletesFromDBReturnsTrue() {
        // arrange
        Category testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("Test category");
        when(this.repo.findById(anyLong())).thenReturn(Optional.of(testCategory));
        // act
        boolean result = this.categoryService.deleteById(1L);
        // assert
        assertTrue(result);
        verify(this.categoryService).findById(1L);
        verify(this.repo).delete(testCategory);
    }

    @Test
    public void deleteById_WhenCategoryDoesNotExist_DoesNotCallDeleteReturnsFalse() {
        // arrange
        when(this.repo.findById(anyLong())).thenReturn(Optional.empty());
        // act
        boolean result = this.categoryService.deleteById(1L);
        // assert
        assertFalse(result);
        verify(this.categoryService).findById(1L);
        verify(this.repo, never()).delete(any(Category.class));
    }
    
}
