import { NextResponse } from "next/server";
import { activeTypingUsers } from "../../../../lib/liveSyncStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = Date.now();
  const typing = Object.entries(activeTypingUsers)
    .filter(([_, info]) => now - info.lastActive < 3000)
    .map(([userId, info]) => ({
      userId,
      name: info.name,
    }));

  return NextResponse.json({ typing });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const userId = body?.userId;
  const name = body?.name;
  const isTyping = body?.isTyping;

  if (!userId || !name) {
    return NextResponse.json({ error: "userId and name are required" }, { status: 400 });
  }

  if (isTyping) {
    activeTypingUsers[userId] = {
      name,
      lastActive: Date.now(),
    };
  } else {
    delete activeTypingUsers[userId];
  }

  const now = Date.now();
  Object.keys(activeTypingUsers).forEach((key) => {
    if (now - activeTypingUsers[key].lastActive >= 3000) {
      delete activeTypingUsers[key];
    }
  });

  const typing = Object.entries(activeTypingUsers)
    .map(([uid, info]) => ({
      userId: uid,
      name: info.name,
    }));

  return NextResponse.json({ typing });
}
