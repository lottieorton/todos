import { useCreateCategory } from "../../hooks/useCategories";
import FormButton from "../buttons/FormButton/FormButton";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import classes from "./CategoryForm.module.scss";
import { useForm, type SubmitHandler } from "react-hook-form";

interface CategoryFormData {
  name: string;
}

export default function CategoryForm() {
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

  const errorMsg = error?.message || null;

  return (
    <div className="categoryForm">
      <section className="section">
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <i
            className={`fa-solid fa-tag ${classes.icon}`}
            data-testid="categoryIcon"
          ></i>
          <input
            {...register("name", { required: true })}
            type="text"
            className={classes.inputField}
            placeholder="Add a category..."
          />
          <FormButton isRounded>
            <i className="fa-solid fa-plus"></i>
          </FormButton>
          {isError && (
            <div className={classes.errorMsg}>
              <ErrorMessage msg={errorMsg} />
            </div>
          )}
        </form>
      </section>
    </div>
  );
}
