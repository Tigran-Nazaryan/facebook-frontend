import {z} from "zod";

export const registrationSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rePassword: z.string().min(6, "Please confirm your password"),
    birthday: z.string().nonempty("Birthday is required"),
    gender: z.string().nonempty("Gender is required"),
  })
  .refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match",
  });

export type RegistrationFormValues = z.infer<typeof registrationSchema>;