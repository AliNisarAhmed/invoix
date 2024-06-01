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
  const currentUserCookieEncoded = cookieObject["_invoix_web_current_user"];
  if (currentUserCookieEncoded) {
    try {
      const currentUserCookie = JSON.parse(atob(currentUserCookieEncoded));
      return currentUserCookie;
    } catch (error) {
      return;
    }
  }
}

export { CurrentUserProvider, useCurrentUser };
