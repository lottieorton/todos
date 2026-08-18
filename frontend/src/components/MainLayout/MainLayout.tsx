import { useState } from "react";
import SidebarHeader from "../SidebarHeader/SidebarHeader";
import Header from "../Header/Header";
import CategoryForm from "../CategoryForm/CategoryForm";
import AddTodo from "../AddTodo/AddTodo";
import EditCategory from "../EditCategory/EditCategory";
import CategoryList from "../CategoryList/CategoryList";
import TodoList from "../TodoList/TodoList";
import { useTodos } from "../../hooks/useTodos";
import { useCategoryContext } from "../../context/CategoryContext";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function MainLayout() {
  const [filterCategoryId, setFilterCategoryId] = useState<number | undefined>(
    undefined,
  );

  const {
    data: allTodos = [],
    isLoading: isAllTodosLoading,
    isError: isAllTodosError,
  } = useTodos();

  const {
    data: filteredTodos = [],
    isLoading: isFilteredTodosLoading,
    isError: isFilteredTodosError,
  } = useTodos(filterCategoryId);

  const { isCategoriesError } = useCategoryContext();

  const isGlobalError =
    isFilteredTodosError || isAllTodosError || isCategoriesError;

  return (
    <main className="main">
      <SidebarHeader />
      <Header />
      {isGlobalError ? (
        <div className="errorMsg">
          <ErrorMessage msg="Network Connection" dataType="task" />
        </div>
      ) : (
        <>
          <CategoryForm />
          <AddTodo />
          <EditCategory />
          <CategoryList
            categoryId={filterCategoryId}
            handleFilter={setFilterCategoryId}
            todos={allTodos}
          />
          <TodoList
            todos={filteredTodos}
            isLoading={isFilteredTodosLoading || isAllTodosLoading}
          />
          <div className="sidebarBackground" data-testid="sidebarBackground" />
        </>
      )}
    </main>
  );
}
