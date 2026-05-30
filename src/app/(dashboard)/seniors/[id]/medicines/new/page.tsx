import { NewMedicineForm } from "@/app/components/NewMedicineForm";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

export default async function NewMedicinePage({
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

  // member না হলে — এই senior-ই তার না, পেজ নাই দেখাও
  if (!member) notFound();

  // VIEWER ওষুধ যোগ করতে পারে না — senior-এর মূল পেজে ফেরত
  if (member.role === "VIEWER") {
    redirect(`/seniors/${id}`);
  }

  // OWNER বা EDITOR হলে তবেই form দেখাও
  return <NewMedicineForm />;
}
