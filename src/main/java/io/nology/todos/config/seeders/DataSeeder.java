package io.nology.todos.config.seeders;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import io.nology.todos.category.CategoryRepository;
import io.nology.todos.category.entities.Category;

@Component
@Profile({"dev"})
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository repo;
    
    public DataSeeder(CategoryRepository repo) {
        this.repo = repo;
    }

    @Override
    public void run(String... args) throws Exception {
        String[] categoryNames = {"House work", "Fitness", "Life Admin", "Work", "Social", "Personal", "Hobbies"};
        List<Category> categories = new ArrayList<>();
        if(repo.count() == 0) {
            for(String name : categoryNames) {
                Category newCategory = new Category();
                newCategory.setName(name);
                categories.add(newCategory);
            }
            repo.saveAllAndFlush(categories);
        }
    }
}
