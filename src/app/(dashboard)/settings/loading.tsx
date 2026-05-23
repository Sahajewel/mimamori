export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <nav className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3 pl-16">
          <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
          <div className="w-24 h-5 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        {/* Profile hero skeleton */}
        <div className="bg-indigo-100 rounded-2xl p-6 flex items-center gap-5 animate-pulse">
          <div className="w-20 h-20 bg-indigo-200 rounded-full flex-shrink-0" />
          <div className="space-y-2">
            <div className="w-32 h-5 bg-indigo-200 rounded-full" />
            <div className="w-44 h-4 bg-indigo-200 rounded-full" />
          </div>
        </div>

        {/* Section skeletons */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100"
          >
            <div className="px-6 py-3 border-b border-gray-50">
              <div className="w-20 h-3 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="px-6 py-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 rounded-xl animate-pulse" />
              <div className="w-36 h-4 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
