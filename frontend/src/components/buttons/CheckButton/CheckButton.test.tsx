import { render, screen } from "@testing-library/react";
import CheckButton from "./CheckButton";
import userEvent from "@testing-library/user-event";

describe("CheckButton", () => {
  const mockToggleComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should render with prop value", () => {
    // arrange
    render(
      <CheckButton isComplete={true} toggleComplete={mockToggleComplete} />,
    );
    // act
    const btn = screen.getByRole("button");
    // assert
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAccessibleName("Mark as incomplete");
  });

  it("Should render with false isComplete value", () => {
    // arrange
    render(
      <CheckButton isComplete={false} toggleComplete={mockToggleComplete} />,
    );
    // act
    const btn = screen.getByRole("button");
    // assert
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAccessibleName("Mark as complete");
  });

  it("Should call toggleComplete when clicked", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <CheckButton isComplete={true} toggleComplete={mockToggleComplete} />,
    );
    // act
    const btn = screen.getByRole("button");
    await user.click(btn);
    // assert
    expect(mockToggleComplete).toHaveBeenCalledOnce();
  });
});
