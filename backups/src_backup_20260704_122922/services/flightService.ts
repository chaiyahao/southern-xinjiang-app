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

  async getLiveFlightStatus(flightNo: string, depIata?: string, arrIata?: string) {
    const apiKey = process.env.AVIATIONSTACK_API_KEY;
    if (!apiKey) {
      console.log("AVIATIONSTACK_API_KEY not configured. Live tracking disabled.");
      return null;
    }

    try {
      const cleanNo = flightNo.replace(/\s+/g, "").toUpperCase();
      // Free plan only supports http, not https
      const url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${cleanNo}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Aviationstack returned status ${res.status}`);
      }

      const responseData = await res.json();
      if (responseData.error) {
        throw new Error(responseData.error.message || "Aviationstack API error");
      }

      if (!responseData.data || responseData.data.length === 0) {
        return null; // No active flight found
      }

      const records = responseData.data as any[];

      // A single flight number (e.g. CZ2362) can cover several routes/dates.
      // Pick the record whose departure/arrival IATA matches the requested leg.
      // Fall back to the most recent record if no exact match is found.
      const depU = depIata?.toUpperCase().trim();
      const arrU = arrIata?.toUpperCase().trim();

      let item: any = records[0];
      if (depU || arrU) {
        const exact = records.find(
          (r) =>
            (!depU || r.departure?.iata === depU) &&
            (!arrU || r.arrival?.iata === arrU)
        );
        if (exact) {
          item = exact;
        } else {
          // Relax: match on departure only, then arrival only
          const partial =
            records.find((r) => depU && r.departure?.iata === depU) ||
            records.find((r) => arrU && r.arrival?.iata === arrU);
          if (partial) item = partial;
        }
      }

      // Choose the freshest record of the same date when several share a route
      const sameRoute = records.filter(
        (r) =>
          r.departure?.iata === item.departure?.iata &&
          r.arrival?.iata === item.arrival?.iata
      );
      if (sameRoute.length > 1) {
        sameRoute.sort(
          (a, b) =>
            new Date(b.flight_date).getTime() - new Date(a.flight_date).getTime()
        );
        item = sameRoute[0];
      }

      const formatTime = (iso: string | null | undefined) => {
        if (!iso) return null;
        try {
          // Display in the airport's local timezone using only HH:MM
          return new Date(iso).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
          });
        } catch {
          return null;
        }
      };

      return {
        flightNo: item.flight?.iata || cleanNo,
        status: item.flight_status || "scheduled", // active, landed, scheduled, cancelled
        flightDate: item.flight_date || null,
        aircraft: item.aircraft?.registration
          ? `${item.aircraft.registration} (${item.aircraft.iata || item.aircraft.icao || "N/A"})`
          : item.aircraft?.icao24
            ? `ICAO24 ${item.aircraft.icao24}`
            : null,
        airline: item.airline?.name || null,
        departure: {
          airport: item.departure?.airport || "",
          iata: item.departure?.iata || "",
          terminal: item.departure?.terminal || null,
          gate: item.departure?.gate || null,
          delay: item.departure?.delay || 0,
          scheduled: item.departure?.scheduled || null,
          scheduledTime: formatTime(item.departure?.scheduled),
          actual: item.departure?.actual || null,
          actualTime: formatTime(item.departure?.actual || item.departure?.estimated),
          estimatedTime: formatTime(item.departure?.estimated),
        },
        arrival: {
          airport: item.arrival?.airport || "",
          iata: item.arrival?.iata || "",
          terminal: item.arrival?.terminal || null,
          gate: item.arrival?.gate || null,
          delay: item.arrival?.delay || 0,
          scheduled: item.arrival?.scheduled || null,
          scheduledTime: formatTime(item.arrival?.scheduled),
          actual: item.arrival?.actual || null,
          actualTime: formatTime(item.arrival?.actual || item.arrival?.estimated),
          estimatedTime: formatTime(item.arrival?.estimated),
          baggage: item.arrival?.baggage || null,
        }
      };
    } catch (err) {
      console.error("Error fetching live flight status from Aviationstack:", err);
      return null;
    }
  }
};
