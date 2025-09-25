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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegistrationFormValues, registrationSchema } from "@/components/auth/registration/RegistrationSchema";
import { useAuth } from "@/store/Auth";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";

export function RegistrationForm({ className, ...props }: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
  });

  const { registration } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: RegistrationFormValues) => {
    try {
      const register = await registration(data.email, data.password, data.firstName, data.lastName, data.birthday, data.gender);
      toast.success("Registration successful!");

      router.push("/auth?justRegistered=true");
    } catch (error: any) {
      toast.error("Registration failed: " + error.message);
      console.error("Registration error:", error.message);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 items-center justify-center", className)} {...props}>
      <Card className="w-full shadow-lg h-[calc(100vh-80px)] overflow-auto">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Create your account</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Fill in the information below to register
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-3">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" type="text" placeholder="John" {...register("firstName")} />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" type="text" placeholder="Doe" {...register("lastName")} />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} autoComplete="new-password" />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="rePassword">Re-enter Password</Label>
              <Input id="rePassword" type="password" {...register("rePassword")} autoComplete="new-password" />
              {errors.rePassword && (
                <p className="text-red-500 text-sm">{errors.rePassword.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="birthday">Birthday</Label>
              <Input id="birthday" type="date" {...register("birthday")} />
              {errors.birthday && (
                <p className="text-red-500 text-sm">{errors.birthday.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Label>Gender</Label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="male"
                    {...register("gender")}
                    defaultChecked
                    className="accent-blue-500"
                  />
                  male
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="female"
                    {...register("gender")}
                    className="accent-pink-500"
                  />
                  female
                </label>
              </div>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender.message}</p>
              )}
            </div>

            <div className="mt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer">
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
