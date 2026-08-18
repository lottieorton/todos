import { useForm, type SubmitHandler } from "react-hook-form";
import type { TodoFormData } from "../../interfaces/TodoFormData";
import TodoForm from "../TodoForm/TodoForm";
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

  const formMethods = useForm<TodoFormData>();

  const onSubmit: SubmitHandler<TodoFormData, void> = (d): void => {
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
    <TodoForm
      formMethods={formMethods}
      onSubmit={onSubmit}
      formText={formText}
      errorMsg={errorMsg}
    />
  );
}
