import { render, renderHook, screen } from "@testing-library/react";
import TodoForm from "./TodoForm";
import { useCategories } from "../../hooks/useCategories";
import type { Category } from "../../interfaces/Category";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import type { TodoFormData } from "../../interfaces/TodoFormData";

vi.mock("../buttons/FormButton/FormButton", () => {
  return {
    default: vi.fn(({ children, isRounded }) => {
      return (
        <button data-testid="form-btn" type="submit">
          {"Rounded " + isRounded + " "}
          <div data-testid="children">{children}</div>
        </button>
      );
    }),
  };
});

vi.mock("../../hooks/useCategories", () => ({
  useCategories: vi.fn(),
}));

// vi.mock("../../hooks/useTodos", () => ({
//   useCreateTodo: vi.fn(),
// }));

describe("TodoForm", () => {
  // const mockMutate = vi.fn(
  //   (_data: string, options: { onSuccess: () => void }) => {
  //     if (options?.onSuccess) {
  //       options.onSuccess();
  //     }
  //   },
  // );

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

    // vi.mocked(useCreateTodo).mockReturnValue({
    //   mutate: mockMutate,
    //   isError: false,
    //   error: null,
    //   isPending: false,
    // } as any);
  });
  const mockOnSubmit = vi.fn();
  const mockFormText = {
    categorySelection: "Select a category",
    todoPlaceholder: "Add a task...",
    btn: "add",
  } as const;

  it("Should render form with list of categories in the dropdown, with an add, non-round btn", () => {
    // arrange
    const { result } = renderHook(() => useForm<TodoFormData>());
    render(
      <TodoForm
        formMethods={result.current}
        onSubmit={mockOnSubmit}
        formText={mockFormText}
      />,
    );
    // act
    const btn = screen.getByRole("button");
    const nameInput = screen.getByPlaceholderText("Add a task...");
    const icon = screen.getByLabelText("categoryIcon");
    const dropdownList = screen.getAllByRole("option");
    const addIcon = screen.getByLabelText("add");
    // assert
    expect(btn).toBeInTheDocument();
    expect(addIcon).toBeInTheDocument();
    expect(btn).toHaveTextContent("Rounded false");
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

  it("Should render form btn as round when isRounded is true", () => {
    // arrange
    const { result } = renderHook(() => useForm<TodoFormData>());
    const mockFormText = {
      categorySelection: "Select a category",
      todoPlaceholder: "Add a task...",
      btn: "add",
      isBtnRounded: true,
    } as const;
    render(
      <TodoForm
        formMethods={result.current}
        onSubmit={mockOnSubmit}
        formText={mockFormText}
      />,
    );
    // act
    const btn = screen.getByRole("button");
    // assert
    expect(btn).toBeInTheDocument();
  });

  it("Should render edit form btn when btn = edit", () => {
    // arrange
    const { result } = renderHook(() => useForm<TodoFormData>());
    const mockFormText = {
      categorySelection: "Select a category",
      todoPlaceholder: "Add a task...",
      btn: "edit",
    } as const;
    render(
      <TodoForm
        formMethods={result.current}
        onSubmit={mockOnSubmit}
        formText={mockFormText}
      />,
    );
    // act
    const btn = screen.getByRole("button");
    const update = screen.getByTestId("children");
    // assert
    expect(btn).toBeInTheDocument();
    screen.debug();
    expect(btn).toHaveTextContent("Rounded false Update");
    expect(update).toHaveTextContent("Update");
  });

  it("Should render loading message while fetching categories", () => {
    vi.mocked(useCategories).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    } as any);
    const { result } = renderHook(() => useForm<TodoFormData>());
    render(
      <TodoForm
        formMethods={result.current}
        onSubmit={mockOnSubmit}
        formText={mockFormText}
      />,
    );
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

    const { result } = renderHook(() => useForm<TodoFormData>());
    render(
      <TodoForm
        formMethods={result.current}
        onSubmit={mockOnSubmit}
        formText={mockFormText}
      />,
    );
    // act
    const errorMessage = screen.getByText("Failed to load categories");
    // assert
    expect(errorMessage).toBeInTheDocument();
  });

  it("Should call onSubmit prop when submit form", async () => {
    // arrange
    const user = userEvent.setup();
    const { result } = renderHook(() => useForm<TodoFormData>());
    render(
      <TodoForm
        formMethods={result.current}
        onSubmit={mockOnSubmit}
        formText={mockFormText}
      />,
    );
    // act
    const btn = screen.getByRole("button");
    const nameInput =
      screen.getByPlaceholderText<HTMLInputElement>("Add a task...");
    const dropdown = screen.getByRole("combobox");
    await user.selectOptions(dropdown, "2");
    await user.type(nameInput, "Run a 5km");
    await user.click(btn);
    // assert
    expect(mockOnSubmit).toHaveBeenCalledOnce();
  });
});
