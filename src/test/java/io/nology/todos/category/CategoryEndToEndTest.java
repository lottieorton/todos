package io.nology.todos.category;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.jdbc.Sql;

import io.nology.todos.category.dtos.CreateCategoryRequest;
import io.nology.todos.category.dtos.UpdateCategoryRequest;
import io.nology.todos.category.entities.Category;
import io.nology.todos.todo.TodoRepository;
import io.nology.todos.todo.entities.Todo;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

import java.util.HashMap;

import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Sql(scripts = "/sql/cleanup.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class CategoryEndToEndTest {
   @LocalServerPort
   private int port;

   @Autowired
   private CategoryRepository categoryRepo;

   @Autowired
    private TodoRepository todoRepo;

   @BeforeEach
   public void setup() {
    RestAssured.port = this.port;
   }

    // getAll

   @Test
   public void getAllCategories_NoCategoriesInDB_ReturnsOKAndEmptyArray() {
        // arrange
        // act
        given().when().get("/categories")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(0));
   }

   @Test
   public void getAllCategories_CategoriesInDB_ReturnsOKAndArrayOfCategories() {
        // arrange
        Category category1 = new Category();
        category1.setName("Test category 1");
        categoryRepo.saveAndFlush(category1);
        Category category2 = new Category();
        category2.setName("Test category 2");
        categoryRepo.saveAndFlush(category2);
        // act
        given().when().get("/categories")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(2))
        .body("name", hasItems("Test category 1", "Test category 2"))
        .body(matchesJsonSchemaInClasspath("schemas/category-list-schema.json"));
   }

    // create

    @Test
    public void createCategory_ValidDto_ReturnsCreatedAndCreatedCategory() {
        // arrange
        CreateCategoryRequest data = new CreateCategoryRequest();
        data.setName("Test category");
        // act
        given()
        .contentType(ContentType.JSON).body(data)
        .when().post("/categories")
        // assert
        .then().statusCode(HttpStatus.CREATED.value())
        .body("name", equalTo("Test category"))
        .body(matchesJsonSchemaInClasspath("schemas/category-schema.json"));
    }

    @Test
    public void createCategory_InvalidDto_ReturnsBadRequest() {
        // arrange
        HashMap<String, String> data = new HashMap<>();
        data.put("name", "");
        // act
        given().contentType(ContentType.JSON).body(data)
        .when().post("/categories")
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }
    
    @Test
    public void createCategory_NoBody_ReturnsBadRequest() {
        // arrange 
        // act
        given().contentType(ContentType.JSON)
        .when().post("/categories")
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body("message", matchesPattern("Required request body is missing.*"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json")); 
    }

    @Test
    public void createCategory_FullCategoryTable_ReturnsBadRequest() {
        // arrange
        for(int i = 1; i <= 15; i++) {
            Category newCategory = new Category();
            newCategory.setName("Test category " + i);
            categoryRepo.saveAndFlush(newCategory);
        }
        CreateCategoryRequest data = new CreateCategoryRequest();
        data.setName("Test category");
        // act
        given()
        .contentType(ContentType.JSON).body(data)
        .when().post("/categories")
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body("message", equalTo("Maximum limit of 15 categories reached"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json")); 
    }
    // updateById

    @Test
    public void updateCategoryById_ValidDto_ReturnsOKAndUpdatedCategory() {
        // arrange
        Category category1 = new Category();
        category1.setName("Test category");
        categoryRepo.saveAndFlush(category1);

        int categoryId = category1.getId().intValue();
        UpdateCategoryRequest data = new UpdateCategoryRequest();
        data.setName("Updated category");      
        // act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/categories/" + categoryId)
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("name", equalTo("Updated category"))
        .body("id", equalTo(categoryId))
        .body(matchesJsonSchemaInClasspath("schemas/category-schema.json"));
    }

    @Test
    public void updateCategoryById_InvalidDto_ReturnsBadRequest() {
        // arrange
        Category category1 = new Category();
        category1.setName("Test category");
        categoryRepo.saveAndFlush(category1);

        String categoryId = category1.getId().toString();
        HashMap<String, String> data = new HashMap<>();
        data.put("name", "");        
        // act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/categories/" + categoryId)
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json")); 
    }

    @Test
    public void updateCategoryById_NoBody_ReturnsBadRequest() {
        // arrange
        Category category1 = new Category();
        category1.setName("Test category");
        categoryRepo.saveAndFlush(category1);

        String categoryId = category1.getId().toString();
        // act
        given().contentType(ContentType.JSON)
        .when().patch("/categories/" + categoryId)
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body("message", matchesPattern("Required request body is missing.*"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json")); 
    }

    @Test
    public void updateCategoryById_IdNotInDB_ReturnsNotFound() {
        // arrange
        Long id = 1L;
        UpdateCategoryRequest data = new UpdateCategoryRequest();
        data.setName("Updated category");
        // act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/categories/" + id)
        // assert
        .then().statusCode(HttpStatus.NOT_FOUND.value())
        .body("error", equalTo("Not Found"))
        .body("message", equalTo("Could not find category with id " + id))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json")); 
    }

    @Test
    public void updateCategoryById_InvalidIdType_ReturnsBadRequest() {
        // arrange
        String id = "a";
        UpdateCategoryRequest data = new UpdateCategoryRequest();
        data.setName("Updated category");
        // act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/categories/" + id)
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json")); 
    }

    // deleteById

    @Test
    public void deleteCategoryById_SuccessfulDelete_ReturnsNoContent() {
        // arrange
        Category category1 = new Category();
        category1.setName("Test category 1");
        categoryRepo.saveAndFlush(category1);

        String id = category1.getId().toString();
        // act
        given().when().delete("/categories/" + id)
        // assert
        .then().statusCode(HttpStatus.NO_CONTENT.value());
    }

    @Test
    public void deleteCategoryById_IdNotInDB_ReturnsNotFound() {
        // arrange
        Long id = 1L;
        // act
        given().when().delete("/categories/" + id)
        // assert
        .then().statusCode(HttpStatus.NOT_FOUND.value())
        .body("error", equalTo("Not Found"))
        .body("message", equalTo("Could not find category with id " + id))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void deleteCategoryById_InvalidIdType_ReturnsBadRequest() {
        // arrange
        String id = "a";
        // act
        given().when().delete("/categories/" + id)
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void deleteCategoryById_CategoryHasTodos_ReturnsBadRequest() {
        // arrange
        Category category1 = new Category();
        category1.setName("Test category");
        categoryRepo.saveAndFlush(category1);
        String categoryId = category1.getId().toString();
        Todo todo1 = new Todo();
        todo1.setName("Test todo 1");
        todo1.setCategory(category1);
        todoRepo.saveAndFlush(todo1);
        // act
        given().when().delete("/categories/" + categoryId)
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }
}
