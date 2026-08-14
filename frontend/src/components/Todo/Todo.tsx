import CheckButton from "../Buttons/CheckButton/CheckButton";
import classes from "./Todo.module.scss";

export default function Todo() {
  return (
    <article className={classes.todo}>
      <CheckButton />
      <div className={classes.content}>
        <h3 className={classes.heading}>Go to the gym</h3>
        <div className={classes.category}>
          <i className={`fa-solid fa-tag ${classes.icon}`}></i>
          <h4 className={classes.categoryText}>CATEGORY</h4>
        </div>
      </div>
    </article>
  );
}
