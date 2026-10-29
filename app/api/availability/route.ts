import { NextResponse } from "next/server";
import { getMonthAvailability, checkSlotFree } from "@/lib/availability";

export const dynamic = "force-dynamic";

const TZ = 7 * 60 * 60 * 1000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Revalidation mode: is this exact slot still free right now?
  const start = searchParams.get("start");
  if (start) {
    const res = await checkSlotFree(start);
    return NextResponse.json(res);
  }

  const month = searchParams.get("month");
  let year: number;
  let monthIndex: number;
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    [year, monthIndex] = month.split("-").map(Number);
    monthIndex -= 1;
  } else {
    const now = new Date(Date.now() + TZ);
    year = now.getUTCFullYear();
    monthIndex = now.getUTCMonth();
  }

  const res = await getMonthAvailability(year, monthIndex);
  return NextResponse.json(res);
}
