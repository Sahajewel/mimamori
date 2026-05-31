import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── কোন কোন ছবির ধরন allow করব ──
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
// ── সর্বোচ্চ file size: 5MB ──
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "ファイルがありません" },
        { status: 400 },
      );
    }

    // ── ফাঁক বন্ধ ১: শুধু ছবি allow করব (type চেক) ──
    // আগে যেকোনো file নিত (frontend-এর accept="image/*" backend-কে আটকায় না)।
    // কেউ সরাসরি API-তে PDF/video/অন্য file পাঠাতে পারত।
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "画像ファイル（JPEG・PNG・WebP・GIF）のみアップロードできます",
        },
        { status: 400 },
      );
    }

    // ── ফাঁক বন্ধ ২: file size limit (5MB) ──
    // আগে যেকোনো size নিত — বড় file খরচ আর performance সমস্যা করত।
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "ファイルサイズは5MB以下にしてください" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    // resource_type: "image" — "auto" থেকে বদলালাম, যাতে শুধু ছবি হিসেবেই
    // process হয় (বাড়তি সুরক্ষা)
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "mimamori",
      resource_type: "image",
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
