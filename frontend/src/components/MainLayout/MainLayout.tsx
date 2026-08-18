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
    data: todos = [],
    isLoading: isTodosLoading,
    isError: isTodosError,
  } = useTodos(filterCategoryId);

  const { isCategoriesError } = useCategoryContext();

  const isGlobalError = isTodosError || isCategoriesError;

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
          />
          <TodoList todos={todos} isLoading={isTodosLoading} />
          <div className="sidebarBackground" data-testid="sidebarBackground" />
        </>
      )}
    </main>
  );
}
