import { render, screen } from "@testing-library/react";
import type { Todo } from "../../interfaces/Todo";
import TodoList from "./TodoList";

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
    vi.clearAllMocks();
  });

  const mockTodos: Todo[] = [
    { id: 1, name: "Fill the dishwasher", category: "Cleaning" },
    { id: 2, name: "Go to the gym", category: "Fitness" },
  ];

  it("Should render list of Todos passing prop value to useTodos", () => {
    // arrange
    render(<TodoList todos={mockTodos} isLoading={false} />);
    // act
    const todo1 = screen.getByTestId("todo-item-1");
    const todo2 = screen.getByTestId("todo-item-2");
    // assert
    expect(todo1).toHaveTextContent("Fill the dishwasher, Cleaning");
    expect(todo2).toHaveTextContent("Go to the gym, Fitness");
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("Should render loading message while isLoading prop true", () => {
    // arrange
    render(<TodoList todos={mockTodos} isLoading={true} />);
    // act
    const loadingMsg = screen.getByText("Loading...");
    // assert
    expect(loadingMsg).toBeInTheDocument();
    expect(screen.queryByTestId("todo-item-1")).not.toBeInTheDocument();
  });
});
