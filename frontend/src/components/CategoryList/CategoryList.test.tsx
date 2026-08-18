import { render, screen } from "@testing-library/react";
import type { Category } from "../../interfaces/Category";
import CategoryList from "./CategoryList";
import userEvent from "@testing-library/user-event";
import { useCategoryContext } from "../../context/CategoryContext";

vi.mock("../buttons/FormButton/FormButton", () => {
  return {
    default: vi.fn(({ isSelected, children }) => {
      return (
        <button data-testid={`form-btn`} type="submit">
          <div data-testid="children">{children + " " + isSelected}</div>
        </button>
      );
    }),
  };
});

vi.mock("../../context/CategoryContext", () => ({
  useCategoryContext: vi.fn(),
}));

describe("CategoryList", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const mockCategories: Category[] = [
      { id: 1, name: "Cleaning" },
      { id: 2, name: "Fitness" },
    ];

    vi.mocked(useCategoryContext).mockReturnValue({
      categories: mockCategories,
      isCategoriesLoading: false,
    } as any);
  });
  const mockHandleFilter = vi.fn();

  it("Should render list of categories", () => {
    // arrange
    render(
      <CategoryList categoryId={undefined} handleFilter={mockHandleFilter} />,
    );
    // act
    const list = screen.getAllByRole("button");
    // assert
    expect(list).toHaveLength(3);
    expect(list[0]).toHaveTextContent("All true");
    expect(list[1]).toHaveTextContent("Cleaning false");
    expect(list[2]).toHaveTextContent("Fitness false");
  });

  it("Should update selected category button if category id value", () => {
    // arrange
    render(<CategoryList categoryId={1} handleFilter={mockHandleFilter} />);
    // act
    const list = screen.getAllByRole("button");
    // assert
    expect(list).toHaveLength(3);
    expect(list[0]).toHaveTextContent("All false");
    expect(list[1]).toHaveTextContent("Cleaning true");
    expect(list[2]).toHaveTextContent("Fitness false");
  });

  it("Should render only All button if no categories fetched", () => {
    // arrange
    vi.mocked(useCategoryContext).mockReturnValue({
      categories: [],
      isCategoriesLoading: false,
    } as any);
    render(
      <CategoryList categoryId={undefined} handleFilter={mockHandleFilter} />,
    );
    // act
    const list = screen.getAllByRole("button");
    // assert
    expect(list).toHaveLength(1);
    expect(list[0]).toHaveAccessibleName("All true");
  });

  it("Should call handleFilter with undefined when All button clicked", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <CategoryList categoryId={undefined} handleFilter={mockHandleFilter} />,
    );
    // act
    const allBtn = screen.getByRole("button", { name: "All true" });
    await user.click(allBtn);
    // assert
    expect(mockHandleFilter).toHaveBeenCalledOnce();
    expect(mockHandleFilter).toHaveBeenCalledWith(undefined);
  });

  it("Should call handleFilter with category id when a category button is clicked", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <CategoryList categoryId={undefined} handleFilter={mockHandleFilter} />,
    );
    // act
    const categoryBtn = screen.getByRole("button", { name: "Cleaning false" });
    await user.click(categoryBtn);
    // assert
    expect(mockHandleFilter).toHaveBeenCalledOnce();
    expect(mockHandleFilter).toHaveBeenCalledWith(1);
  });

  it("Should render loading message when fetching results are loading", () => {
    // arrange
    vi.mocked(useCategoryContext).mockReturnValue({
      categories: [],
      isCategoriesLoading: true,
    } as any);
    render(
      <CategoryList categoryId={undefined} handleFilter={mockHandleFilter} />,
    );
    // act
    const loadingMsg = screen.getByText("Loading now...");
    // assert
    expect(loadingMsg).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "All true" }),
    ).not.toBeInTheDocument();
  });
});
