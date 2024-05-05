import React from "react";
import { Summary } from "./components/Summary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Invoices } from "./components/Invoices";
import { CurrentUserProvider } from "./context/CurrentUserContext";
import { Route, Switch } from "wouter";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Auth } from "./components/Auth";

export const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <CurrentUserProvider>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/">
            <Auth>
              <div className="">
                <Summary />
                <Invoices />
              </div>
            </Auth>
          </Route>
        </Switch>
      </CurrentUserProvider>
    </QueryClientProvider>
  );
};
