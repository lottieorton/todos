import { render, screen } from "@testing-library/react";
import ErrorMessage from "./ErrorMessage";

describe("ErrorMessage", () => {
  it("Should render exact message when missing a category", () => {
    // arrange
    render(<ErrorMessage msg="Must select a category" />);
    // act
    const msg = screen.getByText("Must select a category");
    // assert
    expect(msg).toBeInTheDocument();
  });

  it("Should render exact message when no name value entered", () => {
    // arrange
    render(<ErrorMessage msg="Must enter a name" />);
    // act
    const msg = screen.getByText("Must enter a name");
    // assert
    expect(msg).toBeInTheDocument();
  });

  it("Should render exact message when category limit is reached", () => {
    // arrange
    render(<ErrorMessage msg="Maximum category limit reached" />);
    // act
    const msg = screen.getByText("Maximum category limit reached");
    // assert
    expect(msg).toBeInTheDocument();
  });

  it("Should render invalid values message for Bad Requests", () => {
    // arrange
    render(<ErrorMessage msg="Bad Request" />);
    // act
    const msg = screen.getByText(
      "Invalid values. Ensure name is not empty and a category is selected.",
    );
    // assert
    expect(msg).toBeInTheDocument();
  });

  it("Should render default message for other messages", () => {
    // arrange
    render(<ErrorMessage msg="A random error" />);
    // act
    const msg = screen.getByText(
      "Oops, something went wrong. Please try reloading the page.",
    );
    // assert
    expect(msg).toBeInTheDocument();
  });
});
