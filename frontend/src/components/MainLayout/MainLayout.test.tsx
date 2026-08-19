import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MainLayout from "./MainLayout";
import { useTodos } from "../../hooks/useTodos";
import { useCategoryContext } from "../../context/CategoryContext";

vi.mock("../../hooks/useTodos", () => ({
  useTodos: vi.fn(),
}));

vi.mock("../../context/CategoryContext", () => ({
  useCategoryContext: vi.fn(),
}));

vi.mock("../CategoryForm/CategoryForm", () => ({
  default: vi.fn(() => {
    return <div data-testid="category-form"></div>;
  }),
}));

vi.mock("../AddTodo/AddTodo", () => ({
  default: vi.fn(() => {
    return <div data-testid="add-todo"></div>;
  }),
}));
vi.mock("../EditCategory/EditCategory", () => ({
  default: vi.fn(() => {
    return <div data-testid="edit-category"></div>;
  }),
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

vi.mock("../GlobalMessage/GlobalMessage", () => ({
  default: vi.fn(({ type, msg }) => {
    return <div data-testid="global-msg">{`${type} - ${msg}`}</div>;
  }),
}));

describe("MainLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCategoryContext).mockReturnValue({
      categories: [{ id: 1, name: "Cleaning" }],
      isCategoriesLoading: false,
      isCategoriesError: false,
      categoriesError: new Error("Failed to load categories"),
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

  it("Should render nested component passing state", async () => {
    // arrange
    render(<MainLayout />);
    // act
    const sidebarHeader = screen.getByRole("heading", { level: 2 });
    const header = screen.getByRole("heading", { level: 1 });
    const categoryForm = screen.getByTestId("category-form");
    const addTodo = await screen.findByTestId("add-todo");
    const editCategory = await screen.findByTestId("edit-category");
    const categoryList = screen.getByTestId("category-list");
    const todoList = screen.getByTestId("todo-list");
    const sidebarBackground = screen.getByTestId("sidebarBackground");
    // assert
    expect(sidebarHeader).toHaveTextContent("Task By Task");
    expect(header).toHaveTextContent("My Tasks List");
    expect(categoryForm).toBeInTheDocument();
    expect(addTodo).toBeInTheDocument();
    expect(editCategory).toBeInTheDocument();
    expect(categoryList).toBeInTheDocument();
    expect(categoryList).toHaveTextContent("Filter: ");
    expect(screen.getByTestId("todosCatList")).toHaveTextContent("Hoover");
    expect(screen.getByTestId("todosCatListLength")).toHaveTextContent("2");
    expect(todoList).toBeInTheDocument();
    expect(screen.getByTestId("fileredTodosLength")).toHaveTextContent("2");
    expect(todoList.children[0]).toHaveTextContent("Hoover");
    expect(sidebarBackground).toBeInTheDocument();
  });

  it("Should pass updated state when setter is called in category list", async () => {
    const user = userEvent.setup();
    // arrange
    render(<MainLayout />);
    // act
    const categoryListBtn = screen.getByTestId("category-list");
    const categoryList = screen.getByTestId("category-list");
    expect(categoryList).toHaveTextContent("Filter: undefined");

    await user.click(categoryListBtn);
    // assert
    expect(categoryList).toHaveTextContent("Filter: 1");
    expect(screen.getByTestId("todosCatListLength")).toHaveTextContent("2");
    expect(screen.getByTestId("fileredTodosLength")).toHaveTextContent("1");
  });

  it("Should render error message when there is an error in fetching all from the database", async () => {
    // arrange
    vi.mocked(useTodos).mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
    } as any);
    render(<MainLayout />);
    // act
    const sidebarHeader = screen.getByRole("heading", { level: 2 });
    const header = screen.getByRole("heading", { level: 1 });
    const errorMessage = screen.getByTestId("global-msg");
    // assert
    expect(sidebarHeader).toHaveTextContent("Task By Task");
    expect(header).toHaveTextContent("My Tasks List");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(
      "error - Something went wrong. Please try again!",
    );
    expect(screen.queryByTestId("add-todo")).not.toBeInTheDocument();
  });

  it("Should render loading message when todos data is loading", async () => {
    // arrange
    vi.mocked(useTodos).mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    } as any);
    render(<MainLayout />);
    // act
    const sidebarHeader = screen.getByRole("heading", { level: 2 });
    const header = screen.getByRole("heading", { level: 1 });
    const loadingMessage = screen.getByTestId("global-msg");
    // assert
    expect(sidebarHeader).toHaveTextContent("Task By Task");
    expect(header).toHaveTextContent("My Tasks List");
    expect(loadingMessage).toBeInTheDocument();
    expect(loadingMessage).toHaveTextContent("loading - Loading...");
    expect(screen.queryByTestId("todo-list")).not.toBeInTheDocument();
  });
});
