export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|manifest.json|assets|favicon.ico|sitemap.xml|robots.txt|sw.js|icon.svg|.*\\..*).*)",
};
