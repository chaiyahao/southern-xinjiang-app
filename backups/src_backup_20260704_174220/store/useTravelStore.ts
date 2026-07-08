import { create } from "zustand";
import { ActiveTab, LiveTelemetry, CustomExpense } from "../types";
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

  loadPersistedData: () => {
    if (typeof window !== "undefined") {
      const storedExpenses = localStorage.getItem("customExpenses");
      const storedNotes = localStorage.getItem("travelNotes");
      const storedPacking = localStorage.getItem("packingChecklist");
      const storedFontSize = localStorage.getItem("travelFontSize");
      
      set((state) => ({
        customExpenses: storedExpenses ? JSON.parse(storedExpenses) : [],
        notes: storedNotes ? JSON.parse(storedNotes) : state.notes,
        packingChecklist: storedPacking ? JSON.parse(storedPacking) : state.packingChecklist,
        fontSize: (storedFontSize as any) || "normal",
      }));
    }
  },
}));
