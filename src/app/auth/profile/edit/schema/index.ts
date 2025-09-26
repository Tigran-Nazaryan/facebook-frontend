import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email({message: "Invalid email address"}),
  coverPhoto: z
    .instanceof(FileList)
    .refine((files: FileList) => files.length === 1, "Cover photo is required")
    .refine((files: FileList) => {
      if (files.length === 0) return false;
      const file = files[0];
      return file.size <= 5000000;
    }, "File size must be less than 5MB")
    .refine((files: FileList) => {
      if (files.length === 0) return false;
      const file = files[0];
      return ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type);
    }, "Only JPEG, PNG, GIF and WebP images are allowed"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;