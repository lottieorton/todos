import { render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";

vi.mock("./components/TodoList/TodoList", () => ({
  default: vi.fn(({ categoryId }) => {
    return <div data-testid="todo-list">{categoryId}</div>;
  }),
}));

vi.mock("./components/CategoryList/CategoryList", () => ({
  default: vi.fn(({ categoryId, handleFilter }) => {
    return (
      <button data-testid="category-list" onClick={() => handleFilter(1)}>
        {`Filter: ${categoryId}`}
      </button>
    );
  }),
}));

describe("App", () => {
  it("Should render nested component passing state", async () => {
    // arrange
    render(<App />);
    // act
    const sidebarHeader = screen.getByRole("heading", { level: 2 });
    const header = screen.getByRole("heading", { level: 1 });
    const categoryForm = screen.getByPlaceholderText("Add a category...");
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
    expect(todoList).toBeInTheDocument();
    expect(todoList).toHaveTextContent("");
    expect(sidebarBackground).toBeInTheDocument();
  });

  it("Should pass updated state when setter is called in category list", async () => {
    const user = userEvent.setup();
    // arrange
    render(<App />);
    // act
    const todoList = screen.getByTestId("todo-list");
    const categoryListBtn = screen.getByTestId("category-list");
    const categoryList = screen.getByTestId("category-list");
    await user.click(categoryListBtn);
    // assert
    expect(todoList).toHaveTextContent("1");
    expect(categoryList).toHaveTextContent("1");
  });
});
