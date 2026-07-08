import { NextResponse } from "next/server";
import { aiService } from "@/services/aiService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const day = Number(searchParams.get("day") || "1");
    const location = searchParams.get("location") || "Kashgar";
    const altitude = Number(searchParams.get("altitude") || "1300");

    const recommendation = await aiService.getDayRecommendation(day, location, altitude);
    return NextResponse.json(recommendation);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
