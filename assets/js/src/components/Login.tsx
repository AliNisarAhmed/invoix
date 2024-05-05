import React, { useState } from "react";
import { useLocation } from "wouter";
import { loginUser } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => queryClient.setQueryData(["currentUser"], data),
  });

  return (
    <div>
      <h1>Login</h1>
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
    </div>
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
