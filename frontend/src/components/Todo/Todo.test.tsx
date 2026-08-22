import { render, screen } from "@testing-library/react";
import Todo from "./Todo";
import userEvent from "@testing-library/user-event";
import { useDeleteTodo, useUpdateTodo } from "../../hooks/useTodos";

vi.mock("../../hooks/useTodos", () => ({
  useUpdateTodo: vi.fn(),
  useDeleteTodo: vi.fn(),
}));

vi.mock("../buttons/CheckButton/CheckButton", () => {
  return {
    default: vi.fn(({ isComplete, toggleComplete }) => {
      return (
        <button data-testid="check-btn" type="submit" onClick={toggleComplete}>
          {"Checked " + isComplete}
        </button>
      );
    }),
  };
});

vi.mock("../buttons/IconButton/IconButton", () => {
  return {
    default: vi.fn(({ color, handleClick }) => {
      return (
        <button
          data-testid={`icon-btn-${color}`}
          onClick={handleClick}
        ></button>
      );
    }),
  };
});

vi.mock("../EditTodo/EditTodo", () => {
  return {
    default: vi.fn(({ id, toggleIsEditing }) => {
      return (
        <button data-testid="editTodo" onClick={toggleIsEditing}>
          {id}
        </button>
      );
    }),
  };
});

vi.mock("../ErrorMessage/ErrorMessage", () => {
  return {
    default: vi.fn(({ msg }) => {
      return <div data-testid="errorMsg">{msg}</div>;
    }),
  };
});

describe("Todo", () => {
  const mockUpdateMutate = vi.fn();

  const mockDeleteMutate = vi.fn(
    (_data: unknown, options: { onSuccess: () => void }) => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
  );

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useUpdateTodo).mockReturnValue({
      mutate: mockUpdateMutate,
      isError: false,
      error: null,
      isPending: false,
    } as any);

    vi.mocked(useDeleteTodo).mockReturnValue({
      mutate: mockDeleteMutate,
      isError: false,
      error: null,
      isPending: false,
    } as any);
  });

  it("Should render with passed in props", () => {
    // arrange
    const todoProps = {
      id: 1,
      name: "Read",
      category: "Hobbies",
      isComplete: false,
    };
    render(<Todo todo={todoProps} />);
    // act
    const checkBtn = screen.getByTestId("check-btn");
    const name = screen.getByRole("heading", { level: 3 });
    const category = screen.getByRole("heading", { level: 4 });
    const categoryIcon = screen.getByLabelText("category");
    const editBtn = screen.getByTestId("icon-btn-green");
    const deleteBtn = screen.getByTestId("icon-btn-red");
    const editForm = screen.queryByTestId("editTodo");
    // assert
    expect(checkBtn).toBeInTheDocument();
    expect(checkBtn).toHaveTextContent("Checked false");
    expect(name).toBeInTheDocument();
    expect(name).toHaveTextContent("Read");
    expect(category).toBeInTheDocument();
    expect(category).toHaveTextContent("HOBBIES");
    expect(categoryIcon).toBeInTheDocument();
    expect(editBtn).toBeInTheDocument();
    expect(deleteBtn).toBeInTheDocument();
    expect(editForm).not.toBeInTheDocument();
  });

  it("Should call updateTodo when check button clicked", async () => {
    // arrange
    const user = userEvent.setup();
    const todoProps = {
      id: 1,
      name: "Read",
      category: "Hobbies",
      isComplete: false,
    };
    render(<Todo todo={todoProps} />);
    // act
    const checkBtn = screen.getByTestId("check-btn");
    expect(checkBtn).toHaveTextContent("Checked false");
    await user.click(checkBtn);
    // assert
    expect(mockUpdateMutate).toHaveBeenCalledOnce();
    expect(mockUpdateMutate).toHaveBeenCalledWith({ id: 1, isComplete: true });
  });

  it("Should render errorMessage when updateTodo errors after click", async () => {
    // arrange
    vi.mocked(useUpdateTodo).mockReturnValue({
      mutate: mockUpdateMutate,
      isError: true,
      error: new Error("Failed to delete todo"),
      isPending: false,
    } as any);
    const user = userEvent.setup();
    const todoProps = {
      id: 1,
      name: "Read",
      category: "Hobbies",
      isComplete: false,
    };
    const { rerender } = render(<Todo todo={todoProps} />);
    // act
    const checkBtn = screen.getByTestId("check-btn");
    expect(checkBtn).toHaveTextContent("Checked false");
    await user.click(checkBtn);
    rerender(<Todo todo={todoProps} />);
    // assert
    expect(mockUpdateMutate).toHaveBeenCalledOnce();
    expect(mockUpdateMutate).toHaveBeenCalledWith({ id: 1, isComplete: true });
    expect(screen.getByText("Failed to delete todo")).toBeInTheDocument();
  });

  it("Should load the edit todo form when edit button clicked", async () => {
    // arrange
    const user = userEvent.setup();
    const todoProps = {
      id: 1,
      name: "Read",
      category: "Hobbies",
      isComplete: false,
    };
    render(<Todo todo={todoProps} />);
    // act
    const editBtn = screen.getByTestId("icon-btn-green");
    const editForm = screen.queryByTestId("editTodo");
    expect(editForm).not.toBeInTheDocument();
    await user.click(editBtn);
    // assert
    expect(screen.queryByTestId("editTodo")).toBeInTheDocument();
    expect(screen.queryByTestId("editTodo")).toHaveTextContent("1");
  });

  it("Should toggle the edit todo form when edit button clicked", async () => {
    // arrange
    const user = userEvent.setup();
    const todoProps = {
      id: 1,
      name: "Read",
      category: "Hobbies",
      isComplete: false,
    };
    render(<Todo todo={todoProps} />);
    // act
    const editBtn = screen.getByTestId("icon-btn-green");
    await user.click(editBtn);
    const editForm = screen.queryByTestId("editTodo");
    expect(editForm).toBeInTheDocument();
    await user.click(editBtn);
    // assert
    expect(editForm).not.toBeInTheDocument();
  });

  it("Should hide the edit todo form when it toggles editing status", async () => {
    // arrange
    const user = userEvent.setup();
    const todoProps = {
      id: 1,
      name: "Read",
      category: "Hobbies",
      isComplete: false,
    };
    render(<Todo todo={todoProps} />);
    // act
    const editBtn = screen.getByTestId("icon-btn-green");
    expect(screen.queryByTestId("editTodo")).not.toBeInTheDocument();
    await user.click(editBtn);
    const editForm = screen.getByTestId("editTodo");
    expect(editForm).toBeInTheDocument();
    await user.click(editForm);
    // assert
    expect(editForm).not.toBeInTheDocument();
  });

  it("Should call deleteTodo when the delete button is clicked", async () => {
    // arrange
    const user = userEvent.setup();
    const todoProps = {
      id: 1,
      name: "Read",
      category: "Hobbies",
      isComplete: false,
    };
    render(<Todo todo={todoProps} />);
    // act
    const deleteBtn = screen.getByTestId("icon-btn-red");
    await user.click(deleteBtn);
    // assert
    expect(mockDeleteMutate).toHaveBeenCalledOnce();
    expect(mockDeleteMutate).toHaveBeenCalledWith(1);
  });

  it("Should render error message when deleting todo errors", async () => {
    // arrange
    vi.mocked(useDeleteTodo).mockReturnValue({
      mutate: mockDeleteMutate,
      isError: true,
      error: new Error("Failed to delete todo"),
      isPending: false,
    } as any);
    const user = userEvent.setup();
    const todoProps = {
      id: 1,
      name: "Read",
      category: "Hobbies",
      isComplete: false,
    };
    const { rerender } = render(<Todo todo={todoProps} />);
    // act
    const deleteBtn = screen.getByTestId("icon-btn-red");
    await user.click(deleteBtn);
    rerender(<Todo todo={todoProps} />);
    // assert
    expect(mockDeleteMutate).toHaveBeenCalledOnce();
    expect(mockDeleteMutate).toHaveBeenCalledWith(1);
    expect(screen.getByText("Failed to delete todo")).toBeInTheDocument();
  });
});
