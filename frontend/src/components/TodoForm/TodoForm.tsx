import classes from "./TodoForm.module.scss";
import { type SubmitHandler, type UseFormReturn } from "react-hook-form";
import type { TodoFormData } from "../../interfaces/TodoFormData";
import FormButton from "../buttons/FormButton/FormButton";
import IconButton from "../buttons/IconButton/IconButton";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useCategoryContext } from "../../context/CategoryContext";

interface TodoFormProps {
  formMethods: UseFormReturn<TodoFormData>;
  onSubmit: SubmitHandler<TodoFormData>;
  handleDelete?: (id: number) => void;
  formText: {
    categorySelection: string;
    inputPlaceholder: string;
    btn: "add" | "edit" | "editDelete";
    isBtnRounded?: boolean;
  };
  errorMsg?: string | null;
}

export default function TodoForm({
  formMethods,
  handleDelete,
  onSubmit,
  formText: { categorySelection, inputPlaceholder, btn, isBtnRounded = false },
  errorMsg,
}: TodoFormProps) {
  const { categories, isCategoriesLoading } = useCategoryContext();

  const { register, handleSubmit } = formMethods;

  const handleDeleteClick = () => {
    const selectedCategory = formMethods.getValues("categoryId");
    if (selectedCategory && handleDelete) {
      handleDelete(selectedCategory);
    }
  };

  if (isCategoriesLoading) return <div>Loading...</div>;

  return (
    <form
      className={classes.form + " section todoForm"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={classes.categorySection}>
        {btn === "editDelete" ? (
          <i
            className={`fa-solid fa-pencil ${classes.icon}`}
            aria-label="editIcon"
          ></i>
        ) : (
          <i
            className={`fa-solid fa-tag ${classes.icon}`}
            aria-label="categoryIcon"
          ></i>
        )}
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
          placeholder={inputPlaceholder}
          {...register("name")}
        />
        <div className={classes.btnContainer}>
          <FormButton isRounded={isBtnRounded}>
            {btn === "add" && (
              <i className="fa-solid fa-plus" aria-label="add"></i>
            )}
            {(btn === "edit" || btn === "editDelete") && "Update"}
          </FormButton>
          {btn === "editDelete" && (
            <IconButton color={"red"} handleClick={handleDeleteClick}>
              <i className="fa-solid fa-trash"></i>
            </IconButton>
          )}
        </div>
      </div>
      {errorMsg && <ErrorMessage msg={errorMsg} dataType="task" />}
    </form>
  );
}
