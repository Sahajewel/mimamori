import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginFormUI from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; callbackUrl?: string }>;
}) {
  const session = await auth();
  const { token, callbackUrl } = await searchParams;

  if (session?.user?.id) {
    // login করা থাকলে — token থাকলে invite-এ, নাহলে dashboard
    if (token) redirect(`/invite/${token}`);
    if (callbackUrl) redirect(callbackUrl);
    redirect("/dashboard");
  }
  return <LoginFormUI />;
}
