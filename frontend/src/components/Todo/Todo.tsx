import { useState } from "react";
import type { Todo } from "../../interfaces/Todo";
import CheckButton from "../buttons/CheckButton/CheckButton";
import IconButton from "../buttons/IconButton/IconButton";
import classes from "./Todo.module.scss";
import EditTodo from "../EditTodo/EditTodo";
import { useDeleteTodo, useUpdateTodo } from "../../hooks/useTodos";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

interface TodoProps {
  todo: Todo;
}

export default function Todo({ todo }: TodoProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    mutate: updateTodo,
    isError: isTodosUpdateError,
    error: todosUpdateError,
  } = useUpdateTodo();

  const {
    mutate: deleteTodo,
    isError: isTodosDeleteError,
    error: todosDeleteError,
  } = useDeleteTodo();

  const toggleComplete = () => {
    const data = {
      id: todo.id,
      isComplete: !todo.isComplete,
    };
    updateTodo(data);
  };

  const toggleIsEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const handleDeleteClick = (): void => {
    deleteTodo(todo.id);
  };

  const hasErrors =
    (isTodosDeleteError && todosDeleteError.message) ||
    (isTodosUpdateError && todosUpdateError.message) ||
    null;

  return (
    <article className={classes.todo}>
      <CheckButton
        isComplete={todo.isComplete}
        toggleComplete={toggleComplete}
      />
      <div className={classes.content}>
        <h3
          className={`${classes.heading} ${todo.isComplete && classes.heading_checked}`}
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

      {hasErrors && (
        <div className={classes.errorMessage}>
          <ErrorMessage msg={hasErrors} dataType="task" />
        </div>
      )}
    </article>
  );
}
