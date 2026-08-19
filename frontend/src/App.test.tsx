import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { getAllCategories } from "./services/categories-service";
import { getAllTodos } from "./services/todos-service";

vi.mock("./services/categories-service", () => ({
  getAllCategories: vi.fn(),
}));

vi.mock("./services/todos-service", () => ({
  getAllTodos: vi.fn(),
}));

describe("App", () => {
  it("Should render Main layout", async () => {
    // arrange
    vi.mocked(getAllCategories).mockResolvedValueOnce([]);
    vi.mocked(getAllTodos).mockResolvedValueOnce([]);
    // act
    render(<App />);
    // assert
    await waitFor(() => {
      expect(screen.getByRole("main")).toBeInTheDocument();
    });
  });
});
