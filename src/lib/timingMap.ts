export const TIMING_MAP: Record<string, { start: number; end: number }> = {
  朝食前: { start: 6, end: 8 }, // 朝食の前
  朝食後: { start: 7, end: 10 }, // 朝食の後
  昼食前: { start: 10, end: 12 }, // 昼食の前
  食間: { start: 10, end: 14 }, // 食間
  昼食後: { start: 11, end: 14 }, // 昼食の後
  夕食前: { start: 16, end: 18 }, // 夕食の前
  夕食後: { start: 17, end: 20 }, // 夕食の後
  就寝前: { start: 20, end: 23 }, // 就寝前
};
