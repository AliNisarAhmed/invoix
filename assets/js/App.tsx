import React from "react";
import { createRoot } from "react-dom/client";
import { Summary } from "./src/Summary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Summary />
    </QueryClientProvider>
  );
};

const domNode = document.getElementById("root") as HTMLElement;

const root = createRoot(domNode);

root.render(<App />);
