"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  AlertTriangle,
  Heart,
  Pill,
  FileText,
  Clock,
  User,
  ChevronRight,
  Plus,
} from "lucide-react";

type CheckIn = {
  id: string;
  status: string;
  note: string | null;
  authorName: string | null;
  createdAt: string;
  user: { name: string };
};

type Medicine = {
  id: string;
  name: string;
  dosage: string | null;
  frequency: string;
  logs: { status: string }[];
};

type CareNote = {
  id: string;
  content: string;
  authorName: string | null;
  createdAt: string;
  user: { name: string };
};

type Props = {
  seniorId: string;
  checkIns: CheckIn[];
  medicines: Medicine[];
  careNotes: CareNote[];
  role: string;
  careNotesTotal: number;
};

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}

function ExpandableText({
  text,
  limit = 100,
}: {
  text: string;
  limit?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  if (text.length <= limit) {
    return (
      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
        {text}
      </p>
    );
  }
  return (
    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
      {isExpanded ? text : `${text.slice(0, limit)}... `}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium ml-1 focus:outline-none"
      >
        {isExpanded ? "閉じる" : "もっと読む"}
      </button>
    </p>
  );
}

export function SeniorTabs({
  seniorId,
  checkIns,
  medicines,
  careNotes,
  role,
  careNotesTotal,
}: Props) {
  const [activeTab, setActiveTab] = useState<"checkin" | "medicine" | "note">(
    "checkin",
  );
  const [clickedHref, setClickedHref] = useState<string | null>(null);
  const click = (href: string) => setClickedHref(href);

  const tabs = [
    { key: "checkin", label: "チェックイン", icon: Heart },
    { key: "medicine", label: "お薬", icon: Pill },
    { key: "note", label: "ケアノート", icon: FileText },
  ] as const;

  return (
    <div>
      {/* Modern Tab Bar */}
      <div className="flex bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-1.5 mb-6 shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`}
              />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* CheckIn Tab */}
      {activeTab === "checkin" && (
        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 shadow-lg transition-all">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Heart className="w-5 h-5 text-indigo-500" />
              チェックイン履歴
            </h2>
            {role !== "VIEWER" && (
              <Link
                href={`/seniors/${seniorId}/checkin`}
                onClick={() => click(`/seniors/${seniorId}/checkin`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow"
              >
                {clickedHref === `/seniors/${seniorId}/checkin` ? (
                  <Spinner />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                追加
              </Link>
            )}
          </div>
          {checkIns.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm">
                まだチェックインがありません
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {checkIns.map((checkIn) => {
                const statusConfig = {
                  OK: {
                    icon: CheckCircle,
                    color: "text-green-600",
                    bg: "bg-green-50",
                    label: "良好",
                  },
                  CONCERN: {
                    icon: AlertTriangle,
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                    label: "要確認",
                  },
                  EMERGENCY: {
                    icon: AlertTriangle,
                    color: "text-red-600",
                    bg: "bg-red-50",
                    label: "緊急",
                  },
                };
                const config =
                  statusConfig[checkIn.status as keyof typeof statusConfig] ||
                  statusConfig.OK;
                const Icon = config.icon;
                return (
                  <div
                    key={checkIn.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center shrink-0`}
                      >
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div>
                        <span
                          className={`inline-block text-sm font-semibold ${config.color} mb-1`}
                        >
                          {config.label}
                        </span>
                        {checkIn.note && (
                          <p className="text-sm text-gray-600">
                            {checkIn.note}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right sm:text-left shrink-0">
                      <p className="text-xs text-gray-500 flex items-center gap-1 justify-end sm:justify-start">
                        <User className="w-3 h-3" />{" "}
                        {checkIn.authorName || "退会したユーザー"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(checkIn.createdAt).toLocaleDateString(
                          "ja-JP",
                          { timeZone: "Asia/Tokyo" },
                        )}{" "}
                        {new Date(checkIn.createdAt).toLocaleTimeString(
                          "ja-JP",
                          {
                            timeZone: "Asia/Tokyo",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div className="text-center pt-2">
                <Link
                  href={`/seniors/${seniorId}/checkins`}
                  onClick={() => click(`/seniors/${seniorId}/checkins`)}
                  className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {clickedHref === `/seniors/${seniorId}/checkins` && (
                    <Spinner />
                  )}
                  もっと見る
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Medicine Tab */}
      {activeTab === "medicine" && (
        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Pill className="w-5 h-5 text-indigo-500" />
              お薬一覧
            </h2>
            {role !== "VIEWER" && (
              <Link
                href={`/seniors/${seniorId}/medicines/new`}
                onClick={() => click(`/seniors/${seniorId}/medicines/new`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
              >
                {clickedHref === `/seniors/${seniorId}/medicines/new` ? (
                  <Spinner />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                追加
              </Link>
            )}
          </div>
          {medicines.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Pill className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm">
                まだお薬が登録されていません
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {medicines.map((medicine) => {
                const href = `/seniors/${seniorId}/medicines/${medicine.id}`;
                return (
                  <Link
                    key={medicine.id}
                    href={href}
                    onClick={() => click(href)}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
                  >
                    <div>
                      <p className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                        {medicine.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {medicine.dosage && `${medicine.dosage} · `}
                        {medicine.frequency}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {clickedHref === href ? (
                        <Spinner />
                      ) : (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          服用中
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          <Link
            href={`/seniors/${seniorId}/medicines`}
            onClick={() => click(`/seniors/${seniorId}/medicines`)}
            className="flex items-center justify-center gap-1.5 w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-5 pt-2 border-t border-gray-100"
          >
            {clickedHref === `/seniors/${seniorId}/medicines` && <Spinner />}
            服薬履歴を見る →
          </Link>
        </div>
      )}

      {/* CareNote Tab */}
      {activeTab === "note" && (
        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              ケアノート
            </h2>
            {role !== "VIEWER" && (
              <Link
                href={`/seniors/${seniorId}/notes/new`}
                onClick={() => click(`/seniors/${seniorId}/notes/new`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
              >
                {clickedHref === `/seniors/${seniorId}/notes/new` ? (
                  <Spinner />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                追加
              </Link>
            )}
          </div>
          {careNotes.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm">まだノートがありません</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {careNotes.slice(0, 3).map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <ExpandableText text={note.content} limit={100} />
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <span>{note.authorName || "退会したユーザー"}</span>
                      <span>·</span>
                      <span>
                        {new Date(note.createdAt).toLocaleDateString("ja-JP", {
                          timeZone: "Asia/Tokyo",
                        })}{" "}
                        {new Date(note.createdAt).toLocaleTimeString("ja-JP", {
                          timeZone: "Asia/Tokyo",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {careNotesTotal >= 1 && (
                <Link
                  href={`/seniors/${seniorId}/notes`}
                  onClick={() => click(`/seniors/${seniorId}/notes`)}
                  className="flex items-center justify-center gap-1.5 w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-5 pt-2 border-t border-gray-100"
                >
                  {clickedHref === `/seniors/${seniorId}/notes` && <Spinner />}
                  もっと見る →
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
