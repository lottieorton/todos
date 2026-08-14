import AddButton from "../Buttons/AddButton/AddButton";
import classes from "./CategoryForm.module.scss";
import { useForm, type SubmitHandler } from "react-hook-form";

interface CategoryFormProps {
  handleNewCategory: (newCategory: string) => void;
}

interface CategoryFormData {
  name: string;
}

export default function CategoryForm({ handleNewCategory }: CategoryFormProps) {
  const { register, handleSubmit, reset } = useForm<CategoryFormData>();

  const onSubmit: SubmitHandler<CategoryFormData, void> = (d): void => {
    console.log(d.name);
    if (d.name) {
      handleNewCategory(d.name);
    }
    reset();
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
    </div>
  );
}
