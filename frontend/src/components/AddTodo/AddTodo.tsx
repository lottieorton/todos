import { useCreateTodo } from "../../hooks/useTodos";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { MultiFieldFormData } from "../../interfaces/MultiFieldFormData";
import MultiFieldForm from "../MultiFieldForm/MultiFieldForm";
import { useState } from "react";

export default function AddTodo() {
  const {
    mutate: createTodo,
    isError: isTodosError,
    error: todosError,
  } = useCreateTodo();

  const [formError, setFormError] = useState<string | null>(null);

  const formMethods = useForm<MultiFieldFormData>();

  const onSubmit: SubmitHandler<MultiFieldFormData, void> = (d): void => {
    if (!d.name || d.name.trim() === "") {
      setFormError("Must enter a name");
    } else if (!d.categoryId) {
      setFormError("Must select a category");
    } else if (d.name && d.categoryId) {
      const data = {
        name: d.name,
        categoryId: d.categoryId,
      };
      setFormError(null);
      createTodo(data, {
        onSuccess: () => {
          formMethods.reset();
        },
      });
    }
  };

  const formText = {
    categorySelection: "Select a category",
    inputPlaceholder: "Add a task...",
    btn: "add",
    isBtnRounded: true,
  } as const;

  const errorMsg = (isTodosError && todosError.message) || formError || null;

  return (
    <div data-testid="add-todo">
      <MultiFieldForm
        formMethods={formMethods}
        onSubmit={onSubmit}
        formText={formText}
        errorMsg={errorMsg}
      />
    </div>
  );
}
