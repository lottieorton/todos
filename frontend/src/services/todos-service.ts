import { FailedCreateError, FetchError } from "../errors/errors";
import type { Todo } from "../interfaces/Todo";

export const getAllTodos = async (): Promise<Todo[]> => {
  const response = await fetch("http://localhost:8080/todos");
  if (!response.ok) {
    throw new FetchError("Failed to fetch todos");
  }
  return response.json();
};

export const createTodo = async (
  name: string,
  categoryId: number,
): Promise<Todo> => {
  const response = await fetch("http://localhost:8080/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, categoryId }),
  });
  if (response.status !== 201) {
    const errorResponseBody = await response.json().catch(() => null);
    throw new FailedCreateError(
      errorResponseBody?.message ?? "Failed to create todo",
    );
  }
  return response.json();
};
