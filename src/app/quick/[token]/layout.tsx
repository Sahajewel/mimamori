import type { Metadata } from "next";

// quick পেজের জন্য নিজস্ব manifest link (root-এরটা override)
// তাই হোম স্ক্রিনে add করলে, এই token-এর quick পেজ আইকন হবে
export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  return {
    manifest: `/quick/${token}/manifest.webmanifest`,
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Mimamori",
    },
  };
}

export default function QuickLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
