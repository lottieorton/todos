import AddButton from "../buttons/AddButton/AddButton";
import classes from "./TodoForm.module.scss";
import { useCategories } from "../../hooks/useCategories";

export default function TodoForm() {
  const {
    data: categories = [],
    isLoading,
    isError: isCategoriesError,
  } = useCategories();

  if (isLoading) return <div>Loading...</div>;

  if (isCategoriesError) return <div>Error</div>;

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
