package io.nology.todos.todo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.jdbc.Sql;

import io.nology.todos.category.CategoryRepository;
import io.nology.todos.category.entities.Category;
import io.nology.todos.todo.dtos.CreateTodoRequest;
import io.nology.todos.todo.dtos.UpdateTodoRequest;
import io.nology.todos.todo.entities.Todo;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

import java.util.HashMap;

import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Sql(scripts = "/sql/cleanup.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class TodoEndToEndTest {
    @LocalServerPort
    private int port;

    @Autowired
    private TodoRepository todoRepo;

    @Autowired
    private CategoryRepository categoryRepo;

    @BeforeEach
    public void setup() {
        RestAssured.port = this.port;
    }

    // getAll
    @Test
    public void getAllTodos_NoTodos_ReturnsOKAndEmptyArray() {
        // arrange
        // act
        given().when().get("/todos")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(0));
    }

    @Test
    public void getAllTodos_TodosInDB_ReturnsOKAndArrayOfNonArchivedTodos() {
        // arrange
        Category category = new Category();
        category.setName("Test category");
        categoryRepo.saveAndFlush(category);
        Todo todo1 = new Todo();
        todo1.setName("Test todo 1");
        todo1.setCategory(category);
        todo1.setArchived(false);
        todoRepo.saveAndFlush(todo1);
        Todo todo2 = new Todo();
        todo2.setName("Test todo 2");
        todo2.setCategory(category);
        todo2.setArchived(false);
        todo2.setIsComplete(true);
        todoRepo.saveAndFlush(todo2);
        Todo todo3 = new Todo();
        todo3.setName("Test todo 3");
        todo3.setCategory(category);
        todo3.setArchived(true);
        todoRepo.saveAndFlush(todo3);
        // act
        given().when().get("/todos")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(2))
        .body("name", hasItems("Test todo 1", "Test todo 2"))
        .body("category", hasItem("Test category"))
        .body("isComplete", hasItems(false, true))
        .body(matchesJsonSchemaInClasspath("schemas/todo-list-schema.json"));
    }

    @Test
    public void getAllTodos_CategoryIdInDB_ReturnsOKAndArrayOfNonArchivedFilteredTodos() {
        // arrange
        Category category1 = new Category();
        category1.setName("Test category 1");
        categoryRepo.saveAndFlush(category1);
        Long category1Id = category1.getId();
        Category category2 = new Category();
        category2.setName("Test category 2");
        categoryRepo.saveAndFlush(category2);
        Todo todo1 = new Todo();
        todo1.setName("Test todo 1");
        todo1.setCategory(category1);
        todoRepo.saveAndFlush(todo1);
        Todo todo2 = new Todo();
        todo2.setName("Test todo 2");
        todo2.setCategory(category2);
        todoRepo.saveAndFlush(todo2);
        Todo todo3 = new Todo();
        todo3.setName("Test todo 3");
        todo3.setCategory(category1);
        todo3.setArchived(true);
        todoRepo.saveAndFlush(todo3);
        // act
        given().when().get("/todos?category=" + category1Id)
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(1))
        .body("name", hasItem("Test todo 1"))
        .body("category", hasItem("Test category 1"))
        .body(matchesJsonSchemaInClasspath("schemas/todo-list-schema.json"));
    }

    @Test
    public void getAllTodos_CategoryIdNotInDB_ReturnsOKAndArrayOfFilteredTodos() {
        // arrange
        // act
        given().when().get("/todos?category=1")
        // assert
        .then().statusCode(HttpStatus.UNPROCESSABLE_CONTENT.value())
        .body("error", equalTo("Unprocessable Content"))
        .body("message", equalTo("No category with id 1"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    // getById

    @Test
    public void getTodoById_ValidId_ReturnsOKAndTodo() {
        // arrange
        Category category = new Category();
        category.setName("Test category");
        categoryRepo.saveAndFlush(category);
        Todo todo1 = new Todo();
        todo1.setName("Test todo");
        todo1.setCategory(category);
        todoRepo.saveAndFlush(todo1);
        String todoId = todo1.getId().toString();
        // act
        given().when().get("/todos/" + todoId)
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("name", equalTo("Test todo"))
        .body("category", equalTo("Test category"))
        .body("isComplete", equalTo(false))
        .body("isArchived", nullValue())
        .body(matchesJsonSchemaInClasspath("schemas/todo-schema.json"));
    }

    @Test
    public void getTodoById_IdNotInDB_NotFound() {
        // arrange
        long id = 1L;
        // act
        given().when().get("/todos/" + id)
        // assert
        .then().statusCode(HttpStatus.NOT_FOUND.value())
        .body("message", equalTo("Could not find todo with id 1"))
        .body("error", equalTo("Not Found"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void getTodoById_IdTypeInvalid_BadRequest() {
        //arrange
        char id = 'a';
        //act
        given().when().get("/todos/" + id)
        //assert
        .then()
        .statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    // create

    @Test
    public void create_ValidDto_ReturnsCreatedAndCreatedTodo() {
        // arrange
        Category category = new Category();
        category.setName("Test category");
        categoryRepo.saveAndFlush(category);
        Long categoryId = category.getId();

        CreateTodoRequest data = new CreateTodoRequest();
        data.setName("New todo");
        data.setCategoryId(categoryId);

        //act
        given().contentType(ContentType.JSON).body(data)
        .when().post("/todos")
        .then()
        .statusCode(HttpStatus.CREATED.value())
        .body("name", equalTo("New todo"))
        .body("category", equalTo("Test category"))
        .body("isComplete", equalTo(false))
        .body(matchesJsonSchemaInClasspath("schemas/todo-schema.json"));
    }

    @Test
    public void create_InvalidDto_ReturnsBadRequest() {
        // arrange
        Category category = new Category();
        category.setName("Test category");
        categoryRepo.saveAndFlush(category);
        Long categoryId = category.getId();

        HashMap<String, String> data = new HashMap<>();
        data.put("name", "");
        data.put("categoryId", categoryId.toString());

        //act
        given().contentType(ContentType.JSON).body(data)
        .when().post("/todos")
        .then()
        .statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void create_NoBody_ReturnsBadRequest() {
        //act
        given().contentType(ContentType.JSON)
        .when().post("/todos")
        .then()
        .statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void create_CategoryIdNotInDB_ReturnsUnprocessableContent() {
        // arrange
        Long categoryId = 1L;
        CreateTodoRequest data = new CreateTodoRequest();
        data.setName("New todo");
        data.setCategoryId(categoryId);
        //act
        given().contentType(ContentType.JSON).body(data)
        .when().post("/todos")
        .then()
        .statusCode(HttpStatus.UNPROCESSABLE_CONTENT.value())
        .body("error", equalTo("Unprocessable Content"))
        .body("message", equalTo("No category with id " + categoryId))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    // updateById
    
    @Test
    public void updateById_ValidDto_ReturnsOKAndUpdatedTodo() {
        // arrange
        Category category1 = new Category();
        category1.setName("Test category 1");
        categoryRepo.saveAndFlush(category1);
        Category category2 = new Category();
        category2.setName("Test category 2");
        categoryRepo.saveAndFlush(category2);
        Long category2Id = category2.getId();
        Todo todo1 = new Todo();
        todo1.setName("Test todo");
        todo1.setCategory(category1);
        todo1.setIsComplete(true);
        todoRepo.saveAndFlush(todo1);
        String todoId = todo1.getId().toString();

        UpdateTodoRequest data = new UpdateTodoRequest();
        data.setName("Updated todo");
        data.setCategoryId(category2Id);
        // act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/todos/" + todoId)
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("name", equalTo("Updated todo"))
        .body("category", equalTo("Test category 2"))
        .body("isComplete", equalTo(true))
        .body(matchesJsonSchemaInClasspath("schemas/todo-schema.json"));
    }

    @Test
    public void updateById_InvalidDto_ReturnsBadRequest() {
        // arrange
        Category category1 = new Category();
        category1.setName("Test category 1");
        categoryRepo.saveAndFlush(category1);
        Category category2 = new Category();
        category2.setName("Test category 2");
        categoryRepo.saveAndFlush(category2);
        Long category2Id = category2.getId();
        Todo todo1 = new Todo();
        todo1.setName("Test todo");
        todo1.setCategory(category1);
        todoRepo.saveAndFlush(todo1);
        String todoId = todo1.getId().toString();

        HashMap<String, String> data = new HashMap<>();
        data.put("name", "");
        data.put("categoryId", category2Id.toString());
        // act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/todos/" + todoId)
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void updateById_NoBody_ReturnsBadRequest() {
        // arrange
        Category category1 = new Category();
        category1.setName("Test category 1");
        categoryRepo.saveAndFlush(category1);
        Todo todo1 = new Todo();
        todo1.setName("Test todo");
        todo1.setCategory(category1);
        todoRepo.saveAndFlush(todo1);
        String todoId = todo1.getId().toString();
        // act
        given().contentType(ContentType.JSON)
        .when().patch("/todos/" + todoId)
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void updateById_IdNotInDB_ReturnsNotFound() {
        // arrange
        Long id = 1L;
        Category category1 = new Category();
        category1.setName("Test category 1");
        categoryRepo.saveAndFlush(category1);
        Long categoryId = category1.getId();        

        UpdateTodoRequest data = new UpdateTodoRequest();
        data.setName("Updated todo");
        data.setCategoryId(categoryId);
        // act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/todos/" + id)
        // assert
        .then().statusCode(HttpStatus.NOT_FOUND.value())
        .body("error", equalTo("Not Found"))
        .body("message", equalTo("Could not find todo with id " + id))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void updateById_InvalidIdType_ReturnsBadRequest() {
        // arrange
        String id = "a";
        Category category1 = new Category();
        category1.setName("Test category 1");
        categoryRepo.saveAndFlush(category1);
        Long categoryId = category1.getId();        

        UpdateTodoRequest data = new UpdateTodoRequest();
        data.setName("Updated todo");
        data.setCategoryId(categoryId);
        // act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/todos/" + id)
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void updateById_CategoryIdNotInDB_ReturnsUnprocessableContent() {
        // arrange
        Category category1 = new Category();
        category1.setName("Test category 1");
        categoryRepo.saveAndFlush(category1);
        Long newCategoryId = category1.getId() + 1;
        Todo todo1 = new Todo();
        todo1.setName("Test todo");
        todo1.setCategory(category1);
        todoRepo.saveAndFlush(todo1);
        String todoId = todo1.getId().toString();

        UpdateTodoRequest data = new UpdateTodoRequest();
        data.setName("Updated todo");
        data.setCategoryId(newCategoryId);
        // act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/todos/" + todoId)
        // assert
        .then().statusCode(HttpStatus.UNPROCESSABLE_CONTENT.value())
        .body("error", equalTo("Unprocessable Content"))
        .body("message", equalTo("No category with id " + newCategoryId))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    // deleteById

    @Test
    public void deleteById_SuccessfulSoftDelete_ReturnsNoContent() {
        // arrange
        Category category1 = new Category();
        category1.setName("Test category 1");
        categoryRepo.saveAndFlush(category1);
        Todo todo1 = new Todo();
        todo1.setName("Test todo");
        todo1.setArchived(false);
        todo1.setCategory(category1);
        todoRepo.saveAndFlush(todo1);
        String todoId = todo1.getId().toString();
        // act
        given().when().delete("/todos/" + todoId)
        // assert
        .then().statusCode(HttpStatus.NO_CONTENT.value());
    }

    @Test
    public void deleteById_IdNotInDB_ReturnsNotFound() {
        Long id = 1L;
        // act
        given().when().delete("/todos/" + id)
        // assert
        .then().statusCode(HttpStatus.NOT_FOUND.value())
        .body("error", equalTo("Not Found"))
        .body("message", equalTo("Could not find todo with id " + id))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void deleteById_TodoAlreadyArchived_ReturnsNotFound() {
        // arrange
        Category category1 = new Category();
        category1.setName("Test category 1");
        categoryRepo.saveAndFlush(category1);
        Todo todo1 = new Todo();
        todo1.setName("Test todo");
        todo1.setArchived(true);
        todo1.setCategory(category1);
        todoRepo.saveAndFlush(todo1);
        String todoId = todo1.getId().toString();
        // act
        given().when().delete("/todos/" + todoId)
        // assert
        .then().statusCode(HttpStatus.NOT_FOUND.value())
        .body("error", equalTo("Not Found"))
        .body("message", equalTo("Could not find todo with id " + todoId))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void deleteById_InvalidIdType_ReturnsBadRequest() {
        String id = "a";
        // act
        given().when().delete("/todos/" + id)
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

}
