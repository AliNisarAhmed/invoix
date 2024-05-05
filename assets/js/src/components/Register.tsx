import React, { useState } from "react";
import { useLocation } from "wouter";
import { registerUser } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => queryClient.setQueryData(["currentUser"], data),
  });

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="text"
          value={email}
          onChange={(v) => setEmail(v?.target?.value)}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(v) => setPassword(v?.target?.value)}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      await mutation.mutateAsync({ email, password });
      setLocation("/");
    } catch (error) {
      console.error(error);
    }
  }
}
