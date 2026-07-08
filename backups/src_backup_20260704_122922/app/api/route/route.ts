import { NextResponse } from "next/server";
import { tripService } from "@/services/tripService";

export async function GET() {
  try {
    const itinerary = await tripService.getItinerary();
    return NextResponse.json(itinerary);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
