import { NextResponse } from "next/server";
import { liveSyncState } from "../../../../lib/liveSyncStore";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
const LOCAL_CHAT_FILE = path.join(process.cwd(), "data-store", "chat_messages_snapshot.json");

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const userId = body?.userId;
  const messageIds = body?.messageIds;
  const status = body?.status; // "delivered" | "read"

  if (!userId || !Array.isArray(messageIds) || !status) {
    return NextResponse.json({ error: "userId, messageIds, and status are required" }, { status: 400 });
  }

  let messages = liveSyncState.chatMessages;
  let changed = false;

  messages.forEach((msg) => {
    if (messageIds.includes(msg.id)) {
      if (status === "delivered") {
        if (!msg.deliveredTo) msg.deliveredTo = [];
        if (!msg.deliveredTo.includes(userId)) {
          msg.deliveredTo.push(userId);
          changed = true;
        }
      } else if (status === "read") {
        if (!msg.readBy) msg.readBy = [];
        if (!msg.readBy.includes(userId)) {
          msg.readBy.push(userId);
          changed = true;
        }
        if (!msg.deliveredTo) msg.deliveredTo = [];
        if (!msg.deliveredTo.includes(userId)) {
          msg.deliveredTo.push(userId);
          changed = true;
        }
      }
    }
  });

  if (changed) {
    liveSyncState.chatMessages = messages;
    try {
      const dataStoreDir = path.dirname(LOCAL_CHAT_FILE);
      if (!fs.existsSync(dataStoreDir)) {
        fs.mkdirSync(dataStoreDir, { recursive: true });
      }
      fs.writeFileSync(LOCAL_CHAT_FILE, JSON.stringify({ messages, deletedIds: [] }, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to write updated receipts:", e);
    }
  }

  return NextResponse.json({ ok: true });
}
