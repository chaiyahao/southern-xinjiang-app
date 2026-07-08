import type { SplitExpense } from "../types";

export type LiveChatMessage = {
  id: string;
  sender: string;
  senderId?: string;
  text: string;
  timestamp: string;
  readBy?: string[];
  deliveredTo?: string[];
};

export type LiveTravelerLocation = {
  traveler_id: string;
  name: string;
  lat: number;
  lng: number;
  updated_at: string;
  is_sharing_gps?: boolean;
  speed_kmh?: number;
  accuracy?: number;
  last_active_time?: number;
  online_since?: number;
  last_online?: number;
};

export type PaymentRecord = {
  id: string;
  payerId: string;
  recipientId: string;
  amountThb: number;
  method: "transfer" | "cash" | "other";
  note?: string;
  fileName?: string;
  settledExpenseIds: string[];
  createdAt: string;
};

export type ExpenseSplitSnapshot = {
  splitExpenses: SplitExpense[];
  expenseLogs: string[];
  paymentRecords: PaymentRecord[];
  updatedAt: string;
};

type LiveSyncState = {
  chatMessages: LiveChatMessage[];
  travelerLocations: Record<string, LiveTravelerLocation>;
  expenseSplit: ExpenseSplitSnapshot;
};

const globalForLiveSync = globalThis as typeof globalThis & {
  __xinjiangLiveSync?: LiveSyncState;
};

export const liveSyncState: LiveSyncState =
  globalForLiveSync.__xinjiangLiveSync ||
  (globalForLiveSync.__xinjiangLiveSync = {
    chatMessages: [],
    travelerLocations: {},
    expenseSplit: {
      splitExpenses: [],
      expenseLogs: [],
      paymentRecords: [],
      updatedAt: new Date().toISOString(),
    },
  });

export function addChatMessage(message: LiveChatMessage) {
  if (!liveSyncState.chatMessages.some((item) => item.id === message.id)) {
    liveSyncState.chatMessages.push(message);
  }

  if (liveSyncState.chatMessages.length > 300) {
    liveSyncState.chatMessages = liveSyncState.chatMessages.slice(-300);
  }

  return message;
}

export function upsertTravelerLocation(location: LiveTravelerLocation) {
  const now = Date.now();
  const prev = liveSyncState.travelerLocations[location.traveler_id];
  const wasOffline = !prev || !prev.last_active_time || (now - prev.last_active_time > 120000);

  if (wasOffline) {
    location.online_since = now;
  } else {
    location.online_since = prev.online_since || prev.last_active_time || now;
  }
  location.last_online = now;

  liveSyncState.travelerLocations[location.traveler_id] = location;
  return location;
}

export function setExpenseSplitSnapshot(snapshot: Partial<ExpenseSplitSnapshot>) {
  liveSyncState.expenseSplit = {
    splitExpenses: snapshot.splitExpenses || liveSyncState.expenseSplit.splitExpenses,
    expenseLogs: snapshot.expenseLogs || liveSyncState.expenseSplit.expenseLogs,
    paymentRecords: snapshot.paymentRecords || liveSyncState.expenseSplit.paymentRecords,
    updatedAt: snapshot.updatedAt || new Date().toISOString(),
  };

  return liveSyncState.expenseSplit;
}

export const activeCollaborators: Record<string, { name: string; lastActive: number }> = {};

export const activeTypingUsers: Record<string, { name: string; lastActive: number }> = {};


