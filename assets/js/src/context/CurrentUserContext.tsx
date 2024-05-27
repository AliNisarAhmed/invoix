import React from "react";
import { CurrentUser } from "../types";
import { getCookieObject } from "../utils";

type CurrentUserContext = {
  currentUser: CurrentUser | undefined | null;
  setCurrentUser: React.Dispatch<CurrentUser | undefined | null>;
};

const CurrentUserContext = React.createContext<CurrentUserContext>({
  currentUser: undefined,
  setCurrentUser: () => undefined,
});

function useCurrentUser() {
  const context = React.useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error("useCurrentUser must be used within a CurrentUserProvider");
  }

  return context;
}

function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = React.useState<
    CurrentUser | null | undefined
  >(() => getCurrentUser());
  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

function getCurrentUser() {
  const cookieObject = getCookieObject();
  const currentUserCookie = cookieObject["_invoix_web_current_user"];
  if (currentUserCookie) {
    return JSON.parse(atob(currentUserCookie));
  }
}

export { CurrentUserProvider, useCurrentUser };
