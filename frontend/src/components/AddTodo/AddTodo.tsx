import { useCreateTodo } from "../../hooks/useTodos";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { TodoFormData } from "../../interfaces/TodoFormData";
import TodoForm from "../TodoForm/TodoForm";

export default function AddTodo() {
  const {
    mutate: createTodo,
    isError: isTodosError,
    error: todosError,
  } = useCreateTodo();

  const formMethods = useForm<TodoFormData>();

  const onSubmit: SubmitHandler<TodoFormData, void> = (d): void => {
    if (d.name && d.categoryId) {
      const data = {
        name: d.name,
        categoryId: d.categoryId,
      };
      createTodo(data, {
        onSuccess: () => {
          formMethods.reset();
        },
      });
    }
  };

  const formText = {
    categorySelection: "Select a category",
    todoPlaceholder: "Add a task...",
    btn: "add",
    isBtnRounded: true,
  } as const;

  if (isTodosError) return <div>{todosError.message}</div>;

  return (
    <TodoForm
      formMethods={formMethods}
      onSubmit={onSubmit}
      formText={formText}
    />
  );
}
