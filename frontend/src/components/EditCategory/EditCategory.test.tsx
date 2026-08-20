import { render, screen, waitFor } from "@testing-library/react";
import {
  useDeleteCategory,
  useUpdateCategory,
} from "../../hooks/useCategories";
import EditCategory from "./EditCategory";
import userEvent from "@testing-library/user-event";

vi.mock("../MultiFieldForm/MultiFieldForm", () => ({
  default: vi.fn(
    ({ formMethods, onSubmit, handleDelete, formText, errorMsg }) => {
      return (
        <div>
          <div>{formText.inputPlaceholder}</div>
          <div>{formText.categorySelection}</div>
          <div data-testid="errorMsg">{errorMsg}</div>
          <div>{formText.btn}</div>
          <button
            data-testid="update-btn"
            onClick={() => {
              onSubmit({ name: "Test todo", categoryId: 1 });
            }}
          >
            Update
          </button>
          <button
            data-testid="delete-btn"
            onClick={() => {
              handleDelete(1);
            }}
          >
            Delete
          </button>
          <input
            data-testid="input"
            {...formMethods.register("name")}
            // {...nameRegister}
            // ref={ref}
            value={formMethods.watch("name") || ""}
          />
        </div>
      );
    },
  ),
}));

vi.mock("../../hooks/useCategories", () => ({
  useUpdateCategory: vi.fn(),
  useDeleteCategory: vi.fn(),
}));

describe("EditCategory", () => {
  const mockUpdateMutate = vi.fn(
    (_data: unknown, options: { onSuccess: () => void }) => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
  );

  const mockDeleteMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useUpdateCategory).mockReturnValue({
      mutate: mockUpdateMutate,
      isError: false,
      error: null,
      isPending: false,
    } as any);

    vi.mocked(useDeleteCategory).mockReturnValue({
      mutate: mockDeleteMutate,
      isError: false,
      error: null,
      isPending: false,
    } as any);
  });

  it("Should render form passing fown formText props", () => {
    // arrange
    render(<EditCategory />);
    // act
    const nameInput = screen.getByText("Update category name...");
    const categoryDropdowntext = screen.getByText("Update category");
    const btnInfo = screen.getByText("editDelete");
    const errorMsg = screen.getByTestId("errorMsg");
    // assert
    expect(nameInput).toBeInTheDocument();
    expect(categoryDropdowntext).toBeInTheDocument();
    expect(btnInfo).toBeInTheDocument();
    expect(errorMsg).toHaveTextContent("");
  });

  it("Should call updateCategory with correct category data when onUpdateSubmit called in child form", async () => {
    // arrange
    const user = userEvent.setup();
    render(<EditCategory />);
    // act
    const updateBtn = screen.getByTestId("update-btn");
    await user.click(updateBtn);
    // assert
    expect(mockUpdateMutate).toHaveBeenCalledOnce();
    expect(mockUpdateMutate).toHaveBeenCalledWith(
      { name: "Test todo", id: 1 },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  it("Should reset the child form state onSuccess of updating a category", async () => {
    // arrange
    const user = userEvent.setup();
    render(<EditCategory />);
    // act
    const updateBtn = screen.getByTestId("update-btn");
    const input = screen.getByTestId("input");
    expect(input).toHaveValue("");
    await user.type(input, "Hello");
    expect(input).toHaveValue("Hello");
    await user.click(updateBtn);
    // assert
    expect(mockUpdateMutate).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });

  it("Should call deleteCategory when the handleDelete is invoked", async () => {
    // arrange
    const user = userEvent.setup();
    render(<EditCategory />);
    // act
    const deleteBtn = screen.getByRole("button", { name: "Delete" });
    await user.click(deleteBtn);
    // assert
    expect(mockDeleteMutate).toHaveBeenCalledOnce();
    expect(mockDeleteMutate).toHaveBeenCalledWith(1);
  });

  it("Should display mutation error when updating fails", async () => {
    vi.mocked(useDeleteCategory).mockReturnValue({
      mutate: mockDeleteMutate,
      isError: false,
      error: null,
      isPending: false,
    } as any);
    vi.mocked(useUpdateCategory).mockReturnValue({
      mutate: vi.fn(),
      isError: true,
      error: { message: "Failed to update category" },
      isPending: false,
    } as any);
    render(<EditCategory />);
    // assert
    expect(screen.getByTestId("errorMsg")).toHaveTextContent(
      "Failed to update category",
    );
  });

  it("Should display mutation error when deleting fails", async () => {
    vi.mocked(useUpdateCategory).mockReturnValue({
      mutate: mockUpdateMutate,
      isError: false,
      error: null,
      isPending: false,
    } as any);
    vi.mocked(useDeleteCategory).mockReturnValue({
      mutate: vi.fn(),
      isError: true,
      error: { message: "Failed to delete category" },
      isPending: false,
    } as any);
    render(<EditCategory />);
    // assert
    expect(screen.getByTestId("errorMsg")).toHaveTextContent(
      "Failed to delete category",
    );
  });
});
