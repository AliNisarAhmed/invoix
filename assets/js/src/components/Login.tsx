import React from "react";
import { Redirect, useLocation } from "wouter";
import { loginUser } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/Form";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useCurrentUser } from "../context/CurrentUserContext";

export function Login() {
  const { currentUser, setCurrentUserInContext } = useCurrentUser();
  const [location, setLocation] = useLocation();
  const formSchema = z.object({
    email: z.string().min(1, "Email is required").email(),
    password: z.string().min(1, "Password is required"),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      await loginUser(data),
  });

  if (loginMutation.isIdle && currentUser) {
    return <Redirect to="/" replace />;
  }

  if (loginMutation.isSuccess && currentUser) {
    return <Redirect to="/" replace />;
  }

  return (
    <>
      <div className="container w-1/2">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-8"
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                {form.formState.errors.root?.serverError && (
                  <FormMessage>
                    {form.formState.errors.root?.serverError?.message}
                  </FormMessage>
                )}
                <Button
                  className="w-full"
                  onClick={form.handleSubmit(handleSubmit)}
                >
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );

  async function handleSubmit(
    { email, password }: z.infer<typeof formSchema>,
    e: any,
  ) {
    e.preventDefault();
    try {
      form.clearErrors();
      await loginMutation.mutateAsync({ email, password });
      setCurrentUserInContext();
    } catch (e) {
      form.setError("root.serverError", { message: e.message });
    }
  }
}
