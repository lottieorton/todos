import type { Todo } from "../../interfaces/Todo";
import CheckButton from "../buttons/CheckButton/CheckButton";
import classes from "./Todo.module.scss";

interface TodoProps {
  todo: Todo;
}

export default function Todo({ todo }: TodoProps) {
  return (
    <article className={classes.todo}>
      <CheckButton />
      <div className={classes.content}>
        <h3 className={classes.heading}>{todo.name}</h3>
        <div className={classes.category}>
          <i
            className={`fa-solid fa-tag ${classes.icon}`}
            aria-label="category"
          ></i>
          <h4 className={classes.categoryText}>
            {todo.category.toUpperCase()}
          </h4>
        </div>
      </div>
    </article>
  );
}
