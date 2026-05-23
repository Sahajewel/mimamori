import { signOut } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  await signOut({ redirect: false });

  const response = NextResponse.json({ success: true });

  // manually cookie clear করো
  response.cookies.delete("__Secure-authjs.session-token");
  response.cookies.delete("authjs.session-token");
  response.cookies.delete("__Host-authjs.csrf-token");
  response.cookies.delete("authjs.csrf-token");

  return response;
}
