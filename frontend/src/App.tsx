import { useEffect } from "react";
import "./App.scss";
import Header from "./components/Header/Header";
import CategoryForm from "./components/CategoryForm/CategoryForm";
import TodoList from "./components/TodoList/TodoList";
import TodoForm from "./components/TodoForm/TodoForm";
import SidebarHeader from "./components/SidebarHeader/SidebarHeader";

function App() {
  useEffect(() => {
    fetch("http://localhost:8080/categories")
      .then((response) => response.json())
      .then(console.log)
      .catch((e) => e.message);
  });

  return (
    <div className="main">
      <SidebarHeader />
      <Header />
      <CategoryForm />
      <TodoForm />
      <TodoList />
      <div className="sidebarBackground" />
    </div>
  );
}

export default App;
