import {
  FailedCreateError,
  FailedDeleteError,
  FailedUpdateError,
  FetchError,
} from "../errors/errors";
import type { Todo } from "../interfaces/Todo";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8082";

export const getAllTodos = async (categoryId?: number): Promise<Todo[]> => {
  const categoryFilter = categoryId ? `?category=${categoryId}` : "";
  const response = await fetch(`${API_URL}/todos${categoryFilter}`);
  if (!response.ok) {
    throw new FetchError("Failed to fetch todos");
  }
  return response.json();
};

export const createTodo = async (
  name: string,
  categoryId: number,
): Promise<Todo> => {
  const response = await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, categoryId }),
  });
  if (response.status !== 201) {
    const errorResponseBody = await response.json().catch(() => null);
    throw new FailedCreateError(
      errorResponseBody?.error ?? "Failed to create todo",
    );
  }
  return response.json();
};

export const updateTodo = async (
  id: number,
  name?: string,
  categoryId?: number,
  isComplete?: boolean,
): Promise<Todo> => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, categoryId, isComplete }),
  });
  if (!response.ok) {
    const errorResponseBody = await response.json().catch(() => null);
    throw new FailedUpdateError(
      errorResponseBody?.error ?? "Failed to update todo",
    );
  }
  return response.json();
};

export const deleteTodo = async (id: number): Promise<boolean> => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorResponseBody = await response?.json().catch(() => null);
    throw new FailedDeleteError(
      errorResponseBody?.error ?? "Failed to delete todo",
    );
  }
  return true;
};
