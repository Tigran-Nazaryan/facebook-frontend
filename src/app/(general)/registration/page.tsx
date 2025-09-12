import { RegistrationForm } from "@/components/auth/registration/RegistrationForm";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center sm:p-6 md:p-10">
      <div className="w-full max-w-[500px]">
        <RegistrationForm />
      </div>
    </div>
  );
}
