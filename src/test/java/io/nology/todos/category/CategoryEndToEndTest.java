package io.nology.todos.category;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.jdbc.Sql;

import io.nology.todos.category.entities.Category;
import io.restassured.RestAssured;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Sql(scripts = "/sql/cleanup.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class CategoryEndToEndTest {
   @LocalServerPort
   private int port;

   @Autowired
   private CategoryRepository categoryRepo;

   @BeforeEach
   public void setup() {
    RestAssured.port = this.port;
   }

   @Test
   public void getAllCategories_NoCategoriesInDB_ReturnOkAndEmptyArray() {
        // arrange
        // act
        given().when().get("/categories")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(0));
   }

   @Test
   public void getAllCategories_CategoriesInDB_ReturnsOkAndArrayOfCategories() {
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
        .body("name", hasItems("Test category 1", "Test category 2"));
   }
}
