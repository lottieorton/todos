import { render, screen } from "@testing-library/react";
import LargeButton from "./LargeButton";
import classes from "./LargeButton.module.scss";
import userEvent from "@testing-library/user-event";

describe("LargeButton", () => {
  const mockHandleClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should render itself with children", () => {
    // arrange
    render(
      <LargeButton handleClick={mockHandleClick}>
        <span>Child text</span>
      </LargeButton>,
    );
    // act
    const child = screen.getByText("Child text");
    const btn = screen.getByRole("button");
    // assert
    expect(child).toBeInTheDocument();
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAccessibleName("filter");
  });

  it("Should call handleClick prop when clicked", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <LargeButton handleClick={mockHandleClick}>
        <span>Child text</span>
      </LargeButton>,
    );
    // act
    const btn = screen.getByRole("button");
    await user.click(btn);
    // assert
    expect(mockHandleClick).toHaveBeenCalledOnce();
  });

  it("Should apply the selected class based on the prop", () => {
    // arrange
    render(
      <LargeButton isSelected={true} handleClick={mockHandleClick}>
        <span>Child text</span>
      </LargeButton>,
    );
    // act
    const btn = screen.getByRole("button");
    // assert
    expect(btn).toHaveClass(classes.selected);
  });
});
