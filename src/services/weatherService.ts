export interface WeatherReport {
  location: string;
  tempHigh: number;
  tempLow: number;
  condition: string;
  windSpeedKmh: number;
  alert: string | null;
  humidityPercentage: number;
  elevationM?: number; // Fetched elevation from API
}

function parseWmoCode(code: number): string {
  if (code === 0) return "Sunny";
  if (code === 1 || code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Foggy";
  if (code === 51 || code === 53 || code === 55) return "Drizzle";
  if (code === 61 || code === 63 || code === 65) return "Rainy";
  if (code === 71 || code === 73 || code === 75 || code === 77) return "Snowy";
  if (code === 80 || code === 81 || code === 82) return "Rain Showers";
  if (code === 85 || code === 86) return "Snow Showers";
  if (code === 95 || code === 96 || code === 99) return "Thunderstorm";
  return "Clear";
}

export const weatherService = {
  // Returns real-time or simulated late-autumn Xinjiang weather based on location
  async getWeather(location: string, altitudeM = 1300, lat?: number, lng?: number): Promise<WeatherReport> {
    const loc = location.toLowerCase();

    // 1. Map known stops to coordinates if not explicitly passed
    let queryLat = lat;
    let queryLng = lng;

    if (queryLat === undefined || queryLng === undefined) {
      if (loc.includes("kashgar")) {
        queryLat = 39.47;
        queryLng = 75.98;
      } else if (loc.includes("tashkurgan")) {
        queryLat = 37.77;
        queryLng = 75.23;
      } else if (loc.includes("karakul")) {
        queryLat = 38.43;
        queryLng = 75.05;
      } else if (loc.includes("yecheng")) {
        queryLat = 37.89;
        queryLng = 77.26;
      } else if (loc.includes("hotan")) {
        queryLat = 37.11;
        queryLng = 79.92;
      } else if (loc.includes("aral") || loc.includes("alar")) {
        queryLat = 40.54;
        queryLng = 81.28;
      } else if (loc.includes("aksu")) {
        queryLat = 41.17;
        queryLng = 80.26;
      }
    }

    // 2. Fetch actual weather and elevation from Open-Meteo API
    if (queryLat !== undefined && queryLng !== undefined) {
      try {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${queryLat}&longitude=${queryLng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&elevation=nan`;
        const res = await fetch(weatherUrl);
        if (res.ok) {
          const data = await res.json();
          const current = data.current;
          
          const tempVal = current.temperature_2m;
          const humidityVal = current.relative_humidity_2m;
          const wmoCode = current.weather_code;
          const windSpeed = current.wind_speed_10m;
          const elevVal = data.elevation !== null && data.elevation !== undefined ? Math.round(data.elevation) : undefined;
          
          const condition = parseWmoCode(wmoCode);
          let alert: string | null = null;
          
          // Custom region warnings
          if (queryLat >= 35 && queryLat <= 45 && queryLng >= 73 && queryLng <= 86) {
            if (condition.includes("Snow") || tempVal < 0) {
              alert = "Freezing altitude warning: active ice on mountain passes.";
            } else if (windSpeed > 30) {
              alert = "High winds advisory: watch for dust storm drifts.";
            }
          }

          return {
            location: lat !== undefined && lng !== undefined 
              ? `Device Location (Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)})`
              : location,
            tempHigh: Math.round(tempVal),
            tempLow: Math.round(tempVal - 6),
            condition,
            windSpeedKmh: Math.round(windSpeed),
            alert,
            humidityPercentage: humidityVal,
            elevationM: elevVal,
          };
        }
      } catch (err) {
        console.error("Error fetching live weather from open-meteo:", err);
      }
    }

    // 3. Fallback: Static reports for regions if API is offline
    let baseReport: WeatherReport = {
      location,
      tempHigh: 15,
      tempLow: 3,
      condition: "Clear",
      windSpeedKmh: 12,
      alert: null,
      humidityPercentage: 25,
    };

    if (loc.includes("tashkurgan") || loc.includes("pamir") || loc.includes("karakul")) {
      baseReport = {
        location,
        tempHigh: 4,
        tempLow: -7,
        condition: "Windy Snow",
        windSpeedKmh: 35,
        alert: "Gale force winds on passes. Ice warnings.",
        humidityPercentage: 45,
      };
    } else if (loc.includes("desert") || loc.includes("alar") || loc.includes("taklamakan")) {
      baseReport = {
        location,
        tempHigh: 12,
        tempLow: 0,
        condition: "Hazy Sun",
        windSpeedKmh: 18,
        alert: "Dust storm advisory overnight. Temperatures dropping fast after sunset.",
        humidityPercentage: 15,
      };
    } else if (loc.includes("canyon") || loc.includes("kuqa")) {
      baseReport = {
        location,
        tempHigh: 13,
        tempLow: 2,
        condition: "Sunny",
        windSpeedKmh: 8,
        alert: null,
        humidityPercentage: 22,
      };
    } else if (loc.includes("aksu")) {
      baseReport = {
        location,
        tempHigh: 14,
        tempLow: 1,
        condition: "Partly Cloudy",
        windSpeedKmh: 10,
        alert: null,
        humidityPercentage: 28,
      };
    } else if (loc.includes("kashgar")) {
      baseReport = {
        location,
        tempHigh: 16,
        tempLow: 4,
        condition: "Sunny",
        windSpeedKmh: 9,
        alert: null,
        humidityPercentage: 26,
      };
    }

    // Adjust temperature based on elevation lapse rate (~6.5°C drop per 1,000m climb above base 1,200m)
    if (altitudeM > 1300) {
      const elevationDifferenceKm = (altitudeM - 1300) / 1000;
      const tempDrop = Math.round(elevationDifferenceKm * 6.5);
      baseReport.tempHigh = Math.max(-15, baseReport.tempHigh - tempDrop);
      baseReport.tempLow = Math.max(-25, baseReport.tempLow - tempDrop);
      if (baseReport.tempLow < -5 && !baseReport.alert) {
        baseReport.alert = "Freezing warning: Altitude temperature drop.";
      }
    }

    // Simulate async network request
    await new Promise((resolve) => setTimeout(resolve, 100));

    return baseReport;
  },
};
