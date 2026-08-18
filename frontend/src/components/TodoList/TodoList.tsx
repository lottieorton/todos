import classes from "./TodoList.module.scss";
import TodoItem from "../Todo/Todo";
import type { Todo } from "../../interfaces/Todo";

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
}

export default function TodoList({ todos, isLoading }: TodoListProps) {
  if (isLoading) return <div data-testid="todoList">Loading...</div>;

  return (
    <section className="todoList" data-testid="todoList">
      <div className={classes.container + " section"}>
        {todos.map((t) => {
          return <TodoItem key={t.id} todo={t} />;
        })}
      </div>
    </section>
  );
}
