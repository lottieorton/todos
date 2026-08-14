import { useCreateCategory } from "../../hooks/useCategories";
import AddButton from "../Buttons/AddButton/AddButton";
import classes from "./CategoryForm.module.scss";
import { useForm, type SubmitHandler } from "react-hook-form";

interface CategoryFormData {
  name: string;
}

export default function CategoryForm() {
  // const createCategoryMutation = useCreateCategory();
  const { mutate: createCategory, isError, error } = useCreateCategory();

  const { register, handleSubmit, reset } = useForm<CategoryFormData>();

  const onSubmit: SubmitHandler<CategoryFormData, void> = (d): void => {
    if (d.name) {
      createCategory(d.name, {
        onSuccess: () => {
          reset();
        },
      });
    }
  };

  return (
    <div className="categoryForm">
      <section className="section">
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <i className={`fa-solid fa-tag ${classes.icon}`}></i>
          <input
            {...register("name", { required: true })}
            type="text"
            className={classes.inputField}
            placeholder="Add a category..."
          />
          <AddButton>
            <i className="fa-solid fa-plus"></i>
          </AddButton>
        </form>
      </section>
      {isError && (
        <div>
          {error?.message || "Failed to create category. Please try again."}
        </div>
      )}
    </div>
  );
}
