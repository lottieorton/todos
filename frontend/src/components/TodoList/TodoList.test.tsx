import { render, screen } from "@testing-library/react";
import { useTodos } from "../../hooks/useTodos";
import type { Todo } from "../../interfaces/Todo";
import TodoList from "./TodoList";

vi.mock("../../hooks/useTodos", () => ({
  useTodos: vi.fn(),
}));

vi.mock("../Todo/Todo", () => {
  return {
    default: vi.fn(({ todo }: { todo: Todo }) => {
      return (
        <div data-testid={`todo-item-${todo.id}`}>
          {todo.name}, {todo.category}
        </div>
      );
    }),
  };
});

describe("TodoList", () => {
  beforeEach(() => {
    const mockTodos: Todo[] = [
      { id: 1, name: "Fill the dishwasher", category: "Cleaning" },
      { id: 2, name: "Go to the gym", category: "Fitness" },
    ];

    vi.mocked(useTodos).mockReturnValue({
      data: mockTodos,
      isLoading: false,
      isError: false,
      error: null,
    } as any);
  });

  it("Should render list of Todos", () => {
    // arrange
    render(<TodoList />);
    // act
    const todo1 = screen.getByTestId("todo-item-1");
    const todo2 = screen.getByTestId("todo-item-2");
    // assert
    expect(todo1).toHaveTextContent("Fill the dishwasher, Cleaning");
    expect(todo2).toHaveTextContent("Go to the gym, Fitness");
  });

  it("Should render loading message while fetching todos", () => {
    // arrange
    vi.mocked(useTodos).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    } as any);
    render(<TodoList />);
    // act
    const loadingMessage = screen.getByText("Loading...");
    // assert
    expect(loadingMessage).toBeInTheDocument();
  });

  it("Should render error message if error with fetching todos", () => {
    // arrange
    vi.mocked(useTodos).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error("Failed to fetch todos"),
    } as any);
    render(<TodoList />);
    // act
    const errorMessage = screen.getByText("Failed to fetch todos");
    // assert
    expect(errorMessage).toBeInTheDocument();
  });
});
