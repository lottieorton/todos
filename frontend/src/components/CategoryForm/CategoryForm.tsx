import AddButton from "../Buttons/AddButton/AddButton";
import classes from "./CategoryForm.module.scss";

export default function CategoryForm() {
  return (
    <div className="categoryForm">
      <section className="section">
        <form className={classes.form}>
          <i className={`fa-solid fa-tag ${classes.icon}`}></i>
          <input
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
