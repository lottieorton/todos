import { render, screen } from "@testing-library/react";
import MainLayout from "./MainLayout";
import { useTodos } from "../../hooks/useTodos";
import { useCategoryContext } from "../../context/CategoryContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("../../hooks/useTodos", () => ({
  useTodos: vi.fn(),
  useCreateTodo: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  })),
  useUpdateTodo: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  })),
  useDeleteTodo: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  })),
}));

vi.mock("../../context/CategoryContext", () => ({
  useCategoryContext: vi.fn(),
}));

vi.mock("../TodoList/TodoList", () => ({
  default: vi.fn(({ todos }) => {
    return (
      <div data-testid="todo-list">
        <div data-testid="todos">{todos[0]?.name}</div>
        <div data-testid="fileredTodosLength">{todos.length}</div>
      </div>
    );
  }),
}));

vi.mock("../CategoryList/CategoryList", () => ({
  default: vi.fn(({ categoryId, handleFilter, todos }) => {
    return (
      <>
        <button data-testid="category-list" onClick={() => handleFilter(1)}>
          {`Filter: ${categoryId}`}
        </button>
        <div data-testid="todosCatList">{todos[0]?.name}</div>
        <div data-testid="todosCatListLength">{todos.length}</div>
      </>
    );
  }),
}));

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

describe("MainLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCategoryContext).mockReturnValue({
      categories: [{ id: 1, name: "Cleaning" }],
      isCategoriesLoading: false,
      isCategoriesError: false,
      categoriesError: null,
    });

    vi.mocked(useTodos).mockImplementation((categoryId?: number) => {
      if (categoryId === undefined) {
        return {
          data: [
            { id: 1, name: "Hoover", category: "Cleaning" },
            { id: 2, name: "Run a 5km", category: "Fitness" },
          ],
          isLoading: false,
          isError: false,
        } as any;
      }

      return {
        data: [{ id: 1, name: "Hoover", category: "Cleaning" }],
        isLoading: false,
        isError: false,
      } as any;
    });
  });

  it("Should render key sections when data loads successfully", async () => {
    // arrange
    renderWithQueryClient(<MainLayout />);
    // act
    const sidebarHeader = screen.getByRole("heading", { level: 2 });
    const header = screen.getByRole("heading", { level: 1 });
    const sidebarBackground = screen.getByTestId("sidebarBackground");
    const todoElements = screen.getAllByText("Hoover");
    // assert
    expect(sidebarHeader).toHaveTextContent("Task By Task");
    expect(header).toHaveTextContent("My Tasks List");
    expect(sidebarBackground).toBeInTheDocument();
    expect(todoElements).toHaveLength(2);
  });

  it("Should render error message when there is an error fetching all for the database", async () => {
    // arrange
    vi.mocked(useTodos).mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
    } as any);
    renderWithQueryClient(<MainLayout />);
    // act
    const errorMessage = screen.getByText(
      "Something went wrong. Please try again!",
    );
    // assert
    expect(errorMessage).toBeInTheDocument();
    expect(screen.queryByTestId("todo-list")).not.toBeInTheDocument();
  });

  it("Should render loading message when todos data is loading", () => {
    // arrange
    vi.mocked(useTodos).mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    } as any);
    renderWithQueryClient(<MainLayout />);
    const loadingMessage = screen.getByText("Loading...");
    // act
    expect(loadingMessage).toBeInTheDocument();
    expect(screen.queryByTestId("todo-list")).not.toBeInTheDocument();
  });
});
