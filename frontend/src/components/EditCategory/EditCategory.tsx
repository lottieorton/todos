import { useForm, type SubmitHandler } from "react-hook-form";
import MultiFieldForm from "../MultiFieldForm/MultiFieldForm";
import {
  useDeleteCategory,
  useUpdateCategory,
} from "../../hooks/useCategories";
import { type MultiFieldFormData } from "../../interfaces/MultiFieldFormData";

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

  const formMethods = useForm<MultiFieldFormData>();

  const onUpdateSubmit: SubmitHandler<MultiFieldFormData> = (d): void => {
    const data = {
      id: d.categoryId,
      name: d.name,
    };

    updateCategory(data, {
      onSuccess: () => {
        formMethods.reset();
      },
    });
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
    (isCategoriesUpdateError && categoriesUpdateError?.message) ||
    (isCategoriesDeleteError && categoriesDeleteError?.message) ||
    null;

  return (
    <div data-testid="edit-category" className="editCategoryForm">
      <MultiFieldForm
        formMethods={formMethods}
        onSubmit={onUpdateSubmit}
        handleDelete={handleDelete}
        formText={formText}
        errorMsg={errorMsg}
      />
    </div>
  );
}
