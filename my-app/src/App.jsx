import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./Component/NavBar";
import Product from "./Pages/Product";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import AllRoutes from "./Pages/AllRoutes";
function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <NavBar />
      <AllRoutes />
    </QueryClientProvider>
  
  );
}

export default App;
