import React from "react";
import { useCurrentUser } from "../context/CurrentUserContext";
import { Redirect } from "wouter";

export function Auth({ children }) {
  const { currentUser, isPending } = useCurrentUser();

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (!currentUser) {
    return <Redirect to="/login" replace />;
  }

  return <div>{children}</div>;
}
