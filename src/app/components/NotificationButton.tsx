"use client";

export function NotificationButton() {
  async function handleClick() {
    try {
      const permission = await Notification.requestPermission();
      alert(`Permission: ${permission}`);
    } catch (e) {
      alert(`Error: ${e}`);
    }
  }

  return (
    <button
      onClick={handleClick}
      className="w-full py-2.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg border border-indigo-200"
    >
      🔔 通知を許可する
    </button>
  );
}
