import { render, screen, waitFor } from "@testing-library/react";
import { useUpdateTodo } from "../../hooks/useTodos";
import userEvent from "@testing-library/user-event";
import EditTodo from "./EditTodo";

vi.mock("../MultiFieldForm/MultiFieldForm", () => ({
  default: vi.fn(({ formMethods, onSubmit, formText, errorMsg }) => {
    const { ref, ...nameRegister } = formMethods.register("name");
    return (
      <div>
        <div>{formText.inputPlaceholder}</div>
        <div>{formText.categorySelection}</div>
        <div>{formText.btn}</div>
        <button
          onClick={() => {
            formMethods.setValue("name", "Test todo");
            onSubmit({ name: "Test todo", categoryId: 1 });
          }}
        >
          Add
        </button>
        <input
          data-testid="input"
          {...nameRegister}
          ref={ref}
          value={formMethods.watch("name") || ""}
        />
        <div data-testid="errorMsg">{errorMsg}</div>
      </div>
    );
  }),
}));

vi.mock("../../hooks/useTodos", () => ({
  useUpdateTodo: vi.fn(),
}));

describe("EditTodo", () => {
  const mockMutate = vi.fn(
    (_data: unknown, options: { onSuccess: () => void }) => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
  );

  const mockToggleIsEditing = vi.fn();
  const updateTodoMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useUpdateTodo).mockReturnValue({
      mutate: mockMutate,
      isError: false,
      error: null,
      isPending: false,
    } as any);
  });

  it("Should render MultiFieldForm passing down formText props", () => {
    // arrange
    render(<EditTodo id={1} toggleIsEditing={mockToggleIsEditing} />);
    // act
    const nameInput = screen.getByText("Update task name...");
    const categoryDropdowntext = screen.getByText("Choose category");
    const btnInfo = screen.getByText("edit");
    const errorMsg = screen.getByTestId("errorMsg");
    // assert
    expect(nameInput).toBeInTheDocument();
    expect(categoryDropdowntext).toBeInTheDocument();
    expect(btnInfo).toBeInTheDocument();
    expect(errorMsg).toHaveTextContent("");
  });

  it("Should call updateToDo with correct todo values", async () => {
    // arrange
    const user = userEvent.setup();
    render(<EditTodo id={1} toggleIsEditing={mockToggleIsEditing} />);

    // act
    const btn = screen.getByRole("button");
    await user.click(btn);
    // assert
    expect(mockMutate).toHaveBeenCalledOnce();
    expect(mockMutate).toHaveBeenCalledWith(
      { id: 1, name: "Test todo", categoryId: 1 },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  it("Should reset the form onSuccess of updating a todo", async () => {
    // arrange
    const user = userEvent.setup();
    render(<EditTodo id={1} toggleIsEditing={mockToggleIsEditing} />);

    // act
    const btn = screen.getByRole("button");
    const input = screen.getByTestId("input");
    await user.type(input, "Hello");
    expect(input).toHaveValue("Hello");
    await user.click(btn);
    // assert
    expect(mockMutate).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });

  it("Should call toggleIsEditing onSuccess of updating a todo", async () => {
    // arrange
    const user = userEvent.setup();
    render(<EditTodo id={1} toggleIsEditing={mockToggleIsEditing} />);

    // act
    const btn = screen.getByRole("button");
    await user.click(btn);
    // assert
    expect(mockMutate).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(mockToggleIsEditing).toHaveBeenCalledOnce();
    });
  });

  it("Should render error message if error with updating todo", async () => {
    vi.mocked(useUpdateTodo).mockReturnValue({
      mutate: updateTodoMock,
      isError: true,
      error: new Error("Failed to update todo"),
      isPending: false,
    } as any);
    render(<EditTodo id={1} toggleIsEditing={mockToggleIsEditing} />);
    // act
    const errorMsg = screen.getByTestId("errorMsg");
    // assert
    expect(errorMsg).toHaveTextContent("Failed to update todo");
  });
});
