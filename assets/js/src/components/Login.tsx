import React from "react";
import { useLocation } from "wouter";
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
    email: z.string().email(),
    password: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => queryClient.setQueryData(["currentUser"], data),
  });

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
      await mutation.mutateAsync({ email, password });
      setLocation("/");
    } catch (error) {
      console.error(error);
    }
  }
}
