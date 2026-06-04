// Japan (UTC+9) সময় হিসাব
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

// Japan-এ এখন — Date object যার UTC ফিল্ডে Japan-এর মান
export function japanNow(): Date {
  return new Date(Date.now() + JST_OFFSET_MS);
}

// Japan-এ আজকের শুরু (00:00), আসল UTC instant হিসেবে
export function startOfJapanToday(): Date {
  const jp = japanNow();
  // Japan-এর আজকের Y/M/D নিয়ে, সেই দিনের Japan 00:00 = UTC 00:00 - 9h
  return new Date(
    Date.UTC(jp.getUTCFullYear(), jp.getUTCMonth(), jp.getUTCDate(), 0, 0, 0) -
      JST_OFFSET_MS,
  );
}

// যেকোনো date Japan-এ কোন দিনের 00:00 (UTC instant)
export function japanDayStart(date: Date): Date {
  const jp = new Date(date.getTime() + JST_OFFSET_MS);
  return new Date(
    Date.UTC(jp.getUTCFullYear(), jp.getUTCMonth(), jp.getUTCDate(), 0, 0, 0) -
      JST_OFFSET_MS,
  );
}

export function japanHour(): number {
  return japanNow().getUTCHours();
}
