import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ChangePassword from "@/app/components/ChangePassword";

export default async function PasswordPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login"); // login নাই → login পেজে
  }
  return <ChangePassword />;
}
