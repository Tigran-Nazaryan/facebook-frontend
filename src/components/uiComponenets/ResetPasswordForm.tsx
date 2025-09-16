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
import { toast } from "react-toastify";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    repeatPassword: z.string().min(6, "Please repeat your password"),
  })
  .refine((data) => data.newPassword === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm({ resetToken }: { resetToken: string }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      const res = await $api.post("/auth/resetPassword", {
        token: resetToken,
        newPassword: data.newPassword
      });

      toast.success(res.data.message || "Password changed successfully!");

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
      console.error("Reset password error:", err);
    }
  };


  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <Card className="w-full shadow-lg">
        <CardHeader className="space-y-1 px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl">Reset Password</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter your new password below
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="grid gap-2 sm:gap-3">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  {...register("newPassword")}
                  autoComplete="new-password"
                  className="h-10 sm:h-11"
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="grid gap-2 sm:gap-3">
                <Label htmlFor="repeatPassword">Repeat New Password</Label>
                <Input
                  id="repeatPassword"
                  type="password"
                  placeholder="Repeat new password"
                  {...register("repeatPassword")}
                  autoComplete="new-password"
                  className="h-10 sm:h-11"
                />
                {errors.repeatPassword && (
                  <p className="text-red-500 text-sm">{errors.repeatPassword.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-10 sm:h-11 text-sm sm:text-base cursor-pointer"
                >
                  {isSubmitting ? "Updating..." : "Reset Password"}
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
