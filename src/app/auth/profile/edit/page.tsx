"use client";

import { ChangeEvent, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateCoverPhoto, updateProfile, removeCoverPhoto } from "@/service/editProfile";
import { ProfileFormValues, profileSchema } from "@/validation/schema";
import { toast } from "react-toastify";
import { useAuth } from "@/store/Auth";
import { getImageUrl } from "@/helper";
import { UpdateData } from "@/types/types";

export default function EditProfilePage() {
  const [preview, setPreview] = useState<string | null>(null);
  const { user, setUser } = useAuth();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      coverPhoto: undefined,
    },
  });

  const onSubmit = async (formData: ProfileFormValues) => {
    try {
      const { name, lastName, email, coverPhoto } = formData;
      const updateData: UpdateData = {};

      if (name?.trim()) updateData.firstName = name;
      if (lastName?.trim()) updateData.lastName = lastName;
      if (email?.trim()) updateData.email = email;

      if (Object.keys(updateData).length === 0 && !coverPhoto?.[0]) {
        toast.info("No changes to update");
        return;
      }

      let updatedProfile = null;

      if (Object.keys(updateData).length > 0) {
        updatedProfile = await updateProfile(updateData);
      }

      if (coverPhoto?.[0]) {
        const coverResponse = await updateCoverPhoto(coverPhoto[0]);
        if (coverResponse?.coverPhoto) {
          updatedProfile = { ...updatedProfile, coverPhoto: coverResponse.coverPhoto };
        }
      }

      if (updatedProfile && setUser) {
        setUser((prev) => (prev ? { ...prev, ...updatedProfile } : null));
      }

      toast.success("Profile updated successfully!");
      reset({ name: "", lastName: "", email: "", coverPhoto: undefined });
      setPreview(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleRemoveCoverPhoto = async () => {
    try {
      await removeCoverPhoto();
      setUser?.((prev) => (prev ? { ...prev, coverPhoto: null } : null));
      setPreview(null);
      toast.success("Cover photo removed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove cover photo");
    }
  };

  const getErrorMessage = (error: any): string => {
    if (typeof error === "string") return error;
    if (error && typeof error === "object" && "message" in error) {
      return String(error.message);
    }
    return "";
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 rounded-md border border-black">
      <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input type="text" placeholder="Your name" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.name)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <Input type="text" placeholder="Your last name" {...register("lastName")} />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.lastName)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input type="email" placeholder="Your email" {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.email)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cover Photo</label>
          <Controller
            control={control}
            name="coverPhoto"
            render={({ field }) => (
              <Input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={(e) => {
                  handleFileChange(e);
                  field.onChange(e.target.files);
                }}
              />
            )}
          />
          {errors.coverPhoto && (
            <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.coverPhoto)}</p>
          )}

          <div className="mt-2">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md border"
              />
            ) : user?.coverPhoto ? (
              <>
                <img
                  src={getImageUrl(user.coverPhoto) ?? ""}
                  alt="Current Cover"
                  className="w-32 h-32 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={handleRemoveCoverPhoto}
                  className="text-sm text-red-500 mt-1 cursor-pointer"
                >
                  Remove Cover Photo
                </button>
              </>
            ) : null}
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB
          </p>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer">
          {isSubmitting ? "Update..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
}

