// ছবি upload করার আগে frontend-এ যাচাই (type + size)।
// এটা শুধু UX — দ্রুত warning দেওয়ার জন্য। আসল security backend-এ
// (/api/upload-এ) আছে। limit/type এক জায়গায় রাখলাম যাতে সব form-এ
// একই নিয়ম থাকে, আর পরে বদলালে এক জায়গায় বদলালেই হয়।

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * file যাচাই করে। ঠিক থাকলে null ফেরত দেয় (কোনো সমস্যা নাই),
 * ভুল থাকলে একটা error message (string) ফেরত দেয়।
 */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "画像ファイル（JPEG・PNG・WebP・GIF）のみアップロードできます";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "ファイルサイズは5MB以下にしてください";
  }
  return null;
}
