import { render, screen } from "@testing-library/react";
import { useCategories } from "../../hooks/useCategories";
import type { Category } from "../../interfaces/Category";
import CategoryList from "./CategoryList";
import userEvent from "@testing-library/user-event";

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

vi.mock("../../hooks/useCategories", () => ({
  useCategories: vi.fn(),
}));

describe("CategoryList", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const mockCategories: Category[] = [
      { id: 1, name: "Cleaning" },
      { id: 2, name: "Fitness" },
    ];

    vi.mocked(useCategories).mockReturnValue({
      data: mockCategories,
      isLoading: false,
      isError: false,
      error: null,
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
    vi.mocked(useCategories).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
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
});
