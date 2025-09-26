"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  coverPhoto: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, {
      message: "Cover photo is required"
    })
    .refine((files) => {
      if (files.length === 0) return false;
      const file = files[0];
      return file.size <= 5000000; // 5MB limit
    }, { message: "File size must be less than 5MB" })
    .refine((files) => {
      if (files.length === 0) return false;
      const file = files[0];
      return ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type);
    }, { message: "Only JPEG, PNG, GIF and WebP images are allowed" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    console.log("Form data:", data);

    // Safely get the file
    const coverFile = data.coverPhoto?.[0];
    console.log("Selected cover file:", coverFile);

    // TODO: send data to API for profile update
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Helper function to safely get error message
  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }
    return '';
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input type="text" placeholder="Your name" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.name)}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <Input
            type="text"
            placeholder="Your last name"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.lastName)}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            placeholder="Your email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.email)}
            </p>
          )}
        </div>

        {/* Cover Photo */}
        <div>
          <label className="block text-sm font-medium mb-1">Cover Photo</label>
          <Input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            {...register("coverPhoto")}
          />
          {errors.coverPhoto && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(errors.coverPhoto)}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB
          </p>
        </div>

        {/* Submit */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}