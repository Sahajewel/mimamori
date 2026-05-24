import Link from "next/link";
import Image from "next/image";
import { ContactFeedbackForm } from "@/app/components/ContactFeedbackForm";
import { BackButton } from "@/app/components/BackButton";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <BackButton />
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

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-5">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">お問い合わせ</h1>
          <p className="text-base text-gray-400 mt-1">
            ご質問・ご要望はお気軽にどうぞ
          </p>
        </div>

        {/* Developer card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            👨‍💻 開発者に連絡する
          </h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 rounded-full bg-indigo-100 overflow-hidden flex-shrink-0">
              <Image
                src="https://res.cloudinary.com/dqsgq6z74/image/upload/v1779533948/profile_lwdnjm.png"
                alt="Saha Jewel Kumar"
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">
                Saha Jewel Kumar
              </p>
              <p className="text-base text-indigo-600 font-medium">
                Full Stack Developer
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href="https://github.com/Sahajewel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-5 py-4 border border-gray-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
            >
              <span className="text-2xl">🐙</span>
              <div className="flex-1">
                <p className="text-base font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                  GitHub
                </p>
                <p className="text-sm text-gray-400">github.com/Sahajewel</p>
              </div>
              <span className="text-gray-300 group-hover:text-indigo-400 transition-colors">
                →
              </span>
            </a>

            <a
              href="https://www.linkedin.com/in/sahajewelkumarbd/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-5 py-4 border border-gray-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
            >
              <span className="text-2xl">💼</span>
              <div className="flex-1">
                <p className="text-base font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                  LinkedIn
                </p>
                <p className="text-sm text-gray-400">
                  linkedin.com/in/sahajewelkumarbd
                </p>
              </div>
              <span className="text-gray-300 group-hover:text-indigo-400 transition-colors">
                →
              </span>
            </a>

            <a
              href="https://x.com/sahaJewelkumar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-5 py-4 border border-gray-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
            >
              <span className="text-2xl">𝕏</span>
              <div className="flex-1">
                <p className="text-base font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                  X (Twitter)
                </p>
                <p className="text-sm text-gray-400">x.com/sahaJewelkumar</p>
              </div>
              <span className="text-gray-300 group-hover:text-indigo-400 transition-colors">
                →
              </span>
            </a>

            <a
              href="https://www.instagram.com/sahajewelkumarbd/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-5 py-4 border border-gray-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
            >
              <span className="text-2xl">📸</span>
              <div className="flex-1">
                <p className="text-base font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                  Instagram
                </p>
                <p className="text-sm text-gray-400">
                  instagram.com/sahajewelkumarbd
                </p>
              </div>
              <span className="text-gray-300 group-hover:text-indigo-400 transition-colors">
                →
              </span>
            </a>

            <a
              href="https://sahajewelkumar.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-5 py-4 border border-gray-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
            >
              <span className="text-2xl">🌐</span>
              <div className="flex-1">
                <p className="text-base font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                  Portfolio
                </p>
                <p className="text-sm text-gray-400">
                  sahajewelkumar.vercel.app
                </p>
              </div>
              <span className="text-gray-300 group-hover:text-indigo-400 transition-colors">
                →
              </span>
            </a>
          </div>
        </div>

        {/* Mimamori social */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            📱 Mimamoriをフォローする
          </h2>
          <div className="space-y-3">
            <a
              href="https://x.com/mimamorihealth"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-5 py-4 border border-gray-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
            >
              <span className="text-2xl">𝕏</span>
              <div className="flex-1">
                <p className="text-base font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                  X (Twitter)
                </p>
                <p className="text-sm text-gray-400">x.com/mimamorihealth</p>
              </div>
              <span className="text-gray-300 group-hover:text-indigo-400 transition-colors">
                →
              </span>
            </a>

            <a
              href="https://www.instagram.com/mimamorihealth/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-5 py-4 border border-gray-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
            >
              <span className="text-2xl">📸</span>
              <div className="flex-1">
                <p className="text-base font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                  Instagram
                </p>
                <p className="text-sm text-gray-400">
                  instagram.com/mimamorihealth
                </p>
              </div>
              <span className="text-gray-300 group-hover:text-indigo-400 transition-colors">
                →
              </span>
            </a>
          </div>
        </div>

        {/* Feedback form */}
        <ContactFeedbackForm />

        <p className="text-center text-sm text-gray-300">
          © 2026 Mimamori — ご家族をつなぐ
        </p>
      </div>
    </div>
  );
}
