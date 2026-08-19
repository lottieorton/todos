import { render, screen } from "@testing-library/react";
import LargeButton from "./LargeButton";

describe("FormButton", () => {
  it("Should render itself with children", () => {
    // arrange
    render(
      <LargeButton>
        <h1>Child text</h1>
      </LargeButton>,
    );
    // act
    const header = screen.getByRole("heading", { level: 1 });
    const btn = screen.getByRole("button");
    // assert
    expect(header).toBeInTheDocument();
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAccessibleName("filter");
  });
});
