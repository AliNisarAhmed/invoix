import React from "react";
import { CurrentUser } from "../types";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api";

type CurrentUserContext = {
  currentUser: CurrentUser | undefined | null;
  isPending: boolean;
  isError: boolean;
};

const CurrentUserContext = React.createContext<CurrentUserContext>({
  currentUser: undefined,
  isPending: true,
  isError: false,
});

function useCurrentUser() {
  const context = React.useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error("useCurrentUser must be used within a CurrentUserProvider");
  }

  return context;
}

function CurrentUserProvider({ children }) {
  const {
    data: currentUser,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
  });

  return (
    <CurrentUserContext.Provider value={{ currentUser, isPending, isError }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export { CurrentUserProvider, useCurrentUser };
