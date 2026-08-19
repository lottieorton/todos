import { createContext, useContext, type ReactNode } from "react";
import type { Category } from "../interfaces/Category";
import { useCategories } from "../hooks/useCategories";

interface CategoryContextType {
  categories: Category[];
  isCategoriesLoading: boolean;
  isCategoriesError: boolean;
  categoriesError: Error | null;
}

export const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined,
);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useCategories();

  return (
    <CategoryContext.Provider
      value={{
        categories,
        isCategoriesLoading,
        isCategoriesError,
        categoriesError,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryContext(): CategoryContextType {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error(
      "useCategoryContext must be used within a CategoryProvider",
    );
  }
  return context;
}
