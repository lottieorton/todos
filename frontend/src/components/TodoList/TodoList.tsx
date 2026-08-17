import classes from "./TodoList.module.scss";
import Todo from "../Todo/Todo";
import { useTodos } from "../../hooks/useTodos";

export default function TodoList() {
  const {
    data: todos = [],
    isLoading,
    isError: isTodosError,
    error,
  } = useTodos();

  if (isLoading) return <div data-testid="todoList">Loading...</div>;
  if (isTodosError) return <div>{error.message}</div>;

  return (
    <section className="todoList" data-testid="todoList">
      <div className={classes.container + " section"}>
        {todos.map((t) => {
          return <Todo key={t.id} todo={t} />;
        })}
      </div>
    </section>
  );
}
