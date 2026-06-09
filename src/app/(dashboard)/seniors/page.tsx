import Link from "next/link";
import NewSeniorForm from "@/app/components/NewSeniorForm"; // পাথ ঠিক আছে কি না দেখে নেবেন

export const metadata = {
  title: "家族を追加 - Mimamori",
};

export default function NewSeniorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* নেভবার সার্ভারে থাকবে, কোনোদিনও ফালতু রি-রেন্ডার হবে না */}
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 pl-16">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link
            href={`/dashboard`}
            className="flex items-center gap-1.5 text-indigo-600 hover:underline transition-colors text-sm font-medium"
          >
            <span className="text-lg">←</span>
            <span>戻る</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm">♡</span>
            </div>
            <p className="font-semibold text-gray-900 hidden sm:block">
              Mimamori
            </p>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              家族を追加する
            </h1>
            <p className="text-base text-gray-400 mt-1">
              見守る家族の情報を入力してください
            </p>
          </div>

          {/* আলাদা করে নেওয়া ক্লায়েন্ট ফর্মটি এখানে বসানো হলো */}
          <NewSeniorForm />
        </div>
      </div>
    </div>
  );
}
