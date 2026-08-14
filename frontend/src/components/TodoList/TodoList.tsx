import classes from "./TodoList.module.scss";
import Todo from "../Todo/Todo";

export default function TodoList() {
  return (
    <section className="todoList">
      <div className={classes.container + " section"}>
        <Todo />
        <Todo />
        <Todo />
        <Todo />
      </div>
    </section>
  );
}
