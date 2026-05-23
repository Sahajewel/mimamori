export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <nav className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between pl-12">
          <div className="w-32 h-6 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-24 h-6 bg-gray-100 rounded-full animate-pulse" />
        </div>
      </nav>
      <div className="px-4 md:px-8 py-8 max-w-4xl mx-auto">
        <div className="w-48 h-8 bg-gray-200 rounded-full animate-pulse mb-2" />
        <div className="w-32 h-5 bg-gray-100 rounded-full animate-pulse mb-8" />
        <div className="w-36 h-6 bg-gray-200 rounded-full animate-pulse mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border-2 border-gray-100"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse" />
                <div className="space-y-2">
                  <div className="w-24 h-5 bg-gray-200 rounded-full animate-pulse" />
                  <div className="w-16 h-4 bg-gray-100 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <div className="w-20 h-4 bg-gray-200 rounded-full animate-pulse" />
                  <div className="w-16 h-4 bg-gray-100 rounded-full animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="w-20 h-4 bg-gray-200 rounded-full animate-pulse" />
                  <div className="w-16 h-4 bg-gray-100 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
