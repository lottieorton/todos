import { render, screen } from "@testing-library/react";
import CheckButton from "./CheckButton";
import userEvent from "@testing-library/user-event";

describe("CheckButton", () => {
  const mockToggleComplete = vi.fn();

  it("Should render", () => {
    // arrange
    render(
      <CheckButton isComplete={true} toggleComplete={mockToggleComplete} />,
    );
    // act
    const btn = screen.getByRole("button");
    // assert
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAccessibleName("Check");
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
