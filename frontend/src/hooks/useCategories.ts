import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  getAllCategories,
} from "../services/categories-service";
import type { Category } from "../interfaces/Category";

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
