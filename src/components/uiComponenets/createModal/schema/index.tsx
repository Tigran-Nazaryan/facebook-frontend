import z from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  files: z
    .array(z.instanceof(File))
    .min(1, "At least one file is required")
    .max(5, "You can upload up to 5 files")
});

export type FormValues = z.infer<typeof createPostSchema>;