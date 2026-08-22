import { render, screen } from "@testing-library/react";
import GlobalMessage from "./GlobalMessage";
import classes from "./GlobalMessage.module.scss";

const MockChild = () => {
  return <div>Child</div>;
};

describe("GlobalMessage", () => {
  it("Should render message prop and child component", () => {
    // arrange
    const { container } = render(
      <GlobalMessage msg="Global message" type="error">
        <MockChild />
      </GlobalMessage>,
    );
    // act
    const section = container.querySelector("section");
    const child = screen.getByText("Child");
    const msg = screen.getByText("Global message");
    // assert
    expect(child).toBeInTheDocument();
    expect(msg).toBeInTheDocument();
    expect(section).toHaveClass(classes["globalMsg-error"]);
  });

  it("Should render loading type message", () => {
    // arrange
    const { container } = render(
      <GlobalMessage msg="Global message" type="loading">
        <MockChild />
      </GlobalMessage>,
    );
    // act
    const section = container.querySelector("section");
    // assert
    expect(section).toHaveClass(classes["globalMsg-loading"]);
  });
});
