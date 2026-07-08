import { isSupabaseConfigured, supabase } from "../utils/supabaseClient";
import { HOTELS_DATA } from "../data/travelData";
import { Hotel } from "../types";

export const hotelService = {
  async getHotels(): Promise<Hotel[]> {
    if (!isSupabaseConfigured || !supabase) {
      console.log("Supabase not configured. Using local HOTELS_DATA.");
      return HOTELS_DATA;
    }

    try {
      const { data, error } = await supabase
        .from("hotels")
        .select("*");

      if (error) throw error;
      if (!data || data.length === 0) return HOTELS_DATA;

      return data.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        rating: Number(row.rating),
        daysStayed: row.days_stayed,
        location: row.location,
        amenities: row.amenities,
        highlights: row.highlights,
        imagePrompt: row.image_prompt,
      }));
    } catch (err) {
      console.error("Failed to fetch hotels from Supabase. Falling back to local:", err);
      return HOTELS_DATA;
    }
  },

  async getHotelById(id: string): Promise<Hotel | null> {
    const hotels = await this.getHotels();
    return hotels.find((h) => h.id === id) || null;
  },
};
