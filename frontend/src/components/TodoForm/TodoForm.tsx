import AddButton from "../Buttons/AddButton/AddButton";
import classes from "./TodoForm.module.scss";

export default function TodoForm() {
  return (
    <form className={classes.form + " section todoForm"}>
      <div className={classes.categorySection}>
        <i className={`fa-solid fa-tag ${classes.icon}`}></i>
        <select id="category" className={classes.category}>
          <option value="" disabled>
            Select a category
          </option>
          <option value="cleaning">Cleaning</option>
          <option value="cleaning">Exercise</option>
        </select>
      </div>
      <div className={classes.todo}>
        <input
          type="text"
          className={classes.inputField}
          placeholder="Add a task..."
        />
        <AddButton>+</AddButton>
      </div>
    </form>
  );
}
