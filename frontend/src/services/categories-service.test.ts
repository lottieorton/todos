import { FailedCreateError, FetchError } from "../errors/errors";
import type { Category } from "../interfaces/Category";
import { createCategory, getAllCategories } from "./categories-service";

describe("categories service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllCategories", () => {
    it("Should return a list of categories on successful fetch", async () => {
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
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => {},
      } as Response);
      // assert
      await expect(createCategory("Fails")).rejects.toThrow(FailedCreateError);
    });

    it("Should throw an error on failed POST request", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockRejectedValueOnce(new Error("POST failed"));
      // assert
      await expect(createCategory("Fails")).rejects.toThrow("POST failed");
    });
  });
});
