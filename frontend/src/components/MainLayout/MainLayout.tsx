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
import GlobalMessage from "../GlobalMessage/GlobalMessage";

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
        <GlobalMessage
          type="error"
          msg="Something went wrong. Please try again!"
        >
          <i className="fa-solid fa-triangle-exclamation"></i>
        </GlobalMessage>
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
          {isFilteredTodosLoading || isAllTodosLoading ? (
            <GlobalMessage type="loading" msg="Loading...">
              <i className="fa-solid fa-spinner"></i>
            </GlobalMessage>
          ) : (
            <TodoList todos={filteredTodos} />
          )}
        </>
      )}
      <div className="sidebarBackground" data-testid="sidebarBackground" />
    </main>
  );
}
