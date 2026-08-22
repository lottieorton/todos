import {
  FailedCreateError,
  FailedDeleteError,
  FailedUpdateError,
  FetchError,
} from "../errors/errors";
import type { Category } from "../interfaces/Category";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) {
    throw new FetchError("Failed to fetch categories");
  }
  return response.json();
};

export const createCategory = async (name: string): Promise<Category> => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (response.status != 201) {
    const errorResponseBody = await response.json().catch(() => null);
    if (errorResponseBody?.message.includes("Maximum limit")) {
      throw new FailedCreateError("Maximum category limit reached");
    }
    throw new FailedCreateError(
      errorResponseBody?.error ?? "Failed to create category",
    );
  }
  return response.json();
};

export const updateCategory = async (
  id: number,
  name: string,
): Promise<Category> => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const errorResponseBody = await response.json().catch(() => null);
    throw new FailedUpdateError(
      errorResponseBody?.error ?? "Failed to update category",
    );
  }
  return response.json();
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorResponseBody = await response.json().catch(() => null);
    throw new FailedDeleteError(
      errorResponseBody?.error ?? "Failed to delete category",
    );
  }
  return true;
};
