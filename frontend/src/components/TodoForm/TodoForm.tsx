import classes from "./TodoForm.module.scss";
import { useCategories } from "../../hooks/useCategories";
import { type SubmitHandler, type UseFormReturn } from "react-hook-form";
import type { TodoFormData } from "../../interfaces/TodoFormData";
import FormButton from "../buttons/FormButton/FormButton";

interface TodoFormProps {
  formMethods: UseFormReturn<TodoFormData>;
  onSubmit: SubmitHandler<TodoFormData>;
  formText: {
    categorySelection: string;
    todoPlaceholder: string;
    btn: "add" | "edit";
    isBtnRounded?: boolean;
  };
}

export default function TodoForm({
  formMethods,
  onSubmit,
  formText: { categorySelection, todoPlaceholder, btn, isBtnRounded = false },
}: TodoFormProps) {
  const {
    data: categories = [],
    isLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useCategories();

  const { register, handleSubmit } = formMethods;

  if (isLoading) return <div>Loading...</div>;

  if (isCategoriesError) return <div>{categoriesError.message}</div>;

  return (
    <form
      className={classes.form + " section todoForm"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={classes.categorySection}>
        <i
          className={`fa-solid fa-tag ${classes.icon}`}
          aria-label="categoryIcon"
        ></i>
        <select className={classes.category} {...register("categoryId")}>
          <option value="">{categorySelection}</option>
          {categories.map((c) => {
            return (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className={classes.todo}>
        <input
          type="text"
          className={classes.inputField}
          placeholder={todoPlaceholder}
          {...register("name")}
        />
        <FormButton isRounded={isBtnRounded}>
          {btn === "add" && (
            <i className="fa-solid fa-plus" aria-label="add"></i>
          )}
          {btn === "edit" && "Update"}
        </FormButton>
      </div>
    </form>
  );
}
