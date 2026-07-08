import { NextRequest, NextResponse } from "next/server";
import { flightService } from "@/services/flightService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const flightNo = searchParams.get("flightNo");
    const depIata = searchParams.get("depIata") || undefined;
    const arrIata = searchParams.get("arrIata") || undefined;

    if (!flightNo) {
      return NextResponse.json({ error: "flightNo query parameter is required" }, { status: 400 });
    }

    const liveStatus = await flightService.getLiveFlightStatus(flightNo, depIata, arrIata);
    return NextResponse.json(liveStatus);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
