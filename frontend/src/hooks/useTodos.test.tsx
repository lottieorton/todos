import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { Todo } from "../interfaces/Todo";
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  updateTodo,
} from "../services/todos-service";
import { act, renderHook, waitFor } from "@testing-library/react";
import {
  useCreateTodo,
  useDeleteTodo,
  useTodos,
  useUpdateTodo,
} from "./useTodos";

vi.mock("../services/todos-service", () => ({
  getAllTodos: vi.fn(),
  createTodo: vi.fn(),
  updateTodo: vi.fn(),
  deleteTodo: vi.fn(),
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

describe("useTodos hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useTodos", () => {
    it("Should return todos on successful getAllTodos", async () => {
      //arrange
      const mockTodos: Todo[] = [
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
      vi.mocked(getAllTodos).mockResolvedValueOnce(mockTodos);
      // act
      const { result } = renderHook(() => useTodos(), {
        wrapper: createWrapper(),
      });
      // assert
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(getAllTodos).toHaveBeenCalledOnce();
        expect(result.current.data).toEqual(mockTodos);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("Should return todos on successful getAllTodos with category id value passed in", async () => {
      //arrange
      const mockTodos: Todo[] = [
        {
          id: 1,
          name: "Fill the dishwasher",
          category: "Cleaning",
          isComplete: false,
        },
      ];
      vi.mocked(getAllTodos).mockResolvedValueOnce(mockTodos);
      // act
      const { result } = renderHook(() => useTodos(1), {
        wrapper: createWrapper(),
      });
      // assert
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(getAllTodos).toHaveBeenCalledOnce();
        expect(result.current.data).toEqual(mockTodos);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("Should refetch todos on categoryId changing", async () => {
      //arrange
      const mockAllTodos: Todo[] = [
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
      const mockFilteredTodos: Todo[] = [
        {
          id: 1,
          name: "Fill the dishwasher",
          category: "Cleaning",
          isComplete: false,
        },
      ];
      vi.mocked(getAllTodos)
        .mockResolvedValueOnce(mockAllTodos)
        .mockResolvedValueOnce(mockFilteredTodos);
      // act
      const { result, rerender } = renderHook(
        (categoryId?: number) => useTodos(categoryId),
        {
          wrapper: createWrapper(),
        },
      );
      await waitFor(() => {
        expect(result.current.data).toEqual(mockAllTodos);
        expect(getAllTodos).toHaveBeenCalledWith(undefined);
      });
      rerender(1);
      // assert
      await waitFor(() => {
        expect(result.current.data).toEqual(mockFilteredTodos);
        expect(getAllTodos).toHaveBeenCalledTimes(2);
        expect(getAllTodos).toHaveBeenLastCalledWith(1);
      });
    });

    it("Should return isError when fetching todos errors", async () => {
      // arrange
      vi.mocked(getAllTodos).mockRejectedValueOnce(
        new Error("Failed to get todos"),
      );
      // act
      const { result } = renderHook(() => useTodos(), {
        wrapper: createWrapper(),
      });
      // assert
      expect(result.current.isLoading).toBe(true);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.isError).toBe(true);
        expect(result.current.error?.message).toBe("Failed to get todos");
        expect(getAllTodos).toHaveBeenCalledOnce();
        expect(result.current.data).toBeUndefined();
      });
    });
  });

  describe("useCreateTodos", () => {
    it("Should return new todo on successful createTodos", async () => {
      //arrange
      const mockTodo: Todo = {
        id: 1,
        name: "Fill the dishwasher",
        category: "Cleaning",
        isComplete: false,
      };
      const mockFormData = { name: "Fill the dishwasher", categoryId: 1 };
      vi.mocked(createTodo).mockResolvedValueOnce(mockTodo);
      // act
      const { result } = renderHook(() => useCreateTodo(), {
        wrapper: createWrapper(),
      });
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      act(() => {
        result.current.mutate(mockFormData);
      });
      // assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(createTodo).toHaveBeenCalledOnce();
        expect(createTodo).toHaveBeenCalledWith(
          mockFormData.name,
          mockFormData.categoryId,
        );
        expect(result.current.data).toEqual(mockTodo);
        expect(result.current.isPending).toBe(false);
      });
    });

    it("Should cause getAllTodos to be called on successful createTodo", async () => {
      //arrange
      const mockTodo: Todo = {
        id: 2,
        name: "Go to the gym",
        category: "Fitness",
        isComplete: false,
      };
      vi.mocked(createTodo).mockResolvedValueOnce(mockTodo);
      const mockInitialTodos: Todo[] = [
        {
          id: 1,
          name: "Fill the dishwasher",
          category: "Cleaning",
          isComplete: false,
        },
      ];
      const mockUpdatedTodos: Todo[] = [
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
      vi.mocked(getAllTodos)
        .mockResolvedValueOnce(mockInitialTodos)
        .mockResolvedValueOnce(mockUpdatedTodos);

      const mockFormData = { name: "Go to the gym", categoryId: 2 };

      const wrapper = createWrapper();

      const { result } = renderHook(
        () => ({
          query: useTodos(),
          mutation: useCreateTodo(),
        }),
        { wrapper },
      );
      // act
      await waitFor(() => {
        expect(result.current.query.data).toEqual(mockInitialTodos);
      });
      expect(getAllTodos).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate(mockFormData);
      });
      // assert
      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(true);
        expect(createTodo).toHaveBeenCalledOnce();
        expect(getAllTodos).toHaveBeenCalledTimes(2);
        expect(result.current.query.data).toEqual(mockUpdatedTodos);
      });
    });

    it("Should return isError when createTodo errors", async () => {
      // arrange
      vi.mocked(createTodo).mockRejectedValueOnce(
        new Error("Failed to create todo"),
      );
      const mockFormData = { name: "Go to the gym", categoryId: 2 };
      const mockInitialTodos: Todo[] = [
        {
          id: 1,
          name: "Fill the dishwasher",
          category: "Cleaning",
          isComplete: false,
        },
      ];
      vi.mocked(getAllTodos).mockResolvedValueOnce(mockInitialTodos);

      const wrapper = createWrapper();

      const { result } = renderHook(
        () => ({
          query: useTodos(),
          mutation: useCreateTodo(),
        }),
        { wrapper },
      );

      // act
      await waitFor(() => {
        expect(result.current.query.data).toEqual(mockInitialTodos);
      });
      expect(getAllTodos).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate(mockFormData);
      });
      // assert
      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(false);
        expect(result.current.mutation.isError).toBe(true);
        expect(result.current.mutation.error?.message).toBe(
          "Failed to create todo",
        );
        expect(createTodo).toHaveBeenCalledOnce();
        expect(getAllTodos).toHaveBeenCalledOnce();
      });
    });
  });

  describe("useUpdateTodos", () => {
    it("Should return new todo on successful updateTodos", async () => {
      //arrange
      const mockUpdatedTodo: Todo = {
        id: 1,
        name: "Fill the dishwasher",
        category: "Cleaning",
        isComplete: false,
      };
      const mockFormData = {
        id: 1,
        name: "Fill the dishwasher",
        categoryId: 1,
        isComplete: false,
      };
      vi.mocked(updateTodo).mockResolvedValueOnce(mockUpdatedTodo);
      // act
      const { result } = renderHook(() => useUpdateTodo(), {
        wrapper: createWrapper(),
      });
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      act(() => {
        result.current.mutate(mockFormData);
      });
      // assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(updateTodo).toHaveBeenCalledOnce();
        expect(updateTodo).toHaveBeenCalledWith(
          mockFormData.id,
          mockFormData.name,
          mockFormData.categoryId,
          mockFormData.isComplete,
        );
        expect(result.current.data).toEqual(mockUpdatedTodo);
        expect(result.current.isPending).toBe(false);
      });
    });

    it("Should cause getAllTodos to be called on successful updateTodo", async () => {
      //arrange
      const mockUpdatedTodo: Todo = {
        id: 2,
        name: "Go for a 5km run",
        category: "Fitness",
        isComplete: false,
      };
      vi.mocked(updateTodo).mockResolvedValueOnce(mockUpdatedTodo);
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
      const mockUpdatedTodos: Todo[] = [
        {
          id: 1,
          name: "Fill the dishwasher",
          category: "Cleaning",
          isComplete: false,
        },
        {
          id: 2,
          name: "Go for a 5km run",
          category: "Fitness",
          isComplete: false,
        },
      ];
      vi.mocked(getAllTodos)
        .mockResolvedValueOnce(mockInitialTodos)
        .mockResolvedValueOnce(mockUpdatedTodos);

      const mockFormData = { id: 2, name: "Go for a 5km run", categoryId: 2 };

      const wrapper = createWrapper();

      const { result } = renderHook(
        () => ({
          query: useTodos(),
          mutation: useUpdateTodo(),
        }),
        { wrapper },
      );
      // act
      await waitFor(() => {
        expect(result.current.query.data).toEqual(mockInitialTodos);
      });
      expect(getAllTodos).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate(mockFormData);
      });
      // assert
      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(true);
        expect(updateTodo).toHaveBeenCalledOnce();
        expect(getAllTodos).toHaveBeenCalledTimes(2);
        expect(result.current.query.data).toEqual(mockUpdatedTodos);
      });
    });

    it("Should return isError when updateTodo errors", async () => {
      // arrange
      vi.mocked(updateTodo).mockRejectedValueOnce(
        new Error("Failed to update todo"),
      );
      const mockFormData = { id: 1, name: "Go to the gym", categoryId: 2 };
      const mockInitialTodos: Todo[] = [
        {
          id: 1,
          name: "Fill the dishwasher",
          category: "Cleaning",
          isComplete: false,
        },
      ];
      vi.mocked(getAllTodos).mockResolvedValueOnce(mockInitialTodos);

      const wrapper = createWrapper();

      const { result } = renderHook(
        () => ({
          query: useTodos(),
          mutation: useUpdateTodo(),
        }),
        { wrapper },
      );

      // act
      await waitFor(() => {
        expect(result.current.query.data).toEqual(mockInitialTodos);
      });
      expect(getAllTodos).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate(mockFormData);
      });
      // assert
      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(false);
        expect(result.current.mutation.isError).toBe(true);
        expect(result.current.mutation.error?.message).toBe(
          "Failed to update todo",
        );
        expect(updateTodo).toHaveBeenCalledOnce();
        expect(getAllTodos).toHaveBeenCalledOnce();
      });
    });
  });

  describe("useDeleteTodos", () => {
    it("Should return true on successful deleteTodos", async () => {
      //arrange
      vi.mocked(deleteTodo).mockResolvedValueOnce(true);
      // act
      const { result } = renderHook(() => useDeleteTodo(), {
        wrapper: createWrapper(),
      });
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      act(() => {
        result.current.mutate(1);
      });
      // assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(deleteTodo).toHaveBeenCalledOnce();
        expect(deleteTodo).toHaveBeenCalledWith(1);
        expect(result.current.data).toEqual(true);
        expect(result.current.isPending).toBe(false);
      });
    });

    it("Should cause getAllTodos to be called on successful delete", async () => {
      //arrange
      vi.mocked(deleteTodo).mockResolvedValueOnce(true);
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
      const mockUpdatedTodos: Todo[] = [
        {
          id: 1,
          name: "Fill the dishwasher",
          category: "Cleaning",
          isComplete: false,
        },
      ];
      vi.mocked(getAllTodos)
        .mockResolvedValueOnce(mockInitialTodos)
        .mockResolvedValueOnce(mockUpdatedTodos);

      const wrapper = createWrapper();

      const { result } = renderHook(
        () => ({
          query: useTodos(),
          mutation: useDeleteTodo(),
        }),
        { wrapper },
      );
      // act
      await waitFor(() => {
        expect(result.current.query.data).toEqual(mockInitialTodos);
      });
      expect(getAllTodos).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate(2);
      });
      // assert
      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(true);
        expect(deleteTodo).toHaveBeenCalledOnce();
        expect(getAllTodos).toHaveBeenCalledTimes(2);
        expect(result.current.query.data).toEqual(mockUpdatedTodos);
      });
    });

    it("Should return isError when deleteTodo errors", async () => {
      // arrange
      vi.mocked(deleteTodo).mockRejectedValueOnce(
        new Error("Failed to delete todo"),
      );
      const mockInitialTodos: Todo[] = [
        {
          id: 1,
          name: "Fill the dishwasher",
          category: "Cleaning",
          isComplete: false,
        },
      ];
      vi.mocked(getAllTodos).mockResolvedValueOnce(mockInitialTodos);

      const wrapper = createWrapper();

      const { result } = renderHook(
        () => ({
          query: useTodos(),
          mutation: useDeleteTodo(),
        }),
        { wrapper },
      );

      // act
      await waitFor(() => {
        expect(result.current.query.data).toEqual(mockInitialTodos);
      });
      expect(getAllTodos).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate(10);
      });
      // assert
      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(false);
        expect(result.current.mutation.isError).toBe(true);
        expect(result.current.mutation.error?.message).toBe(
          "Failed to delete todo",
        );
        expect(deleteTodo).toHaveBeenCalledOnce();
        expect(getAllTodos).toHaveBeenCalledOnce();
      });
    });
  });
});
