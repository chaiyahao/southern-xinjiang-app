import { NextResponse } from "next/server";
import { addChatMessage, liveSyncState, type LiveChatMessage, activeTypingUsers } from "../../../lib/liveSyncStore";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const LOCAL_CHAT_FILE = path.join(process.cwd(), "data-store", "chat_messages_snapshot.json");

interface ChatStorage {
  messages: LiveChatMessage[];
  deletedIds: string[];
}

function writeJsonAtomic(filePath: string, data: any) {
  const tempPath = filePath + ".tmp";
  try {
    const dataStoreDir = path.dirname(filePath);
    if (!fs.existsSync(dataStoreDir)) {
      fs.mkdirSync(dataStoreDir, { recursive: true });
    }
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    console.error("Atomic write failed:", err);
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch {}
    }
  }
}

function readStorage(): ChatStorage {
  try {
    const dataStoreDir = path.dirname(LOCAL_CHAT_FILE);
    if (!fs.existsSync(dataStoreDir)) {
      fs.mkdirSync(dataStoreDir, { recursive: true });
    }
    if (fs.existsSync(LOCAL_CHAT_FILE)) {
      const content = fs.readFileSync(LOCAL_CHAT_FILE, "utf-8");
      if (content.trim()) {
        const parsed = JSON.parse(content);
        return {
          messages: Array.isArray(parsed?.messages) ? parsed.messages : [],
          deletedIds: Array.isArray(parsed?.deletedIds) ? parsed.deletedIds : [],
        };
      }
    }
  } catch (err) {
    console.error("Failed to read chat messages from file:", err);
  }
  return {
    messages: liveSyncState.chatMessages,
    deletedIds: [],
  };
}

export async function GET() {
  const storage = readStorage();
  liveSyncState.chatMessages = storage.messages;

  const now = Date.now();
  const typing = Object.entries(activeTypingUsers)
    .filter(([_, info]) => now - info.lastActive < 3000)
    .map(([uid, info]) => ({
      userId: uid,
      name: info.name,
    }));

  return NextResponse.json({
    messages: storage.messages,
    deletedIds: storage.deletedIds,
    typing,
    serverTime: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const sender = typeof body?.sender === "string" ? body.sender.trim() : "";
  const senderId = typeof body?.senderId === "string" ? body.senderId.trim() : undefined;
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const id = typeof body?.id === "string" ? body.id : crypto.randomUUID();
  const timestamp = typeof body?.timestamp === "string" ? body.timestamp : new Date().toISOString();

  if (!sender || !text) {
    return NextResponse.json({ error: "sender and text are required" }, { status: 400 });
  }

  const storage = readStorage();
  
  if (!storage.messages.some((msg) => msg.id === id) && !storage.deletedIds.includes(id)) {
    const readBy = senderId ? [senderId] : [];
    const newMessage: LiveChatMessage = {
      id,
      sender,
      senderId,
      text,
      timestamp,
      readBy,
      deliveredTo: senderId ? [senderId] : [],
    };
    storage.messages.push(newMessage);
    
    // Trim log to prevent unbounded file size
    storage.messages = storage.messages.slice(-300);
    liveSyncState.chatMessages = storage.messages;
    
    writeJsonAtomic(LOCAL_CHAT_FILE, storage);
  }

  return NextResponse.json({ message: { id, sender, senderId, text, timestamp } });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const storage = readStorage();

  if (id) {
    storage.messages = storage.messages.filter((msg) => msg.id !== id);
    if (!storage.deletedIds.includes(id)) {
      storage.deletedIds.push(id);
      // Keep deleted list trimmed
      storage.deletedIds = storage.deletedIds.slice(-200);
    }
    liveSyncState.chatMessages = storage.messages;
    writeJsonAtomic(LOCAL_CHAT_FILE, storage);
    return NextResponse.json({ ok: true, deleted: id });
  }
  
  storage.messages = [];
  storage.deletedIds = [];
  liveSyncState.chatMessages = [];
  writeJsonAtomic(LOCAL_CHAT_FILE, storage);
  return NextResponse.json({ ok: true });
}
