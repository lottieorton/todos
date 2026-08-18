import { render, screen, waitFor } from "@testing-library/react";
import {
  useDeleteCategory,
  useUpdateCategory,
} from "../../hooks/useCategories";
import EditCategory from "./EditCategory";
import userEvent from "@testing-library/user-event";

vi.mock("../TodoForm/TodoForm", () => ({
  default: vi.fn(
    ({ formMethods, onSubmit, handleDelete, formText, errorMsg }) => {
      const { ref, ...nameRegister } = formMethods.register("name");
      return (
        <div>
          <div>{formText.inputPlaceholder}</div>
          <div>{formText.categorySelection}</div>
          <div data-testid="errorMsg">{errorMsg}</div>
          <div>{formText.btn}</div>
          <button
            onClick={() => {
              formMethods.setValue("name", "Test name");
              onSubmit({ name: "Test name", categoryId: 1 });
            }}
          >
            Update
          </button>
          <button
            onClick={() => {
              handleDelete(1);
            }}
          >
            Delete
          </button>
          <input
            data-testid="input"
            {...nameRegister}
            ref={ref}
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
    const updateBtn = screen.getByRole("button", { name: "Update" });
    await user.click(updateBtn);
    // assert
    expect(mockUpdateMutate).toHaveBeenCalledOnce();
    expect(mockUpdateMutate).toHaveBeenCalledWith(
      { name: "Test name", id: 1 },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  it("Should reset the child form onSuccess of updating a category", async () => {
    // arrange
    const user = userEvent.setup();
    render(<EditCategory />);
    // act
    const updateBtn = screen.getByRole("button", { name: "Update" });
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

  it("Should call deleteCategory when the child calls handleDelete", async () => {
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

  it("Should render updateCategory error when error updating category", async () => {
    const user = userEvent.setup();
    const updateCategoryMock = vi.fn();
    vi.mocked(useUpdateCategory).mockReturnValue({
      mutate: updateCategoryMock,
      isError: false,
      error: null,
      isPending: false,
    } as any);

    const { rerender } = render(<EditCategory />);

    // act
    const updateBtn = screen.getByRole("button", { name: "Update" });
    await user.click(updateBtn);
    expect(updateCategoryMock).toHaveBeenCalledOnce();

    vi.mocked(useUpdateCategory).mockReturnValueOnce({
      mutate: updateCategoryMock,
      isError: true,
      error: new Error("Failed to update category"),
      isPending: false,
    } as any);
    rerender(<EditCategory />);
    // assert
    expect(screen.getByText("Failed to update category"));
    expect(updateCategoryMock).toHaveBeenCalledOnce();
  });

  it("Should render deleteCategory error when error deleting category", async () => {
    const user = userEvent.setup();
    const deleteCategoryMock = vi.fn();
    vi.mocked(useDeleteCategory).mockReturnValue({
      mutate: deleteCategoryMock,
      isError: false,
      error: null,
      isPending: false,
    } as any);

    const { rerender } = render(<EditCategory />);

    // act
    const deleteBtn = screen.getByRole("button", { name: "Delete" });
    await user.click(deleteBtn);
    expect(deleteCategoryMock).toHaveBeenCalledOnce();

    vi.mocked(useDeleteCategory).mockReturnValueOnce({
      mutate: deleteCategoryMock,
      isError: true,
      error: new Error("Failed to delete category"),
      isPending: false,
    } as any);
    rerender(<EditCategory />);
    // assert
    expect(screen.getByText("Failed to delete category"));
    expect(deleteCategoryMock).toHaveBeenCalledOnce();
  });
});
