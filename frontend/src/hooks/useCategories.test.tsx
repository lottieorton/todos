import { renderHook, waitFor, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "./useCategories";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../services/categories-service";
import type { Category } from "../interfaces/Category";
import { getAllTodos } from "../services/todos-service";
import type { Todo } from "../interfaces/Todo";
import { useTodos } from "./useTodos";

vi.mock("../services/categories-service", () => ({
  getAllCategories: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
}));

vi.mock("../services/todos-service", () => ({
  getAllTodos: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useCategories hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useCategories", () => {
    it("Should return categories on successful getAllCategories", async () => {
      // arrange
      const mockCategories: Category[] = [
        { id: 1, name: "Cleaning" },
        { id: 2, name: "Fitness" },
      ];
      vi.mocked(getAllCategories).mockResolvedValueOnce(mockCategories);
      // act
      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });
      // assert
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(getAllCategories).toHaveBeenCalledOnce();
        expect(result.current.data).toEqual(mockCategories);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("Should return isError when fetching categories errors", async () => {
      // arrange
      vi.mocked(getAllCategories).mockRejectedValueOnce(
        new Error("Failed to get categories"),
      );
      // act
      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });
      // assert
      expect(result.current.isLoading).toBe(true);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.isError).toBe(true);
        expect(result.current.error?.message).toBe("Failed to get categories");
        expect(getAllCategories).toHaveBeenCalledOnce();
        expect(result.current.data).toBeUndefined();
      });
    });
  });

  describe("useCreateCategory", () => {
    it("Should return new category on successful createCategory", async () => {
      // arrange
      const mockCategory: Category = { id: 1, name: "Cleaning" };
      vi.mocked(createCategory).mockResolvedValueOnce(mockCategory);

      const { result } = renderHook(() => useCreateCategory(), {
        wrapper: createWrapper(),
      });

      // act
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      act(() => {
        result.current.mutate("Cleaning");
      });
      // assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(createCategory).toHaveBeenCalledOnce();
        expect(createCategory).toHaveBeenCalledWith("Cleaning");
        expect(result.current.data).toEqual(mockCategory);
        expect(result.current.isPending).toBe(false);
      });
    });

    it("Should cause getAllCategories to be called on successful createCategory", async () => {
      // arrange
      const mockCategory: Category = { id: 2, name: "Fitness" };
      vi.mocked(createCategory).mockResolvedValueOnce(mockCategory);
      const mockInitialCategories: Category[] = [{ id: 1, name: "Cleaning" }];
      const mockUpdatedCategories: Category[] = [
        { id: 1, name: "Cleaning" },
        { id: 2, name: "Fitness" },
      ];
      vi.mocked(getAllCategories)
        .mockResolvedValueOnce(mockInitialCategories)
        .mockResolvedValueOnce(mockUpdatedCategories);

      const wrapper = createWrapper();

      const { result } = renderHook(
        () => ({
          query: useCategories(),
          mutation: useCreateCategory(),
        }),
        { wrapper },
      );
      // act
      await waitFor(() => {
        expect(result.current.query.data).toEqual(mockInitialCategories);
      });
      expect(getAllCategories).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate("Fitness");
      });
      // assert
      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(true);
        expect(createCategory).toHaveBeenCalledOnce();
        expect(getAllCategories).toHaveBeenCalledTimes(2);
        expect(result.current.query.data).toEqual(mockUpdatedCategories);
      });
    });

    it("Should return isError when createCategory fails", async () => {
      // arrange
      vi.mocked(createCategory).mockRejectedValueOnce(
        new Error("Failed to create category"),
      );
      const mockInitialCategories: Category[] = [{ id: 1, name: "Cleaning" }];
      vi.mocked(getAllCategories).mockResolvedValueOnce(mockInitialCategories);

      const wrapper = createWrapper();

      const { result } = renderHook(
        () => ({
          query: useCategories(),
          mutation: useCreateCategory(),
        }),
        { wrapper },
      );
      // act
      await waitFor(() => {
        expect(result.current.query.data).toEqual(mockInitialCategories);
      });
      expect(getAllCategories).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate("Failed category");
      });
      // assert
      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(false);
        expect(result.current.mutation.isError).toBe(true);
        expect(result.current.mutation.error?.message).toBe(
          "Failed to create category",
        );
        expect(createCategory).toHaveBeenCalledOnce();
        expect(getAllCategories).toHaveBeenCalledOnce();
      });
    });
  });

  describe("useUpdateCategory", () => {
    it("Should return category on successful updateCategory", async () => {
      // arrange
      const mockCategory: Category = { id: 1, name: "Cleaning" };
      vi.mocked(updateCategory).mockResolvedValueOnce(mockCategory);
      const mockFormData = {
        id: 1,
        name: "Cleaning",
      };
      const { result } = renderHook(() => useUpdateCategory(), {
        wrapper: createWrapper(),
      });
      // act
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      act(() => {
        result.current.mutate(mockFormData);
      });
      // assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(updateCategory).toHaveBeenCalledOnce();
        expect(updateCategory).toHaveBeenCalledWith(1, "Cleaning");
        expect(result.current.data).toEqual(mockCategory);
        expect(result.current.isPending).toBe(false);
      });
    });

    it("Should cause getAllCategories to be called on successful updateCategory", async () => {
      // arrange
      const mockCategory: Category = { id: 1, name: "Cleaning" };
      vi.mocked(updateCategory).mockResolvedValueOnce(mockCategory);
      const mockFormData = {
        id: 1,
        name: "Cleaning",
      };
      const mockInitialCategories: Category[] = [{ id: 1, name: "Cleaning" }];
      const mockUpdatedCategories: Category[] = [{ id: 1, name: "Fitness" }];
      vi.mocked(getAllCategories)
        .mockResolvedValueOnce(mockInitialCategories)
        .mockResolvedValueOnce(mockUpdatedCategories);
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => ({
          query: useCategories(),
          mutation: useUpdateCategory(),
        }),
        { wrapper },
      );
      // act
      await waitFor(() => {
        expect(result.current.query.data).toBe(mockInitialCategories);
      });
      expect(getAllCategories).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate(mockFormData);
      });
      // assert
      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(true);
        expect(updateCategory).toHaveBeenCalledOnce();
        expect(getAllCategories).toHaveBeenCalledTimes(2);
        expect(result.current.query.data).toEqual(mockUpdatedCategories);
      });
    });

    it("Should cause getAllTodos to be called on successful updateCategory", async () => {
      // arrange
      const mockCategory: Category = { id: 1, name: "Cleaning" };
      vi.mocked(updateCategory).mockResolvedValueOnce(mockCategory);
      const mockFormData = {
        id: 1,
        name: "Cleaning",
      };
      const mockInitialTodos: Todo[] = [
        {
          id: 1,
          name: "Fill the dishwasher",
          category: "Cleaning",
          isComplete: false,
        },
        {
          id: 2,
          name: "Go to the gym",
          category: "Fitness",
          isComplete: false,
        },
      ];
      const mockRefetchedTodos: Todo[] = [
        {
          id: 1,
          name: "Fill the dishwasher",
          category: "Cleaning",
          isComplete: false,
        },
        {
          id: 2,
          name: "Go to the gym",
          category: "Workout",
          isComplete: false,
        },
      ];
      vi.mocked(getAllTodos)
        .mockResolvedValueOnce(mockInitialTodos)
        .mockResolvedValueOnce(mockRefetchedTodos);
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => ({
          query: useTodos(),
          mutation: useUpdateCategory(),
        }),
        { wrapper },
      );
      // act
      await waitFor(() => {
        expect(result.current.query.data).toBe(mockInitialTodos);
      });
      expect(getAllTodos).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate(mockFormData);
      });
      // assert
      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(true);
        expect(updateCategory).toHaveBeenCalledOnce();
        expect(getAllTodos).toHaveBeenCalledTimes(2);
        expect(result.current.query.data).toEqual(mockRefetchedTodos);
      });
    });

    it("Should return isError when updateCategory fails", async () => {
      // arrange
      vi.mocked(updateCategory).mockRejectedValueOnce(
        new Error("Failed to update category"),
      );
      const mockFormData = {
        id: 1,
        name: "Cleaning",
      };
      const mockInitialCategories: Category[] = [{ id: 1, name: "Cleaning" }];
      vi.mocked(getAllCategories).mockResolvedValueOnce(mockInitialCategories);
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => ({
          query: useCategories(),
          mutation: useUpdateCategory(),
        }),
        { wrapper },
      );
      // act
      await waitFor(() => {
        expect(result.current.query.data).toBe(mockInitialCategories);
      });
      expect(getAllCategories).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate(mockFormData);
      });
      // assert
      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(false);
        expect(result.current.mutation.isError).toBe(true);
        expect(result.current.mutation.error?.message).toBe(
          "Failed to update category",
        );
        expect(updateCategory).toHaveBeenCalledOnce();
        expect(getAllCategories).toHaveBeenCalledOnce();
      });
    });
  });

  describe("useDeleteCategory", () => {
    it("Should return true on successful deleteCategory", async () => {
      // arrange
      vi.mocked(deleteCategory).mockResolvedValueOnce(true);
      const { result } = renderHook(() => useDeleteCategory(), {
        wrapper: createWrapper(),
      });
      // act
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      act(() => {
        result.current.mutate(1);
      });
      // assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(deleteCategory).toHaveBeenCalledOnce();
        expect(deleteCategory).toHaveBeenCalledWith(1);
        expect(result.current.data).toBe(true);
        expect(result.current.isPending).toBe(false);
      });
    });

    it("Should cause getAllCategories to be called on successful deleteCategory", async () => {
      // arrange
      vi.mocked(deleteCategory).mockResolvedValueOnce(true);
      const mockInitialCategories: Category[] = [
        { id: 1, name: "Cleaning" },
        { id: 2, name: "Fitness" },
      ];
      const mockUpdatedCategories: Category[] = [{ id: 1, name: "Cleaning" }];
      vi.mocked(getAllCategories)
        .mockResolvedValueOnce(mockInitialCategories)
        .mockResolvedValueOnce(mockUpdatedCategories);

      const wrapper = createWrapper();

      const { result } = renderHook(
        () => ({
          query: useCategories(),
          mutation: useDeleteCategory(),
        }),
        { wrapper },
      );
      // act
      await waitFor(() => {
        expect(result.current.query.data).toBe(mockInitialCategories);
      });
      expect(getAllCategories).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate(2);
      });
      // assert
      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(true);
        expect(deleteCategory).toHaveBeenCalledOnce();
        expect(getAllCategories).toHaveBeenCalledTimes(2);
        expect(result.current.query.data).toEqual(mockUpdatedCategories);
      });
    });

    it("Should return isError when deleteCategory fails", async () => {
      // arrange
      vi.mocked(deleteCategory).mockRejectedValueOnce(
        new Error("Failed to delete category"),
      );
      const mockInitialCategories: Category[] = [
        { id: 1, name: "Cleaning" },
        { id: 2, name: "Fitness" },
      ];
      vi.mocked(getAllCategories).mockResolvedValueOnce(mockInitialCategories);

      const wrapper = createWrapper();

      const { result } = renderHook(
        () => ({
          query: useCategories(),
          mutation: useDeleteCategory(),
        }),
        { wrapper },
      );
      // act
      await waitFor(() => {
        expect(result.current.query.data).toBe(mockInitialCategories);
      });
      act(() => {
        result.current.mutation.mutate(2);
      });
      // assert
      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(false);
        expect(result.current.mutation.isError).toBe(true);
        expect(result.current.mutation.error?.message).toBe(
          "Failed to delete category",
        );
        expect(deleteCategory).toHaveBeenCalledOnce();
        expect(getAllCategories).toHaveBeenCalledOnce();
      });
    });
  });
});
