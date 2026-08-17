import { useForm, type SubmitHandler } from "react-hook-form";
import TodoForm from "../TodoForm/TodoForm";
import {
  useDeleteCategory,
  useUpdateCategory,
} from "../../hooks/useCategories";

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

  const onUpdateSubmit: SubmitHandler<FormData, void> = (d): void => {
    if (d.name && d.categoryId) {
      const data = {
        id: d.categoryId,
        name: d.name,
      };

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

  if (isCategoriesUpdateError)
    return <div>{categoriesUpdateError.message}</div>;

  if (isCategoriesDeleteError)
    return <div>{categoriesDeleteError.message}</div>;

  return (
    <div data-testid="edit-category">
      <TodoForm
        formMethods={formMethods}
        onSubmit={onUpdateSubmit}
        handleDelete={handleDelete}
        formText={formText}
      />
    </div>
  );
}
