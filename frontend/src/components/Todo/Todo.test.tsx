import { render, screen } from "@testing-library/react";
import Todo from "./Todo";

vi.mock("../buttons/CheckButton/CheckButton", () => {
  return {
    default: vi.fn(() => {
      return <button data-testid="add-btn" type="submit"></button>;
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
    const btn = screen.getByRole("button");
    const name = screen.getByRole("heading", { level: 3 });
    const category = screen.getByRole("heading", { level: 4 });
    const icon = screen.getByLabelText("category");
    // assert
    expect(btn).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(name).toHaveTextContent("Read");
    expect(category).toBeInTheDocument();
    expect(category).toHaveTextContent("HOBBIES");
    expect(icon).toBeInTheDocument();
  });
});
