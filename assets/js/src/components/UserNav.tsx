import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./Dropdown";
import { Button } from "./Button";
import { Avatar, AvatarFallback } from "./Avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Redirect, useLocation } from "wouter";
import { logoutUser } from "../api";
import { useCurrentUser } from "../context/CurrentUserContext";

export function UserNav() {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      queryClient.clear();
    },
  });

  if (mutation.isSuccess) {
    return <Redirect to="/login" replace />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarFallback>G</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Guest</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full hover:border-none rounded-none p-0"
            >
              Log Out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  async function handleLogout() {
    await mutation.mutateAsync();
    setCurrentUser(null);
  }
}
