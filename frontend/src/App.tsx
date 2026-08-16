import "./App.scss";
import Header from "./components/Header/Header";
import CategoryForm from "./components/CategoryForm/CategoryForm";
import TodoList from "./components/TodoList/TodoList";
import SidebarHeader from "./components/SidebarHeader/SidebarHeader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddTodo from "./components/AddTodo/AddTodo";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="main">
        <SidebarHeader />
        <Header />
        <CategoryForm />
        <AddTodo />
        <TodoList />
        <div className="sidebarBackground" data-testid="sidebarBackground" />
      </div>
    </QueryClientProvider>
  );
}

export default App;
