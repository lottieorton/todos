import {
  FailedCreateError,
  FailedDeleteError,
  FailedUpdateError,
  FetchError,
} from "../errors/errors";
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
    const errorResponseBody = await response.json().catch(() => null);
    throw new FailedCreateError(
      errorResponseBody?.message ?? "Failed to create category",
    );
  }
  return response.json();
};

export const updateCategory = async (
  id: number,
  name: string,
): Promise<Category> => {
  const response = await fetch(`http://localhost:8080/categories/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const errorResponseBody = await response.json().catch(() => null);
    throw new FailedUpdateError(
      errorResponseBody?.message ?? "Failed to update category",
    );
  }
  return response.json();
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  const response = await fetch(`http://localhost:8080/categories/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorResponseBody = await response.json().catch(() => null);
    throw new FailedDeleteError(
      errorResponseBody?.message ?? "Failed to delete category",
    );
  }
  return true;
};
