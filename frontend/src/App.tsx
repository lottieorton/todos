import { useEffect } from "react";
import "./App.scss";
import Header from "./components/Header/Header";
import CategoryForm from "./components/CategoryForm/CategoryForm";
import TodoList from "./components/TodoList/TodoList";

function App() {
  useEffect(() => {
    fetch("http://localhost:8080/categories")
      .then((response) => response.json())
      .then(console.log)
      .catch((e) => e.message);
  });

  return (
    <div className="main">
      <Header />
      <CategoryForm />
      <TodoList />
    </div>
  );
}

export default App;
