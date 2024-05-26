import React from "react";
import { Redirect, useLocation } from "wouter";
import { loginUser } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./Form";
import { Input } from "./Input";
import { Button } from "./Button";

export function Login() {
  const [location, setLocation] = useLocation();
  const formSchema = z.object({
    email: z.string().min(1, "Email is required").email(),
    password: z.string().min(1, "Password is required"),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
      setLocation("/", { replace: true });
    },
    onError: (e, x, y) => {
      form.setError("root.serverError", { message: e.message });
    },
  });

  if (mutation.isSuccess) {
    return <Redirect to="/" replace />;
  }

  return (
    <>
      <div className="container w-1/2">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-8"
                onSubmit={form.handleSubmit(
                  async (data) => await handleSubmit(data),
                )}
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

  async function handleSubmit({ email, password }: z.infer<typeof formSchema>) {
    try {
      form.clearErrors();
      mutation.mutate({ email, password });
    } catch (error) {
      console.error(error);
    }
  }
}
