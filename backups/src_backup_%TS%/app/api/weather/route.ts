import { NextResponse } from "next/server";
import { weatherService } from "@/services/weatherService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location") || "Kashgar";
    const altitude = Number(searchParams.get("altitude") || "1300");
    const lat = searchParams.get("lat") ? Number(searchParams.get("lat")) : undefined;
    const lng = searchParams.get("lng") ? Number(searchParams.get("lng")) : undefined;

    const report = await weatherService.getWeather(location, altitude, lat, lng);
    return NextResponse.json(report);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
