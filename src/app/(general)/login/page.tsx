import {LoginForm} from "@/components/auth/login/LoginForm";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-[500px]">
        <LoginForm />
      </div>
    </div>
  )
}
