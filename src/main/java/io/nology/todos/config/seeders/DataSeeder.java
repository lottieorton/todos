package io.nology.todos.config.seeders;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import io.nology.todos.category.CategoryRepository;
import io.nology.todos.category.entities.Category;
import io.nology.todos.todo.TodoRepository;
import io.nology.todos.todo.entities.Todo;

@Component
@Profile({"dev"})
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepo;
    private final TodoRepository todoRepo;
    
    public DataSeeder(CategoryRepository categoryRepo, TodoRepository todoRepo) {
        this.categoryRepo = categoryRepo;
        this.todoRepo = todoRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        // enter data into categories table
        String[] categoryNames = {"House work", "Fitness", "Life Admin", "Work", "Social", "Personal", "Hobbies"};
        List<Category> categories = new ArrayList<>();
        if(categoryRepo.count() == 0) {
            for(String name : categoryNames) {
                Category newCategory = new Category();
                newCategory.setName(name);
                categories.add(newCategory);
            }
            categoryRepo.saveAllAndFlush(categories);
        }

        // enter data into todos table
        if(todoRepo.count() == 0) {
            Todo cleaningTodo = new Todo();
            cleaningTodo.setName("Clean kitchen");
            cleaningTodo.setCategory(categories.get(0));
            todoRepo.saveAndFlush(cleaningTodo);

            Todo fitnessTodo = new Todo();
            fitnessTodo.setName("Go for a 5km run");
            fitnessTodo.setCategory(categories.get(1));
            todoRepo.saveAndFlush(fitnessTodo);
        }

    }
}
