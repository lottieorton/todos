import { render, screen } from "@testing-library/react";
import { useCategories } from "../hooks/useCategories";
import { CategoryProvider, useCategoryContext } from "./CategoryContext";

vi.mock("../hooks/useCategories", () => ({
  useCategories: vi.fn(),
}));

const MockChild = () => {
  const {
    categories,
    isCategoriesLoading,
    isCategoriesError,
    categoriesError,
  } = useCategoryContext();
  return (
    <div>
      <div data-testid="categories">
        {categories !== null && categories[0]?.name}
      </div>
      <div data-testid="isCategoriesLoading">
        {"isCategoriesLoading " + isCategoriesLoading}
      </div>
      <div data-testid="isCategoriesError">
        {"isCategoriesError " + isCategoriesError}
      </div>
      <div data-testid="categoriesError">
        {"categoriesError " + categoriesError?.message}
      </div>
    </div>
  );
};

describe("CategoryContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should render with correct values on successful categories fetch", () => {
    // arrange
    vi.mocked(useCategories).mockReturnValue({
      data: [{ id: 1, name: "Cleaning" }],
      isLoading: false,
      isError: false,
      error: null,
    } as any);
    // act
    render(
      <CategoryProvider>
        <MockChild />
      </CategoryProvider>,
    );
    const categories = screen.getByTestId("categories");
    const isCategoriesLoading = screen.getByTestId("isCategoriesLoading");
    const isCategoriesError = screen.getByTestId("isCategoriesError");
    const categoriesError = screen.getByTestId("categoriesError");
    // assert
    expect(categories).toHaveTextContent("Cleaning");
    expect(isCategoriesLoading).toHaveTextContent("isCategoriesLoading false");
    expect(isCategoriesError).toHaveTextContent("isCategoriesError false");
    expect(categoriesError).toHaveTextContent("categoriesError undefined");
  });

  it("Should render with correct values on loading categories fetch", () => {
    // arrange
    vi.mocked(useCategories).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    } as any);
    // act
    render(
      <CategoryProvider>
        <MockChild />
      </CategoryProvider>,
    );
    const categories = screen.getByTestId("categories");
    const isCategoriesLoading = screen.getByTestId("isCategoriesLoading");
    const isCategoriesError = screen.getByTestId("isCategoriesError");
    const categoriesError = screen.getByTestId("categoriesError");
    // assert
    expect(categories).toHaveTextContent("");
    expect(isCategoriesLoading).toHaveTextContent("isCategoriesLoading true");
    expect(isCategoriesError).toHaveTextContent("isCategoriesError false");
    expect(categoriesError).toHaveTextContent("categoriesError undefined");
  });

  it("Should render with correct values on error fetching categories", () => {
    // arrange
    vi.mocked(useCategories).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: "Failed to fetch" },
    } as any);
    // act
    render(
      <CategoryProvider>
        <MockChild />
      </CategoryProvider>,
    );
    const categories = screen.getByTestId("categories");
    const isCategoriesLoading = screen.getByTestId("isCategoriesLoading");
    const isCategoriesError = screen.getByTestId("isCategoriesError");
    const categoriesError = screen.getByTestId("categoriesError");
    // assert
    expect(categories).toHaveTextContent("");
    expect(isCategoriesLoading).toHaveTextContent("isCategoriesLoading false");
    expect(isCategoriesError).toHaveTextContent("isCategoriesError true");
    expect(categoriesError).toHaveTextContent("Failed to fetch");
  });

  it("Should throw an error if context is called out of CategoryProvider", () => {
    // arrange
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    // act
    // assert
    expect(() => render(<MockChild />)).toThrow(
      "useCategoryContext must be used within a CategoryProvider",
    );

    consoleSpy.mockRestore();
  });
});
