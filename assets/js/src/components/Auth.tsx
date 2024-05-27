import React from "react";
import { useCurrentUser } from "../context/CurrentUserContext";
import { Redirect } from "wouter";

export function Auth({ children }) {
  const { currentUser } = useCurrentUser();

  if (!currentUser) {
    return <Redirect to="/login" replace />;
  }

  return <div>{children}</div>;
}
