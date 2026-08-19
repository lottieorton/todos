import { useForm, type SubmitHandler } from "react-hook-form";
import type { MultiFieldFormData } from "../../interfaces/MultiFieldFormData";
import MultiFieldForm from "../MultiFieldForm/MultiFieldForm";
import { useUpdateTodo } from "../../hooks/useTodos";

interface EditTodoProps {
  id: number;
  toggleIsEditing: () => void;
}

interface FormData {
  id: number;
  name?: string;
  categoryId?: number;
}

export default function EditTodo({ id, toggleIsEditing }: EditTodoProps) {
  const {
    mutate: updateTodo,
    isError: isTodosError,
    error: todosError,
  } = useUpdateTodo();

  const formMethods = useForm<MultiFieldFormData>();

  const onSubmit: SubmitHandler<MultiFieldFormData, void> = (d): void => {
    const data: FormData = { id };
    if (d.name) data.name = d.name;
    if (d.categoryId) data.categoryId = d.categoryId;

    updateTodo(data, {
      onSuccess: () => {
        formMethods.reset();
        toggleIsEditing();
      },
    });
  };

  const formText = {
    categorySelection: "Choose category",
    inputPlaceholder: "Update task name...",
    btn: "edit",
  } as const;

  const errorMsg = (isTodosError && todosError.message) || null;

  return (
    <MultiFieldForm
      formMethods={formMethods}
      onSubmit={onSubmit}
      formText={formText}
      errorMsg={errorMsg}
    />
  );
}
