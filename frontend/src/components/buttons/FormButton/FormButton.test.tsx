import { render, screen } from "@testing-library/react";
import FormButton from "./FormButton";

describe("FormButton", () => {
  it("Should render itself with children", () => {
    // arrange
    render(
      <FormButton>
        <h1>Header</h1>
      </FormButton>,
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
