import { render, screen } from "@testing-library/react";
import AddButton from "./FormButton";

describe("FormButton", () => {
  it("Should render itself with children", () => {
    // arrange
    render(
      <AddButton>
        <h1>Header</h1>
      </AddButton>,
    );
    // act
    const header = screen.getByRole("heading", { level: 1 });
    const btn = screen.getByRole("button");
    // assert
    expect(header).toBeInTheDocument();
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAccessibleName("Submit");
  });
});
