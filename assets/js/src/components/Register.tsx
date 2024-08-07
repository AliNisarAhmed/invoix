import React from "react";
import { Redirect, useLocation } from "wouter";
import { registerUser } from "../api";
import { useMutation } from "@tanstack/react-query";
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

export function Register() {
  const { currentUser, setCurrentUserInContext } = useCurrentUser();
  const [location, setLocation] = useLocation();

  const formSchema = z
    .object({
      email: z.string().email(),
      password: z.string(),
      confirm: z.string(),
    })
    .refine((data) => data.password === data.confirm, {
      message: "Passwords don't match",
      path: ["confirm"],
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const registerUserMutation = useMutation({
    mutationFn: registerUser,
  });

  if (registerUserMutation.isSuccess || currentUser) {
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
                <FormField
                  control={form.control}
                  name="confirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
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
                  Register
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
      await registerUserMutation.mutateAsync({ email, password });
      setCurrentUserInContext();
      setLocation("/invoices", { replace: true });
    } catch (e) {
      form.setError(e.errorInfo.field, { message: e.errorInfo.message });
    }
  }
}
