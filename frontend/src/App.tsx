import "./App.scss";
import Header from "./components/Header/Header";
import CategoryForm from "./components/CategoryForm/CategoryForm";
import TodoList from "./components/TodoList/TodoList";
import TodoForm from "./components/TodoForm/TodoForm";
import SidebarHeader from "./components/SidebarHeader/SidebarHeader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="main">
        <SidebarHeader />
        <Header />
        <CategoryForm />
        <TodoForm />
        <TodoList />
        <div className="sidebarBackground" />
      </div>
    </QueryClientProvider>
  );
}

export default App;
