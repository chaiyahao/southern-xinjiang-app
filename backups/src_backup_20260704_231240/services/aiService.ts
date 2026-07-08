export interface AiRecommendation {
  day: number;
  location: string;
  packingTip: string;
  altitudeAdvice: string;
  culturalEtiquette: string;
  photoSpot: string;
}

export const aiService = {
  async getDayRecommendation(day: number, location: string, altitudeM: number): Promise<AiRecommendation> {
    // Return custom recommendations based on route details
    let packingTip = "Carry light layers. An autumn sweater is sufficient for daytime explorations.";
    let altitudeAdvice = "Low altitude. Drink normal amounts of water. No high-altitude preparations required.";
    let culturalEtiquette = "When visiting traditional bazaars, standard bargaining is accepted. Greet shop owners with a smile and a polite 'Yaxshimusiz' (Hello in Uyghur).";
    let photoSpot = "Old Town Alleyways - morning sunlight creates dramatic shadows between ancient clay houses.";

    if (altitudeM >= 3000) {
      packingTip = "Heavy windproof down jacket, thermal underwear, gloves, and ear-muffs are absolute essentials today.";
      altitudeAdvice = "High risk of altitude sickness (~3,000m+). Avoid alcohol, drink 3L of warm water, take slow breaths. Do not run or carry heavy gear.";
      culturalEtiquette = "Pamir Tajik culture is very hospitable. If invited into a Tajik yurt, remove shoes before entering and do not step on the threshold (it brings bad luck).";
      photoSpot = "Karakul Lake shore - capture the symmetry of Mount Muztagh Ata reflecting in the glacier water at golden hour.";
    } else if (location.toLowerCase().includes("desert") || location.toLowerCase().includes("camp")) {
      packingTip = "Dust scarf/buff, high UV sunglasses, and lip protection. Shifting sands can damage camera lenses, so keep them covered.";
      altitudeAdvice = "Low altitude desert environment. Ensure you carry electrolyte hydration salts to combat dry sweat evaporation.";
      culturalEtiquette = "The desert is fragile. Carry all trash back to the base camp. Respect Tarim Poplar forests (do not peel bark or break ancient branches).";
      photoSpot = "Top of the orange sand dunes near the glamping camp at sunset, overlooking the endless desert horizon.";
    } else if (location.toLowerCase().includes("caves") || location.toLowerCase().includes("kizil")) {
      packingTip = "Comfortable walking shoes with good grip. A light jacket is useful since cave corridors are cool.";
      altitudeAdvice = "Stable low-altitude river valleys. Perfect day for long hikes.";
      culturalEtiquette = "Buddhist murals in Kizil Caves are extremely sacred and ancient. Absolutely NO flash photography is allowed inside the caves to prevent fading of colors.";
      photoSpot = "Statue of Kumarajiva (the great translator) sitting in contemplation against the backdrop of the red Kizil cliffs.";
    }

    // Simulate async processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      day,
      location,
      packingTip,
      altitudeAdvice,
      culturalEtiquette,
      photoSpot,
    };
  },
};
