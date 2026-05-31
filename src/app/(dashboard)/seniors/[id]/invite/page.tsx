import { InviteForm } from "@/app/components/Inviteform";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // login না থাকলে login পেজে
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // এই user এই senior-এর member কিনা
  const member = await prisma.seniorMember.findFirst({
    where: { seniorId: id, userId: session.user.id },
  });

  // member না হলে — পেজ নাই দেখাও
  if (!member) notFound();

  // শুধু OWNER invite করতে পারবে — EDITOR/VIEWER দুজনকেই ফেরত পাঠাও
  // (backend POST-ও OWNER ছাড়া আটকায়; এটা UX যাতে অন্যরা ফর্মই না দেখে)
  if (member.role !== "OWNER") {
    redirect(`/seniors/${id}`);
  }

  // OWNER হলে তবেই form দেখাও
  return <InviteForm />;
}
