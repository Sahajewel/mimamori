export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mb-4 animate-pulse">
        <span className="text-white text-3xl">♡</span>
      </div>
      <p className="text-gray-400 text-sm">読み込み中...</p>
    </div>
  );
}
