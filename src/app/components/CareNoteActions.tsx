"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  noteId: string;
  seniorId: string;
  content: string;
  isOwner: boolean;
};

export function CareNoteActions({ noteId, seniorId, content, isOwner }: Props) {
  const router = useRouter();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [loading, setLoading] = useState(false);

  if (!isOwner) return null;

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/seniors/${seniorId}/carenotes/${noteId}`, {
      method: "DELETE",
    });
    setLoading(false);
    setShowDelete(false);
    router.refresh();
  }

  async function handleEdit() {
    if (!editContent.trim()) return;
    setLoading(true);
    await fetch(`/api/seniors/${seniorId}/carenotes/${noteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editContent }),
    });
    setLoading(false);
    setShowEdit(false);
    router.refresh();
  }

  return (
    <>
      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm mb-4 p-5">
            <p className="text-base font-semibold text-gray-900 mb-3">
              ノートを編集
            </p>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none mb-4"
            />
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setShowEdit(false);
                  setEditContent(content);
                }}
                className="py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600"
              >
                キャンセル
              </button>
              <button
                onClick={handleEdit}
                disabled={loading || !editContent.trim()}
                className="py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
              >
                {loading ? "保存中..." : "保存する"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm mb-4 p-5">
            <p className="text-base font-semibold text-gray-900 mb-2 text-center">
              削除しますか？
            </p>
            <p className="text-sm text-gray-400 text-center mb-5">
              この操作は取り消せません
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="py-3 bg-red-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
              >
                {loading ? "削除中..." : "削除する"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={() => setShowEdit(true)}
          className="text-xs text-indigo-400 hover:text-indigo-600 transition-colors"
        >
          ✏️ 編集
        </button>
        <span className="text-gray-200">·</span>
        <button
          onClick={() => setShowDelete(true)}
          className="text-xs text-red-300 hover:text-red-500 transition-colors"
        >
          🗑️ 削除
        </button>
      </div>
    </>
  );
}
