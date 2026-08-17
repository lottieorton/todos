package io.nology.todos.todo;

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
import org.modelmapper.ModelMapper;

import io.nology.todos.category.CategoryService;
import io.nology.todos.category.entities.Category;
import io.nology.todos.common.exceptions.UnprocessableContentException;
import io.nology.todos.todo.dtos.CreateTodoRequest;
import io.nology.todos.todo.dtos.UpdateTodoRequest;
import io.nology.todos.todo.entities.Todo;

@ExtendWith(MockitoExtension.class)
public class TodoServiceTest {
    @Mock
    private TodoRepository repo;

    @Mock
    private ModelMapper mapper;

    @Mock
    private CategoryService categoryService;

    @Spy
    @InjectMocks
    private TodoService todoService;


    @Test
    public void findAllWithCategory_WhenNoCategoryId_CallsFindAllWithCategory() {
        // act
        this.todoService.findAll(null);
        // assert
        verify(this.repo).findAllWithCategory();
    }

    @Test
    public void findAllWithCategory_WhenCategoryExists_CallsFindByCategoryId() {
        // arrange
        Category testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("Test category");

        when(this.categoryService.findById(anyLong())).thenReturn(Optional.of(testCategory));
        // act
        this.todoService.findAll(1L);
        // assert
        verify(this.repo).findByCategoryId(1L);
    }

    @Test
    public void findAllWithCategory_WhenCategoryDoesNotExist_ThrowsException() {
        // arrange
        when(this.categoryService.findById(anyLong())).thenReturn(Optional.empty());
        // assert
        assertThrows(UnprocessableContentException.class, () -> this.todoService.findAll(1L));
    }

    @Test
    public void findById_CallsFindByIdWithCorrectArg() {
        // act
        this.todoService.findById(1L);
        // assert
        verify(this.repo).findById(1L);
    }

    @Test
    public void create_WhenCategoryExists_SavesTodoInDB() {
        Category testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("Test category");

        CreateTodoRequest data = new CreateTodoRequest();
        data.setCategoryId(1L);

        Todo testTodo = new Todo();
        testTodo.setName("New todo");

       when(this.categoryService.findById(anyLong())).thenReturn(Optional.of(testCategory));
       when(this.mapper.map(data, Todo.class)).thenReturn(testTodo);
       when(this.repo.saveAndFlush(any(Todo.class))).thenAnswer(t -> {
            return t.getArgument(0);
        });

       // act
        Todo result = this.todoService.create(data);

       // assert
       assertNotNull(result);
       assertEquals("New todo", result.getName());
       assertEquals("Test category", result.getCategory().getName());

       verify(this.mapper).map(data, Todo.class);
       verify(this.repo).saveAndFlush(argThat(todo -> todo.getName().equals("New todo")));
       verify(this.repo).saveAndFlush(argThat(todo -> todo.getCategory().getName().equals("Test category")));
       verify(this.repo).saveAndFlush(any(Todo.class));
    }

    @Test
    public void create_WhenCategoryDoesNotExist_ThrowsException() {
        CreateTodoRequest data = new CreateTodoRequest();
        data.setCategoryId(1L);

        Todo testTodo = new Todo();
        testTodo.setName("New todo");

       when(this.categoryService.findById(anyLong())).thenReturn(Optional.empty());

       // assert
       assertThrows(UnprocessableContentException.class, () -> this.todoService.create(data));

       verify(this.mapper, never()).map(data, Todo.class);
       verify(this.repo, never()).saveAndFlush(any(Todo.class));
    }

    @Test
    public void updateById_WhenTodoAndCategoryExists_SavesUpdateTodoInDB() {
        // arrange
        Category testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("Test category");
        
        UpdateTodoRequest data = new UpdateTodoRequest();
        data.setCategoryId(1L);

        Todo testTodo = new Todo();
        testTodo.setName("Existing todo");

        when(this.repo.findById(1L)).thenReturn(Optional.of(testTodo));
        when(this.categoryService.findById(1L)).thenReturn(Optional.of(testCategory));
        when(this.repo.saveAndFlush(any(Todo.class))).thenAnswer(t -> {
            return t.getArgument(0);
        });

        // act
        Optional<Todo> result = this.todoService.updateById(1L, data);

        // assert
        assertTrue(result.isPresent());
        assertEquals("Existing todo", result.get().getName());        
        assertEquals("Test category", result.get().getCategory().getName());
        
        verify(this.todoService).findById(1L);
        verify(this.mapper).map(data, testTodo);
        verify(this.repo).saveAndFlush(testTodo);
        verify(this.repo).saveAndFlush(argThat(todo -> todo.getCategory().getName().equals("Test category")));
    }

    @Test
    public void updateById_WhenTodoDoesNotExist_ReturnsEmpty() {
        // arrange
        UpdateTodoRequest data = new UpdateTodoRequest();
        data.setCategoryId(1L);

        when(this.repo.findById(1L)).thenReturn(Optional.empty());

        // act
        Optional<Todo> result = this.todoService.updateById(1L, data);

        // assert
        assertTrue(result.isEmpty());
        
        verify(this.todoService).findById(1L);
        verify(this.mapper, never()).map(any(UpdateTodoRequest.class), any(Todo.class));
        verify(this.repo, never()).saveAndFlush(any(Todo.class));
    }

    @Test
    public void updateById_WhenCategoryDoesNotExist_ThrowsUnprocessableContentException() {
        // arrange
        UpdateTodoRequest data = new UpdateTodoRequest();
        data.setCategoryId(1L);

        Todo testTodo = new Todo();
        testTodo.setName("Existing todo");

        when(this.repo.findById(1L)).thenReturn(Optional.of(testTodo));
        when(this.categoryService.findById(1L)).thenReturn(Optional.empty());

        // act

        // assert
        assertThrows(UnprocessableContentException.class, () -> this.todoService.updateById(1L, data));
        
        verify(this.todoService).findById(1L);
        verify(this.repo, never()).saveAndFlush(any(Todo.class));
    }

    @Test
    public void deleteById_WhenTodoExists_DeletesFromDBReturnsTrue() {
        // arrange
        Todo testTodo = new Todo();
        testTodo.setName("Existing todo");

        when(this.repo.findById(1L)).thenReturn(Optional.of(testTodo));

        // act
        boolean result = this.todoService.deleteById(1L);

        // assert
        assertTrue(result);
        verify(this.todoService).findById(1L);
        verify(this.repo).delete(testTodo);

    }

    @Test
    public void deleteById_WhenTodoDoesNotExist_DoesNotCallDeleteReturnsFalse() {
        // arrange
        when(this.repo.findById(1L)).thenReturn(Optional.empty());

        // act
        boolean result = this.todoService.deleteById(1L);

        // assert
        assertFalse(result);
        verify(this.todoService).findById(1L);
        verify(this.repo, never()).delete(any(Todo.class));

    }

}
