import { NextResponse } from "next/server";
import {
  liveSyncState,
  upsertTravelerLocation,
  type LiveTravelerLocation,
} from "../../../lib/liveSyncStore";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    locations: Object.values(liveSyncState.travelerLocations),
    serverTime: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const travelerId = typeof body?.traveler_id === "string" ? body.traveler_id.trim() : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const lat = Number(body?.lat);
  const lng = Number(body?.lng);

  if (!travelerId || !name || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "traveler_id, name, lat, and lng are required" }, { status: 400 });
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json({ error: "coordinates are out of range" }, { status: 400 });
  }

  const location: LiveTravelerLocation = {
    traveler_id: travelerId,
    name,
    lat,
    lng,
    updated_at: new Date().toISOString(),
    is_sharing_gps: body?.is_sharing_gps === true,
    speed_kmh: typeof body?.speed_kmh === "number" ? body.speed_kmh : undefined,
    accuracy: typeof body?.accuracy === "number" ? body.accuracy : undefined,
    last_active_time: typeof body?.last_active_time === "number" ? body.last_active_time : Date.now(),
  };
  upsertTravelerLocation(location);

  return NextResponse.json({ location });
}

export async function DELETE() {
  liveSyncState.travelerLocations = {};
  return NextResponse.json({ ok: true });
}
