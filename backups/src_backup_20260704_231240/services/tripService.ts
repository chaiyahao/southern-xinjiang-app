import { isSupabaseConfigured, supabase } from "../utils/supabaseClient";
import { ITINERARY_DATA } from "../data/travelData";
import { ItineraryDay } from "../types";

export const tripService = {
  async getItinerary(): Promise<ItineraryDay[]> {
    if (!isSupabaseConfigured || !supabase) {
      console.log("Supabase not configured. Using local ITINERARY_DATA.");
      return ITINERARY_DATA;
    }

    try {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .order("day_number", { ascending: true });

      if (error) throw error;
      if (!data || data.length === 0) return ITINERARY_DATA;

      // Map Supabase rows back to ItineraryDay typescript types
      return data.map((row) => ({
        day: row.day_number,
        date: row.date_str,
        title: row.title,
        subtitle: row.subtitle,
        startLocation: row.start_location,
        endLocation: row.end_location,
        distanceKm: Number(row.distance_km),
        driveTime: row.drive_time,
        elevationGainM: row.elevation_gain_m,
        maxElevationM: row.max_elevation_m,
        description: row.description,
        hotelName: row.hotel_name,
        activities: row.activities,
        coordinates: [Number(row.coordinates[0]), Number(row.coordinates[1])],
        routeCoordinates: row.route_coordinates ? JSON.parse(JSON.stringify(row.route_coordinates)) : undefined,
        weather: {
          tempRange: row.weather_temp_range,
          icon: row.weather_icon,
          forecast: row.weather_forecast,
        },
      }));
    } catch (err) {
      console.error("Failed to fetch itinerary from Supabase. Falling back to local:", err);
      return ITINERARY_DATA;
    }
  },

  async getDayDetails(dayNumber: number): Promise<ItineraryDay | null> {
    const itinerary = await this.getItinerary();
    return itinerary.find((d) => d.day === dayNumber) || null;
  },
};
