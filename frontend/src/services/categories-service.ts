import { FailedCreateError, FetchError } from "../errors/errors";
import type { Category } from "../interfaces/Category";

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await fetch("http://localhost:8080/categories");
  if (!response.ok) {
    throw new FetchError("Failed to fetch categories");
  }
  return response.json();
};

export const createCategory = async (name: string): Promise<Category> => {
  const response = await fetch("http://localhost:8080/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (response.status != 201) {
    throw new FailedCreateError("Failed to create category");
  }
  return response.json();
};
