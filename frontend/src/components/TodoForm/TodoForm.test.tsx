import { render, screen, waitFor } from "@testing-library/react";
import { useCreateTodo } from "../../hooks/useTodos";
import TodoForm from "./TodoForm";
import { useCategories } from "../../hooks/useCategories";
import type { Category } from "../../interfaces/Category";
import userEvent from "@testing-library/user-event";

vi.mock("../buttons/AddButton/AddButton", () => {
  return {
    default: vi.fn(() => {
      return (
        <button data-testid="add-btn" type="submit">
          Btn
        </button>
      );
    }),
  };
});

vi.mock("../../hooks/useCategories", () => ({
  useCategories: vi.fn(),
}));

vi.mock("../../hooks/useTodos", () => ({
  useCreateTodo: vi.fn(),
}));

describe("TodoForm", () => {
  const mockMutate = vi.fn(
    (_data: string, options: { onSuccess: () => void }) => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
  );

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

    vi.mocked(useCreateTodo).mockReturnValue({
      mutate: mockMutate,
      isError: false,
      error: null,
      isPending: false,
    } as any);
  });

  it("Should render form with list of categories in the dropdown", () => {
    // arrange
    render(<TodoForm />);
    // act
    const btn = screen.getByRole("button");
    const nameInput = screen.getByPlaceholderText("Add a task...");
    const icon = screen.getByLabelText("categoryIcon");
    const dropdownList = screen.getAllByRole("option");
    // assert
    expect(btn).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(dropdownList).toHaveLength(3);
    expect(dropdownList[0]).toHaveValue("");
    expect(dropdownList[0]).toHaveTextContent("Select a category");
    expect(dropdownList[1]).toHaveValue("1");
    expect(dropdownList[1]).toHaveTextContent("Cleaning");
    expect(dropdownList[2]).toHaveValue("2");
    expect(dropdownList[2]).toHaveTextContent("Fitness");
  });

  it("Should render loading message while fetching categories", () => {
    vi.mocked(useCategories).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    } as any);

    render(<TodoForm />);
    // act
    const loadingMessage = screen.getByText("Loading...");
    // assert
    expect(loadingMessage).toBeInTheDocument();
  });

  it("Should render error message if error with fetching categories", () => {
    // arrange
    vi.mocked(useCategories).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error("Failed to load categories"),
    } as any);

    render(<TodoForm />);
    // act
    const errorMessage = screen.getByText("Failed to load categories");
    // assert
    expect(errorMessage).toBeInTheDocument();
  });

  it("Should reset the form onSuccess of creating a todo", async () => {
    // arrange
    const user = userEvent.setup();
    render(<TodoForm />);
    // act
    const btn = screen.getByRole("button");
    const nameInput =
      screen.getByPlaceholderText<HTMLInputElement>("Add a task...");
    const dropdown = screen.getByRole("combobox");
    await user.selectOptions(dropdown, "2");
    await user.type(nameInput, "Run a 5km");
    await user.click(btn);
    // assert
    expect(mockMutate).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(dropdown).toHaveValue("");
      expect(nameInput.value).toBe("");
    });
  });

  it("Should render error message if error with creating todo", async () => {
    const user = userEvent.setup();
    const createTodoMock = vi.fn();

    vi.mocked(useCreateTodo).mockReturnValue({
      mutate: createTodoMock,
      isError: false,
      error: null,
      isPending: false,
    } as any);

    const { rerender } = render(<TodoForm />);
    // act
    const btn = screen.getByRole("button");
    const nameInput =
      screen.getByPlaceholderText<HTMLInputElement>("Add a task...");
    const dropdown = screen.getByRole("combobox");
    await user.selectOptions(dropdown, "2");
    await user.type(nameInput, "Run a 5km");
    await user.click(btn);
    expect(createTodoMock).toHaveBeenCalledOnce();

    vi.mocked(useCreateTodo).mockReturnValue({
      mutate: createTodoMock,
      isError: true,
      error: new Error("Failed to create todo"),
      isPending: false,
    } as any);

    rerender(<TodoForm />);

    // assert
    expect(screen.getByText("Failed to create todo")).toBeInTheDocument();
    expect(createTodoMock).toHaveBeenCalledOnce();
  });
});
