import { render, screen } from "@testing-library/react";
import GlobalMessage from "./GlobalMessage";

const MockChild = () => {
  return <div>Child</div>;
};

describe("GlobalMessage", () => {
  it("Should render message prop and child component", () => {
    // arrange
    render(
      <GlobalMessage msg="Global message" type="error">
        <MockChild />
      </GlobalMessage>,
    );
    // act
    const child = screen.getByText("Child");
    const msg = screen.getByText("Global message");
    // assert
    expect(child).toBeInTheDocument();
    expect(msg).toBeInTheDocument();
  });
});
