import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Todo } from "../interfaces/Todo";
import { createTodo, getAllTodos } from "../services/todos-service";

export const TODOS_KEY = ["todos"];

export function useTodos() {
  return useQuery<Todo[]>({
    queryKey: TODOS_KEY,
    queryFn: getAllTodos,
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
