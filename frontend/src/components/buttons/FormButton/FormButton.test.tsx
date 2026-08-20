import { render, screen } from "@testing-library/react";
import FormButton from "./FormButton";
import classes from "./FormButton.module.scss";

describe("FormButton", () => {
  it("Should render itself with children", () => {
    // arrange
    render(
      <FormButton>
        <span>Child</span>
      </FormButton>,
    );
    // act
    const child = screen.getByText("Child");
    const btn = screen.getByRole("button");
    // assert
    expect(child).toBeInTheDocument();
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAccessibleName("Submit");
  });

  it("Should pass updated props to the class", () => {
    // arrange
    render(
      <FormButton isRounded={true} isSelected={true}>
        <span>Child</span>
      </FormButton>,
    );
    // act
    const btn = screen.getByRole("button");
    // assert
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAccessibleName("Submit");
    expect(btn).toHaveClass(classes.rounded);
    expect(btn).toHaveClass(classes.selected);
  });
});
