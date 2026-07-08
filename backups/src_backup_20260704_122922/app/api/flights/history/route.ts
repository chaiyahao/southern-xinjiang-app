import { NextResponse } from "next/server";
import { flightService } from "@/services/flightService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const flightNo = searchParams.get("flightNo") || "CZ2362";
    const history = await flightService.getFlightHistory(flightNo);
    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
