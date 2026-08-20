import { render, screen, waitFor } from "@testing-library/react";
import { useCreateTodo } from "../../hooks/useTodos";
import userEvent from "@testing-library/user-event";
import AddTodo from "./AddTodo";

vi.mock("../MultiFieldForm/MultiFieldForm", () => ({
  default: vi.fn(({ formMethods, onSubmit, formText, errorMsg }) => {
    const { ref, ...nameRegister } = formMethods.register("name");
    return (
      <div>
        <div>{formText.inputPlaceholder}</div>
        <div>{formText.categorySelection}</div>
        <div>{formText.btn}</div>
        <button
          data-testid="add-values-btn"
          onClick={() => {
            formMethods.setValue("name", "Test todo");
            formMethods.setValue("categoryId", 1);
            formMethods.handleSubmit(onSubmit)();
          }}
        >
          Add
        </button>
        <button
          data-testid="submit-nocat-btn"
          onClick={() => {
            formMethods.setValue("name", "test");
            formMethods.handleSubmit(onSubmit)();
          }}
        >
          Submit no-cat
        </button>
        <button
          data-testid="submit-noname-btn"
          onClick={() => {
            formMethods.setValue("categoryId", 1);
            formMethods.handleSubmit(onSubmit)();
          }}
        >
          Submit blank name
        </button>
        <button
          data-testid="submit-emptyname-btn"
          onClick={() => {
            formMethods.setValue("name", "    ");
            formMethods.setValue("categoryId", 1);
            formMethods.handleSubmit(onSubmit)();
          }}
        >
          Submit empty name
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
  useCreateTodo: vi.fn(),
}));

describe("AddTodo", () => {
  const mockMutate = vi.fn(
    (
      _data: { name: string; categoryId: number },
      options: { onSuccess: () => void },
    ) => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
  );

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCreateTodo).mockReturnValue({
      mutate: mockMutate,
      isError: false,
      error: null,
      isPending: false,
    } as any);
  });

  it("Should render MultiFieldForm passing down formText props", () => {
    // arrange
    render(<AddTodo />);
    // act
    const nameInput = screen.getByText("Add a task...");
    const categoryDropdowntext = screen.getByText("Select a category");
    const errorMsg = screen.getByTestId("errorMsg");
    // assert
    expect(nameInput).toBeInTheDocument();
    expect(categoryDropdowntext).toBeInTheDocument();
    expect(errorMsg).toHaveTextContent("");
  });

  it("Should call createTodo with correct todo values", async () => {
    // arrange
    const user = userEvent.setup();
    render(<AddTodo />);
    // act
    const btn = screen.getByTestId("add-values-btn");
    await user.click(btn);
    // assert
    expect(mockMutate).toHaveBeenCalledOnce();
    expect(mockMutate).toHaveBeenCalledWith(
      { name: "Test todo", categoryId: 1 },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  it("Should reset the form onSuccess of creating a todo", async () => {
    // arrange
    const user = userEvent.setup();
    render(<AddTodo />);
    // act
    const btn = screen.getByTestId("add-values-btn");
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

  it("Should pass error message to form if form entered with no selected category", async () => {
    const user = userEvent.setup();
    const createTodoMock = vi.fn();

    vi.mocked(useCreateTodo).mockReturnValue({
      mutate: createTodoMock,
      isError: false,
      error: null,
      isPending: false,
    } as any);

    render(<AddTodo />);
    // act
    const btn = screen.getByTestId("submit-nocat-btn");
    const errorMsg = screen.getByTestId("errorMsg");

    await user.click(btn);
    expect(createTodoMock).not.toHaveBeenCalled();
    // assert
    expect(errorMsg).toHaveTextContent("Must select a category");
  });

  it("Should pass error message to form if form entered with no name value", async () => {
    const user = userEvent.setup();
    const createTodoMock = vi.fn();

    vi.mocked(useCreateTodo).mockReturnValue({
      mutate: createTodoMock,
      isError: false,
      error: null,
      isPending: false,
    } as any);

    render(<AddTodo />);
    // act
    const btn = screen.getByTestId("submit-noname-btn");
    const errorMsg = screen.getByTestId("errorMsg");

    await user.click(btn);
    expect(createTodoMock).not.toHaveBeenCalled();
    // assert
    expect(errorMsg).toHaveTextContent("Must enter a name");
  });

  it("Should pass error message to form if form entered with empty name value", async () => {
    const user = userEvent.setup();
    const createTodoMock = vi.fn();

    vi.mocked(useCreateTodo).mockReturnValue({
      mutate: createTodoMock,
      isError: false,
      error: null,
      isPending: false,
    } as any);

    render(<AddTodo />);
    // act
    const btn = screen.getByTestId("submit-emptyname-btn");
    const errorMsg = screen.getByTestId("errorMsg");

    await user.click(btn);
    expect(createTodoMock).not.toHaveBeenCalled();
    // assert
    expect(errorMsg).toHaveTextContent("Must enter a name");
  });

  it("Should pass remove error message on successful submission of the form", async () => {
    const user = userEvent.setup();
    const createTodoMock = vi.fn();

    vi.mocked(useCreateTodo).mockReturnValue({
      mutate: createTodoMock,
      isError: false,
      error: null,
      isPending: false,
    } as any);

    render(<AddTodo />);
    // act
    const btn = screen.getByTestId("submit-nocat-btn");
    const successSubmitBtn = screen.getByTestId("add-values-btn");

    const errorMsg = screen.getByTestId("errorMsg");
    await user.click(btn);
    expect(errorMsg).toHaveTextContent("Must select a category");
    await user.click(successSubmitBtn);
    // assert
    expect(errorMsg).toHaveTextContent("");
  });

  it("Should pass error message to form if error with creating todo", async () => {
    // arrange
    vi.mocked(useCreateTodo).mockReturnValue({
      mutate: vi.fn(),
      isError: true,
      error: new Error("Failed to create todo"),
      isPending: false,
    } as any);

    render(<AddTodo />);
    // act
    const errorMsg = screen.getByTestId("errorMsg");
    // assert
    expect(errorMsg).toHaveTextContent("Failed to create todo");
  });
});
