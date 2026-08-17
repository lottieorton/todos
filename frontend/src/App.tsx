import "./App.scss";
import Header from "./components/Header/Header";
import CategoryForm from "./components/CategoryForm/CategoryForm";
import TodoList from "./components/TodoList/TodoList";
import SidebarHeader from "./components/SidebarHeader/SidebarHeader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddTodo from "./components/AddTodo/AddTodo";
import EditCategory from "./components/EditCategory/EditCategory";
import CategoryList from "./components/CategoryList/CategoryList";
import { useState } from "react";

const queryClient = new QueryClient();

function App() {
  const [filterCategoryId, setFilterCategoryId] = useState<number | undefined>(
    undefined,
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="main">
        <SidebarHeader />
        <Header />
        <CategoryForm />
        <AddTodo />
        <EditCategory />
        <CategoryList
          categoryId={filterCategoryId}
          handleFilter={setFilterCategoryId}
        />
        <TodoList categoryId={filterCategoryId} />
        <div className="sidebarBackground" data-testid="sidebarBackground" />
      </div>
    </QueryClientProvider>
  );
}

export default App;
