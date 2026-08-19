import { render, renderHook, screen } from "@testing-library/react";
import TodoForm from "./TodoForm";
import type { Category } from "../../interfaces/Category";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import type { TodoFormData } from "../../interfaces/TodoFormData";
import { useCategoryContext } from "../../context/CategoryContext";

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

vi.mock("../buttons/IconButton/IconButton", () => {
  return {
    default: vi.fn(({ children, color, handleClick }) => {
      return (
        <button data-testid="delete-btn" type="button" onClick={handleClick}>
          {`Delete - ${color}`}
          <div data-testid="children">{children}</div>
        </button>
      );
    }),
  };
});

vi.mock("../ErrorMessage/ErrorMessage", () => {
  return {
    default: vi.fn(({ msg }) => {
      return <div data-testid="errorMsg">{msg}</div>;
    }),
  };
});

vi.mock("../../context/CategoryContext", () => ({
  useCategoryContext: vi.fn(),
}));

describe("TodoForm", () => {
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
  const mockOnSubmit = vi.fn();
  const mockFormText = {
    categorySelection: "Select a category",
    inputPlaceholder: "Add a name...",
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
    const addBtn = screen.getByRole("button");
    const nameInput = screen.getByPlaceholderText("Add a name...");
    const icon = screen.getByLabelText("categoryIcon");
    const dropdownList = screen.getAllByRole("option");
    const addIcon = screen.getByLabelText("add");
    // assert
    expect(addBtn).toBeInTheDocument();
    expect(addBtn).toHaveTextContent("Rounded false");
    expect(addIcon).toBeInTheDocument();
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

  it("Should render form button as round when isRounded is true", () => {
    // arrange
    const { result } = renderHook(() => useForm<TodoFormData>());
    const mockFormText = {
      categorySelection: "Select a category",
      inputPlaceholder: "Add a name...",
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
    const addBtn = screen.getByRole("button");
    // assert
    expect(addBtn).toBeInTheDocument();
    expect(addBtn).toHaveTextContent("Rounded true");
  });

  it("Should render edit form button when btn = edit", () => {
    // arrange
    const { result } = renderHook(() => useForm<TodoFormData>());
    const mockFormText = {
      categorySelection: "Select a category",
      inputPlaceholder: "Add a name...",
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
    const updateBtn = screen.getByRole("button");
    const update = screen.getByTestId("children");
    // assert
    expect(updateBtn).toBeInTheDocument();
    expect(updateBtn).toHaveTextContent("Rounded false Update");
    expect(update).toHaveTextContent("Update");
  });

  it("Should render edit icon, edit form and delete buttons when btn = editDelete", () => {
    // arrange
    const { result } = renderHook(() => useForm<TodoFormData>());
    const mockhandleDelete = vi.fn();

    const mockFormText = {
      categorySelection: "Select a category",
      inputPlaceholder: "Add a name...",
      btn: "editDelete",
    } as const;
    render(
      <TodoForm
        formMethods={result.current}
        onSubmit={mockOnSubmit}
        formText={mockFormText}
        handleDelete={mockhandleDelete}
      />,
    );
    // act
    const editIcon = screen.getByLabelText("editIcon");
    const updateFormBtn = screen.getByTestId("form-btn");
    const deleteBtn = screen.getByTestId("delete-btn");
    // assert
    expect(editIcon).toBeInTheDocument();
    expect(updateFormBtn).toBeInTheDocument();
    expect(deleteBtn).toBeInTheDocument();
    expect(deleteBtn).toHaveTextContent("Delete - red");
  });

  it("Should render loading icon while fetching categories", () => {
    vi.mocked(useCategoryContext).mockReturnValue({
      categories: [],
      isCategoriesLoading: true,
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
    const loadingIcon = screen.getByLabelText("loading icon");
    // assert
    expect(loadingIcon).toBeInTheDocument();
  });

  it("Should render error message if error with fetching categories", () => {
    // arrange
    vi.mocked(useCategoryContext).mockReturnValue({
      categories: [],
      isCategoriesLoading: false,
    } as any);

    const { result } = renderHook(() => useForm<TodoFormData>());
    render(
      <TodoForm
        formMethods={result.current}
        onSubmit={mockOnSubmit}
        formText={mockFormText}
        errorMsg="Not Found"
      />,
    );
    // act
    const errorMessage = screen.getByTestId("errorMsg");
    // assert
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("Not Found");
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
      screen.getByPlaceholderText<HTMLInputElement>("Add a name...");
    const dropdown = screen.getByRole("combobox");
    await user.selectOptions(dropdown, "2");
    await user.type(nameInput, "Run a 5km");
    await user.click(btn);
    // assert
    expect(mockOnSubmit).toHaveBeenCalledOnce();
  });

  it("Should call parents handleDelete when delete button clicked with selected category", async () => {
    // arrange
    const user = userEvent.setup();
    const { result } = renderHook(() => useForm<TodoFormData>());
    const mockhandleDelete = vi.fn();

    const mockFormText = {
      categorySelection: "Select a category",
      inputPlaceholder: "Add a name...",
      btn: "editDelete",
    } as const;
    render(
      <TodoForm
        formMethods={result.current}
        onSubmit={mockOnSubmit}
        formText={mockFormText}
        handleDelete={mockhandleDelete}
      />,
    );
    // act
    const deleteBtn = screen.getByTestId("delete-btn");
    const dropdown = screen.getByRole("combobox");
    await user.selectOptions(dropdown, "2");
    await user.click(deleteBtn);
    // assert
    expect(mockhandleDelete).toHaveBeenCalledOnce();
  });

  it("Should render error message when delete button clicked without category selected", async () => {
    // arrange
    const user = userEvent.setup();
    const { result } = renderHook(() => useForm<TodoFormData>());
    const mockhandleDelete = vi.fn();

    const mockFormText = {
      categorySelection: "Select a category",
      inputPlaceholder: "Add a name...",
      btn: "editDelete",
    } as const;
    render(
      <TodoForm
        formMethods={result.current}
        onSubmit={mockOnSubmit}
        formText={mockFormText}
        handleDelete={mockhandleDelete}
      />,
    );
    // act
    const deleteBtn = screen.getByTestId("delete-btn");
    await user.click(deleteBtn);
    // assert
    expect(mockhandleDelete).not.toHaveBeenCalled();
    expect(screen.getByTestId("errorMsg")).toBeInTheDocument();
    expect(screen.getByTestId("errorMsg")).toHaveTextContent(
      "Must select a category",
    );
  });

  it("Should remove error message when delete button clicked with category selected", async () => {
    // arrange
    const user = userEvent.setup();
    const { result } = renderHook(() => useForm<TodoFormData>());
    const mockhandleDelete = vi.fn();

    const mockFormText = {
      categorySelection: "Select a category",
      inputPlaceholder: "Add a name...",
      btn: "editDelete",
    } as const;
    render(
      <TodoForm
        formMethods={result.current}
        onSubmit={mockOnSubmit}
        formText={mockFormText}
        handleDelete={mockhandleDelete}
      />,
    );
    // act
    const deleteBtn = screen.getByTestId("delete-btn");
    const dropdown = screen.getByRole("combobox");
    await user.click(deleteBtn);
    expect(mockhandleDelete).not.toHaveBeenCalled();
    const errorMsg = screen.getByTestId("errorMsg");
    expect(errorMsg).toHaveTextContent("Must select a category");
    await user.selectOptions(dropdown, "2");
    await user.click(deleteBtn);
    // assert
    // assert
    expect(mockhandleDelete).toHaveBeenCalledOnce();
    expect(errorMsg).not.toBeInTheDocument();
  });
});
