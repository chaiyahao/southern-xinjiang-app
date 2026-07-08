import { NextResponse } from "next/server";
import { activeCollaborators } from "../../../../lib/liveSyncStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = Date.now();
  // Filter out expired collaborators (older than 5 seconds)
  const active = Object.entries(activeCollaborators)
    .filter(([_, info]) => now - info.lastActive < 5000)
    .map(([userId, info]) => ({
      userId,
      name: info.name,
    }));

  return NextResponse.json({ active });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || !body.userId || !body.name) {
    return NextResponse.json({ error: "userId and name are required" }, { status: 400 });
  }

  const now = Date.now();
  if (body.status === "idle") {
    delete activeCollaborators[body.userId];
  } else {
    activeCollaborators[body.userId] = {
      name: body.name,
      lastActive: now,
    };
  }

  // Also clean up older entries during the write
  Object.keys(activeCollaborators).forEach((key) => {
    if (now - activeCollaborators[key].lastActive >= 5000) {
      delete activeCollaborators[key];
    }
  });

  const active = Object.entries(activeCollaborators)
    .map(([userId, info]) => ({
      userId,
      name: info.name,
    }));

  return NextResponse.json({ active });
}
