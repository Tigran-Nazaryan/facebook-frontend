"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import $api from "@/http";
import {toast} from "react-toastify";
import {useSearchParams} from "next/navigation";
import ResetPasswordForm from "@/components/uiComponenets/ResetPasswordForm";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams()
  const resetToken = searchParams.get('token')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      const res = await $api.post("/auth/forgotPassword", { email: data.email });
      toast.success(`${res.data.message}`);
    } catch (err: any) {
      toast.error(`${err.userMessage}`);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col gap-6 w-full max-w-md">
        {
          resetToken ? (
            <ResetPasswordForm resetToken={resetToken} />
          ) : (
            <Card className="w-full shadow-lg">
              <CardHeader className="space-y-1 px-4 sm:px-6">
                <CardTitle className="text-xl sm:text-2xl">Reset Password</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Enter your email below to receive a password reset link
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
                        autoComplete="email"
                      />
                      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-10 sm:h-11 text-sm sm:text-base cursor-pointer"
                      >
                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-2 text-center text-xs sm:text-sm">
                    <Link
                      href="/login"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      Back to Login
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
          )
        }
      </div>
    </div>
  );
}