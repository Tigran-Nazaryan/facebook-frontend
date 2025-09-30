import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .optional()
    .or(z.literal("")),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .or(z.literal("")),
  coverPhoto: z
    .any()
    .optional()
    .refine((files) => !files || files.length === 1, { message: "Cover photo is required" })
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= 5000000,
      { message: "File size must be less than 5MB" }
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(files[0].type),
      { message: "Only JPEG, PNG, GIF and WebP images are allowed" }
    ),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
