import React from "react";
import { Summary } from "./components/Summary";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Invoices } from "./components/Invoices";
import { CurrentUserProvider } from "./context/CurrentUserContext";
import { Route, Switch, useLocation } from "wouter";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Auth } from "./components/Auth";
import { UserNav } from "./components/UserNav";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/Toaster";
import { useToast } from "./hooks/use-toast";
import { clearCookies, timeout } from "./utils";

export const App = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: async (error) => {
        if (error.response?.status === 401) {
          toast({
            title: "401: Unauthorized",
            description: "You are unauthorized, Logging out...",
          });
          clearCookies();
          await timeout(1500);
          window.location.href = "/";
        }
      },
    }),
  });

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
