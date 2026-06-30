import { isSupabaseConfigured, supabase } from "../utils/supabaseClient";
import { FLIGHTS_DATA } from "../data/travelData";
import { FlightTicket } from "../types";

export const flightService = {
  async getFlights(): Promise<FlightTicket[]> {
    if (!isSupabaseConfigured || !supabase) {
      console.log("Supabase not configured. Using local FLIGHTS_DATA.");
      return FLIGHTS_DATA;
    }

    try {
      const { data, error } = await supabase
        .from("flights")
        .select("*");

      if (error) throw error;
      if (!data || data.length === 0) return FLIGHTS_DATA;

      return data.map((row) => ({
        type: row.flight_type as "Outbound" | "Return",
        route: row.route,
        totalDuration: row.total_duration,
        baggageLimit: row.baggage_limit,
        legs: row.legs ? JSON.parse(JSON.stringify(row.legs)) : [],
      }));
    } catch (err) {
      console.error("Failed to fetch flights from Supabase. Falling back to local:", err);
      return FLIGHTS_DATA;
    }
  },

  async getFlightHistory(flightNo: string) {
    const history = [];
    const now = new Date();

    // Helper to generate a stable pseudo-random number based on flight number and date string
    const getPseudoRandom = (seedStr: string) => {
      let hash = 0;
      for (let i = 0; i < seedStr.length; i++) {
        hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash);
    };

    // Typical schedule base times for our flights
    let depTime = "00:30";
    let arrTime = "05:00";
    let aircraftList = ["B-8231 (A320)", "B-9932 (A320)", "B-1801 (A320)"];

    const cleanNo = flightNo.toUpperCase();
    if (cleanNo.includes("CZ2362") || cleanNo.includes("OQ2362")) {
      // Outbound BKK-CKG and CKG-KHG both CZ2362
      if (cleanNo.includes("BKK")) {
        depTime = "00:30";
        arrTime = "05:00";
      } else {
        depTime = "13:30";
        arrTime = "18:55";
      }
      aircraftList = ["B-303Q (A320N)", "B-321X (A320)", "B-30AL (A320N)"];
    } else if (cleanNo.includes("CZ2008")) {
      // Return AKU-CKG and CKG-BKK both CZ2008
      if (cleanNo.includes("AKU")) {
        depTime = "12:40";
        arrTime = "16:55";
      } else {
        depTime = "21:30";
        arrTime = "23:30";
      }
      aircraftList = ["B-1901 (B738)", "B-1707 (B738)", "B-6062 (B738)"];
    }

    for (let i = 1; i <= 14; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const seed = getPseudoRandom(flightNo + dateStr);
      
      // Determine delay: 75% chance of slight delay (<15m), 15% chance of longer delay, 10% on-time/early
      let delayVal = 0;
      const delayRoll = seed % 100;
      if (delayRoll < 75) {
        delayVal = seed % 15; // 0 to 14 mins
      } else if (delayRoll < 90) {
        delayVal = 15 + (seed % 45); // 15 to 59 mins
      } else {
        delayVal = -(seed % 5); // 0 to 4 mins early
      }

      // Calculate actual times
      const addMinutes = (timeStr: string, mins: number) => {
        const [h, m] = timeStr.split(":").map(Number);
        let total = h * 60 + m + mins;
        if (total < 0) total += 24 * 60;
        const newH = Math.floor(total / 60) % 24;
        const newM = total % 60;
        return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
      };

      const depActual = addMinutes(depTime, delayVal > 0 ? delayVal - (seed % 3) : delayVal);
      const arrActual = addMinutes(arrTime, delayVal);
      const status = delayVal > 25 ? "Delayed" : "Landed";
      const aircraft = aircraftList[seed % aircraftList.length];

      history.push({
        date: dateStr,
        flightNo,
        aircraft,
        departureScheduled: depTime,
        departureActual: depActual,
        arrivalScheduled: arrTime,
        arrivalActual: arrActual,
        delayMinutes: Math.max(0, delayVal),
        status,
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
    return history;
  },
};
