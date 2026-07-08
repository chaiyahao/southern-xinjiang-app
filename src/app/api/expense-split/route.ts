import { NextResponse } from "next/server";
import { liveSyncState, setExpenseSplitSnapshot } from "../../../lib/liveSyncStore";
import { isSupabaseWriteConfigured, serverSupabase } from "../../../utils/serverSupabaseClient";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
const SNAPSHOT_ID = "group-ledger";
const LOCAL_SNAPSHOT_FILE = path.join(process.cwd(), "data-store", "expense_split_snapshot.json");
const OLD_SNAPSHOT_FILE = path.join(process.cwd(), "src", "data", "expense_split_snapshot.json");

// Ensure data-store directory exists and migrate the template file if necessary
function ensureLocalFile() {
  try {
    const dataStoreDir = path.dirname(LOCAL_SNAPSHOT_FILE);
    if (!fs.existsSync(dataStoreDir)) {
      fs.mkdirSync(dataStoreDir, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_SNAPSHOT_FILE) && fs.existsSync(OLD_SNAPSHOT_FILE)) {
      fs.copyFileSync(OLD_SNAPSHOT_FILE, LOCAL_SNAPSHOT_FILE);
    }
  } catch (err) {
    console.error("Failed to migrate/create local data-store for expense split:", err);
  }
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
    console.error("Atomic write for expense split failed:", err);
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch {}
    }
  }
}

export async function GET() {
  ensureLocalFile();
  if (isSupabaseWriteConfigured && serverSupabase) {
    const { data, error } = await serverSupabase
      .from("expense_split_snapshot")
      .select("split_expenses, expense_logs, payment_records, updated_at")
      .eq("id", SNAPSHOT_ID)
      .maybeSingle();

    if (!error && data) {
      const snapshot = setExpenseSplitSnapshot({
        splitExpenses: data.split_expenses || [],
        expenseLogs: data.expense_logs || [],
        paymentRecords: data.payment_records || [],
        updatedAt: data.updated_at,
      });

      return NextResponse.json({
        ...snapshot,
        serverTime: new Date().toISOString(),
        source: "supabase",
      });
    }
  } else {
    try {
      if (fs.existsSync(LOCAL_SNAPSHOT_FILE)) {
        const fileContent = fs.readFileSync(LOCAL_SNAPSHOT_FILE, "utf-8");
        const data = JSON.parse(fileContent);
        const snapshot = setExpenseSplitSnapshot({
          splitExpenses: data.splitExpenses || [],
          expenseLogs: data.expenseLogs || [],
          paymentRecords: data.paymentRecords || [],
          updatedAt: data.updatedAt,
        });

        return NextResponse.json({
          ...snapshot,
          serverTime: new Date().toISOString(),
          source: "local-file",
        });
      }
    } catch (err) {
      console.error("Failed to read local expense snapshot file:", err);
    }
  }

  return NextResponse.json({
    ...liveSyncState.expenseSplit,
    serverTime: new Date().toISOString(),
    source: "memory",
  });
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || !Array.isArray(body.splitExpenses) || !Array.isArray(body.expenseLogs) || !Array.isArray(body.paymentRecords)) {
    return NextResponse.json(
      { error: "splitExpenses, expenseLogs, and paymentRecords arrays are required" },
      { status: 400 }
    );
  }

  // Concurrency check
  let existingUpdatedAt: string | null = null;
  if (isSupabaseWriteConfigured && serverSupabase) {
    const { data } = await serverSupabase
      .from("expense_split_snapshot")
      .select("updated_at")
      .eq("id", SNAPSHOT_ID)
      .maybeSingle();
    if (data) {
      existingUpdatedAt = data.updated_at;
    }
  } else {
    try {
      if (fs.existsSync(LOCAL_SNAPSHOT_FILE)) {
        const fileContent = fs.readFileSync(LOCAL_SNAPSHOT_FILE, "utf-8");
        const data = JSON.parse(fileContent);
        existingUpdatedAt = data.updatedAt || null;
      }
    } catch (err) {
      console.error("Failed to read local file for concurrency check:", err);
    }
  }

  if (existingUpdatedAt && body.lastUpdatedAt) {
    const serverTime = new Date(existingUpdatedAt).getTime();
    const clientTime = new Date(body.lastUpdatedAt).getTime();
    if (serverTime - clientTime > 1000) {
      return NextResponse.json(
        { error: "This data has changed. Please refresh and try again." },
        { status: 409 }
      );
    }
  }

  const nextSnapshot = {
    splitExpenses: body.splitExpenses,
    expenseLogs: body.expenseLogs.slice(0, 200),
    paymentRecords: body.paymentRecords.slice(0, 300),
  };

  const snapshot = setExpenseSplitSnapshot(nextSnapshot);

  if (isSupabaseWriteConfigured && serverSupabase) {
    const { error } = await serverSupabase.from("expense_split_snapshot").upsert({
      id: SNAPSHOT_ID,
      split_expenses: nextSnapshot.splitExpenses,
      expense_logs: nextSnapshot.expenseLogs,
      payment_records: nextSnapshot.paymentRecords,
      updated_at: snapshot.updatedAt,
    });

    if (error) {
      return NextResponse.json({ ...snapshot, warning: error.message, source: "memory" }, { status: 202 });
    }
  } else {
    try {
      ensureLocalFile();
      const dataToSave = {
        splitExpenses: nextSnapshot.splitExpenses,
        expenseLogs: nextSnapshot.expenseLogs,
        paymentRecords: nextSnapshot.paymentRecords,
        updatedAt: snapshot.updatedAt,
      };
      writeJsonAtomic(LOCAL_SNAPSHOT_FILE, dataToSave);
    } catch (err) {
      console.error("Failed to write local expense snapshot file:", err);
    }
  }

  return NextResponse.json({ ...snapshot, source: isSupabaseWriteConfigured ? "supabase" : "local-file" });
}

export async function DELETE() {
  const nextSnapshot = {
    splitExpenses: [],
    expenseLogs: [],
    paymentRecords: [],
  };

  const snapshot = setExpenseSplitSnapshot(nextSnapshot);

  if (isSupabaseWriteConfigured && serverSupabase) {
    await serverSupabase.from("expense_split_snapshot").upsert({
      id: SNAPSHOT_ID,
      split_expenses: [],
      expense_logs: [],
      payment_records: [],
      updated_at: snapshot.updatedAt,
    });
  } else {
    try {
      if (fs.existsSync(LOCAL_SNAPSHOT_FILE)) {
        fs.unlinkSync(LOCAL_SNAPSHOT_FILE);
      }
    } catch (err) {
      console.error("Failed to delete local expense snapshot file:", err);
    }
  }

  return NextResponse.json({ ...snapshot, source: isSupabaseWriteConfigured ? "supabase" : "local-file" });
}
