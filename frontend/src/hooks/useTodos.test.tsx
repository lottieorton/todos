import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { Todo } from "../interfaces/Todo";
import { createTodo, getAllTodos } from "../services/todos-service";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useCreateTodo, useTodos } from "./useTodos";

vi.mock("../services/todos-service", () => ({
  getAllTodos: vi.fn(),
  createTodo: vi.fn(),
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
        { id: 1, name: "Fill the dishwasher", category: "Cleaning" },
        { id: 2, name: "Go to the gym", category: "Fitness" },
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
      };
      vi.mocked(createTodo).mockResolvedValueOnce(mockTodo);
      const mockInitialTodos: Todo[] = [
        { id: 1, name: "Fill the dishwasher", category: "Cleaning" },
      ];
      const mockUpdatedTodos: Todo[] = [
        { id: 1, name: "Fill the dishwasher", category: "Cleaning" },
        { id: 2, name: "Go to the gym", category: "Fitness" },
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
        { id: 1, name: "Fill the dishwasher", category: "Cleaning" },
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
});
