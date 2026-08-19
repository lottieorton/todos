import "./App.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CategoryProvider } from "./context/CategoryContext";
import MainLayout from "./components/MainLayout/MainLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CategoryProvider>
        <MainLayout />
      </CategoryProvider>
    </QueryClientProvider>
  );
}

export default App;
