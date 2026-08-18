import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../services/categories-service";
import type { Category } from "../interfaces/Category";
import { TODOS_KEY } from "./useTodos";

export const CATEGORIES_KEY = ["categories"];

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: CATEGORIES_KEY,
    queryFn: getAllCategories,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, string>({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
}

interface UpdateCategoryPayload {
  id: number;
  name: string;
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, UpdateCategoryPayload>({
    mutationFn: ({ id, name }) => updateCategory(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
}
