package io.nology.todos.todo;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import io.nology.todos.todo.entities.Todo;

public interface TodoRepository extends JpaRepository<Todo, Long>{

    // Query does an upfront left join of todos and categories - prevents doing individual joins when creating the todo response
    @EntityGraph(attributePaths = "category")
    @Query("SELECT t FROM Todo t")
    List<Todo> findAllWithCategory();
    
}
