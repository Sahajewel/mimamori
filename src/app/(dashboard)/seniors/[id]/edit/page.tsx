// edit senior page
import { EditSeniorForm } from "@/app/components/Editseniorform";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

export default async function EditSeniorPage({
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
  if (!member) notFound();

  // edit শুধু OWNER পারবে — EDITOR/VIEWER ফেরত (backend PATCH-ও OWNER ছাড়া আটকায়)
  if (member.role !== "OWNER") {
    redirect(`/seniors/${id}`);
  }

  // senior data সরাসরি prisma দিয়ে আনছি (fetch ছাড়া) — form-এ ভরে দেব
  const senior = await prisma.senior.findUnique({
    where: { id },
  });
  if (!senior) notFound();

  return (
    <EditSeniorForm
      initialName={senior.name}
      initialAge={senior.age?.toString() ?? ""}
      initialNotes={senior.notes ?? ""}
      initialPhotoUrl={senior.photoUrl ?? ""}
    />
  );
}
