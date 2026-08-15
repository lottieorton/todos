import { render, screen } from "@testing-library/react";
import SidebarHeader from "./SidebarHeader";

vi.mock("../TodoBar/TodoBar", () => {
  return {
    default: vi.fn(() => {
      return <div data-testid="todoBar"></div>;
    }),
  };
});

describe("SidebarHeader", () => {
  it("Should render", () => {
    // arrange
    render(<SidebarHeader />);
    // act
    const heading = screen.getByRole("heading", { level: 2 });
    const icon = screen.getByTestId("checklistIcon");
    // assert
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Task By Task");
    expect(icon).toBeInTheDocument();
  });
});
