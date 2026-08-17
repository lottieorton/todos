import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IconButton from "./IconButton";

describe("IconButton", () => {
  const mockHandleClick = vi.fn();

  it("Should render", () => {
    // arrange
    render(
      <IconButton color="green" handleClick={mockHandleClick}>
        Icon
      </IconButton>,
    );
    // act
    const btn = screen.getByRole("button");
    // assert
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAccessibleName("Icon");
  });

  it("Should call toggleComplete when clicked", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <IconButton color="green" handleClick={mockHandleClick}>
        Icon
      </IconButton>,
    );
    // act
    const btn = screen.getByRole("button");
    await user.click(btn);
    // assert
    expect(mockHandleClick).toHaveBeenCalledOnce();
  });
});
