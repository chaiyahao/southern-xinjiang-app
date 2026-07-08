import { NextResponse } from "next/server";
import { getOfficialAlerts } from "@/services/alertService";

export async function GET() {
  try {
    const alerts = await getOfficialAlerts();
    return NextResponse.json({ alerts });
  } catch (error: any) {
    return NextResponse.json({ alerts: [] }, { status: 500 });
  }
}
