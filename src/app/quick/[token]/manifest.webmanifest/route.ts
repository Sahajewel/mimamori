import { NextResponse } from "next/server";

// quick পেজের জন্য dynamic manifest — start_url-এ ওই token-এর quick পেজ
// তাই হোম স্ক্রিনে add করলে, আইকন → সরাসরি সেই senior-এর quick পেজ খোলে
export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const manifest = {
    name: "Mimamori",
    short_name: "Mimamori",
    description: "ご家族をつなぐ見守りアプリ",
    start_url: `/quick/${token}`, // ← এই senior-এর quick পেজ
    scope: `/quick/${token}`,
    display: "standalone",
    background_color: "#4F46E5",
    theme_color: "#4F46E5",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
    },
  });
}
