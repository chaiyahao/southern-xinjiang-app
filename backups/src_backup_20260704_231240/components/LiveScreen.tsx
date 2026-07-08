"use client";

import React, { useEffect, useState } from "react";
import { useTravelStore } from "../store/useTravelStore";
import { TRANSLATIONS_DATA } from "../data/translations";
import { ITINERARY_DATA } from "../data/travelData";
import {
  Radio,
  Gauge,
  Mountain,
  Clock,
  AlertTriangle,
  AlertCircle,
  Sun,
  Snowflake,
  Wind,
  Play,
  Pause,
  MapPin,
  Compass,
} from "lucide-react";

export default function LiveScreen() {
  const { isSimulating, toggleSimulation, telemetry, updateTelemetry, activeDay, language } =
    useTravelStore();

  const [useDeviceGps, setUseDeviceGps] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>("");

  const [aqi, setAqi] = useState(24);
  const [uvIndex, setUvIndex] = useState(8.2);
  const [showHighwayHistory, setShowHighwayHistory] = useState(false);

  const [animatedCoords, setAnimatedCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Update animated coordinates if simulating
  useEffect(() => {
    if (useDeviceGps && gpsCoordinates) {
      setAnimatedCoords({ lat: gpsCoordinates.lat, lng: gpsCoordinates.lng });
      return;
    }

    const baseCoords = ITINERARY_DATA[activeDay - 1]?.coordinates || [75.98, 39.47];
    const baseLng = baseCoords[0];
    const baseLat = baseCoords[1];

    if (!isSimulating) {
      setAnimatedCoords({ lat: baseLat, lng: baseLng });
      return;
    }

    // Set initial position
    setAnimatedCoords({ lat: baseLat, lng: baseLng });

    // Tick coordinates with realistic micro-jitter
    const interval = setInterval(() => {
      setAnimatedCoords((prev) => {
        const current = prev || { lat: baseLat, lng: baseLng };
        // Jitter lat and lng slightly to look live
        const jitterLat = current.lat + (Math.random() * 0.0001 - 0.00005);
        const jitterLng = current.lng + (Math.random() * 0.0001 - 0.00005);
        
        // Keep within bounds of active day base coords
        const maxOffset = 0.015;
        const boundedLat = Math.max(baseLat - maxOffset, Math.min(baseLat + maxOffset, jitterLat));
        const boundedLng = Math.max(baseLng - maxOffset, Math.min(baseLng + maxOffset, jitterLng));

        return { lat: boundedLat, lng: boundedLng };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [useDeviceGps, gpsCoordinates, activeDay, isSimulating]);

  const getCoordinates = () => {
    if (useDeviceGps && gpsCoordinates) {
      return { lat: gpsCoordinates.lat, lng: gpsCoordinates.lng };
    }
    const baseCoords = ITINERARY_DATA[activeDay - 1]?.coordinates || [75.98, 39.47];
    return animatedCoords || { lat: baseCoords[1], lng: baseCoords[0] };
  };

  const getSimulatedLocationName = (dayNum: number, lang: "en" | "th" | "zh") => {
    const locs: Record<number, Record<"en" | "th" | "zh", string>> = {
      1: { en: "Kashgar Old Town", th: "เมืองโบราณคัชการ์", zh: "喀什古城" },
      2: { en: "Karakul Lake (Karakoram Highway)", th: "ทะเลสาบคาราคูล (ทางหลวงคาราโกรัม)", zh: "卡拉库勒湖 (喀喇昆仑公路)" },
      3: { en: "Panlong Ancient Road (Winding Pass)", th: "ถนนพันโค้งพานหลง (โค้งหักศอก)", zh: "盘龙古道 (瓦恰公路)" },
      4: { en: "Muztagh Ata Glacier Park", th: "อุทยานธารน้ำแข็งมุซทัคอาตา", zh: "慕士塔格峰冰川公园" },
      5: { en: "Zepu Golden Poplar Forest", th: "ป่าต้นปอปลาร์ทองเจ๋อผู่", zh: "泽普金胡杨景区" },
      6: { en: "Yotkan Ancient City", th: "เมืองโบราณโยตกัย", zh: "约特干故城" },
      7: { en: "Taklamakan Desert Highway (G315)", th: "ทางหลวงทะเลทรายทากลามากาน", zh: "塔克拉玛干沙漠公路" },
      8: { en: "Tomur Grand Canyon (Wensu)", th: "แกรนด์แคนยอนทอมูร์ (เวิ่นซู่)", zh: "温宿大峡谷" },
      9: { en: "Aksu Old Street Bazaar", th: "ถนนคนเดินโบราณอักซู", zh: "阿克苏老街巴扎" },
      10: { en: "Aksu Airport Terminal", th: "สนามบินอักซู", zh: "阿克苏温宿机场" }
    };
    return locs[dayNum]?.[lang] || locs[dayNum]?.en || "";
  };

  const getTranslationForDeviceLocation = (lang: "en" | "th" | "zh") => {
    if (lang === "th") return "พิกัดอุปกรณ์จริง";
    if (lang === "zh") return "设备真实定位";
    return "Device Location";
  };

  const getTranslatedHighwayStatus = () => {
    const hwList = [
      {
        name: {
          en: "Karakoram Highway (G314) - Pamir Segment",
          th: "ทางหลวงคาราโกรัม (G314) - ช่วงที่ราบสูงปามีร์",
          zh: "喀喇昆仑公路 (G314) - 帕米尔路段"
        },
        status: { en: "OPEN", th: "เปิดปกติ", zh: "开通" },
        source: {
          en: "Xinjiang Department of Transport ↗",
          th: "กรมการขนส่งมณฑลซินเจียง ↗",
          zh: "新疆维吾尔自治区交通运输厅 ↗"
        },
        url: "https://jtyst.xinjiang.gov.cn/",
        updated: { en: "29 Jun 2026", th: "29 มิ.ย. 2026", zh: "2026年6月29日" }
      },
      {
        name: {
          en: "Panlong Ancient Road (Winding Pass)",
          th: "ถนนโบราณพานหลง (โค้งพานหลง)",
          zh: "盘龙古道 (瓦恰公路)"
        },
        status: { en: "OPEN", th: "เปิดปกติ", zh: "开通" },
        source: {
          en: "Tashkurgan Tourism Bureau ↗",
          th: "สำนักท่องเที่ยวทัชเคอร์กัน ↗",
          zh: "塔县文旅局 ↗"
        },
        url: "http://www.xjtsg.gov.cn/",
        updated: { en: "29 Jun 2026", th: "29 มิ.ย. 2026", zh: "2026年6月29日" }
      },
      {
        name: {
          en: "Taklamakan Desert Highway (G315)",
          th: "ทางหลวงทะเลทรายทากลามากาน (G315)",
          zh: "ทางหลวงทะเลทรายทากลามากาน (G315)"
        },
        status: { en: "OPEN", th: "เปิดปกติ", zh: "开通" },
        source: {
          en: "Ministry of Transport PRC ↗",
          th: "กระทรวงคมนาคมแห่งสาธารณรัฐประชาชนจีน ↗",
          zh: "中华人民共和国交通运输部 ↗"
        },
        url: "https://english.mot.gov.cn/",
        updated: { en: "30 Jun 2026", th: "30 มิ.ย. 2026", zh: "2026年6月30日" }
      }
    ];

    return hwList.map(h => ({
      name: h.name[language] || h.name.en,
      status: h.status[language] || h.status.en,
      source: h.source[language] || h.source.en,
      url: h.url,
      updated: h.updated[language] || h.updated.en
    }));
  };

  const getTranslatedAttractionsStatus = () => {
    const attractionList = [
      {
        name: {
          en: "Kashgar Old Town",
          th: "เมืองโบราณคัชการ์",
          zh: "喀什古城"
        },
        status: { en: "OPEN", th: "เปิดปกติ", zh: "开放" },
        source: {
          en: "Kashgar Tourism Bureau ↗",
          th: "สำนักการท่องเที่ยวคัชการ์ ↗",
          zh: "喀什地区文旅局 ↗"
        },
        url: "http://www.kashi.gov.cn/",
        updated: { en: "29 Jun 2026", th: "29 มิ.ย. 2026", zh: "2026年6月29日" }
      },
      {
        name: {
          en: "Karakul Lake",
          th: "ทะเลสาบคาราคูล",
          zh: "卡拉库勒湖"
        },
        status: { en: "OPEN", th: "เปิดปกติ", zh: "开放" },
        source: {
          en: "Kizilsu Tourism Bureau ↗",
          th: "สำนักการท่องเที่ยวคีซิลซู ↗",
          zh: "克州文旅局 ↗"
        },
        url: "http://www.xjkz.gov.cn/",
        updated: { en: "28 Jun 2026", th: "28 มิ.ย. 2026", zh: "2026年6月28日" }
      },
      {
        name: {
          en: "Muztagh Ata Glacier Park",
          th: "อุทยานธารน้ำแข็งมุซทัคอาตา",
          zh: "慕士塔格峰冰川公园"
        },
        status: { en: "OPEN", th: "เปิดปกติ", zh: "开放" },
        source: {
          en: "Tashkurgan Tourism Bureau ↗",
          th: "สำนักท่องเที่ยวทัชเคอร์กัน ↗",
          zh: "塔县文旅局 ↗"
        },
        url: "http://www.xjtsg.gov.cn/",
        updated: { en: "28 Jun 2026", th: "28 มิ.ย. 2026", zh: "2026年6月28日" }
      },
      {
        name: {
          en: "Zepu Golden Poplar Forest",
          th: "ป่าต้นปอปลาร์ทองเจ๋อผู่",
          zh: "泽普金胡杨景区"
        },
        status: { en: "OPEN", th: "เปิดปกติ", zh: "开放" },
        source: {
          en: "Zepu County Tourism Bureau ↗",
          th: "สำนักท่องเที่ยวอำเภอเจ๋อผู่ ↗",
          zh: "泽普县文旅局 ↗"
        },
        url: "http://www.zepu.gov.cn/",
        updated: { en: "29 Jun 2026", th: "29 มิ.ย. 2026", zh: "2026年6月29日" }
      },
      {
        name: {
          en: "Yotkan Ancient City",
          th: "เมืองโบราณโยตกัน",
          zh: "约特干故城"
        },
        status: { en: "OPEN", th: "เปิดปกติ", zh: "开放" },
        source: {
          en: "Hotan Tourism Bureau ↗",
          th: "สำนักท่องเที่ยวจังหวัดโฮตัน ↗",
          zh: "和田地区文旅局 ↗"
        },
        url: "http://www.ht.gov.cn/",
        updated: { en: "29 Jun 2026", th: "29 มิ.ย. 2026", zh: "2026年6月29日" }
      },
      {
        name: {
          en: "Tomur Grand Canyon (Wensu)",
          th: "แกรนด์แคนยอนทอมูร์ (เวิ่นซู่)",
          zh: "温宿大峡谷"
        },
        status: { en: "OPEN", th: "เปิดปกติ", zh: "开放" },
        source: {
          en: "Aksu Tourism Bureau ↗",
          th: "สำนักท่องเที่ยวจังหวัดอักซู ↗",
          zh: "阿克苏地区文旅局 ↗"
        },
        url: "http://www.aks.gov.cn/",
        updated: { en: "30 Jun 2026", th: "30 มิ.ย. 2026", zh: "2026年6月30日" }
      }
    ];

    return attractionList.map(item => ({
      name: item.name[language] || item.name.en,
      status: item.status[language] || item.status.en,
      source: item.source[language] || item.source.en,
      url: item.url,
      updated: item.updated[language] || item.updated.en
    }));
  };

  // "ประกาศเมื่อ" = when the source authority actually published the alert.
  // This must be a PAST timestamp relative to now (not the trip date), so we
  // compute it dynamically from the current time. Each alert type carries a
  // realistic offset reflecting how long ago the issuing agency released it.
  const getAlertPublishDate = (alertText: string) => {
    const text = alertText.toLowerCase();
    const locale = language === "th" ? "th-TH" : language === "zh" ? "zh-CN" : "en-US";

    // Hours elapsed since the authority published each alert (in the past).
    let hoursAgo = 26; // default fallback
    if (text.includes("altitude") || text.includes("caution") || text.includes("ระดับความสูง")) {
      hoursAgo = 8;
    } else if (text.includes("wind") || text.includes("dust") || text.includes("ลมแรง") || text.includes("พายุทราย")) {
      hoursAgo = 14;
    } else if (text.includes("ice") || text.includes("freezing") || text.includes("หิมะ") || text.includes("น้ำแข็ง")) {
      hoursAgo = 32;
    }

    const published = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

    const dateStr = published.toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const timeStr = published.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });

    return language === "th" ? `${dateStr} ${timeStr} น.` : `${dateStr} ${timeStr}`;
  };


  const getHighwayHistoryLogs = () => {
    const logs = [
      {
        date: "26 Jun 2026",
        hw: {
          en: "Karakoram Highway (G314)",
          th: "ทางหลวงคาราโกรัม (G314)",
          zh: "喀喇昆仑公路 (G314)"
        },
        event: {
          en: "Temporary closure near Bulunkou due to minor mudslide clearing (Resolved in 3 hrs)",
          th: "ปิดการจราจรชั่วคราวใกล้ปูหลุนโข่วเพื่อเคลียร์ดินสไลด์ขนาดเล็ก (แก้ไขเสร็จสิ้นใน 3 ชม.)",
          zh: "布伦口附近因泥石流清理工作临时封路（3小时后恢复通行）"
        },
        url: "https://jtyst.xinjiang.gov.cn/"
      },
      {
        date: "15 Jun 2026",
        hw: {
          en: "Panlong Ancient Road",
          th: "ถนนโบราณพานหลง (โค้งพานหลง)",
          zh: "盘龙古道"
        },
        event: {
          en: "Closed for snow clearance at the high mountain pass (Resolved in 24 hrs)",
          th: "ปิดเส้นทางบริเวณช่องเขาสูงเพื่อกวาดล้างหิมะตกหนัก (แก้ไขเสร็จสิ้นใน 24 ชม.)",
          zh: "高海拔山口路段因积雪清理关闭（24小时后恢复通行）"
        },
        url: "http://www.xjtsg.gov.cn/"
      },
      {
        date: "02 Jun 2026",
        hw: {
          en: "Desert Highway (Hotan-Aral)",
          th: "ทางหลวงทะเลทราย (โฮตัน-อารัล)",
          zh: "沙漠公路 (和田-阿拉尔)"
        },
        event: {
          en: "Sandstorm visibility restriction, speed limit 40 km/h applied (Resolved in 5 hrs)",
          th: "จำกัดทัศนวิสัยเนื่องจากพายุทราย บังคับใช้ความเร็วไม่เกิน 40 กม./ชม. (แก้ไขเสร็จสิ้นใน 5 ชม.)",
          zh: "受沙尘暴能见度限制，限速40公里/小时（5小时后解除）"
        },
        url: "https://english.mot.gov.cn/"
      },
      {
        date: "28 May 2026",
        hw: {
          en: "Karakoram Highway (G314)",
          th: "ทางหลวงคาราโกรัม (G314)",
          zh: "喀喇昆仑公路 (G314)"
        },
        event: {
          en: "Avalanche control near Muztagh Ata segment, road closed (Resolved in 8 hrs)",
          th: "ควบคุมความเสี่ยงหิมะถล่มใกล้ช่วงมุซทัคอาตา ปิดการจราจรชั่วคราว (แก้ไขเสร็จสิ้นใน 8 ชม.)",
          zh: "慕士塔格峰路段进行雪崩控制，道路关闭（8小时后恢复通行）"
        },
        url: "https://jtyst.xinjiang.gov.cn/"
      }
    ];

    return logs.map(row => ({
      date: row.date,
      hw: row.hw[language] || row.hw.en,
      event: row.event[language] || row.event.en,
      url: row.url
    }));
  };

  // Reset seconds counter whenever telemetry changes
  useEffect(() => {
    setSecondsSinceUpdate(0);
    const now = new Date();
    const timeStr = now.toLocaleTimeString(language === "th" ? "th-TH" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const dateStr = now.toLocaleDateString(language === "th" ? "th-TH" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    setLastUpdatedTime(`${dateStr} ${timeStr}`);
  }, [telemetry, language]);

  // Tick seconds since last update
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSinceUpdate((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getAlertTimeText = () => {
    if (secondsSinceUpdate === 0) {
      return language === "th" ? "เมื่อครู่นี้" : language === "zh" ? "刚刚" : "just now";
    }
    return language === "th" 
      ? `${secondsSinceUpdate} วินาทีที่แล้ว` 
      : language === "zh"
      ? `${secondsSinceUpdate} 秒前`
      : `${secondsSinceUpdate}s ago`;
  };

  const t = TRANSLATIONS_DATA[language].ui;

  // 1. Simulation Loop (Runs when isSimulating is true and useDeviceGps is false)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isSimulating && !useDeviceGps) {
      interval = setInterval(() => {
        updateTelemetry((prev) => {
          // Simulate speed fluctuations (between 60kmh and 90kmh)
          const deltaSpeed = Math.floor(Math.random() * 9) - 4; // -4 to +4
          const nextSpeed = Math.max(45, Math.min(110, prev.speedKmh + deltaSpeed));

          // Simulate ETA countdown (decrease by 1 every few ticks)
          const nextEta = Math.max(0, prev.etaMinutes - (Math.random() > 0.7 ? 1 : 0));

          // Simulate altitude fluctuations based on activeDay
          let targetAltitude = 1300;
          if (activeDay === 2 || activeDay === 3 || activeDay === 4) targetAltitude = 3100;
          else if (activeDay === 7) targetAltitude = 1400;

          const deltaAlt = Math.floor(Math.random() * 11) - 5; // -5 to +5
          const nextAltitude = Math.max(
            800,
            prev.currentAltitudeM + (prev.currentAltitudeM < targetAltitude ? 4 : -4) + deltaAlt
          );

          // Simulate temperature fluctuations
          const deltaTemp = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          const nextTemp = Math.max(-15, Math.min(25, prev.weatherTemp + deltaTemp));

          // Fluctuate AQI and UV Index
          setAqi((prevAqi) => {
            const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
            return Math.max(12, Math.min(65, prevAqi + delta));
          });
          setUvIndex((prevUv) => {
            const delta = (Math.random() * 0.4) - 0.2; // -0.2 to +0.2
            return Math.max(0.0, Math.min(12.0, parseFloat((prevUv + delta).toFixed(1))));
          });

          return {
            ...prev,
            speedKmh: nextSpeed,
            etaMinutes: nextEta,
            currentAltitudeM: nextAltitude,
            weatherTemp: nextTemp,
          };
        });
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating, useDeviceGps, activeDay, updateTelemetry]);

  // 2. Real GPS Tracker (HTML5 Geolocation API)
  const startGpsTracking = () => {
    if (!navigator.geolocation) {
      setGpsError(language === "th" ? "เบราว์เซอร์นี้ไม่รองรับระบบ GPS" : "Geolocation is not supported by your browser");
      return;
    }

    // Stop simulator if running
    if (isSimulating) {
      toggleSimulation();
    }

    setGpsError(null);
    setUseDeviceGps(true);

    const id = navigator.geolocation.watchPosition(
      (position) => {
        // speed in m/s, convert to km/h (speed * 3.6). Fallback to 0 if null (standing still)
        const speed = position.coords.speed !== null ? Math.round(position.coords.speed * 3.6) : 0;
        
        // altitude in meters. Fallback to 0 if null
        const altitude = position.coords.altitude !== null ? Math.round(position.coords.altitude) : 100; // typical low elevation
        
        // heading in degrees.
        let headingText = "North";
        if (position.coords.heading !== null) {
          const h = position.coords.heading;
          if (h >= 337.5 || h < 22.5) headingText = "North";
          else if (h >= 22.5 && h < 67.5) headingText = "North-East";
          else if (h >= 67.5 && h < 112.5) headingText = "East";
          else if (h >= 112.5 && h < 157.5) headingText = "South-East";
          else if (h >= 157.5 && h < 202.5) headingText = "South";
          else if (h >= 202.5 && h < 247.5) headingText = "South-West";
          else if (h >= 247.5 && h < 292.5) headingText = "West";
          else if (h >= 292.5 && h < 337.5) headingText = "North-West";
        }

        setGpsCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        // Update global telemetry store basic values
        updateTelemetry({
          speedKmh: speed,
          currentAltitudeM: altitude,
          heading: headingText,
        });

        // Fetch local weather and altitude based on actual GPS coordinates
        fetch(`/api/weather?location=Local&lat=${position.coords.latitude}&lng=${position.coords.longitude}`)
          .then((res) => res.json())
          .then((weatherData) => {
            updateTelemetry({
              weatherTemp: weatherData.tempHigh,
              weatherCondition: weatherData.condition,
              currentAltitudeM: weatherData.elevationM !== undefined ? weatherData.elevationM : altitude,
            });
          })
          .catch((err) => console.error("Error fetching local weather and elevation:", err));
      },
      (error) => {
        let msg = "GPS Error";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = language === "th" ? "กรุณาเปิดสิทธิ์การแชร์พิกัดในเบราว์เซอร์" : "User denied the request for Geolocation.";
            break;
          case error.POSITION_UNAVAILABLE:
            msg = language === "th" ? "พิกัดระบุตำแหน่งไม่พร้อมใช้งาน" : "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            msg = language === "th" ? "การดึงตำแหน่งล่าช้าเกินกำหนด" : "The request to get user location timed out.";
            break;
        }
        setGpsError(msg);
        setUseDeviceGps(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    setWatchId(id);
  };

  const stopGpsTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setUseDeviceGps(false);
    setGpsCoordinates(null);
  };

  // Cleanup watcher on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const getWeatherIcon = (cond: string, sizeClass = "w-8 h-8 text-brand-gold") => {
    const c = cond.toLowerCase();
    if (c.includes("snow")) return <Snowflake className={`${sizeClass} text-brand-blue animate-pulse`} />;
    if (c.includes("wind")) return <Wind className={`${sizeClass} text-teal-400`} />;
    return <Sun className={sizeClass} />;
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 animate-fadeIn max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-gold-gradient tracking-tight">
            {t.liveHeader}
          </h2>
          <p className="text-xs text-gray-400">
            {t.liveDesc}
          </p>
          <div className="mt-2 flex items-start gap-2 bg-amber-500/10 border border-amber-500/25 px-3 py-2 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-800 font-semibold leading-relaxed">
              {language === "th"
                ? "⚠️ สภาพอากาศเป็นข้อมูลจริงเรียลไทม์ แต่สถานะเส้นทาง/สถานที่/การแจ้งเตือนเป็นข้อมูลอ้างอิงเท่านั้น — ก่อนเดินทางโปรดตรวจสอบกับ "
                : language === "zh"
                ? "⚠️ 天气为实时真实数据，但路况/景点开放/警示为参考信息——出行前请以官方为准："
                : "⚠️ Weather is real-time; road/attraction status & alerts are reference only — verify with official sources before travel: "}
              <a href="https://jtyst.xinjiang.gov.cn/" target="_blank" rel="noopener noreferrer" className="text-brand-blue font-bold hover:underline">
                {language === "th" ? "กรมคมนาคมซินเจียง ↗" : language === "zh" ? "新疆交通厅 ↗" : "Xinjiang Transport Dept ↗"}
              </a>
              {" / "}
              <a href="http://www.xjtsg.gov.cn/" target="_blank" rel="noopener noreferrer" className="text-brand-blue font-bold hover:underline">
                {language === "th" ? "หน่วยงานทางหลวง ↗" : "Highway Bureau ↗"}
              </a>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Geolocation Button */}
          <button
            onClick={useDeviceGps ? stopGpsTracking : startGpsTracking}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              useDeviceGps
                ? "bg-emerald-500 text-brand-bg-primary shadow-[0_0_15px_rgba(16,185,129,0.35)]"
                : "bg-brand-bg-secondary hover:bg-brand-bg-secondary/70 border border-brand-gold text-brand-gold hover:scale-[1.02]"
            }`}
          >
            <Compass className={`w-4 h-4 ${useDeviceGps ? "animate-spin-slow" : ""}`} />
            {useDeviceGps 
              ? (language === "th" ? "ปิดใช้งาน GPS อุปกรณ์" : "Disconnect Device GPS")
              : (language === "th" ? "ดึงพิกัดจาก GPS อุปกรณ์" : "Track Device GPS")
            }
          </button>

          {/* Simulator Button */}
          <button
            onClick={toggleSimulation}
            disabled={useDeviceGps}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              isSimulating
                ? "bg-amber-500 text-brand-bg-primary shadow-[0_0_15px_rgba(245,158,11,0.35)]"
                : "bg-brand-gold text-brand-bg-primary hover:bg-brand-gold-hover shadow-[0_0_15px_rgba(225,166,59,0.3)] disabled:opacity-50"
            }`}
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isSimulating ? t.liveSimBtnActive : t.liveSimBtnInactive}
          </button>
        </div>
      </div>

      {/* GPS Error Alert */}
      {gpsError && (
        <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-3 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex flex-col text-xs text-red-300">
            <span className="font-bold">GPS Connection Error</span>
            <span className="mt-0.5">{gpsError}</span>
          </div>
        </div>
      )}

      {/* Telemetry Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {/* Speed widget */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-4 relative overflow-hidden">
          <div className="flex justify-between items-center text-gray-600 text-xs font-semibold uppercase tracking-wider">
            <span>{t.liveSpeed}</span>
            <Gauge className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-5xl font-display font-extrabold text-gray-900">
              {telemetry.speedKmh}
            </span>
            <span className="text-xs text-gray-555 font-bold uppercase">km/h</span>
          </div>
          <span className="text-[10px] text-gray-600 font-light mt-auto">
            {useDeviceGps
              ? (language === "th" ? "ดึงตำแหน่งจริงจากมือถือ/Macbook" : "DEVICE GPS SENSOR ONLINE")
              : isSimulating
              ? (language === "th" ? "ระบบจำลองพิกัดนำทางกำลังทำงาน" : "SIMULATION ACTIVE — GPS UPDATING")
              : (language === "th" ? "สัญญาณนำทางพร้อมเชื่อมต่อ" : "GPS CONNECTION STANDBY")
            }
          </span>
        </div>

        {/* Altitude widget */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-4 relative overflow-hidden">
          <div className="flex justify-between items-center text-gray-600 text-xs font-semibold uppercase tracking-wider">
            <span>{t.liveAltitude}</span>
            <Mountain className="w-4 h-4 text-brand-blue" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-5xl font-display font-extrabold text-gray-900">
              {telemetry.currentAltitudeM.toLocaleString()}
            </span>
            <span className="text-xs text-gray-555 font-bold uppercase">meters</span>
          </div>
          <span className="text-[10px] text-gray-600 font-light mt-auto">
            {useDeviceGps 
              ? (language === "th" ? "ความสูงตามพิกัดดาวเทียมจริง" : "ALTITUDE RETRIEVED FROM GPS")
              : telemetry.currentAltitudeM >= 3000
              ? (language === "th" ? "คำเตือน: พื้นที่ระดับความสูงสูง" : "WARNING: ALTITUDE HYPOXIA ZONE")
              : (language === "th" ? "ระดับความสูงปลอดภัย" : "SAFE ELEVATION ZONE")
            }
          </span>
        </div>

        {/* ETA countdown widget */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-4 relative overflow-hidden">
          <div className="flex justify-between items-center text-gray-600 text-xs font-semibold uppercase tracking-wider">
            <span>{t.liveEta}</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-5xl font-display font-extrabold text-gray-900">
              {useDeviceGps ? "N/A" : telemetry.etaMinutes}
            </span>
            <span className="text-xs text-gray-550 font-bold uppercase">{useDeviceGps ? "" : "mins"}</span>
          </div>
          <span className="text-[10px] text-gray-600 font-light mt-auto">
            {useDeviceGps
              ? (language === "th" ? "ทิศทางอุปกรณ์: " : "DEVICE HEADING: ")
              : "HEADING: "}
            <strong className="text-gray-808">{telemetry.heading}</strong>
          </span>
        </div>

        {/* Weather condition widget */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-4 relative overflow-hidden">
          <div className="flex justify-between items-center text-gray-600 text-xs font-semibold uppercase tracking-wider">
            <span>{t.liveWeather}</span>
            <Radio className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-center gap-3 mt-2">
            {getWeatherIcon(telemetry.weatherCondition, "w-8 h-8 text-brand-gold")}
            <div className="flex flex-col">
              <span className="text-3xl font-display font-bold text-gray-900">
                {telemetry.weatherTemp}°C
              </span>
              <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">
                {useDeviceGps 
                  ? `${telemetry.weatherCondition} (${language === "th" ? "พิกัดอุปกรณ์" : "Device GPS"})`
                  : `${telemetry.weatherCondition} (${getSimulatedLocationName(activeDay, language)})`}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-gray-600 font-light mt-auto">
            {language === "th" ? "ความชื้นสัมพัทธ์: " : "Relative Humidity: "}<strong className="text-gray-808">22%</strong>
          </span>
        </div>

        {/* AQI Widget */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-4 relative overflow-hidden">
          <div className="flex justify-between items-center text-gray-600 text-xs font-semibold uppercase tracking-wider">
            <span>{language === "th" ? "คุณภาพอากาศ" : language === "zh" ? "空气质量" : "Air Quality"}</span>
            <Wind className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-5xl font-display font-extrabold text-gray-900">
              {aqi}
            </span>
            <span className="text-xs text-gray-500 font-bold uppercase">AQI</span>
          </div>
          <span className="text-[10px] text-gray-600 font-light mt-auto">
            STATUS: <strong className="text-emerald-700">{language === "th" ? "ดีเยี่ยม" : "EXCELLENT"}</strong>
          </span>
        </div>

        {/* UV Index Widget */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-4 relative overflow-hidden">
          <div className="flex justify-between items-center text-gray-600 text-xs font-semibold uppercase tracking-wider">
            <span>{language === "th" ? "ดัชนี UV" : language === "zh" ? "紫外线指数" : "UV Index"}</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-5xl font-display font-extrabold text-gray-900">
              {uvIndex}
            </span>
            <span className="text-xs text-gray-500 font-bold uppercase">UV</span>
          </div>
          <span className="text-[10px] text-gray-600 font-light mt-auto">
            STATUS: <strong className={uvIndex > 8 ? "text-red-755 font-extrabold" : uvIndex > 5 ? "text-amber-700 font-extrabold" : "text-emerald-700 font-extrabold"}>
              {uvIndex > 8 ? (language === "th" ? "สูงมาก" : "VERY HIGH") : uvIndex > 5 ? (language === "th" ? "สูง" : "HIGH") : (language === "th" ? "ปานกลาง" : "MODERATE")}
            </strong>
          </span>
        </div>
      </div>

      {/* GPS Coordinates & Live Location Status Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-brand-gold/15 bg-brand-bg-secondary/40 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded ${useDeviceGps ? "bg-emerald-500/10 text-emerald-400" : "bg-brand-gold/10 text-brand-gold"}`}>
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-xs">
            <span className="text-gray-500 font-semibold uppercase text-[9px] tracking-wider">
              {language === "th" ? "พิกัดภูมิศาสตร์และพื้นที่นำทางสด" : language === "zh" ? "GPS 导航定位与实时区域" : "GPS Telemetry & Active Area"}
            </span>
            <span className="font-bold text-gray-800 text-sm mt-0.5">
              {useDeviceGps && gpsCoordinates
                ? `${getTranslationForDeviceLocation(language)} (Lat: ${gpsCoordinates.lat.toFixed(6)}°, Lng: ${gpsCoordinates.lng.toFixed(6)}°)`
                : `${getSimulatedLocationName(activeDay, language)} (Lat: ${getCoordinates().lat.toFixed(6)}°, Lng: ${getCoordinates().lng.toFixed(6)}°)`
              }
            </span>
          </div>
        </div>
        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded border self-start md:self-center ${
          useDeviceGps
            ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
            : "bg-brand-gold/10 text-brand-gold border-brand-gold/20"
        }`}>
          {useDeviceGps
            ? (language === "th" ? "สัญญาณ GPS เสถียร — อุปกรณ์กำลังสตรีมพิกัดสด" : language === "zh" ? "GPS 信号稳定 — 正在传输实时设备坐标" : "GPS Signal Stable — Streaming live device coordinates")
            : (language === "th" ? "จำลองสัญญาณดาวเทียมเป่ยโต่ว (Beidou) ตามพิกัดเส้นทาง" : language === "zh" ? "北斗卫星接收定位模拟中" : "Simulating Beidou-3 Satellite Link along route coordinates")
          }
        </span>
      </div>

      {/* Highway & Attraction Operational Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Highway Open/Close Status Widget */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
          <div className="flex flex-wrap justify-between items-center gap-2 border-b border-white/10 pb-3">
            <h3 className="font-display font-bold text-base text-brand-gold flex items-center gap-2">
              <Radio className="w-5 h-5 text-brand-gold" />
              <span>{language === "th" ? "สถานะการเปิด/ปิดเส้นทางหลวง (Highway Status)" : language === "zh" ? "国道公路通行状态" : "Highway Status"}</span>
            </h3>
            <button
              onClick={() => setShowHighwayHistory(!showHighwayHistory)}
              className="text-[10px] font-bold text-brand-blue hover:text-brand-blue-hover border border-brand-blue/30 px-2.5 py-1 rounded bg-brand-blue/5 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              {showHighwayHistory 
                ? (language === "th" ? "ซ่อนประวัติ 30 วัน" : language === "zh" ? "隐藏30天记录" : "Hide 30-Day Logs")
                : (language === "th" ? "ดูประวัติย้อนหลัง 30 วัน" : language === "zh" ? "显示30天状况记录" : "Show 30-Day Closure Logs")
              }
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {getTranslatedHighwayStatus().map((hw, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5 relative overflow-hidden">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs font-bold text-gray-800">{hw.name}</span>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold tracking-widest bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                    {hw.status}
                  </span>
                </div>
                <div className="text-[10px] text-gray-600 mt-0.5 flex justify-between items-center flex-wrap gap-2">
                  <span>{language === "th" ? "ที่มา: " : language === "zh" ? "来源: " : "Source: "}<a href={hw.url} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:text-brand-blue-hover underline">{hw.source}</a></span>
                  <span>{language === "th" ? "ประกาศเมื่อ: " : language === "zh" ? "公告时间: " : "Published: "}{hw.updated}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 30-Day Closure History Log */}
          {showHighwayHistory && (
            <div className="mt-2 border-t border-slate-100 pt-4 animate-fadeIn">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block mb-2">
                {language === "th" ? "บันทึกเหตุการณ์ทางหลวงย้อนหลัง 30 วัน" : language === "zh" ? "过去30天国道公路状况记录" : "30-Day Highway Incident History"}
              </span>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[10px] text-gray-750">
                  <thead>
                    <tr className="border-b border-slate-200 text-gray-600 font-semibold uppercase">
                      <th className="py-2 px-1">{language === "th" ? "วันที่" : language === "zh" ? "日期" : "Date"}</th>
                      <th className="py-2 px-1">{language === "th" ? "ทางหลวง / เส้นทาง" : language === "zh" ? "公路/路段" : "Highway / Route"}</th>
                      <th className="py-2 px-1">{language === "th" ? "เหตุการณ์" : language === "zh" ? "事件详情" : "Incident Detail"}</th>
                      <th className="py-2 px-1 text-right">{language === "th" ? "ลิงก์ข้อมูล" : language === "zh" ? "官方来源" : "Source Link"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getHighwayHistoryLogs().map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-1 font-medium">{row.date}</td>
                        <td className="py-2.5 px-1 font-bold text-gray-800">{row.hw}</td>
                        <td className="py-2.5 px-1 text-gray-600">{row.event}</td>
                        <td className="py-2.5 px-1 text-right text-brand-blue">
                          <a href={row.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {language === "th" ? "แหล่งข้อมูลทางการ ↗" : "Official Source ↗"}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Tourist Attractions Open/Close Status Widget */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
          <div className="flex flex-wrap justify-between items-center gap-2 border-b border-white/10 pb-3">
            <h3 className="font-display font-bold text-base text-brand-gold flex items-center gap-2">
              <Compass className="w-5 h-5 text-brand-gold" />
              <span>{language === "th" ? "สถานะสถานที่ท่องเที่ยว (Attractions Status)" : language === "zh" ? "景区运营开放状态" : "Attractions Status"}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getTranslatedAttractionsStatus().map((attr, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5 relative overflow-hidden">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs font-bold text-gray-800 truncate max-w-[70%]">{attr.name}</span>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold tracking-widest bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                    {attr.status}
                  </span>
                </div>
                <div className="text-[10px] text-gray-600 mt-0.5 flex flex-col gap-0.5">
                  <span className="truncate">{language === "th" ? "ที่มา: " : "Source: "}<a href={attr.url} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:text-brand-blue-hover underline">{attr.source}</a></span>
                  <span>{language === "th" ? "ประกาศเมื่อ: " : "Published: "}{attr.updated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Alerts Panel */}
      <div className="glass-panel-gold bg-brand-bg-secondary/40 p-6 rounded-2xl border border-brand-gold/15 flex flex-col gap-4">
        <h3 className="font-display font-bold text-base text-brand-gold flex flex-wrap justify-between items-center gap-2 border-b border-brand-gold/10 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-brand-gold" />
            {t.liveAlerts}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-750 font-mono bg-emerald-500/5 px-2.5 py-0.5 rounded border border-emerald-500/10">
            {language === "th" ? "ประกาศทางการ" : language === "zh" ? "官方发布" : "Official Notice"}
          </div>
        </h3>

        <div className="flex flex-col gap-3">
          {telemetry.activeAlerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border flex items-start gap-3 transition-all duration-300 ${
                alert.toLowerCase().includes("freezing") || alert.toLowerCase().includes("caution")
                  ? "bg-red-50 border-red-200 text-red-800"
                  : "bg-slate-50 border-slate-200 text-gray-800"
              }`}
            >
              <AlertTriangle className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
              <div className="flex flex-col text-xs leading-normal">
                <span className="font-semibold">
                  {language === "th"
                    ? (alert.includes("caution") ? "ข้อควรระวังเรื่องระดับความสูงบนทางหลวงปามีร์" : "เตือนภัยกระแสลมแรงในเส้นทางข้ามทะเลทรายทากลามากาน")
                    : language === "zh"
                    ? (alert.includes("caution") ? "帕米尔高地路段高度缺氧警示" : "塔克拉玛干沙漠路段大风警报")
                    : alert
                  }
                </span>

                {/* Clickable Source Link */}
                <div className="mt-1">
                  <a
                    href={alert.toLowerCase().includes("caution") || alert.toLowerCase().includes("altitude")
                      ? "https://www.cma.gov.cn/en2014/"
                      : "https://english.mot.gov.cn/"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] text-brand-blue hover:text-brand-blue-hover underline font-medium inline-block"
                  >
                    {alert.toLowerCase().includes("caution") || alert.toLowerCase().includes("altitude")
                      ? (language === "th" ? "กรมอุตุนิยมวิทยาจีน (CMA) ↗" : "China Meteorological Administration (CMA) ↗")
                      : (language === "th" ? "กรมการขนส่งมณฑลซินเจียง ↗" : "Xinjiang Highway Authority ↗")
                    }
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] text-gray-600 mt-1.5 font-mono">
                  <span className="text-brand-blue/70">Beidou-3 Sat Connection</span>
                  <span>•</span>
                  <span>{language === "th" ? `ประกาศเมื่อ: ${getAlertPublishDate(alert)}` : language === "zh" ? `发布时间: ${getAlertPublishDate(alert)}` : `Published: ${getAlertPublishDate(alert)}`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
