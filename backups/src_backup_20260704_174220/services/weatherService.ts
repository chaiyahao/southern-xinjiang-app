export interface WeatherReport {
  location: string;
  tempHigh: number;
  tempLow: number;
  condition: string;
  windSpeedKmh: number;
  alert: string | null;
  humidityPercentage: number;
  elevationM?: number; // Fetched elevation from API
  todayTemp?: number;
  todayCondition?: string;
  todayHumidity?: number;
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

    const getTravelDate = (locName: string, qLat?: number, qLng?: number): string => {
      const name = locName.toLowerCase();
      if (name.includes("tashkurgan")) return "10-31";
      if (name.includes("karakul")) return "10-30";
      if (name.includes("yecheng")) return "11-02";
      if (name.includes("hotan")) return "11-03";
      if (name.includes("aral") || name.includes("alar")) return "11-04";
      if (name.includes("aksu")) return "11-05";
      if (name.includes("kashgar")) return "10-29";
      
      if (qLat !== undefined && qLng !== undefined) {
        if (Math.abs(qLat - 37.77) < 0.3) return "10-31";
        if (Math.abs(qLat - 38.43) < 0.3) return "10-30";
        if (Math.abs(qLat - 37.89) < 0.3) return "11-02";
        if (Math.abs(qLat - 37.11) < 0.3) return "11-03";
        if (Math.abs(qLat - 40.54) < 0.3) return "11-04";
        if (Math.abs(qLat - 41.17) < 0.3) return "11-05";
        if (Math.abs(qLat - 39.47) < 0.3) return "10-29";
      }
      return "10-29";
    };

    // 2. Fetch actual weather and elevation from Open-Meteo API
    if (queryLat !== undefined && queryLng !== undefined) {
      try {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${queryLat}&longitude=${queryLng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&elevation=nan`;
        const monthDay = getTravelDate(loc, queryLat, queryLng);
        const archiveUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${queryLat}&longitude=${queryLng}&start_date=2025-${monthDay}&end_date=2025-${monthDay}&daily=temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max,relative_humidity_2m_max`;

        const [resForecast, resArchive] = await Promise.all([
          fetch(weatherUrl),
          fetch(archiveUrl).catch(e => {
            console.error("Historical archive fetch failed", e);
            return null;
          })
        ]);

        if (resForecast.ok) {
          const forecastData = await resForecast.json();
          const current = forecastData.current;
          
          const tempVal = current.temperature_2m;
          const humidityVal = current.relative_humidity_2m;
          const wmoCode = current.weather_code;
          const windSpeed = current.wind_speed_10m;
          const elevVal = forecastData.elevation !== null && forecastData.elevation !== undefined ? Math.round(forecastData.elevation) : undefined;
          
          let archiveTempMax = Math.round(tempVal - 15);
          let archiveTempMin = Math.round(tempVal - 22);
          let archiveWmoCode = wmoCode;
          let archiveWindSpeed = windSpeed;
          let archiveHumidity = humidityVal;

          if (resArchive && resArchive.ok) {
            const archiveData = await resArchive.json();
            if (archiveData.daily) {
              archiveTempMax = archiveData.daily.temperature_2m_max[0] ?? archiveTempMax;
              archiveTempMin = archiveData.daily.temperature_2m_min[0] ?? archiveTempMin;
              archiveWmoCode = archiveData.daily.weather_code[0] ?? archiveWmoCode;
              archiveWindSpeed = archiveData.daily.wind_speed_10m_max[0] ?? archiveWindSpeed;
              archiveHumidity = archiveData.daily.relative_humidity_2m_max[0] ?? archiveHumidity;
            }
          }

          const condition = parseWmoCode(archiveWmoCode);
          let alert: string | null = null;
          
          // Custom region warnings based on historical travel temperatures
          if (queryLat >= 35 && queryLat <= 45 && queryLng >= 73 && queryLng <= 86) {
            if (condition.includes("Snow") || archiveTempMin < 0) {
              alert = "Freezing altitude warning: active ice on mountain passes.";
            } else if (archiveWindSpeed > 30) {
              alert = "High winds advisory: watch for dust storm drifts.";
            }
          }

          let resolvedLocation = location;
          if (lat !== undefined && lng !== undefined) {
            try {
              const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`;
              const geoRes = await fetch(geoUrl, {
                headers: {
                  "User-Agent": "XinjiangTravelConsole/1.0"
                }
              });
              if (geoRes.ok) {
                const geoData = await geoRes.json();
                const addr = geoData.address || {};
                const placeName = geoData.display_name || "";
                const details = addr.suburb || addr.city_district || addr.city || addr.town || addr.village || addr.county || addr.state || "";
                const country = addr.country || "";
                resolvedLocation = details ? `${details}${country ? ', ' + country : ''}` : placeName.split(',').slice(0, 3).join(', ');
              } else {
                resolvedLocation = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
              }
            } catch (e) {
              console.error("Nominatim reverse geocoding failed:", e);
              resolvedLocation = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
            }
          }

          return {
            location: resolvedLocation,
            tempHigh: Math.round(archiveTempMax),
            tempLow: Math.round(archiveTempMin),
            condition,
            windSpeedKmh: Math.round(archiveWindSpeed),
            alert,
            humidityPercentage: archiveHumidity,
            elevationM: elevVal,
            todayTemp: Math.round(tempVal),
            todayCondition: parseWmoCode(wmoCode),
            todayHumidity: humidityVal,
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
      todayTemp: 33,
      todayCondition: "Sunny",
      todayHumidity: 22,
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
        todayTemp: 22,
        todayCondition: "Sunny",
        todayHumidity: 12,
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
        todayTemp: 35,
        todayCondition: "Sunny",
        todayHumidity: 8,
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
        todayTemp: 32,
        todayCondition: "Sunny",
        todayHumidity: 11,
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
        todayTemp: 33,
        todayCondition: "Sunny",
        todayHumidity: 18,
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
        todayTemp: 34,
        todayCondition: "Sunny",
        todayHumidity: 19,
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
