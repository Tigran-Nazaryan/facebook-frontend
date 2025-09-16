"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/store/Auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "@/components/auth/login/LoginSchema";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full shadow-lg">
        <CardHeader className="space-y-1 px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl">Login to your account</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="grid gap-2 sm:gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="h-10 sm:h-11"
                  {...register("email")}
                  autoComplete="current-password"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2 sm:gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="******"
                  className="h-10 sm:h-11"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-10 sm:h-11 text-sm sm:text-base cursor-pointer"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </div>
            </div>

            <div className="mt-2 text-center text-xs sm:text-sm">
              <Link
                href="/forgot-password"
                className="underline underline-offset-4 hover:text-primary"
              >
                Reset Password
              </Link>
            </div>

            <div className="mt-4 text-center text-xs sm:text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/registration"
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
