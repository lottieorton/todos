import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("Should render nested component", async () => {
    // arrange
    render(<App />);
    // act
    const sidebarHeader = screen.getByRole("heading", { level: 2 });
    const header = screen.getByRole("heading", { level: 1 });
    const categoryForm = screen.getByPlaceholderText("Add a category...");
    const addTodo = await screen.findByTestId("add-todo");
    const editCategory = await screen.findByTestId("edit-category");
    const todoList = screen.getByTestId("todoList");
    const sidebarBackground = screen.getByTestId("sidebarBackground");
    // assert
    expect(sidebarHeader).toHaveTextContent("Task By Task");
    expect(header).toHaveTextContent("My Tasks List");
    expect(categoryForm).toBeInTheDocument();
    expect(addTodo).toBeInTheDocument();
    expect(editCategory).toBeInTheDocument();
    expect(todoList).toBeInTheDocument();
    expect(sidebarBackground).toBeInTheDocument();
  });
});
