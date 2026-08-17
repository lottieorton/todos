import { FetchError } from "../errors/errors";
import type { Todo } from "../interfaces/Todo";
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  updateTodo,
} from "./todos-service";

describe("todos service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllTodos", () => {
    it("Should return an array of todos on successful fetch with no categoryId", async () => {
      // arrange
      const mockTodos: Todo[] = [
        { id: 1, name: "Fill the dishwasher", category: "Cleaning" },
        { id: 2, name: "Go to the gym", category: "Fitness" },
      ];
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockTodos,
      } as Response);
      // act
      const result = await getAllTodos();
      // assert
      expect(result).toEqual(mockTodos);
      expect(fetch).toHaveBeenCalledWith("http://localhost:8080/todos");
    });

    it("Should return an array of todos on successful fetch with categoryId", async () => {
      // arrange
      const mockTodos: Todo[] = [
        { id: 1, name: "Fill the dishwasher", category: "Cleaning" },
      ];
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockTodos,
      } as Response);
      // act
      const result = await getAllTodos(1);
      // assert
      expect(result).toEqual(mockTodos);
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/todos?category=1",
      );
    });

    it("Should throw a FetchError for !response.ok", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => {},
      } as Response);
      // assert
      await expect(getAllTodos()).rejects.toThrow(FetchError);
    });

    it("Should throw an error on failed fetch", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockRejectedValueOnce(
        new Error("Network connection error"),
      );
      // assert
      await expect(getAllTodos()).rejects.toThrow("Network connection error");
    });
  });

  describe("createTodo", () => {
    it("Should return a todo on successful POST request", async () => {
      // arrange
      const mockTodo = {
        id: 1,
        name: "Fill the dishwasher",
        category: "Cleaning",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockTodo,
      } as Response);
      // act
      const result = await createTodo("Fill the dishwasher", 1);
      // assert
      expect(result).toEqual(mockTodo);
    });

    it("Should throw a FailedCreateError for non 201 response status", async () => {
      // arrange
      const mockTodoErrorResponseBody = {
        timestamp: "2026-08-15T07:09:14.240081Z",
        status: 422,
        error: "Unprocessable Content",
        message: "No category with id 50",
        path: "/todos",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: async () => mockTodoErrorResponseBody,
      } as Response);
      // assert
      await expect(createTodo("Fails", 50)).rejects.toThrow(
        "No category with id 50",
      );
    });

    it("Should throw a FailedCreateError with default message for non 201 response status without message", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: async () => {},
      } as Response);
      // assert
      await expect(createTodo("Fails", 50)).rejects.toThrow(
        "Failed to create todo",
      );
    });

    it("Should throw an error on failed POST request", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockRejectedValueOnce(
        new Error("Network connection error"),
      );
      // assert
      await expect(createTodo("Fails", 50)).rejects.toThrow(
        "Network connection error",
      );
    });
  });

  describe("updateTodo", () => {
    it("Should return a todo on successful PATCH request", async () => {
      // arrange
      const mockUpdatedTodo = {
        id: 1,
        name: "Updated task",
        category: "Cleaning",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockUpdatedTodo,
      } as Response);
      // act
      const result = await updateTodo(1, "Fill the dishwasher", 1);
      // assert
      expect(result).toEqual(mockUpdatedTodo);
    });

    it("Should return a todo on successful PATCH request with no new name or categoryId", async () => {
      // arrange
      const mockUpdatedTodo = {
        id: 1,
        name: "Updated task",
        category: "Cleaning",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockUpdatedTodo,
      } as Response);
      // act
      const result = await updateTodo(1);
      // assert
      expect(result).toEqual(mockUpdatedTodo);
    });

    it("Should throw a FailedUpdateError for !response.ok", async () => {
      // arrange
      const mockTodoErrorResponseBody = {
        timestamp: "2026-08-15T07:09:14.240081Z",
        status: 404,
        error: "Not Found",
        message: "Could not find todo with id 50",
        path: "/todos/50",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => mockTodoErrorResponseBody,
      } as Response);
      // assert
      await expect(updateTodo(50, "Fails", 3)).rejects.toThrow(
        "Could not find todo with id 50",
      );
    });

    it("Should throw a FailedUpdateError with default message for non ok response status without message", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => {},
      } as Response);
      // assert
      await expect(updateTodo(50, "Fails", 2)).rejects.toThrow(
        "Failed to update todo",
      );
    });

    it("Should throw an error on failed PATCH request", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockRejectedValueOnce(
        new Error("Network connection error"),
      );
      // assert
      await expect(updateTodo(1, "Fails", 2)).rejects.toThrow(
        "Network connection error",
      );
    });
  });

  describe("deleteTodo", () => {
    it("Should return true on successful delete", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 204,
      } as Response);
      // act
      const result = await deleteTodo(1);
      // assert
      expect(result).toEqual(true);
    });

    it("Should throw a Failed DeleteError for !response.ok", async () => {
      // arrange
      const mockTodoErrorResponseBody = {
        timestamp: "2026-08-15T07:09:14.240081Z",
        status: 404,
        error: "Not Found",
        message: "Could not find todo with id 50",
        path: "/todos/50",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => mockTodoErrorResponseBody,
      } as Response);
      // assert
      await expect(deleteTodo(50)).rejects.toThrow(
        "Could not find todo with id 50",
      );
    });

    it("Should throw a FailedDeleteError with default message for non ok response status without message", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => {},
      } as Response);
      // assert
      await expect(deleteTodo(50)).rejects.toThrow("Failed to delete todo");
    });

    it("Should throw an error on failed DELETE request", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockRejectedValueOnce(
        new Error("Network connection error"),
      );
      // assert
      await expect(deleteTodo(1)).rejects.toThrow("Network connection error");
    });
  });
});
