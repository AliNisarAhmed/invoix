import React from "react";
import { Summary } from "./components/Summary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Invoices } from "./components/Invoices";
import { CurrentUserProvider } from "./context/CurrentUserContext";

export const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <CurrentUserProvider>
        <div className="">
          <Summary />
          <Invoices />
        </div>
      </CurrentUserProvider>
    </QueryClientProvider>
  );
};
