import { NextResponse } from "next/server";
import { flightService } from "@/services/flightService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // flightNo may come in as "CZ2008 (AKU)" — split out the origin hint
    const raw = searchParams.get("flightNo") || "CZ2362";
    const depIata = searchParams.get("depIata") || undefined;
    const arrIata = searchParams.get("arrIata") || undefined;

    // Extract the bare flight number (before any " (XXX)" hint)
    const flightNo = raw.split("(")[0].trim();

    const history = await flightService.getFlightHistory(flightNo, depIata, arrIata);
    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
