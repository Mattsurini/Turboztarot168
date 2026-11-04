/**
 * name -> {slug, order} map generated from design/v2/services-data.json.
 * Notion rows not in this map (e.g. the trashed "Video Call 999") are dropped;
 * order drives the public services list.
 */
export const SERVICE_SLUGS: Record<string, { slug: string; order: number }> = {
  "Horary Astrology 5 คำถาม": { slug: "horary-astrology-5", order: 1 },
  "Horary Astrology 3 คำถาม": { slug: "horary-astrology-3", order: 2 },
  "Horary Astrology 1 คำถาม": { slug: "horary-astrology-1", order: 3 },
  "โชคลาภ และ การเสี่ยงทาย": { slug: "luck-and-fortune", order: 4 },
  "5 คำถาม": { slug: "tarot-5-questions", order: 5 },
  "3 คำถาม": { slug: "tarot-3-questions", order: 6 },
  "2 คำถาม": { slug: "tarot-2-questions", order: 7 },
  "1 คำถาม": { slug: "tarot-1-question", order: 8 },
  "About Soulmate": { slug: "about-soulmate", order: 9 },
  "แฟนคนถัดไป": { slug: "next-partner", order: 10 },
  "เนื้อคู่ของคุณ": { slug: "your-soulmate", order: 11 },
  "4 คำถามความรัก": { slug: "love-4-questions", order: 12 },
  "ไพ่เล่าเรื่อง X ….": { slug: "story-telling-x", order: 13 },
  "พื้นดวงแบบปังๆ": { slug: "natal-chart-boom", order: 14 },
  "อยากรู้แต่ไม่อยากถาม": { slug: "energy-reading", order: 15 },
  "Video Call (Card) 30 Min": { slug: "video-call-card-30-min-lite", order: 16 },
  "Voice Call (No Face) 30 Min": { slug: "voice-call-30-min", order: 17 },
  "Voice Call (No Face) 10 Min": { slug: "voice-call-10-min", order: 18 },
  "เจาะลึกแบบจุกๆ": { slug: "deep-dive-reading", order: 19 },
};
