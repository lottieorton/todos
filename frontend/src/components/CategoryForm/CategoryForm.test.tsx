import { render, screen, waitFor } from "@testing-library/react";
import CategoryForm from "./CategoryForm";
import { useCreateCategory } from "../../hooks/useCategories";
import userEvent from "@testing-library/user-event";

vi.mock("../buttons/FormButton/FormButton", () => {
  return {
    default: vi.fn(({ isRounded }) => {
      return (
        <button data-testid="add-btn" type="submit">
          {"Rounded " + isRounded}
        </button>
      );
    }),
  };
});

vi.mock("../../hooks/useCategories", () => ({
  useCreateCategory: vi.fn(),
}));

vi.mock("../ErrorMessage/ErrorMessage", () => {
  return {
    default: vi.fn(({ msg, dataType }) => {
      return <div data-testid="errorMsg">{msg + " " + dataType}</div>;
    }),
  };
});

describe("CategoryForm", () => {
  const mockMutate = vi.fn(
    (_data: string, options: { onSuccess: () => void }) => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
  );

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCreateCategory).mockReturnValue({
      mutate: mockMutate,
      isError: false,
      error: null,
      isPending: false,
    } as any);
  });

  it("Should render with props passed to button", () => {
    // arrange
    render(<CategoryForm />);
    // act
    const icon = screen.getByTestId("categoryIcon");
    const input = screen.getByPlaceholderText("Add a category...");
    const btn = screen.getByTestId("add-btn");
    // assert
    expect(icon).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent("Rounded true");
  });

  it("Should reset the input value onSuccess of createCategory", async () => {
    // arrange
    render(<CategoryForm />);
    const user = userEvent.setup();
    // act
    const input =
      screen.getByPlaceholderText<HTMLInputElement>("Add a category...");
    const btn = screen.getByTestId("add-btn");
    await user.type(input, "New category");
    expect(input.value).toBe("New category");
    await user.click(btn);
    // assert
    expect(mockMutate).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(input.value).toBe("");
    });
  });

  it("Should render the error message when createCategory has an error", async () => {
    // arrange
    vi.mocked(useCreateCategory).mockReturnValue({
      mutate: vi.fn(),
      isError: true,
      error: new Error("Failed to create category"),
      isPending: false,
    } as any);

    render(<CategoryForm />);
    const user = userEvent.setup();
    // act
    const input =
      screen.getByPlaceholderText<HTMLInputElement>("Add a category...");
    const btn = screen.getByTestId("add-btn");
    await user.type(input, "New category");
    expect(input.value).toBe("New category");
    await user.click(btn);
    // assert
    await waitFor(() => {
      expect(screen.getByTestId("errorMsg")).toBeInTheDocument();
      expect(screen.getByTestId("errorMsg")).toHaveTextContent(
        "Failed to create category category",
      );
    });
  });
});
