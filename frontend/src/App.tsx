import { useEffect, useState } from "react";
import "./App.scss";
import Header from "./components/Header/Header";
import CategoryForm from "./components/CategoryForm/CategoryForm";
import TodoList from "./components/TodoList/TodoList";
import TodoForm from "./components/TodoForm/TodoForm";
import SidebarHeader from "./components/SidebarHeader/SidebarHeader";
import type { Category } from "./interfaces/Category";
import {
  createCategory,
  getAllCategories,
} from "./services/categories-service";

function App() {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = (): void => {
    getAllCategories()
      .then((data) => setCategories(data))
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNewCategory = (newCategory: string): void => {
    createCategory(newCategory)
      .then(console.log)
      .then(() => {
        fetchCategories();
      })
      .catch((e) => console.log(e.message));
  };

  return (
    <div className="main">
      <SidebarHeader />
      <Header />
      <CategoryForm handleNewCategory={handleNewCategory} />
      <TodoForm categories={categories} />
      <TodoList />
      <div className="sidebarBackground" />
    </div>
  );
}

export default App;
