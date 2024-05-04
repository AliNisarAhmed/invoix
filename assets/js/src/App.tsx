import React from "react";
import { Summary } from "./components/Summary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Invoices } from "./components/Invoices";

export const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="">
        <Summary />
        <Invoices />
      </div>
    </QueryClientProvider>
  );
};
