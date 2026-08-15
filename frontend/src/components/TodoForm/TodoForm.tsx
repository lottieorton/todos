import AddButton from "../buttons/AddButton/AddButton";
import classes from "./TodoForm.module.scss";
import { useCategories } from "../../hooks/useCategories";
import { useCreateTodo } from "../../hooks/useTodos";
import { useForm, type SubmitHandler } from "react-hook-form";

interface TodoFormData {
  name: string;
  categoryId: number;
}

export default function TodoForm() {
  const {
    data: categories = [],
    isLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useCategories();

  const {
    mutate: createTodo,
    isError: isTodosError,
    error: todosError,
  } = useCreateTodo();

  const { register, handleSubmit, reset } = useForm<TodoFormData>();

  const onSubmit: SubmitHandler<TodoFormData, void> = (d): void => {
    if (d.name && d.categoryId) {
      const data = {
        name: d.name,
        categoryId: d.categoryId,
      };
      createTodo(data, {
        onSuccess: () => {
          reset();
        },
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  if (isCategoriesError) return <div>{categoriesError.message}</div>;

  if (isTodosError) return <div>{todosError.message}</div>;

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
          <option value="">Select a category</option>
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
          placeholder="Add a task..."
          {...register("name")}
        />
        <AddButton>
          <i className="fa-solid fa-plus" aria-label="add"></i>
        </AddButton>
      </div>
    </form>
  );
}
