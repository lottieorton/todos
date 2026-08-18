import { render, screen } from "@testing-library/react";
import type { Category } from "../../interfaces/Category";
import CategoryList from "./CategoryList";
import userEvent from "@testing-library/user-event";
import { useCategoryContext } from "../../context/CategoryContext";
import type { Todo } from "../../interfaces/Todo";

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
  const mockHandleFilter = vi.fn();

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

  const mockTodos: Todo[] = [
    {
      id: 1,
      name: "Fill the dishwasher",
      category: "Cleaning",
      isComplete: false,
    },
    { id: 2, name: "Go to the gym", category: "Fitness", isComplete: true },
  ];

  it("Should render list of categories, with correct todo values", () => {
    // arrange
    render(
      <CategoryList
        categoryId={undefined}
        handleFilter={mockHandleFilter}
        todos={mockTodos}
      />,
    );
    // act
    const list = screen.getAllByRole("button");
    // assert
    expect(list).toHaveLength(3);
    expect(list[0]).toHaveTextContent("All - 1 / 2 true");
    expect(list[1]).toHaveTextContent("Cleaning - 0 / 1 false");
    expect(list[2]).toHaveTextContent("Fitness - 1 / 1 false");
  });

  it("Should update selected category button if category id value", () => {
    // arrange
    render(
      <CategoryList
        categoryId={1}
        handleFilter={mockHandleFilter}
        todos={mockTodos}
      />,
    );
    // act
    const list = screen.getAllByRole("button");
    // assert
    expect(list).toHaveLength(3);
    expect(list[0]).toHaveTextContent("All - 1 / 2 false");
    expect(list[1]).toHaveTextContent("Cleaning - 0 / 1 true");
    expect(list[2]).toHaveTextContent("Fitness - 1 / 1 false");
  });

  it("Should render only All button if no categories fetched", () => {
    // arrange
    vi.mocked(useCategoryContext).mockReturnValue({
      categories: [],
      isCategoriesLoading: false,
    } as any);
    render(
      <CategoryList
        categoryId={undefined}
        handleFilter={mockHandleFilter}
        todos={mockTodos}
      />,
    );
    // act
    const list = screen.getAllByRole("button");
    // assert
    expect(list).toHaveLength(1);
    expect(list[0]).toHaveAccessibleName("All - 1 / 2 true");
  });

  it("Should call handleFilter with undefined when All button clicked", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <CategoryList
        categoryId={undefined}
        handleFilter={mockHandleFilter}
        todos={mockTodos}
      />,
    );
    // act
    const allBtn = screen.getByRole("button", { name: "All - 1 / 2 true" });
    await user.click(allBtn);
    // assert
    expect(mockHandleFilter).toHaveBeenCalledOnce();
    expect(mockHandleFilter).toHaveBeenCalledWith(undefined);
  });

  it("Should call handleFilter with category id when a category button is clicked", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <CategoryList
        categoryId={undefined}
        handleFilter={mockHandleFilter}
        todos={mockTodos}
      />,
    );
    // act
    const categoryBtn = screen.getByRole("button", {
      name: "Cleaning - 0 / 1 false",
    });
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
      <CategoryList
        categoryId={undefined}
        handleFilter={mockHandleFilter}
        todos={mockTodos}
      />,
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
