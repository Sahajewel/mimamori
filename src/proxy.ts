import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function proxy(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  /*
   * Next.js এর অভ্যন্তরীণ ফাইল (_next/static, _next/image, favicon.ico)
   * এবং api রুটগুলোকে বাদ দিয়ে বাকি সব রুটের জন্য মিডলওয়্যার রান হবে।
   */
  // matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sw.js|icon.svg|manifest.json).*)",
  ],
};
