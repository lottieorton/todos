import AddButton from "../Buttons/AddButton/AddButton";
import classes from "./TodoForm.module.scss";
import type { Category } from "../../interfaces/Category";

interface TodoFormProps {
  categories: Category[];
}

export default function TodoForm({ categories }: TodoFormProps) {
  return (
    <form
      className={classes.form + " section todoForm"}
      // onSubmit={}
    >
      <div className={classes.categorySection}>
        <i className={`fa-solid fa-tag ${classes.icon}`}></i>
        <select name="category" className={classes.category}>
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
          name="name"
        />
        <AddButton>
          <i className="fa-solid fa-plus"></i>
        </AddButton>
      </div>
    </form>
  );
}
