import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IconButton from "./IconButton";
import classes from "./IconButton.module.scss";

describe("IconButton", () => {
  const mockHandleClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should render with children", () => {
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

  it("Should apply the correct color class based on the prop", () => {
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
    expect(btn).toHaveClass(classes["iconBtn--green"]);
  });

  it("Should call handleClick when clicked", async () => {
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
