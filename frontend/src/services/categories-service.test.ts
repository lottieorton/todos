import { FetchError } from "../errors/errors";
import type { Category } from "../interfaces/Category";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "./categories-service";

describe("categories service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllCategories", () => {
    it("Should return an array of categories on successful fetch", async () => {
      // arrange
      const mockCategories: Category[] = [
        { id: 1, name: "Cleaning" },
        { id: 2, name: "Fitness" },
      ];
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCategories,
      } as Response);
      // act
      const result = await getAllCategories();
      // assert
      expect(result).toEqual(mockCategories);
    });

    it("Should throw a FetchError for !response.ok", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => {},
      } as Response);
      // assert
      await expect(getAllCategories()).rejects.toThrow(FetchError);
    });

    it("Should throw an error on failed fetch", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockRejectedValueOnce(
        new Error("Network connection error"),
      );
      // assert
      await expect(getAllCategories()).rejects.toThrow(
        "Network connection error",
      );
    });
  });

  describe("createCategory", () => {
    it("Should return a category on successful POST request", async () => {
      // arrange
      const mockCategory = { id: 1, name: "Cleaning" };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockCategory,
      } as Response);
      // act
      const result = await createCategory("Cleaning");
      // assert
      expect(result).toEqual(mockCategory);
    });

    it("Should throw a FailedCreateError for non 201 response status", async () => {
      // arrange
      const mockTodoErrorResponseBody = {
        timestamp: "2026-08-15T07:09:14.240081Z",
        status: 400,
        error: "Bad Request",
        message: "Validation failed for argument",
        path: "/categories",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockTodoErrorResponseBody,
      } as Response);
      // assert
      await expect(createCategory("Fails")).rejects.toThrow("Bad Request");
    });

    it("Should throw a FailedCreateError for non 201 response status with database limit message", async () => {
      // arrange
      const mockTodoErrorResponseBody = {
        timestamp: "2026-08-15T07:09:14.240081Z",
        status: 400,
        error: "Bad Request",
        message: "Maximum limit of 15 categories reached",
        path: "/categories",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockTodoErrorResponseBody,
      } as Response);
      // assert
      await expect(createCategory("Fails")).rejects.toThrow(
        "Maximum category limit reached",
      );
    });

    it("Should throw a FailedCreateError with default message for non 201 response status without message", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => {},
      } as Response);
      // assert
      await expect(createCategory("Fails")).rejects.toThrow(
        "Failed to create category",
      );
    });

    it("Should throw an error on failed POST request", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockRejectedValueOnce(new Error("POST failed"));
      // assert
      await expect(createCategory("Fails")).rejects.toThrow("POST failed");
    });
  });

  describe("updateCategory", () => {
    it("Should return a category on successful PATCH request", async () => {
      // arrange
      const mockCategory = { id: 1, name: "Updated category" };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCategory,
      } as Response);
      // act
      const result = await updateCategory(1, "Updated category");
      // assert
      expect(result).toEqual(mockCategory);
    });

    it("Should throw a FailedUpdateError for !response.ok", async () => {
      const mockTodoErrorResponseBody = {
        timestamp: "2026-08-15T07:09:14.240081Z",
        status: 404,
        error: "Not Found",
        message: "Could not find category in database with id 1",
        path: "/categories/1",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockTodoErrorResponseBody,
      } as Response);
      // assert
      await expect(updateCategory(1, "Failed category update")).rejects.toThrow(
        "Not Found",
      );
    });

    it("Should throw a FailedUpdateError with default message for !response.ok wihtout message", async () => {
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => {},
      } as Response);
      // assert
      await expect(updateCategory(1, "Failed category update")).rejects.toThrow(
        "Failed to update category",
      );
    });

    it("Should throw an error on failed PATCH request", async () => {
      vi.spyOn(window, "fetch").mockRejectedValueOnce(
        new Error("Failed to update"),
      );
      // assert
      await expect(updateCategory(1, "Failed category update")).rejects.toThrow(
        "Failed to update",
      );
    });
  });

  describe("deleteCategory", () => {
    it("Should return true on successful delete", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 204,
      } as Response);
      // act
      const result = await deleteCategory(1);
      // assert
      expect(result).toEqual(true);
    });

    it("Should throw a FailedDeleteError for !response.ok", async () => {
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
      await expect(deleteCategory(50)).rejects.toThrow("Not Found");
    });

    it("Should throw a FailedDeleteError with default message for !response.ok wihtout message", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => {},
      } as Response);
      // assert
      await expect(deleteCategory(50)).rejects.toThrow(
        "Failed to delete category",
      );
    });

    it("Should throw an error on failed deletion", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockRejectedValueOnce(
        new Error("Deletion failed"),
      );
      // assert
      await expect(deleteCategory(50)).rejects.toThrow("Deletion failed");
    });
  });
});
