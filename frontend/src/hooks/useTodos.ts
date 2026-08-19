import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Todo } from "../interfaces/Todo";
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  updateTodo,
} from "../services/todos-service";

export const TODOS_KEY = ["todos"];

export function useTodos(categoryId?: number) {
  return useQuery<Todo[]>({
    queryKey: [...TODOS_KEY, categoryId],
    queryFn: () => getAllTodos(categoryId),
  });
}

interface CreateTodoPayload {
  name: string;
  categoryId: number;
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, CreateTodoPayload>({
    mutationFn: ({ name, categoryId }) => createTodo(name, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}

interface UpdateTodoPayload {
  id: number;
  name?: string;
  categoryId?: number;
  isComplete?: boolean;
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, UpdateTodoPayload>({
    mutationFn: ({ id, name, categoryId, isComplete }) =>
      updateTodo(id, name, categoryId, isComplete),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: (id) => deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}
