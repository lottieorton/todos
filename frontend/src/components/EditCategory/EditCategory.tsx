import { useForm, type SubmitHandler } from "react-hook-form";
import TodoForm from "../TodoForm/TodoForm";
import {
  useDeleteCategory,
  useUpdateCategory,
} from "../../hooks/useCategories";
import { useState } from "react";

interface FormData {
  name: string;
  categoryId: number;
}

export default function EditCategory() {
  const {
    mutate: updateCategory,
    isError: isCategoriesUpdateError,
    error: categoriesUpdateError,
  } = useUpdateCategory();

  const {
    mutate: deleteCategory,
    isError: isCategoriesDeleteError,
    error: categoriesDeleteError,
  } = useDeleteCategory();

  const formMethods = useForm<FormData>();

  const [formError, setFormError] = useState<string | null>(null);

  const onUpdateSubmit: SubmitHandler<FormData, void> = (d): void => {
    if (!d.name || d.name.trim() === "") {
      setFormError("Must enter a name");
    } else if (!d.categoryId) {
      setFormError("Must select a category");
    } else if (d.name && d.categoryId) {
      const data = {
        id: d.categoryId,
        name: d.name,
      };
      setFormError(null);

      updateCategory(data, {
        onSuccess: () => {
          formMethods.reset();
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    deleteCategory(id);
  };

  const formText = {
    categorySelection: "Update category",
    inputPlaceholder: "Update category name...",
    btn: "editDelete",
  } as const;

  const errorMsg =
    (isCategoriesUpdateError && categoriesUpdateError.message) ||
    (isCategoriesDeleteError && categoriesDeleteError.message) ||
    formError ||
    null;

  return (
    <div data-testid="edit-category" className="editCategoryForm">
      <TodoForm
        formMethods={formMethods}
        onSubmit={onUpdateSubmit}
        handleDelete={handleDelete}
        formText={formText}
        errorMsg={errorMsg}
      />
    </div>
  );
}
