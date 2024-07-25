import React from "react";
import { Summary } from "./components/Summary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Invoices } from "./components/Invoices";
import { CurrentUserProvider } from "./context/CurrentUserContext";
import { Route, Switch } from "wouter";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Auth } from "./components/Auth";
import { UserNav } from "./components/UserNav";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/Toaster";

export const App = () => {
  const queryClient = new QueryClient();

  React.useEffect(() => {
    const welcome = document.querySelector("#welcome");
    if (welcome) {
      welcome.remove();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <CurrentUserProvider>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route>
            <Auth>
              <div className="w-10/12 mx-auto">
                <UserNav />
                <Summary />
                <Invoices />
              </div>
            </Auth>
          </Route>
        </Switch>
      </CurrentUserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
