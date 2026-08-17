import { render, screen } from "@testing-library/react";
import TodoBar from "./TodoBar";

describe("TodoBar", () => {
  it("Should render", () => {
    // arrange
    render(<TodoBar />);
    // act
    const bar = screen.getByTestId("todoBar");
    // assert
    expect(bar).toBeInTheDocument();
  });
});
