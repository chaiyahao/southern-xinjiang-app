import { create } from "zustand";
import { ActiveTab, LiveTelemetry, CustomExpense, SplitExpense } from "../types";
import { TELEMETRY_MOCK, ITINERARY_DATA } from "../data/travelData";

interface TravelState {
  activeTab: ActiveTab;
  activeDay: number;
  notes: Record<number, string>;
  packingChecklist: Record<string, boolean>;
  isSimulating: boolean;
  telemetry: LiveTelemetry;
  supabaseSyncStatus: "connected" | "disconnected" | "syncing";
  language: "en" | "th" | "zh";
  customExpenses: CustomExpense[];
  
  // Batch 2 State
  simulatedDate: string | null;
  visitorName: string;
  highlightedLogTimestamp: string | null;
  isUnlockedPassports: boolean;
  exchangeRateCNY: number;
  chatMessages: Array<{
    id: string;
    sender: string;
    senderId?: string;
    text: string;
    timestamp: string;
    readBy?: string[];
    deliveredTo?: string[];
  }>;
  travelerLocations: Record<string, {
    name: string;
    lat: number;
    lng: number;
    lastUpdated: string;
    isSharingGps?: boolean;
    speedKmh?: number;
    accuracy?: number;
    lastActiveTime?: number;
    onlineSince?: number;
    lastOnline?: number;
  }>;
  
  // Batch 1 State
  splitExpenses: SplitExpense[];
  expenseLogs: string[];

  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  setActiveDay: (day: number) => void;
  updateNote: (day: number, note: string) => void;
  togglePackingItem: (item: string) => void;
  setPackingItems: (items: Record<string, boolean>) => void;
  toggleSimulation: () => void;
  updateTelemetry: (updater: Partial<LiveTelemetry> | ((prev: LiveTelemetry) => LiveTelemetry)) => void;
  triggerSupabaseSync: () => Promise<void>;
  setLanguage: (lang: "en" | "th" | "zh") => void;
  addCustomExpense: (name: string, amountThb: number, category: "flights" | "transport" | "hotels" | "tickets" | "other", description?: string) => void;
  deleteCustomExpense: (id: string) => void;
  
  // Batch 2 actions
  setSimulatedDate: (date: string | null) => void;
  setVisitorName: (name: string) => void;
  setHighlightedLogTimestamp: (timestamp: string | null) => void;
  unlockPassports: (unlocked: boolean) => void;
  fetchExchangeRate: () => Promise<void>;
  sendChatMessage: (sender: string, text: string) => void;
  updateTravelerLocation: (id: string, lat: number, lng: number, extra?: { isSharingGps?: boolean; speedKmh?: number; accuracy?: number; lastActiveTime?: number; onlineSince?: number; lastOnline?: number }) => void;

  // Batch 1 actions
  addSplitExpense: (expense: Omit<SplitExpense, "id" | "createdAt">) => void;
  deleteSplitExpense: (id: string, pin: string) => boolean;
  toggleExpenseParticipantSettled: (expenseId: string, participantId: string, settled: boolean) => void;

  loadPersistedData: () => void;
  fontSize: "normal" | "large" | "xl";
  setFontSize: (size: "normal" | "large" | "xl") => void;
}

const DEFAULT_PACKING = {
  "Passport & Chinese Visa copies": true,
  "Heavy winter thermal jacket / fleece": false,
  "Good windbreaker (Pamir plateau is windy)": false,
  "Lip balm & high-strength moisturizer (desert dry air)": false,
  "Sunscreen & polar UV sunglasses": false,
  "Altitude sickness medicine (Acetazolamide/Diamox)": false,
  "Power bank (battery drains fast in cold temperatures)": false,
  "Offline maps (Kashgar & Aksu regions)": true,
  "Thermal flask for warm tea": false,
};

export const useTravelStore = create<TravelState>((set, get) => ({
  activeTab: "overview",
  activeDay: 1,
  notes: {
    1: "Double check passport validity. Remember to change Chinese Yuan (CNY) cash for small local bazaars.",
    2: "Don't miss the 10:00 AM opening ceremony at the Old Town Gates. Try the pomegranate juice near Id Kah Mosque.",
    3: "Stay hydrated. Avoid active physical exercise at Karakul Lake. Drink warm tea.",
  },
  packingChecklist: DEFAULT_PACKING,
  isSimulating: false,
  telemetry: TELEMETRY_MOCK,
  supabaseSyncStatus: "connected",
  language: "th",
  customExpenses: [],
  fontSize: "normal",
  
  // Batch 2 initial states
  simulatedDate: null,
  visitorName: "",
  highlightedLogTimestamp: null,
  isUnlockedPassports: false,
  exchangeRateCNY: 4.88,
  chatMessages: [],
  travelerLocations: {
    "1": { name: "CHAIYA WIBOONSANTISUK (Hao)", lat: 39.470, lng: 75.980, lastUpdated: "Just now" },
    "2": { name: "NANUTDA PRAKHOD (Benz)", lat: 39.472, lng: 75.982, lastUpdated: "Just now" },
    "3": { name: "TIPUBON HOMCHAN (Tare)", lat: 39.468, lng: 75.978, lastUpdated: "Just now" },
    "4": { name: "NAPAS PATTARAAMORNPAN (Cheer)", lat: 39.475, lng: 75.985, lastUpdated: "Just now" },
    "5": { name: "NAKARED WATTANAMONTRI (Tob)", lat: 39.465, lng: 75.975, lastUpdated: "Just now" },
    "6": { name: "NATTARIKA KHAMMA (Tarn)", lat: 39.471, lng: 75.981, lastUpdated: "Just now" },
  },
  splitExpenses: [],
  expenseLogs: [],

  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setActiveDay: (day) => {
    set({ activeDay: day });
    
    // Trigger telemetry update for the new day
    const dayData = ITINERARY_DATA[day - 1];
    if (dayData) {
      // Set base altitude
      get().updateTelemetry({
        currentAltitudeM: dayData.maxElevationM,
        heading: day === 2 ? "South" : day === 4 ? "North" : "East",
      });
      
      // Fetch live weather for the new day's end stop
      fetch(`/api/weather?location=${dayData.endLocation}&altitude=${dayData.maxElevationM}`)
        .then(res => res.json())
        .then(weather => {
          get().updateTelemetry({
            weatherTemp: weather.tempHigh,
            weatherCondition: weather.condition,
            humidity: weather.humidityPercentage || 25,
            todayTemp: weather.todayTemp,
            todayCondition: weather.todayCondition,
            todayHumidity: weather.todayHumidity,
            activeAlerts: weather.alert 
              ? [weather.alert] 
              : dayData.maxElevationM >= 3000 
              ? ["High altitude caution on Pamir Highway segments"] 
              : ["Route clear. Navigation normal."],
          });
        })
        .catch(err => console.error("Error updating telemetry weather:", err));
    }
  },

  updateNote: (day, note) =>
    set((state) => {
      const updatedNotes = { ...state.notes, [day]: note };
      if (typeof window !== "undefined") {
        localStorage.setItem("travelNotes", JSON.stringify(updatedNotes));
      }
      return { notes: updatedNotes };
    }),

  togglePackingItem: (item) =>
    set((state) => {
      const updatedPacking = {
        ...state.packingChecklist,
        [item]: !state.packingChecklist[item],
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("packingChecklist", JSON.stringify(updatedPacking));
      }
      return { packingChecklist: updatedPacking };
    }),

  setPackingItems: (items) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("packingChecklist", JSON.stringify(items));
    }
    set({ packingChecklist: items });
  },

  toggleSimulation: () => set((state) => ({ isSimulating: !state.isSimulating })),

  updateTelemetry: (updater) =>
    set((state) => ({
      telemetry:
        typeof updater === "function"
          ? updater(state.telemetry)
          : { ...state.telemetry, ...updater },
    })),

  triggerSupabaseSync: async () => {
    set({ supabaseSyncStatus: "syncing" });
    // Mock network call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({ supabaseSyncStatus: "connected" });
  },

  setLanguage: (lang) => set({ language: lang }),

  setFontSize: (size) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("travelFontSize", size);
    }
    set({ fontSize: size });
  },

  addCustomExpense: (name, amountThb, category, description) => {
    const newExpense: CustomExpense = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      amountThb,
      category,
      description,
    };
    set((state) => {
      const updated = [...state.customExpenses, newExpense];
      if (typeof window !== "undefined") {
        localStorage.setItem("customExpenses", JSON.stringify(updated));
      }
      return { customExpenses: updated };
    });
  },

  deleteCustomExpense: (id) => {
    set((state) => {
      const updated = state.customExpenses.filter((e) => e.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("customExpenses", JSON.stringify(updated));
      }
      return { customExpenses: updated };
    });
  },

  // Batch 2 actions
  setSimulatedDate: (date) => set({ simulatedDate: date }),
  
  setVisitorName: (name) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("travelVisitorName", name);
    }
    set({ visitorName: name });
  },
  
  setHighlightedLogTimestamp: (timestamp) => set({ highlightedLogTimestamp: timestamp }),
  
  unlockPassports: (unlocked) => set({ isUnlockedPassports: unlocked }),
  
  fetchExchangeRate: async () => {
    try {
      const res = await fetch("/api/exchange-rate");
      if (res.ok) {
        const data = await res.json();
        set({ exchangeRateCNY: data.rate });
      }
    } catch (err) {
      console.error("Error fetching exchange rate:", err);
    }
  },
  
  sendChatMessage: (sender, text) => {
    const newMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender,
      text,
      timestamp: new Date().toISOString(),
    };
    set((state) => {
      const updated = [...state.chatMessages, newMessage];
      if (typeof window !== "undefined") {
        localStorage.setItem("chatMessages", JSON.stringify(updated));
      }
      return { chatMessages: updated };
    });
  },
  
  updateTravelerLocation: (id, lat, lng, extra) => {
    set((state) => {
      const current = state.travelerLocations[id];
      if (!current) return state;
      const updated = {
        ...state.travelerLocations,
        [id]: {
          ...current,
          lat,
          lng,
          lastUpdated: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          isSharingGps: extra?.isSharingGps !== undefined ? extra.isSharingGps : current.isSharingGps,
          speedKmh: extra?.speedKmh !== undefined ? extra.speedKmh : current.speedKmh,
          accuracy: extra?.accuracy !== undefined ? extra.accuracy : current.accuracy,
          lastActiveTime: extra?.lastActiveTime !== undefined ? extra.lastActiveTime : Date.now(),
          onlineSince: extra?.onlineSince !== undefined ? extra.onlineSince : current.onlineSince,
          lastOnline: extra?.lastOnline !== undefined ? extra.lastOnline : current.lastOnline,
        },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("travelerLocations", JSON.stringify(updated));
      }
      return { travelerLocations: updated };
    });
  },

  // Batch 1 actions
  addSplitExpense: (expense) => {
    const newExpense: SplitExpense = {
      ...expense,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    set((state) => {
      const updated = [...state.splitExpenses, newExpense];
      const logMsg = `${expense.recordedBy} เพิ่มรายการ "${expense.name}" จำนวน ¥${expense.amountCny} RMB`;
      const updatedLogs = [logMsg, ...state.expenseLogs];
      if (typeof window !== "undefined") {
        localStorage.setItem("splitExpenses", JSON.stringify(updated));
        localStorage.setItem("expenseLogs", JSON.stringify(updatedLogs));
      }
      return { splitExpenses: updated, expenseLogs: updatedLogs };
    });
  },

  deleteSplitExpense: (id, pin) => {
    const pinMap: Record<string, string> = {
      "CHAIYA WIBOONSANTISUK": "1111",
      "NANUTDA PRAKHOD": "2222",
      "TIPUBON HOMCHAN": "3333",
      "NAPAS PATTARAAMORNPAN": "4444",
      "NAKARED WATTANAMONTRI": "5555",
      "NATTARIKA KHAMMA": "6666",
    };

    const targetExpense = get().splitExpenses.find((e) => e.id === id);
    if (!targetExpense) return false;

    const allowedPins = ["9643", pinMap[targetExpense.recordedBy.toUpperCase()] || "1234"];
    if (!allowedPins.includes(pin)) {
      return false;
    }

    set((state) => {
      const updated = state.splitExpenses.filter((e) => e.id !== id);
      const logMsg = `${targetExpense.recordedBy} ลบรายการ "${targetExpense.name}"`;
      const updatedLogs = [logMsg, ...state.expenseLogs];
      if (typeof window !== "undefined") {
        localStorage.setItem("splitExpenses", JSON.stringify(updated));
        localStorage.setItem("expenseLogs", JSON.stringify(updatedLogs));
      }
      return { splitExpenses: updated, expenseLogs: updatedLogs };
    });
    return true;
  },

  toggleExpenseParticipantSettled: (expenseId, participantId, settled) => {
    set((state) => {
      const updated = state.splitExpenses.map((exp) => {
        if (exp.id !== expenseId) return exp;
        const settledList = exp.settledParticipants || [];
        const updatedList = settled
          ? [...new Set([...settledList, participantId])]
          : settledList.filter((id) => id !== participantId);
        return { ...exp, settledParticipants: updatedList };
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("splitExpenses", JSON.stringify(updated));
      }
      return { splitExpenses: updated };
    });
  },

  loadPersistedData: () => {
    if (typeof window !== "undefined") {
      const storedExpenses = localStorage.getItem("customExpenses");
      const storedNotes = localStorage.getItem("travelNotes");
      const storedPacking = localStorage.getItem("packingChecklist");
      const storedFontSize = localStorage.getItem("travelFontSize");
      const storedVisitorName = localStorage.getItem("travelVisitorName");
      const storedChat = localStorage.getItem("chatMessages");
      const storedLocs = localStorage.getItem("travelerLocations");
      const storedSplit = localStorage.getItem("splitExpenses");
      const storedLogs = localStorage.getItem("expenseLogs");
      
      set((state) => ({
        customExpenses: storedExpenses ? JSON.parse(storedExpenses) : [],
        notes: storedNotes ? JSON.parse(storedNotes) : state.notes,
        packingChecklist: storedPacking ? JSON.parse(storedPacking) : state.packingChecklist,
        fontSize: (storedFontSize as any) || "normal",
        visitorName: storedVisitorName || "",
        chatMessages: storedChat ? JSON.parse(storedChat) : state.chatMessages,
        travelerLocations: storedLocs ? JSON.parse(storedLocs) : state.travelerLocations,
        splitExpenses: storedSplit ? JSON.parse(storedSplit) : [],
        expenseLogs: storedLogs ? JSON.parse(storedLogs) : [],
      }));
    }
  },
}));
