import { render, screen } from "@testing-library/react";
import Todo from "./Todo";
import userEvent from "@testing-library/user-event";

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

describe("Todo", () => {
  it("Should render with passed in props", () => {
    // arrange
    const todoProps = {
      id: 1,
      name: "Read",
      category: "Hobbies",
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

  it("Should complete the todo when check button clicked", async () => {
    // arrange
    const user = userEvent.setup();
    const todoProps = {
      id: 1,
      name: "Read",
      category: "Hobbies",
    };
    render(<Todo todo={todoProps} />);
    // act
    const checkBtn = screen.getByTestId("check-btn");
    expect(checkBtn).toHaveTextContent("Checked false");
    await user.click(checkBtn);
    // assert
    expect(checkBtn).toHaveTextContent("Checked true");
  });

  it("Should toggle the todo status when check button clicked twice", async () => {
    // arrange
    const user = userEvent.setup();
    const todoProps = {
      id: 1,
      name: "Read",
      category: "Hobbies",
    };
    render(<Todo todo={todoProps} />);
    // act
    const checkBtn = screen.getByTestId("check-btn");
    expect(checkBtn).toHaveTextContent("Checked false");
    await user.click(checkBtn);
    expect(checkBtn).toHaveTextContent("Checked true");
    await user.click(checkBtn);
    // assert
    expect(checkBtn).toHaveTextContent("Checked false");
  });

  it("Should load the edit todo form when edit button clicked", async () => {
    // arrange
    const user = userEvent.setup();
    const todoProps = {
      id: 1,
      name: "Read",
      category: "Hobbies",
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
});
