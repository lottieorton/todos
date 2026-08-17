import { useState } from "react";
import type { Todo } from "../../interfaces/Todo";
import CheckButton from "../buttons/CheckButton/CheckButton";
import IconButton from "../buttons/IconButton/IconButton";
import classes from "./Todo.module.scss";
import EditTodo from "../EditTodo/EditTodo";
import { useDeleteTodo } from "../../hooks/useTodos";

interface TodoProps {
  todo: Todo;
}

export default function Todo({ todo }: TodoProps) {
  const [isComplete, setIsComplete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const toggleComplete = () => {
    setIsComplete((prev) => !prev);
  };

  const toggleIsEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const {
    mutate: deleteTodo,
    isError: isTodosError,
    error: todosError,
  } = useDeleteTodo();

  const handleDeleteClick = (): void => {
    deleteTodo(todo.id);
  };

  if (isTodosError) return <div>{todosError.message}</div>;

  return (
    <article className={classes.todo}>
      <CheckButton isComplete={isComplete} toggleComplete={toggleComplete} />
      <div className={classes.content}>
        <h3
          className={`${classes.heading} ${isComplete && classes.heading_checked}`}
        >
          {todo.name}
        </h3>
        <div className={classes.category}>
          <i
            className={`fa-solid fa-tag ${classes.categoryIcon}`}
            aria-label="category"
          ></i>
          <h4 className={classes.categoryText}>
            {todo.category.toUpperCase()}
          </h4>
        </div>
      </div>
      <div className={classes.editIcons}>
        <IconButton color={"green"} handleClick={toggleIsEditing}>
          <i className="fa-solid fa-pencil"></i>
        </IconButton>
        <IconButton color={"red"} handleClick={handleDeleteClick}>
          <i className="fa-solid fa-trash"></i>
        </IconButton>
      </div>

      {isEditing && (
        <div className={classes.editTodo}>
          <EditTodo id={todo.id} toggleIsEditing={toggleIsEditing} />
        </div>
      )}
    </article>
  );
}
