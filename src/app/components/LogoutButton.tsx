"use client";

export function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth/signout", { method: "POST" });
    // session clear হওয়ার জন্য একটু wait করো
    await new Promise((resolve) => setTimeout(resolve, 500));
    window.location.href = "/";
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
    >
      ログアウト
    </button>
  );
}
