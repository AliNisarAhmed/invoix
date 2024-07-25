import React from "react";
import { CurrentUser } from "../types";
import { getCookieObject } from "../utils";

type CurrentUserContext = {
  currentUser: CurrentUser | undefined | null;
  setCurrentUserInContext: () => void;
};

const CurrentUserContext = React.createContext<CurrentUserContext>({
  currentUser: undefined,
  setCurrentUserInContext: () => undefined,
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
  >(() => getCurrentUserFromCookie());

  const setCurrentUserInContext = () => {
    setCurrentUser(getCurrentUserFromCookie());
  };

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, setCurrentUserInContext }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}

function getCurrentUserFromCookie() {
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
