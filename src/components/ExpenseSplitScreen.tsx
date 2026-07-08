"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  Coins,
  FileSpreadsheet,
  Image as ImageIcon,
  Plus,
  Receipt,
  Scale,
  Sparkles,
  Trash2,
  Upload,
  Users,
  WalletCards,
  Edit,
  RotateCcw,
  RefreshCw,
  Eye,
  EyeOff,
  AlertTriangle,
  Camera,
  FolderOpen,
  X
} from "lucide-react";
import { useTravelStore } from "../store/useTravelStore";
import type { SplitExpense } from "../types";
import { formatDisplayName, getParticipantColor, getParticipantById, PARTICIPANTS } from "../utils/travelers";
import SecurityVerificationModal from "./SecurityVerificationModal";
import { isSupabaseConfigured, supabase } from "../utils/supabaseClient";

const TRAVELERS = [
  { id: "1", name: "CHAIYA WIBOONSANTISUK (Hao)", pin: "1111" },
  { id: "2", name: "NANUTDA PRAKHOD (Benz)", pin: "2222" },
  { id: "3", name: "TIPUBON HOMCHAN (Tare)", pin: "3333" },
  { id: "4", name: "NAPAS PATTARAAMORNPAN (Cheer)", pin: "4444" },
  { id: "5", name: "NAKARED WATTANAMONTRI (Tob)", pin: "5555" },
  { id: "6", name: "NATTARIKA KHAMMA (Tarn)", pin: "6666" },
];

const CATEGORIES = [
  { id: "food", th: "อาหารและเครื่องดื่ม", en: "Food & Drinks" },
  { id: "transport", th: "เดินทาง/น้ำมัน", en: "Transport" },
  { id: "hotels", th: "ที่พัก", en: "Hotels" },
  { id: "tickets", th: "ตั๋ว/ค่าเข้า", en: "Tickets" },
  { id: "shopping", th: "ช้อปปิ้ง/ของฝาก", en: "Shopping" },
  { id: "other", th: "อื่น ๆ", en: "Other" },
] as const;

type PaymentRecord = {
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

type OutstandingItem = {
  expense: SplitExpense;
  payerId: string;
  recipientId: string;
  amountThb: number;
  amountCny: number;
};

function firstName(idOrName: string) {
  return formatDisplayName(idOrName, "nickname");
}

function currency(value: number) {
  return `฿${Math.round(value).toLocaleString()}`;
}

function cny(value: number) {
  return `¥${value.toLocaleString(undefined, { maximumFractionDigits: 1 })}`;
}

export function computeSettlements(expenses: SplitExpense[], travelers: { id: string; name: string }[]) {
  const balances: Record<string, number> = Object.fromEntries(travelers.map((traveler) => [traveler.id, 0]));

  expenses.forEach((expense) => {
    if (expense.isDeleted) return;
    if (expense.splitAmong.length === 0) return;
    const share = expense.amountThb / expense.splitAmong.length;
    const settled = new Set(expense.settledParticipants || []);

    expense.splitAmong.forEach((participantId) => {
      if (participantId === expense.paidBy || settled.has(participantId)) return;
      balances[participantId] -= share;
      balances[expense.paidBy] += share;
    });
  });

  const creditors = travelers
    .map((traveler) => ({ ...traveler, amount: balances[traveler.id] || 0 }))
    .filter((item) => item.amount > 0.01)
    .sort((a, b) => b.amount - a.amount);
  const debtors = travelers
    .map((traveler) => ({ ...traveler, amount: Math.abs(balances[traveler.id] || 0) }))
    .filter((item) => (balances[item.id] || 0) < -0.01)
    .sort((a, b) => b.amount - a.amount);

  const settlements: { fromId: string; from: string; toId: string; to: string; amount: number }[] = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const payment = Math.min(debtor.amount, creditor.amount);
    settlements.push({
      fromId: debtor.id,
      from: debtor.name,
      toId: creditor.id,
      to: creditor.name,
      amount: Number(payment.toFixed(2)),
    });
    debtor.amount -= payment;
    if (debtor.amount < 0.01) debtorIndex += 1;
    if (creditor.amount < 0.01) creditorIndex += 1;
  }

  return { balances, settlements };
}

function getOutstandingItems(expenses: SplitExpense[], payerId?: string) {
  const items: OutstandingItem[] = [];

  expenses.forEach((expense) => {
    if (expense.isDeleted) return;
    if (expense.splitAmong.length === 0) return;
    const settled = new Set(expense.settledParticipants || []);
    const shareThb = expense.amountThb / expense.splitAmong.length;
    const shareCny = expense.amountCny / expense.splitAmong.length;

    expense.splitAmong.forEach((participantId) => {
      if (participantId === expense.paidBy || settled.has(participantId)) return;
      if (payerId && participantId !== payerId) return;
      items.push({
        expense,
        payerId: participantId,
        recipientId: expense.paidBy,
        amountThb: shareThb,
        amountCny: shareCny,
      });
    });
  });

  return items;
}

export default function ExpenseSplitScreen() {
  const { exchangeRateCNY, language, splitExpenses, expenseLogs, visitorName, highlightedLogTimestamp, setHighlightedLogTimestamp } = useTravelStore();
  const isThai = language === "th";
  
  useEffect(() => {
    if (highlightedLogTimestamp) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`audit-log-${highlightedLogTimestamp}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500);
      
      const clearTimer = setTimeout(() => {
        setHighlightedLogTimestamp(null);
      }, 6000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(clearTimer);
      };
    }
  }, [highlightedLogTimestamp, setHighlightedLogTimestamp]);

  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [syncStatus, setSyncStatus] = useState<"syncing" | "online" | "local">("syncing");
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [selectedPayerId, setSelectedPayerId] = useState("1");
  const [selectedOutstandingIds, setSelectedOutstandingIds] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentRecord["method"]>("transfer");
  const [paymentNote, setPaymentNote] = useState("");
  const [paymentFileName, setPaymentFileName] = useState("");
  const seededServerRef = useRef(false);
  const lastWriteTimeRef = useRef<number>(0);
  const lastServerUpdatedAtRef = useRef<string>("");
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // New requirements states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "outstanding" | "settled" | "my">("all");
  const [showDeleted, setShowDeleted] = useState(false);
  const [editExpenseData, setEditExpenseData] = useState<SplitExpense | null>(null);
  
  // Security verification modal states
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [verificationTitleTh, setVerificationTitleTh] = useState("");
  const [verificationTitleEn, setVerificationTitleEn] = useState("");

  // Attachment state & refs
  const [receiptActionTarget, setReceiptActionTarget] = useState<"receipt" | "slip" | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const albumInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAddExpenseConfirmModal, setShowAddExpenseConfirmModal] = useState(false);

  // Collaboration States
  const [activeEditors, setActiveEditors] = useState<Array<{ userId: string; name: string }>>([]);
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const openAndroidPhotoPicker = async () => {
    if (typeof window !== "undefined" && typeof (window as any).showOpenFilePicker === "function") {
      try {
        const [fileHandle] = await (window as any).showOpenFilePicker({
          types: [
            {
              description: 'Images',
              accept: {
                'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.webp']
              }
            }
          ],
          excludeAcceptAllOption: true,
          multiple: false
        });
        const file = await fileHandle.getFile();
        if (file) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          if (albumInputRef.current) {
            albumInputRef.current.files = dataTransfer.files;
            const event = new Event('change', { bubbles: true });
            albumInputRef.current.dispatchEvent(event);
          }
        }
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return;
        }
        console.warn("showOpenFilePicker failed, falling back to traditional file input", err);
      }
    }
    albumInputRef.current?.click();
  };

  const currentUserId = TRAVELERS.find((traveler) => traveler.name.toLowerCase().includes(visitorName.toLowerCase()))?.id || "unknown";
  const isOwnerAdmin = currentUserId === "1"; // Only ID "1" is Owner/Admin (Hao)
  const CURRENT_RECORDER = TRAVELERS.find((traveler) => traveler.id === currentUserId)?.name || "Guest";

  const getDeviceAgent = () => {
    if (typeof window === "undefined" || !navigator.userAgent) return "Unknown Device";
    const ua = navigator.userAgent;
    if (ua.includes("iPhone")) return "iPhone";
    if (ua.includes("iPad")) return "iPad";
    if (ua.includes("Android")) return "Android Device";
    if (ua.includes("Macintosh")) return "Mac";
    if (ua.includes("Windows")) return "Windows PC";
    if (ua.includes("Linux")) return "Linux PC";
    return "Web Browser";
  };

  const makeLog = (actionText: string, customTimestamp?: string) => {
    const timestamp = customTimestamp || new Date().toISOString();
    const user = visitorName || "Guest";
    const device = getDeviceAgent();
    const ip = "192.168.1.15"; // Mock IP address
    return `[${timestamp}] [User: ${user}] [Device: ${device}] [IP: ${ip}] - ${actionText}`;
  };

  const sendSystemChatMessage = async (text: string) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    const timestamp = new Date().toISOString();

    // 1. Post to local store first
    useTravelStore.setState((state) => {
      const message = { id, sender: "SYSTEM", text, timestamp };
      const updated = [...state.chatMessages, message];
      if (typeof window !== "undefined") localStorage.setItem("chatMessages", JSON.stringify(updated));
      return { chatMessages: updated };
    });

    // 2. Publish to Supabase if configured
    let publishedOnSupabase = false;
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("travel_chat_messages").insert({
          id,
          sender: "SYSTEM",
          text,
          created_at: timestamp,
        });
        if (!error) {
          publishedOnSupabase = true;
        } else {
          console.warn("Supabase travel_chat_messages insert failed for system message:", error);
        }
      } catch (err) {
        console.warn("Supabase travel_chat_messages insert error for system message:", err);
      }
    }

    // 3. Fall back to local API
    if (!publishedOnSupabase) {
      try {
        await fetch("/api/live-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            sender: "SYSTEM",
            text,
            timestamp,
          }),
        });
      } catch (e) {
        console.error("Failed to send system chat message to local API:", e);
      }
    }
  };

  const handleOcrScan = () => {
    setIsOcrScanning(true);
    setTimeout(() => {
      const ocrSamples = [
        { name: "ก๋วยเตี๋ยวเนื้อแกะ Kashgar (Kashgar Mutton Noodles)", amountCny: "88", category: "food" },
        { name: "น้ำมันเชื้อเพลิงทางหลวง Pamir (Highway Gas Refill)", amountCny: "320", category: "transport" },
        { name: "มินิมาร์ทผลไม้เมือง Hotan (Hotan Oasis Fruit Market)", amountCny: "45", category: "food" },
        { name: "ตั๋วเข้าชมเมืองโบราณกัชการ์ (Kashgar Old Town Entry)", amountCny: "150", category: "tickets" },
        { name: "โรงแรมหรู Tashkurgan (Tashkurgan Boutique Stay)", amountCny: "680", category: "hotels" },
      ];
      const selected = ocrSamples[Math.floor(Math.random() * ocrSamples.length)];
      updateForm(() => ({
        ...form,
        name: selected.name,
        amountCny: selected.amountCny,
        category: selected.category,
      }));
      setIsOcrScanning(false);
      alert(isThai ? "✨ จำลองการตรวจจับใบเสร็จด้วย AI สำเร็จ!" : "✨ Simulated AI OCR Scanning Succeeded!");
    }, 1200);
  };

  const [form, setForm] = useState({
    name: "",
    amountCny: "",
    category: "food",
    paidBy: "", // Required, defaults to empty to trigger validation
    splitAmong: TRAVELERS.map((traveler) => traveler.id),
    imageUrl: "",
  });

  const { balances, settlements } = useMemo(() => computeSettlements(splitExpenses, TRAVELERS), [splitExpenses]);
  const outstandingItems = useMemo(() => getOutstandingItems(splitExpenses), [splitExpenses]);

  // Group outstanding items by creditor
  const creditorGroupedOutstanding = useMemo(() => {
    const payables = outstandingItems.filter((item) => item.payerId === selectedPayerId);
    const groups: Record<string, OutstandingItem[]> = {};
    payables.forEach((item) => {
      const credId = item.recipientId;
      if (!groups[credId]) groups[credId] = [];
      groups[credId].push(item);
    });
    return groups;
  }, [outstandingItems, selectedPayerId]);

  const debtMatrix = useMemo(() => {
    const matrix: Record<string, Record<string, number>> = {};
    TRAVELERS.forEach((t1) => {
      matrix[t1.id] = {};
      TRAVELERS.forEach((t2) => {
        matrix[t1.id][t2.id] = 0;
      });
    });
    outstandingItems.forEach((item) => {
      if (matrix[item.payerId] && matrix[item.recipientId] !== undefined) {
        matrix[item.payerId][item.recipientId] += item.amountThb;
      }
    });
    return matrix;
  }, [outstandingItems]);

  const payerOutstanding = useMemo(() => {
    const payables = outstandingItems.filter((item) => item.payerId === selectedPayerId);
    if (payables.length > 0) return payables;
    return outstandingItems.filter((item) => item.recipientId === selectedPayerId);
  }, [outstandingItems, selectedPayerId]);

  const selectedItems = payerOutstanding.filter((item) => selectedOutstandingIds.includes(item.expense.id));
  const selectedTotal = selectedItems.reduce((sum, item) => sum + item.amountThb, 0);
  const totalThb = splitExpenses.filter(e => !e.isDeleted).reduce((sum, expense) => sum + expense.amountThb, 0);
  const totalCny = splitExpenses.filter(e => !e.isDeleted).reduce((sum, expense) => sum + expense.amountCny, 0);

  const publishSnapshot = async (
    nextExpenses: SplitExpense[],
    nextLogs: string[],
    nextPayments: PaymentRecord[] = paymentRecords
  ) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    lastWriteTimeRef.current = Date.now();

    try {
      const response = await fetch("/api/expense-split", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          splitExpenses: nextExpenses,
          expenseLogs: nextLogs,
          paymentRecords: nextPayments,
          lastUpdatedAt: lastServerUpdatedAtRef.current,
        }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("This data has changed. Please refresh and try again.");
        }
        throw new Error("Network failure, server error, or timeout.");
      }

      const data = await response.json();
      lastServerUpdatedAtRef.current = data.updatedAt || new Date().toISOString();
      
      useTravelStore.setState({ splitExpenses: nextExpenses, expenseLogs: nextLogs });
      setPaymentRecords(nextPayments);
      localStorage.setItem("splitExpenses", JSON.stringify(nextExpenses));
      localStorage.setItem("expenseLogs", JSON.stringify(nextLogs));
      localStorage.setItem("paymentRecords", JSON.stringify(nextPayments));
      setSyncStatus("online");
    } catch (err: any) {
      setSyncStatus("local");
      setErrorMessage(err.message || "Failed to sync with central ledger.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Collaboration Reporting and Fetching API
  const reportEditingStatus = async (status: "editing" | "idle") => {
    if (!CURRENT_RECORDER || CURRENT_RECORDER === "Guest" || currentUserId === "unknown") return;
    try {
      await fetch("/api/expense-split/collaboration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          name: CURRENT_RECORDER,
          status,
        }),
      });
    } catch (e) {
      console.warn("Failed to report editing status:", e);
    }
  };

  const fetchActiveCollaborators = async () => {
    try {
      const res = await fetch("/api/expense-split/collaboration");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.active)) {
          setActiveEditors(data.active);
        }
      }
    } catch {
      // Ignore poll failures silently
    }
  };

  // Manage Collaboration editing timer and intervals
  const triggerEditingStart = () => {
    if (!isEditingLocal) {
      setIsEditingLocal(true);
      reportEditingStatus("editing");
    }

    // Reset inactivity timer (5 seconds)
    if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    inactivityTimeoutRef.current = setTimeout(() => {
      triggerEditingEnd();
    }, 5000);
  };

  const triggerEditingEnd = () => {
    setIsEditingLocal(false);
    reportEditingStatus("idle");
    if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
  };

  // Form wrapper function to capture edits
  const updateForm = (updater: (prev: typeof form) => typeof form) => {
    setForm(updater);
    triggerEditingStart();
  };

  // Periodical collaborator polling
  useEffect(() => {
    // Poll collaborators every 900ms to keep latency < 1s
    const pollInterval = setInterval(fetchActiveCollaborators, 900);

    // Keep alive interval for current user every 2 seconds when editing
    keepAliveIntervalRef.current = setInterval(() => {
      if (isEditingLocal) {
        reportEditingStatus("editing");
      }
    }, 2000);

    // Clean up hook
    const handleUnload = () => {
      if (isEditingLocal) {
        navigator.sendBeacon(
          "/api/expense-split/collaboration",
          JSON.stringify({ userId: currentUserId, name: CURRENT_RECORDER, status: "idle" })
        );
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      clearInterval(pollInterval);
      if (keepAliveIntervalRef.current) clearInterval(keepAliveIntervalRef.current);
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [isEditingLocal, currentUserId, CURRENT_RECORDER]);

  const isFormFirstMountRef = useRef(true);
  useEffect(() => {
    if (isFormFirstMountRef.current) {
      isFormFirstMountRef.current = false;
      return;
    }
    const isFormEmpty = !form.name.trim() && !form.amountCny && !form.paidBy;
    if (isFormEmpty) {
      triggerEditingEnd();
    } else {
      triggerEditingStart();
    }
  }, [form]);


  // Sync data from server hooks
  useEffect(() => {
    const savedPayments = localStorage.getItem("paymentRecords");
    if (savedPayments) setPaymentRecords(JSON.parse(savedPayments));

    let cancelled = false;

    const syncFromServer = async () => {
      if (Date.now() - lastWriteTimeRef.current < 4000) {
        return;
      }

      try {
        const response = await fetch(`/api/expense-split?t=${Date.now()}`, { cache: "no-store" });
        const data = await response.json();
        if (cancelled) return;

        if (Date.now() - lastWriteTimeRef.current < 4000) {
          return;
        }

        const serverExpenses = Array.isArray(data.splitExpenses) ? data.splitExpenses : [];
        const serverLogs = Array.isArray(data.expenseLogs) ? data.expenseLogs : [];
        const serverPayments = Array.isArray(data.paymentRecords) ? data.paymentRecords : [];
        lastServerUpdatedAtRef.current = data.updatedAt || new Date().toISOString();

        if (!seededServerRef.current && serverExpenses.length === 0 && splitExpenses.length > 0) {
          seededServerRef.current = true;
          await publishSnapshot(splitExpenses, expenseLogs, paymentRecords);
          return;
        }

        useTravelStore.setState({ splitExpenses: serverExpenses, expenseLogs: serverLogs });
        setPaymentRecords(serverPayments);
        localStorage.setItem("splitExpenses", JSON.stringify(serverExpenses));
        localStorage.setItem("expenseLogs", JSON.stringify(serverLogs));
        localStorage.setItem("paymentRecords", JSON.stringify(serverPayments));
        setSyncStatus("online");
      } catch {
        setSyncStatus("local");
      }
    };

    syncFromServer();
    const interval = setInterval(syncFromServer, 2500);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const addLog = (message: string, logs = expenseLogs, customTimestamp?: string) => [makeLog(message, customTimestamp), ...logs].slice(0, 200);

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      if (receiptActionTarget === "receipt") {
        updateForm((prev) => ({ ...prev, imageUrl: "" }));
      }
      return;
    }

    if (receiptActionTarget === "receipt") {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          updateForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    } else if (receiptActionTarget === "slip") {
      setPaymentFileName(file.name);
    }

    // Reset action target
    setReceiptActionTarget(null);
    // Reset file inputs so selecting the same file again triggers change event
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (albumInputRef.current) albumInputRef.current.value = "";
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Duplicate Check Helper
  const checkDuplicate = (payerId: string, amount: number, title: string) => {
    return splitExpenses.some((exp) => {
      if (exp.isDeleted) return false;
      const timeDiff = Math.abs(Date.now() - new Date(exp.createdAt).getTime());
      const isRecent = timeDiff < 5 * 60 * 1000;
      return (
        isRecent &&
        exp.paidBy === payerId &&
        Math.abs(exp.amountCny - amount) < 0.01 &&
        exp.name.trim().toLowerCase() === title.trim().toLowerCase()
      );
    });
  };

  const handleSaveToSharedAccount = (event: React.FormEvent) => {
    event.preventDefault();
    const amountCny = Number(form.amountCny);
    
    // Validations
    if (!form.paidBy) {
      alert(isThai ? "กรุณาเลือกผู้จ่ายก่อน" : "Please select who paid first.");
      return;
    }
    if (!form.name.trim()) {
      alert(isThai ? "กรุณาใส่ชื่อรายการ" : "Please enter a description.");
      return;
    }
    if (!amountCny || amountCny <= 0) {
      alert(isThai ? "ยอดเงินต้องมากกว่า 0" : "Amount must be greater than 0.");
      return;
    }
    if (form.splitAmong.length === 0) {
      alert(isThai ? "ต้องมีผู้หารอย่างน้อย 1 คน" : "At least one participant must be selected.");
      return;
    }

    // Duplicate detection
    if (checkDuplicate(form.paidBy, amountCny, form.name)) {
      const proceed = window.confirm(
        isThai
          ? "⚠️ พบรายการที่มีผู้จ่าย ยอดเงิน และชื่อเหมือนกันใน 5 นาทีที่ผ่านมา ต้องการบันทึกซ้ำหรือไม่?"
          : "⚠️ A similar expense was created in the last 5 minutes. Save duplicate anyway?"
      );
      if (!proceed) return;
    }

    // Launch confirmation modal instead of security PIN verification
    setShowAddExpenseConfirmModal(true);
  };

  const triggerAddExpense = async () => {
    const ts = new Date().toISOString();
    const amountCny = Number(form.amountCny);
    const payerName = TRAVELERS.find((traveler) => traveler.id === form.paidBy)?.name || CURRENT_RECORDER;
    
    const newExpense: SplitExpense = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      name: form.name.trim(),
      amountCny,
      amountThb: amountCny * exchangeRateCNY,
      category: form.category as SplitExpense["category"],
      paidBy: form.paidBy,
      splitAmong: form.splitAmong,
      settledParticipants: [],
      imageUrl: form.imageUrl || undefined,
      createdAt: ts,
      recordedBy: visitorName || payerName,
    };

    await publishSnapshot(
      [...splitExpenses, newExpense],
      addLog(`เพิ่มรายการ "${newExpense.name}" ${cny(amountCny)} (${currency(newExpense.amountThb)})`, expenseLogs, ts)
    );

    sendSystemChatMessage(
      `[EXPENSE_LINK:${ts}] 📢 บันทึกค่าใช้จ่ายใหม่โดย ${firstName(newExpense.recordedBy)}: "${newExpense.name}" ยอด ${cny(amountCny)} (${currency(newExpense.amountThb)})`
    );

    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 4000);

    setForm({
      name: "",
      amountCny: "",
      category: "food",
      paidBy: "",
      splitAmong: TRAVELERS.map((traveler) => traveler.id),
      imageUrl: "",
    });

    triggerEditingEnd();
  };

  const resetForm = () => {
    setForm({
      name: "",
      amountCny: "",
      category: "food",
      paidBy: "",
      splitAmong: TRAVELERS.map((traveler) => traveler.id),
      imageUrl: "",
    });
    triggerEditingEnd();
  };

  const deleteExpense = async (expenseId: string) => {
    const target = splitExpenses.find((expense) => expense.id === expenseId);
    if (!target) return;

    // Role verification
    const isMyRecord = target.recordedBy === visitorName || target.paidBy === currentUserId;
    if (!isOwnerAdmin && !isMyRecord) {
      alert(isThai ? "คุณไม่มีสิทธิ์แก้ไขหรือลบรายการของคนอื่น" : "You do not have permission to delete other users' records.");
      return;
    }

    const isProtected = target.settledParticipants && target.settledParticipants.length > 0;
    if (!isOwnerAdmin && isProtected) {
      alert(isThai ? "ไม่สามารถลบรายการที่มีผู้จ่ายคืนแล้วได้ (รายการป้องกัน)" : "Members cannot delete protected/settled records.");
      return;
    }

    setVerificationTitleTh("ยืนยันตัวตนเพื่อลบรายการค่าใช้จ่าย");
    setVerificationTitleEn("Authenticate to Delete Expense");
    setPendingAction(() => () => triggerDeleteExpense(expenseId));
    setIsVerifying(true);
  };

  const triggerDeleteExpense = async (expenseId: string) => {
    const target = splitExpenses.find((expense) => expense.id === expenseId);
    if (!target) return;

    if (!window.confirm(isThai ? "ย้ายรายการนี้ไปยังถังขยะบัญชีกลาง?" : "Archive this item to the central recycle bin?")) return;

    const nextExpenses = splitExpenses.map((e) => {
      if (e.id === expenseId) {
        return { ...e, isDeleted: true };
      }
      return e;
    });

    await publishSnapshot(
      nextExpenses,
      addLog(`ลบรายการ "${target.name}" (Soft Delete)`)
    );

    sendSystemChatMessage(
      `📢 ลบรายการค่าใช้จ่ายโดย ${firstName(visitorName || "Guest")}: "${target.name}" ยอด ${cny(target.amountCny)} (${currency(target.amountThb)}) ถูกย้ายไปยังถังขยะ`
    );
  };

  const restoreExpense = async (expenseId: string) => {
    const target = splitExpenses.find((expense) => expense.id === expenseId);
    if (!target) return;

    setVerificationTitleTh("ยืนยันตัวตนเพื่อกู้คืนรายการ");
    setVerificationTitleEn("Authenticate to Restore Expense");
    setPendingAction(() => () => triggerRestoreExpense(expenseId));
    setIsVerifying(true);
  };

  const triggerRestoreExpense = async (expenseId: string) => {
    const target = splitExpenses.find((expense) => expense.id === expenseId);
    if (!target) return;

    if (!window.confirm(isThai ? "กู้คืนรายการนี้เข้าบัญชีกลาง?" : "Restore this item to the shared ledger?")) return;

    const nextExpenses = splitExpenses.map((e) => {
      if (e.id === expenseId) {
        return { ...e, isDeleted: false };
      }
      return e;
    });

    await publishSnapshot(
      nextExpenses,
      addLog(`กู้คืนรายการ "${target.name}"`)
    );

    sendSystemChatMessage(
      `📢 กู้คืนรายการค่าใช้จ่ายโดย ${firstName(visitorName || "Guest")}: "${target.name}" ยอด ${cny(target.amountCny)} (${currency(target.amountThb)}) เข้าบัญชีกลาง`
    );
  };

  const editExpense = (expense: SplitExpense) => {
    // Role verification
    const isMyRecord = expense.recordedBy === visitorName || expense.paidBy === currentUserId;
    if (!isOwnerAdmin && !isMyRecord) {
      alert(isThai ? "คุณไม่มีสิทธิ์แก้ไขหรือลบรายการของคนอื่น" : "You do not have permission to edit other users' records.");
      return;
    }

    setEditExpenseData(expense);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editExpenseData) return;
    
    // Auth before saving edit
    setVerificationTitleTh("ยืนยันตัวตนเพื่อบันทึกการแก้ไข");
    setVerificationTitleEn("Authenticate to Save Edits");
    setPendingAction(() => () => triggerEditExpense());
    setIsVerifying(true);
  };

  const triggerEditExpense = async () => {
    if (!editExpenseData) return;

    const updatedExpenses = splitExpenses.map((e) => {
      if (e.id === editExpenseData.id) {
        return {
          ...editExpenseData,
          amountThb: editExpenseData.amountCny * exchangeRateCNY,
        };
      }
      return e;
    });

    const oldTarget = splitExpenses.find((e) => e.id === editExpenseData.id);

    await publishSnapshot(
      updatedExpenses,
      addLog(
        `แก้ไขรายการ "${editExpenseData.name}" (ยอดเก่า: ${cny(oldTarget?.amountCny || 0)}, ยอดใหม่: ${cny(
          editExpenseData.amountCny
        )})`
      )
    );

    setEditExpenseData(null);
  };

  const toggleSplitter = (travelerId: string) => {
    updateForm((prev) => ({
      ...prev,
      splitAmong: prev.splitAmong.includes(travelerId)
        ? prev.splitAmong.filter((id) => id !== travelerId)
        : [...prev.splitAmong, travelerId],
    }));
  };

  const openSettleModal = (payerId: string) => {
    setSelectedPayerId(payerId);
    setSelectedOutstandingIds([]);
    setPaymentMethod("transfer");
    setPaymentNote("");
    setPaymentFileName("");
    setShowSettleModal(true);
  };

  const handleConfirmSettlement = () => {
    if (selectedItems.length === 0) return;

    // Check creditor grouping requirement (Only settle one creditor at a time)
    const creditorsSelected = new Set(selectedItems.map((item) => item.recipientId));
    if (creditorsSelected.size > 1) {
      alert(isThai ? "กรุณาเคลียร์ยอดทีละหนึ่งเจ้าหนี้" : "Please settle with one creditor at a time.");
      return;
    }

    setVerificationTitleTh("ยืนยันตัวตนเพื่อเคลียร์ยอดค้างชำระ");
    setVerificationTitleEn("Authenticate to Confirm Settlement");
    setPendingAction(() => () => {
      setShowSettleModal(false);
      triggerConfirmSettlement();
    });
    setIsVerifying(true);
  };

  const triggerConfirmSettlement = async () => {
    if (selectedItems.length === 0) return;

    const ts = new Date().toISOString();
    const selectedIds = new Set(selectedOutstandingIds);
    const nextExpenses = splitExpenses.map((expense) => {
      if (!selectedIds.has(expense.id)) return expense;
      return {
        ...expense,
        settledParticipants: [...new Set([...(expense.settledParticipants || []), selectedPayerId])],
      };
    });

    const recordsByRecipient = selectedItems.reduce<Record<string, OutstandingItem[]>>((groups, item) => {
      groups[item.recipientId] = [...(groups[item.recipientId] || []), item];
      return groups;
    }, {});

    const newRecords: PaymentRecord[] = Object.entries(recordsByRecipient).map(([recipientId, items]) => ({
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      payerId: selectedPayerId,
      recipientId,
      amountThb: items.reduce((sum, item) => sum + item.amountThb, 0),
      method: paymentMethod,
      note: paymentNote || undefined,
      fileName: paymentFileName || undefined,
      settledExpenseIds: items.map((item) => item.expense.id),
      createdAt: ts,
    }));

    const recipientNames = newRecords.map((record) => firstName(record.recipientId)).join(", ");

    const selectedTotalThb = selectedTotal;
    const selectedTotalCny = selectedItems.reduce((sum, item) => sum + item.amountCny, 0);

    await publishSnapshot(
      nextExpenses,
      addLog(`เคลียร์ยอด ${cny(selectedTotalCny)} (${currency(selectedTotalThb)}) ให้ ${recipientNames} (${paymentMethod})`, expenseLogs, ts),
      [...newRecords, ...paymentRecords]
    );

    sendSystemChatMessage(
      `[EXPENSE_LINK:${ts}] 💸 เคลียร์ยอดสำเร็จโดย ${firstName(selectedPayerId)}: ยอดรวม ${cny(selectedTotalCny)} (${currency(selectedTotalThb)}) ให้ ${recipientNames} (${paymentMethod})`
    );

    setShowSettleModal(false);
    setSelectedOutstandingIds([]);
  };

  const cancelSettlement = async (record: PaymentRecord) => {
    if (!isOwnerAdmin) {
      alert(isThai ? "เฉพาะผู้ดูแล (Admin/Owner) เท่านั้นที่สามารถยกเลิกการชำระเงินได้" : "Only Admins/Owners can cancel settlements.");
      return;
    }

    setVerificationTitleTh("ยืนยันตัวตนเพื่อยกเลิกการชำระเงิน");
    setVerificationTitleEn("Authenticate to Cancel Settlement");
    setPendingAction(() => () => triggerCancelSettlement(record));
    setIsVerifying(true);
  };

  const triggerCancelSettlement = async (record: PaymentRecord) => {
    const recordCny = record.amountThb / exchangeRateCNY;

    if (
      !window.confirm(
        isThai
          ? `ต้องการยกเลิกการชำระเงินของ ${firstName(record.payerId)} ให้ ${firstName(record.recipientId)} ยอด ${cny(recordCny)} (${currency(
              record.amountThb
            )})?`
          : `Do you want to cancel the settlement of ${cny(recordCny)} (${currency(record.amountThb)}) from ${firstName(
              record.payerId
            )} to ${firstName(record.recipientId)}?`
      )
    ) {
      return;
    }

    // Remove recipientId from settledParticipants for related expenses
    const affectedExpenseIds = new Set(record.settledExpenseIds);
    const nextExpenses = splitExpenses.map((expense) => {
      if (!affectedExpenseIds.has(expense.id)) return expense;
      return {
        ...expense,
        settledParticipants: (expense.settledParticipants || []).filter((id) => id !== record.payerId),
      };
    });

    const nextPayments = paymentRecords.filter((r) => r.id !== record.id);

    await publishSnapshot(
      nextExpenses,
      addLog(`ยกเลิกการเคลียร์ยอด ${cny(recordCny)} (${currency(record.amountThb)}) จาก ${firstName(record.payerId)} ให้ ${firstName(record.recipientId)}`),
      nextPayments
    );

    sendSystemChatMessage(
      `📢 ยกเลิกการเคลียร์ยอดโดย ${firstName(visitorName || "Guest")}: ยอด ${cny(recordCny)} (${currency(record.amountThb)}) จาก ${firstName(record.payerId)} ให้ ${firstName(record.recipientId)}`
    );
  };

  const exportCsv = () => {
    const rows = [
      "Description,Category,Payer,Amount CNY,Amount THB,Split Among,Settled Participants,Date,IsDeleted",
      ...splitExpenses.map((expense) => {
        const splitNames = expense.splitAmong.map(firstName).join(";");
        const settledNames = (expense.settledParticipants || []).map(firstName).join(";");
        return `"${expense.name}","${expense.category}","${firstName(expense.paidBy)}",${expense.amountCny},${expense.amountThb},"${splitNames}","${settledNames}","${expense.createdAt}",${expense.isDeleted || false}`;
      }),
    ];
    const blob = new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Xinjiang_Group_Expenses_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Search, Filter, and Sort (Default Descending Date/Newest First)
  const filteredExpenses = useMemo(() => {
    const list = splitExpenses.filter((expense) => {
      // Soft Delete Filter
      if (expense.isDeleted && !showDeleted) return false;
      if (!expense.isDeleted && showDeleted) return false;

      // Search Query Filter
      const payerName = TRAVELERS.find((t) => t.id === expense.paidBy)?.name || "";
      const matchesSearch =
        expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        new Date(expense.createdAt).toLocaleDateString().includes(searchQuery);

      if (!matchesSearch) return false;

      // Status Filter
      if (filterMode === "outstanding") {
        const settled = new Set(expense.settledParticipants || []);
        return expense.splitAmong.some((pId) => pId !== expense.paidBy && !settled.has(pId));
      }
      if (filterMode === "settled") {
        const settled = new Set(expense.settledParticipants || []);
        return expense.splitAmong.every((pId) => pId === expense.paidBy || settled.has(pId));
      }
      if (filterMode === "my") {
        const isMyPayer = expense.paidBy === currentUserId;
        const isMyRecorder = expense.recordedBy === visitorName;
        const isMySplit = expense.splitAmong.includes(currentUserId);
        return isMyPayer || isMyRecorder || isMySplit;
      }
      return true;
    });

    // Sort by Transaction Date in descending order (Newest first)
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [splitExpenses, searchQuery, filterMode, showDeleted, currentUserId, visitorName]);

  // Sort Activity Log descending (Newest first) based on parsed timestamp
  const sortedLogs = useMemo(() => {
    return [...expenseLogs].sort((a, b) => {
      const matchA = a.match(/^\[([^\]]+)\]/);
      const matchB = b.match(/^\[([^\]]+)\]/);
      if (matchA && matchB) {
        return new Date(matchB[1]).getTime() - new Date(matchA[1]).getTime();
      }
      return 0;
    });
  }, [expenseLogs]);

  const parseLog = (logStr: string) => {
    const regex = /^\[([^\]]+)\]\s*\[User:\s*([^\]]+)\]\s*\[Device:\s*([^\]]+)\]\s*\[IP:\s*([^\]]+)\]\s*-\s*(.*)$/;
    const match = logStr.match(regex);
    if (match) {
      return {
        timestamp: match[1],
        user: match[2],
        device: match[3],
        ip: match[4],
        message: match[5],
        raw: logStr,
      };
    }
    const fallbackRegex = /^\[([^\]]+)\]\s*(.*)$/;
    const fbMatch = logStr.match(fallbackRegex);
    if (fbMatch) {
      return {
        timestamp: fbMatch[1],
        user: "",
        device: "",
        ip: "",
        message: fbMatch[2],
        raw: logStr,
      };
    }
    return {
      timestamp: "",
      user: "",
      device: "",
      ip: "",
      message: logStr,
      raw: logStr,
    };
  };

  const formatDateHeader = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      if (isNaN(date.getTime())) return isThai ? "รายการอื่น ๆ" : "Other Activities";
      return date.toLocaleDateString(language === "th" ? "th-TH" : "en-US", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return isThai ? "รายการอื่น ๆ" : "Other Activities";
    }
  };

  const formatLogTime = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const groupedLogs = useMemo(() => {
    const groups: { dateStr: string; dateHeader: string; items: ReturnType<typeof parseLog>[] }[] = [];

    sortedLogs.forEach((rawLog) => {
      const parsed = parseLog(rawLog);
      const dateKey = parsed.timestamp ? parsed.timestamp.split("T")[0] : "other";
      const dateHeader = parsed.timestamp ? formatDateHeader(parsed.timestamp) : (isThai ? "รายการอื่น ๆ" : "Other Activities");

      let group = groups.find((g) => g.dateStr === dateKey);
      if (!group) {
        group = { dateStr: dateKey, dateHeader, items: [] };
        groups.push(group);
      }
      group.items.push(parsed);
    });

    return groups;
  }, [sortedLogs, language]);

  // Sort Settlement History by Transaction Date (descending / newest first)
  const sortedPaymentRecords = useMemo(() => {
    return [...paymentRecords].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [paymentRecords]);

  // Derive collaboration editor details
  const isRed = isSubmitting || isEditingLocal || activeEditors.some(e => e.userId !== currentUserId);
  const panelBorderColorClass = isRed
    ? "border-red-500 border-2 shadow-red-50/50"
    : "border-emerald-500 border-2 shadow-emerald-50/50";

  const allEditorNames = useMemo(() => {
    const names = new Set(activeEditors.map((e) => firstName(e.name)));
    if (isEditingLocal && CURRENT_RECORDER && CURRENT_RECORDER !== "Guest") {
      names.add(firstName(CURRENT_RECORDER));
    }
    return Array.from(names);
  }, [activeEditors, isEditingLocal, CURRENT_RECORDER]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 text-gray-800 lg:p-8">
      
      {/* Verification Dialog Modal */}
      <SecurityVerificationModal
        isOpen={isVerifying}
        onClose={() => {
          setIsVerifying(false);
          setPendingAction(null);
        }}
        onSuccess={() => {
          setIsVerifying(false);
          if (pendingAction) {
            pendingAction();
            setPendingAction(null);
          }
        }}
        titleTh={verificationTitleTh}
        titleEn={verificationTitleEn}
      />

      <div className="flex flex-col gap-4 border-b border-gray-200 pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-navy">
            {isThai ? "ระบบหารเงินกลุ่ม" : "Group Expense Split"}
          </h2>
          <p className="mt-1 max-w-3xl text-sm font-medium text-gray-600">
            {isThai
              ? "เพิ่มรายการ เคลียร์ยอด และดูสถานะล่าสุดร่วมกันได้แบบเรียลไทม์"
              : "Shared ledger for everyone on this website. Add, settle, and review the same live data."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${syncStatus === "online" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
            {syncStatus === "online" ? (isThai ? "ซิงก์บัญชีกลางแล้ว" : "Shared ledger online") : (isThai ? "โหมดเครื่องนี้" : "Local mode")}
          </span>
          <button onClick={exportCsv} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:border-brand-gold">
            <FileSpreadsheet className="h-4 w-4" />
            CSV
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-700 animate-fadeIn">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="ml-auto font-black text-gray-500 hover:text-gray-700">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Collaborative Add Expense Form Panel */}
        <form onSubmit={handleSaveToSharedAccount} className={`rounded-2xl bg-white/80 p-5 shadow-sm lg:col-span-4 h-fit transition-all duration-300 ${panelBorderColorClass}`}>
          <h3 className="flex items-center gap-2 border-b border-gray-100 pb-3 text-sm font-extrabold uppercase text-navy">
            <Plus className="h-5 w-5 text-brand-gold" />
            {isThai ? "เพิ่มค่าใช้จ่าย" : "Add Expense"}
          </h3>

          <div className="mt-4 flex flex-col gap-3">
            <label className="text-[10px] font-black uppercase text-gray-500">{isThai ? "ชื่อรายการ" : "Description"}</label>
            <input
              value={form.name}
              onChange={(event) => updateForm(() => ({ ...form, name: event.target.value }))}
              placeholder={isThai ? "เช่น ค่าอาหารกลางวัน" : "e.g. Lunch"}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-brand-gold focus:outline-none"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500">CNY</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amountCny}
                  onChange={(event) => updateForm(() => ({ ...form, amountCny: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-brand-gold focus:outline-none"
                />
                {form.amountCny && (
                  <div className="mt-1 text-[10px] font-bold text-brand-gold">
                    ≈ {currency(Number(form.amountCny) * exchangeRateCNY)}
                  </div>
                )}
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500">{isThai ? "หมวดหมู่" : "Category"}</label>
                <select
                  value={form.category}
                  onChange={(event) => updateForm(() => ({ ...form, category: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-brand-gold focus:outline-none"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {isThai ? category.th : category.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="text-[10px] font-black uppercase text-gray-500">{isThai ? "ใครจ่ายก่อน" : "Paid by"}</label>
            <div className="grid grid-cols-2 gap-2 mt-1 mb-2">
              {TRAVELERS.map((traveler) => {
                const isSelected = form.paidBy === traveler.id;
                const color = getParticipantColor(traveler.id);
                const participant = getParticipantById(traveler.id);
                const initial = participant?.nickname.slice(0, 1) || "P";
                const nickname = participant?.nickname || traveler.name;
                return (
                  <button
                    key={traveler.id}
                    type="button"
                    onClick={() => updateForm(() => ({ ...form, paidBy: traveler.id }))}
                    style={{
                      borderColor: isSelected ? color : "#e2e8f0",
                      backgroundColor: isSelected ? `${color}15` : "#ffffff",
                    }}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all text-left cursor-pointer hover:bg-slate-50`}
                  >
                    <div
                      style={{ backgroundColor: color }}
                      className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] text-white font-extrabold"
                    >
                      {initial}
                    </div>
                    <span className={isSelected ? "text-gray-900 font-extrabold" : "text-gray-600"}>
                      {nickname}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-gray-500">{isThai ? "หารกับใครบ้าง" : "Split among"}</span>
                <button type="button" onClick={() => updateForm(() => ({ ...form, splitAmong: TRAVELERS.map((traveler) => traveler.id) }))} className="text-[10px] font-bold text-brand-blue">
                  {isThai ? "เลือกทั้งหมด" : "All"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {TRAVELERS.map((traveler) => {
                  const checked = form.splitAmong.includes(traveler.id);
                  return (
                    <button
                      type="button"
                      key={traveler.id}
                      onClick={() => toggleSplitter(traveler.id)}
                      className={`rounded-lg border px-2 py-2 text-left text-[11px] font-bold transition-all ${
                        checked
                          ? "border-brand-gold bg-brand-gold/10 text-navy font-extrabold"
                          : "border-slate-200 bg-slate-100 text-gray-400"
                      }`}
                    >
                      {checked ? "✓ " : ""}{firstName(traveler.id)}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setReceiptActionTarget("receipt")}
              className="flex w-full items-center justify-between rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-xs font-bold text-gray-600 hover:border-brand-gold hover:bg-slate-100/50 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-brand-gold" />
                {form.imageUrl ? (isThai ? "แนบรูปแล้ว" : "Receipt attached") : (isThai ? "แนบรูปใบเสร็จ (ไม่บังคับ)" : "Receipt image (optional)")}
              </span>
            </button>

            {form.imageUrl && (
              <button
                type="button"
                onClick={handleOcrScan}
                disabled={isOcrScanning}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-brand-gold bg-brand-gold/10 px-3 py-2 text-xs font-black text-brand-gold hover:bg-brand-gold/25 transition-all cursor-pointer"
              >
                {isOcrScanning ? (
                  <>
                     <span className="w-3.5 h-3.5 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
                     <span>{isThai ? "กำลังจำลองการสแกนด้วย AI..." : "AI scanning..."}</span>
                  </>
                ) : (
                  <>
                     <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                     <span>{isThai ? "สแกนใบเสร็จด้วย AI (Simulate)" : "Simulate AI OCR Scan"}</span>
                  </>
                )}
              </button>
            )}

            {showSaveSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/60 p-3 text-[11px] font-bold animate-fadeIn">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>{isThai ? "บันทึกรายการสำเร็จและอัปเดตเรียบร้อยแล้ว!" : "Saved and updated successfully!"}</span>
              </div>
            )}

            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-bold text-gray-550 hover:bg-slate-50 cursor-pointer"
              >
                {isThai ? "รีเซ็ต" : "Reset"}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !form.name.trim() || !form.amountCny || form.splitAmong.length === 0}
                className="flex-[2] rounded-xl bg-brand-gold px-4 py-3 text-xs font-extrabold text-brand-bg-primary shadow-sm disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-brand-bg-primary border-t-transparent rounded-full animate-spin" />
                    <span>{isThai ? "กำลังบันทึก..." : "Saving..."}</span>
                  </>
                ) : (
                  <span>{isThai ? "บันทึกเข้าบัญชีกลาง" : "Save to Shared Ledger"}</span>
                )}
              </button>
            </div>

            {/* Collaborative active editor text names at bottom */}
            {allEditorNames.length > 0 && (
              <div className="mt-3 text-[10px] font-black text-red-650 bg-red-50/50 border border-red-200/40 rounded-xl p-2.5 animate-fadeIn">
                📢 {isThai ? "กำลังแก้ไขร่วมกัน" : "Currently editing"} ({allEditorNames.length}): {allEditorNames.join(", ")}
              </div>
            )}
          </div>
        </form>

        <div className="flex flex-col gap-6 lg:col-span-8">
          <section className="rounded-2xl border border-brand-gold/15 bg-white/80 p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase text-navy">
                <Users className="h-5 w-5 text-brand-gold" />
                {isThai ? "ภาพรวมยอดค้างรายคน" : "Balance by Traveler"}
              </h3>
              <button onClick={() => openSettleModal(currentUserId || "1")} className="rounded-xl bg-brand-blue px-3 py-2 text-xs font-bold text-white cursor-pointer">
                {isThai ? "เคลียร์ยอดของฉัน" : "Settle My Debts"}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {TRAVELERS.map((traveler) => {
                const balance = balances[traveler.id] || 0;
                const owes = outstandingItems.filter((item) => item.payerId === traveler.id).reduce((sum, item) => sum + item.amountThb, 0);
                const receives = outstandingItems.filter((item) => item.recipientId === traveler.id).reduce((sum, item) => sum + item.amountThb, 0);
                const balanceCny = balance / exchangeRateCNY;
                const owesCny = owes / exchangeRateCNY;
                const receivesCny = receives / exchangeRateCNY;
                return (
                  <div key={traveler.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">{firstName(traveler.id)}</span>
                      <span className={`text-xs font-black ${balance >= 0 ? "text-emerald-700" : "text-red-600 font-extrabold"}`}>
                        {balanceCny >= 0 ? "+" : ""}{cny(balanceCny)}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] font-semibold text-gray-600">
                      <div>{isThai ? "ค้างจ่าย" : "Owes"}<br /><b className="text-red-600 font-extrabold">{cny(owesCny)}</b></div>
                      <div>{isThai ? "ต้องรับคืน" : "Receives"}<br /><b className="text-emerald-700">{cny(receivesCny)}</b></div>
                    </div>
                    <button onClick={() => openSettleModal(traveler.id)} className="mt-3 w-full rounded-lg border border-slate-200 bg-white py-2 text-[10px] font-bold text-gray-700 hover:border-brand-gold cursor-pointer">
                      {isThai ? "ดู/เคลียร์ยอดค้าง" : "Review debts"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-brand-gold/15 bg-white/80 p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3 text-sm font-extrabold uppercase text-navy">
              <WalletCards className="h-5 w-5 text-brand-gold" />
              {isThai ? "ตารางแผนการชำระเงิน" : "Payment Schedule"}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-[11px]">
                <thead>
                  <tr className="border-b border-slate-200 text-gray-500 font-bold">
                    <th className="py-2 pr-2">{isThai ? "ใครค้าง (แถว) \\ ให้ใคร (หลัก)" : "Who owes (Row) \\ To Whom (Col)"}</th>
                    {TRAVELERS.map((t) => (
                      <th key={t.id} className="py-2 px-2 text-center font-bold text-gray-700">{firstName(t.id)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TRAVELERS.map((tRow) => (
                    <tr key={tRow.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="py-2 pr-2 font-black text-gray-900">{firstName(tRow.id)}</td>
                      {TRAVELERS.map((tCol) => {
                        const amount = debtMatrix[tRow.id]?.[tCol.id] || 0;
                        const isSelf = tRow.id === tCol.id;
                        return (
                          <td key={tCol.id} className={`py-2 px-1 text-center font-mono font-semibold ${isSelf ? "text-gray-300 bg-slate-50/20" : amount > 0 ? "text-red-655 font-black bg-red-50/20" : "text-gray-400"}`}>
                            {isSelf ? "-" : amount > 0 ? cny(amount / exchangeRateCNY) : "0"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Search, Filters, and Table section */}
          <section className="rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm">
            <div className="mb-4 border-b border-gray-100 pb-3">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase text-navy">
                  <Receipt className="h-5 w-5 text-brand-gold" />
                  {isThai ? "รายการค่าใช้จ่าย" : "Expense Ledger"}
                </h3>
                
                {/* Search query input */}
                <input
                  type="text"
                  placeholder={isThai ? "ค้นหา รายการ, ผู้จ่าย, วันที่..." : "Search items, payer, date..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl border border-slate-205 bg-white px-3 py-1.5 text-xs focus:border-brand-gold focus:outline-none w-full sm:w-64"
                />
              </div>

              {/* Filtering Controls */}
              <div className="mt-3 flex flex-wrap gap-2 items-center justify-between">
                <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                  {[
                    { id: "all", label: isThai ? "ทั้งหมด" : "All" },
                    { id: "outstanding", label: isThai ? "ยังค้างจ่าย" : "Outstanding" },
                    { id: "settled", label: isThai ? "จ่ายครบแล้ว" : "Settled" },
                    { id: "my", label: isThai ? "ของฉัน" : "My Expenses" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setFilterMode(mode.id as any)}
                      className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        filterMode === mode.id
                          ? "border-brand-gold bg-brand-gold/15 text-navy font-black"
                          : "border-slate-200 bg-white text-gray-500"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>

                {/* Show Deleted Switcher */}
                <button
                  type="button"
                  onClick={() => setShowDeleted(!showDeleted)}
                  className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border flex items-center gap-1 cursor-pointer transition-all ${
                    showDeleted ? "bg-slate-200 text-gray-700 border-slate-350" : "bg-white text-gray-400 border-slate-200"
                  }`}
                >
                  {showDeleted ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{isThai ? "ถังขยะบัญชีกลาง" : "Recycle Bin"}</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] uppercase text-gray-500">
                    <th className="py-3 pr-3">{isThai ? "รายการ" : "Item"}</th>
                    <th className="py-3 pr-3">{isThai ? "จ่ายโดย" : "Paid by"}</th>
                    <th className="py-3 pr-3">{isThai ? "หารกับ" : "Split"}</th>
                    <th className="py-3 pr-3 text-right">{isThai ? "ยอด" : "Amount"}</th>
                    <th className="py-3 text-center">{isThai ? "จัดการ" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id} className={`border-b border-slate-100 ${expense.isDeleted ? "opacity-60 bg-red-50/10" : ""}`}>
                      <td className="py-3 pr-3">
                        <div className={`font-extrabold text-gray-900 ${expense.isDeleted ? "line-through" : ""}`}>{expense.name}</div>
                        <div className="mt-1 text-[9px] font-medium text-gray-500">
                          {new Date(expense.createdAt).toLocaleString(language === "th" ? "th-TH" : "en-US", { hour12: false })} • {isThai ? "บันทึกโดย" : "By"} {firstName(expense.recordedBy)}
                        </div>
                      </td>
                      <td className="py-3 pr-3 font-bold text-navy">{firstName(expense.paidBy)}</td>
                      <td className="py-3 pr-3">
                        <div className="flex max-w-[280px] flex-wrap gap-1">
                          {expense.splitAmong.map((id) => {
                            const settled = id === expense.paidBy || (expense.settledParticipants || []).includes(id);
                            return (
                              <span key={id} className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${settled ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                {firstName(id)}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="py-3 pr-3 text-right font-mono">
                        <div className="font-black">{cny(expense.amountCny)}</div>
                        <div className="text-[10px] font-bold text-gray-500">{currency(expense.amountThb)}</div>
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {expense.imageUrl && (
                            <button onClick={() => setSelectedReceiptUrl(expense.imageUrl || null)} className="rounded p-1.5 text-gray-400 hover:bg-brand-blue/5 hover:text-brand-blue cursor-pointer">
                              <ImageIcon className="h-4 w-4" />
                            </button>
                          )}
                          
                          {/* Edit, Delete, or Restore actions */}
                          {expense.isDeleted ? (
                            <button onClick={() => restoreExpense(expense.id)} className="rounded p-1.5 text-gray-400 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer" title={isThai ? "กู้คืน" : "Restore"}>
                              <RotateCcw className="h-4 w-4" />
                            </button>
                          ) : (
                            <>
                              <button onClick={() => editExpense(expense)} className="rounded p-1.5 text-gray-400 hover:bg-brand-gold/10 hover:text-brand-gold cursor-pointer" title={isThai ? "แก้ไข" : "Edit"}>
                                <Edit className="h-4 w-4" />
                              </button>
                              <button onClick={() => deleteExpense(expense.id)} className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 cursor-pointer" title={isThai ? "ลบ" : "Delete"}>
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredExpenses.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-sm font-bold text-gray-400">
                        {isThai ? "ไม่พบรายการค่าใช้จ่าย" : "No matching expenses found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Settlement History */}
          <section className="rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-extrabold uppercase text-navy">{isThai ? "ประวัติการเคลียร์ยอด" : "Settlement History"}</h3>
            <div className="flex flex-col gap-2">
              {sortedPaymentRecords.slice(0, 15).map((record) => (
                <div key={record.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs">
                  <div>
                    <b>{firstName(record.payerId)}</b>
                    <span className="text-gray-400 mx-1">→</span>
                    <b>{firstName(record.recipientId)}</b>
                    <span className="ml-2 text-gray-500">({record.method})</span>
                    {record.fileName && <span className="ml-2 text-brand-blue">{record.fileName}</span>}
                    {record.note && <p className="mt-1 text-[10px] text-gray-500 italic">"{record.note}"</p>}
                    <p className="mt-1 text-[9px] text-gray-400">{new Date(record.createdAt).toLocaleString(language === "th" ? "th-TH" : "en-US", { hour12: false })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-black text-brand-gold">{cny(record.amountThb / exchangeRateCNY)} <span className="text-[10px] font-bold text-gray-500">({currency(record.amountThb)})</span></div>
                    
                    {/* Settlement cancelation button (Admins/Owners only) */}
                    {isOwnerAdmin && (
                      <button
                        onClick={() => cancelSettlement(record)}
                        className="p-1 rounded text-gray-400 hover:text-red-650 hover:bg-red-50 cursor-pointer"
                        title={isThai ? "ยกเลิกการชำระเงิน" : "Cancel Payment"}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {paymentRecords.length === 0 && <div className="text-xs font-semibold text-gray-400">{isThai ? "ยังไม่มีประวัติ" : "No settlement history."}</div>}
            </div>
          </section>

          {/* Activity Log Audit Log Section */}
          <section className="rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-extrabold uppercase text-navy">{isThai ? "บันทึกกิจกรรมโดยละเอียด (Audit Log)" : "Detailed Audit Log"}</h3>
            <div className="max-h-72 overflow-y-auto text-[10px] text-gray-650 flex flex-col gap-4 pr-1">
              {groupedLogs.map((group) => (
                <div key={group.dateStr} className="flex flex-col gap-2">
                  <div className="text-[9px] font-black uppercase text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-md self-start tracking-wider">
                    {group.dateHeader}
                  </div>
                  <div className="flex flex-col gap-1.5 pl-1.5 border-l border-slate-100 ml-1.5">
                    {group.items.map((item, index) => {
                      const p = PARTICIPANTS.find(
                        (x) =>
                          x.nickname.toLowerCase() === item.user.toLowerCase() ||
                          x.fullName.toLowerCase() === item.user.toLowerCase()
                      );
                      const isHighlighted = highlightedLogTimestamp === item.timestamp;
                      return (
                        <div
                          key={`${item.raw}-${index}`}
                          id={item.timestamp ? `audit-log-${item.timestamp}` : undefined}
                          className={`flex items-start gap-2.5 py-1 px-1.5 rounded-lg transition-all duration-500 border border-transparent ${
                            isHighlighted
                              ? "bg-brand-gold/15 border-brand-gold/30 shadow-[0_2px_8px_rgba(181,137,44,0.08)] scale-[1.01]"
                              : "hover:bg-slate-50/50"
                          }`}
                        >
                          <span className="text-[9px] font-bold text-gray-400 font-mono w-7 shrink-0 pt-0.5">
                            {formatLogTime(item.timestamp)}
                          </span>
                          
                          {item.user && (
                            <span 
                              className="px-1.5 py-0.5 rounded text-[8px] font-black text-white shrink-0 shadow-sm leading-none flex items-center justify-center h-4.5"
                              style={{ backgroundColor: p?.color || "#64748b" }}
                            >
                              {p ? p.nickname : item.user}
                            </span>
                          )}
                          
                          <div className="flex-1 font-semibold leading-relaxed">
                            <span className="text-gray-805">{item.message}</span>
                            {item.device && (
                              <span 
                                className="text-[8px] text-gray-400 font-medium ml-2 select-none" 
                                title={`IP: ${item.ip}`}
                              >
                                via {item.device}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              {expenseLogs.length === 0 && (
                <div className="text-gray-400 p-2 font-mono">{isThai ? "ยังไม่มีบันทึก" : "No activity yet."}</div>
              )}
            </div>
          </section>

          {/* Relocated Summary Cards under the Activity Log section */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mt-6">
            {[
              { label: isThai ? "ยอดรวม" : "Total", value: cny(totalCny), sub: currency(totalThb), icon: WalletCards },
              { label: isThai ? "จำนวนรายการ" : "Items", value: splitExpenses.filter(e => !e.isDeleted).length, sub: isThai ? "รายการในบัญชี" : "ledger entries", icon: Receipt },
              { label: isThai ? "ยอดค้างทั้งหมด" : "Open debts", value: cny(outstandingItems.reduce((sum, item) => sum + item.amountCny, 0)), sub: `${outstandingItems.length} ${isThai ? "ยอดย่อย" : "shares"} (${currency(outstandingItems.reduce((sum, item) => sum + item.amountThb, 0))})`, icon: Scale },
              { label: isThai ? "อัตราแลกเปลี่ยน" : "Exchange rate", value: exchangeRateCNY, sub: "THB / CNY", icon: Coins },
            ].map((card) => {
              const isOutstandingCard = card.label.includes("ยอดค้าง") || card.label.includes("Open debts");
              return (
                <div key={card.label} className="rounded-2xl border border-slate-100 bg-white/85 p-4 shadow-md">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-gray-500">
                    <span>{card.label}</span>
                    <card.icon className="h-4 w-4 text-brand-gold" />
                  </div>
                  <div className={`mt-3 text-2xl font-extrabold ${isOutstandingCard ? "text-red-600" : "text-navy"}`}>{card.value}</div>
                  <div className="mt-1 text-[11px] font-semibold text-gray-500">{card.sub}</div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Settlement/Debts review modal */}
      {showSettleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl text-gray-800">
            <div className="mb-4 border-b border-gray-100 pb-3">
              <h3 className="text-sm font-extrabold uppercase text-navy">{isThai ? "เลือกยอดค้างที่ต้องการชำระ" : "Select Debts to Settle"}</h3>
              <p className="mt-1 text-xs font-medium text-gray-500">
                {isThai ? "เลือกยอดหนี้เพื่อเคลียร์เป็นรายเจ้าหนี้ (หากชำระต่างคน ต้องดำเนินการทีละคน)" : "Select debts to settle. Settle with one creditor at a time."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 block mb-2">{isThai ? "ผู้ชำระเงินคืน" : "Payer"}</label>
                <div className="grid grid-cols-2 gap-2">
                  {TRAVELERS.map((traveler) => {
                    const isSelected = selectedPayerId === traveler.id;
                    const color = getParticipantColor(traveler.id);
                    const participant = getParticipantById(traveler.id);
                    const nickname = participant?.nickname || traveler.name;
                    return (
                      <button
                        key={traveler.id}
                        type="button"
                        onClick={() => {
                          setSelectedPayerId(traveler.id);
                          setSelectedOutstandingIds([]);
                        }}
                        style={{
                          borderColor: isSelected ? color : "#e2e8f0",
                          backgroundColor: isSelected ? `${color}15` : "#ffffff",
                        }}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all text-left cursor-pointer hover:bg-slate-50`}
                      >
                        <div
                          style={{ backgroundColor: color }}
                          className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white uppercase shrink-0"
                        >
                          {nickname.slice(0, 1)}
                        </div>
                        <span className="truncate">{firstName(traveler.id)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500">{isThai ? "วิธีชำระ" : "Payment Method"}</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { id: "transfer", label: isThai ? "โอนเงิน" : "Transfer" },
                    { id: "cash", label: isThai ? "เงินสด" : "Cash" },
                    { id: "other", label: isThai ? "อื่น ๆ" : "Other" },
                  ].map((method) => (
                    <button key={method.id} type="button" onClick={() => setPaymentMethod(method.id as PaymentRecord["method"])} className={`rounded-xl border px-2 py-3 text-xs font-bold cursor-pointer ${paymentMethod === method.id ? "border-brand-gold bg-brand-gold/10 text-navy" : "border-slate-200 text-gray-500"}`}>
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Creditor Grouped List */}
            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <span className="text-[10px] font-black uppercase text-gray-500 block mb-3">
                {isThai ? "รายการยอดค้างจัดกลุ่มตามเจ้าหนี้" : "Outstanding Debts Grouped by Creditor"}
              </span>
              
              <div className="flex max-h-80 flex-col gap-4 overflow-y-auto pr-1">
                {Object.entries(creditorGroupedOutstanding).map(([creditorId, items]) => {
                  const creditorName = TRAVELERS.find(t => t.id === creditorId)?.name || creditorId;
                  const allCreditorItemIds = items.map(item => item.expense.id);
                  const isAllCreditorItemsSelected = allCreditorItemIds.every(id => selectedOutstandingIds.includes(id));
                  
                  // Disable if another creditor's items are already selected
                  const selectedCreditorIds = selectedItems.map(si => si.recipientId);
                  const isBlocked = selectedCreditorIds.length > 0 && !selectedCreditorIds.includes(creditorId);

                  return (
                    <div key={creditorId} className={`rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm ${isBlocked ? "opacity-45 pointer-events-none" : ""}`}>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                        <span className="font-extrabold text-xs text-navy tracking-wide">
                          {isThai ? "เจ้าหนี้:" : "Creditor:"} {firstName(creditorName)}
                        </span>
                        
                        {/* Select All Creditor's items button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (isAllCreditorItemsSelected) {
                              setSelectedOutstandingIds(prev => prev.filter(id => !allCreditorItemIds.includes(id)));
                            } else {
                              setSelectedOutstandingIds(prev => [...new Set([...prev, ...allCreditorItemIds])]);
                            }
                          }}
                          className="text-[9px] font-black uppercase text-brand-blue hover:underline cursor-pointer"
                        >
                          {isAllCreditorItemsSelected ? (isThai ? "ยกเลิกทั้งหมด" : "Clear Group") : (isThai ? "เลือกกลุ่มนี้ทั้งหมด" : "Select Group")}
                        </button>
                      </div>

                      <div className="flex flex-col gap-2">
                        {items.map((item) => {
                          const selected = selectedOutstandingIds.includes(item.expense.id);
                          return (
                            <button
                              key={item.expense.id}
                              type="button"
                              onClick={() => {
                                if (selected) {
                                  setSelectedOutstandingIds(prev => prev.filter(id => id !== item.expense.id));
                                } else {
                                  setSelectedOutstandingIds(prev => [...prev, item.expense.id]);
                                }
                              }}
                              className={`w-full rounded-xl border p-2.5 text-left transition-all ${
                                selected ? "border-brand-gold bg-brand-gold/5" : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <div className="text-xs font-bold text-gray-900">{item.expense.name}</div>
                                  <div className="mt-1 text-[9px] font-semibold text-gray-400">
                                    {firstName(item.payerId)} {isThai ? "ค้างชำระ" : "owes"}
                                  </div>
                                </div>
                                <div className="text-right font-mono">
                                  <div className="font-black text-brand-gold text-xs">{cny(item.amountCny)}</div>
                                  <div className="text-[9px] font-bold text-gray-500">{currency(item.amountThb)}</div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {payerOutstanding.length === 0 && (
                  <div className="py-8 text-center text-xs font-bold text-emerald-700">
                    {isThai ? "คนนี้ไม่มียอดค้างชำระแล้ว" : "This traveler has no outstanding debts."}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setReceiptActionTarget("slip")}
                className="flex items-center justify-between rounded-xl border border-dashed border-slate-205 bg-slate-50 px-3 py-3 text-xs font-bold text-gray-600 hover:border-brand-gold hover:bg-slate-100/50 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-brand-gold" />
                  {paymentFileName || (isThai ? "แนบรูปสลิป (ไม่บังคับ)" : "Attach slip (optional)")}
                </span>
              </button>
              <input
                value={paymentNote}
                onChange={(event) => setPaymentNote(event.target.value)}
                placeholder={isThai ? "หมายเหตุ เช่น จ่ายสดบนรถ" : "Note, e.g. paid cash in van"}
                className="rounded-xl border border-slate-205 px-3 py-3 text-xs"
              />
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl bg-brand-gold/10 p-4">
              <div>
                <div className="text-[10px] font-black uppercase text-gray-500">{isThai ? "ยอดที่เลือก" : "Selected total"}</div>
                <div className="text-2xl font-black text-navy">{cny(selectedItems.reduce((sum, item) => sum + item.amountCny, 0))} <span className="text-xs font-semibold text-gray-500">({currency(selectedTotal)})</span></div>
              </div>
              <CheckCircle2 className="h-8 w-8 text-brand-gold" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button onClick={() => setShowSettleModal(false)} className="rounded-xl border border-slate-200 py-3 text-xs font-bold text-gray-650 cursor-pointer">
                {isThai ? "ยกเลิก" : "Cancel"}
              </button>
              <button onClick={handleConfirmSettlement} disabled={selectedItems.length === 0} className="rounded-xl bg-brand-gold py-3 text-xs font-extrabold text-brand-bg-primary disabled:opacity-40 cursor-pointer">
                {isThai ? "ยืนยันเคลียร์ยอด" : "Confirm Settlement"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Expense Modal dialog */}
      {editExpenseData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fadeIn">
          <form onSubmit={handleSaveEdit} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl text-gray-800 flex flex-col gap-4">
            <div className="border-b border-slate-100 pb-3 mb-2 flex items-center gap-2">
              <Edit className="w-5 h-5 text-brand-gold" />
              <h3 className="text-sm font-extrabold uppercase text-navy">{isThai ? "แก้ไขรายการค่าใช้จ่าย" : "Edit Expense"}</h3>
            </div>

            <div className="flex flex-col gap-3.5 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-gray-400">{isThai ? "ชื่อรายการ" : "Description"}</label>
                <input
                  value={editExpenseData.name}
                  onChange={(e) => setEditExpenseData({ ...editExpenseData, name: e.target.value })}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">CNY</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editExpenseData.amountCny}
                    onChange={(e) => setEditExpenseData({ ...editExpenseData, amountCny: Number(e.target.value) })}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">{isThai ? "หมวดหมู่" : "Category"}</label>
                  <select
                    value={editExpenseData.category}
                    onChange={(e) => setEditExpenseData({ ...editExpenseData, category: e.target.value as any })}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{isThai ? c.th : c.en}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-gray-400">{isThai ? "ผู้จ่ายเงิน" : "Paid by"}</label>
                <select
                  value={editExpenseData.paidBy}
                  onChange={(e) => setEditExpenseData({ ...editExpenseData, paidBy: e.target.value })}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold"
                >
                  {TRAVELERS.map((t) => (
                    <option key={t.id} value={t.id}>{firstName(t.id)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button type="button" onClick={() => setEditExpenseData(null)} className="rounded-xl border border-slate-200 py-3 text-xs font-bold text-gray-500 cursor-pointer">
                {isThai ? "ยกเลิก" : "Cancel"}
              </button>
              <button type="submit" className="rounded-xl bg-brand-gold py-3 text-xs font-extrabold text-brand-bg-primary cursor-pointer">
                {isThai ? "บันทึกการแก้ไข" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-xs font-extrabold uppercase text-navy">{isThai ? "รูปใบเสร็จ" : "Receipt"}</h3>
              <button onClick={() => setSelectedReceiptUrl(null)} className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold cursor-pointer">Close</button>
            </div>
            <img src={selectedReceiptUrl} alt="Receipt" className="max-h-[70vh] w-full rounded-2xl object-contain" />
          </div>
        </div>
      )}

      {/* Hidden inputs for Choose an Action */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={handleFileSelected}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        ref={albumInputRef}
        onChange={handleFileSelected}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*,application/pdf"
        ref={fileInputRef}
        onChange={handleFileSelected}
        className="hidden"
      />

      {receiptActionTarget && (
        <div 
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm animate-fadeIn" 
          onClick={() => setReceiptActionTarget(null)}
        >
          <div 
            className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white border border-slate-200 p-5 shadow-2xl animate-slideUp sm:animate-scaleUp text-gray-800" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-black uppercase text-navy">
                {isThai ? "เลือกการดำเนินการ" : "Choose an Action"}
              </h3>
              <button 
                onClick={() => setReceiptActionTarget(null)} 
                type="button"
                className="p-1 rounded-full hover:bg-slate-150 text-gray-400 hover:text-gray-600 transition-all cursor-pointer border border-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  cameraInputRef.current?.click();
                }}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-left font-bold text-xs text-gray-700 transition-all cursor-pointer hover:scale-[1.01]"
              >
                <Camera className="w-4.5 h-4.5 text-brand-gold animate-pulse" />
                <span>{isThai ? "กล้องถ่ายรูป (Camera)" : "Camera"}</span>
              </button>
              <button
                type="button"
                onClick={openAndroidPhotoPicker}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-left font-bold text-xs text-gray-700 transition-all cursor-pointer hover:scale-[1.01]"
              >
                <ImageIcon className="w-4.5 h-4.5 text-brand-gold" />
                <span>{isThai ? "คลังรูปภาพ / อัลบั้ม (Photo Library / Album)" : "Photo Library / Album"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-left font-bold text-xs text-gray-700 transition-all cursor-pointer hover:scale-[1.01]"
              >
                <FolderOpen className="w-4.5 h-4.5 text-brand-gold" />
                <span>{isThai ? "เลือกไฟล์เอกสาร (Files)" : "Files"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddExpenseConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl animate-scaleUp text-gray-800 relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl"></div>
            
            <div className="text-center mb-5 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black uppercase text-navy flex items-center justify-center gap-1.5">
                <Receipt className="w-4 h-4 text-brand-gold" />
                {isThai ? "ยืนยันรายละเอียดค่าใช้จ่าย" : "Confirm Expense Details"}
              </h3>
              <p className="text-[10px] text-gray-400 font-semibold mt-1">
                {isThai ? "โปรดตรวจสอบข้อมูลก่อนบันทึกบัญชีกลาง" : "Please double check before saving to shared ledger"}
              </p>
            </div>

            <div className="flex flex-col gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-5">
              <div className="flex justify-between items-start gap-4">
                <span className="text-gray-400 font-bold shrink-0">{isThai ? "ชื่อรายการ:" : "Item Name:"}</span>
                <span className="text-gray-900 font-extrabold text-right">{form.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold">{isThai ? "หมวดหมู่:" : "Category:"}</span>
                <span className="text-gray-900 font-extrabold capitalize">
                  {isThai 
                    ? (CATEGORIES.find(c => c.id === form.category)?.th || form.category) 
                    : (CATEGORIES.find(c => c.id === form.category)?.en || form.category)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold">{isThai ? "ผู้จ่ายเงิน:" : "Paid By:"}</span>
                <span className="text-gray-900 font-extrabold">{firstName(form.paidBy)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200/60 pt-2.5 mt-1">
                <span className="text-gray-400 font-bold">{isThai ? "ยอดเงินทั้งหมด:" : "Total Amount:"}</span>
                <span className="text-brand-gold font-black text-sm">
                  {cny(Number(form.amountCny))} <span className="text-[10px] text-gray-500 font-bold">({currency(Number(form.amountCny) * exchangeRateCNY)})</span>
                </span>
              </div>
              <div className="flex flex-col gap-1 border-t border-slate-200/60 pt-2.5 mt-1">
                <span className="text-gray-400 font-bold">{isThai ? "ผู้ร่วมหาร (" + form.splitAmong.length + " คน):" : "Split Among (" + form.splitAmong.length + " travelers):"}</span>
                <span className="text-gray-700 font-bold text-[10px] leading-relaxed">
                  {form.splitAmong.map(firstName).join(", ")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setShowAddExpenseConfirmModal(false)}
                className="rounded-xl border border-slate-200 py-3 text-xs font-bold text-gray-500 hover:bg-slate-50 cursor-pointer"
              >
                {isThai ? "แก้ไขอีกครั้ง" : "Cancel"}
              </button>
              <button 
                type="button"
                onClick={() => {
                  setShowAddExpenseConfirmModal(false);
                  triggerAddExpense();
                }}
                className="rounded-xl bg-brand-gold py-3 text-xs font-extrabold text-brand-bg-primary hover:bg-brand-gold-hover cursor-pointer"
              >
                {isThai ? "ยืนยันบันทึก" : "Confirm & Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
