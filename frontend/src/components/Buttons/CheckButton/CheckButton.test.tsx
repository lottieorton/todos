import { render, screen } from "@testing-library/react";
import CheckButton from "./CheckButton";

describe("CheckButton", () => {
  it("Should render", () => {
    // arrange
    render(<CheckButton />);
    // act
    const btn = screen.getByRole("button");
    // assert
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAccessibleName("Check");
  });
});
