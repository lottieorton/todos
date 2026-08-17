import { render, screen } from "@testing-library/react";
import Header from "./Header";

vi.mock("../TodoBar/TodoBar", () => {
  return {
    default: vi.fn(() => <div data-testid="todoBar"></div>),
  };
});

describe("Header", () => {
  it("Should render", () => {
    // arrange
    render(<Header />);
    // act
    const header = screen.getByRole("heading", { level: 1 });
    const subheader = screen.getByRole("heading", { level: 3 });
    const todoBar = screen.getByTestId("todoBar");
    // assert
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("My Tasks List");
    expect(subheader).toBeInTheDocument();
    expect(subheader).toHaveTextContent("Make your life beautifully organised");
    expect(todoBar).toBeInTheDocument();
  });
});
