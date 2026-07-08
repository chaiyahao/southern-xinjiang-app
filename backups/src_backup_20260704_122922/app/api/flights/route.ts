import { NextResponse } from "next/server";
import { flightService } from "@/services/flightService";

export async function GET() {
  try {
    const flights = await flightService.getFlights();
    return NextResponse.json(flights);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
