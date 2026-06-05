import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ResetPasswordFormUI from "./ResetPasswordForm";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user?.id) {
    redirect("/dashboard");
  }
  return <ResetPasswordFormUI />;
}
