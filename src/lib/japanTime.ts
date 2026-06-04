// Japan time (UTC+9) ঠিকঠাক হিসাব করার helper।
// সমস্যা ছিল: new Date(toLocaleString(...)) server timezone-এ interpret হয়,
// তাই মাঝরাতের আশেপাশে তারিখ এক পিছিয়ে যেত।
//
// এই helper সরাসরি UTC offset (+9) দিয়ে হিসাব করে — server যেখানেই থাক, ঠিক থাকবে।

const JST_OFFSET_MS = 9 * 60 * 60 * 1000; // UTC+9

// এখন Japan-এ কোন দিন/সময়, সেটা একটা Date হিসেবে (UTC ফিল্ড গুলোতে Japan মান)
export function nowInJapan(): Date {
  return new Date(Date.now() + JST_OFFSET_MS);
}

// Japan-এ আজকের শুরু (00:00) — কিন্তু আসল UTC instant হিসেবে।
// medicineLog.createdAt (UTC) এর সাথে { gte: startOfJapanToday() } তুলনা করা যাবে।
export function startOfJapanToday(): Date {
  const jpNow = new Date(Date.now() + JST_OFFSET_MS);
  // Japan-এর আজকের তারিখ (UTC ফিল্ডে)
  const y = jpNow.getUTCFullYear();
  const m = jpNow.getUTCMonth();
  const d = jpNow.getUTCDate();
  // Japan-এর আজ 00:00 = UTC-তে সেই দিনের 00:00 মাইনাস ৯ ঘণ্টা
  return new Date(Date.UTC(y, m, d) - JST_OFFSET_MS);
}

// Japan-এ এখন কত ঘণ্টা (0-23) — medicine timing চেক করতে
export function japanHour(): number {
  return new Date(Date.now() + JST_OFFSET_MS).getUTCHours();
}
// যেকোনো UTC date → Japan-এ সেই date কোন দিনের 00:00 (compare করার জন্য)
export function japanDayStart(date: Date): Date {
  const jp = new Date(date.getTime() + JST_OFFSET_MS);
  return new Date(
    Date.UTC(jp.getUTCFullYear(), jp.getUTCMonth(), jp.getUTCDate()) -
      JST_OFFSET_MS,
  );
}
