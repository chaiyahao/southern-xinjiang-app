"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Navigation, ExternalLink, Loader2, Crosshair } from "lucide-react";

interface MiniMapProps {
  // Place name + coordinates (lat,lng) for Google Maps embed
  name: string;
  lat?: number;
  lng?: number;
  // Amap query (URL-encoded Chinese works best)
  amapQuery?: string;
  googleQuery?: string;
  language: "en" | "th" | "zh";
}

interface NominatimResult {
  lat: string;
  lon: string;
}

/**
 * MiniMap — embeds a live preview map (Amap by default, Google toggle)
 * + shows realtime GPS distance from the user's current location.
 * No login required for either map preview.
 */
export default function MiniMap({ name, lat, lng, amapQuery, googleQuery, language }: MiniMapProps) {
  const [provider, setProvider] = useState<"osm" | "google" | "amap">("osm");
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [autoTried, setAutoTried] = useState(false);
  const [resolvedLat, setResolvedLat] = useState<number | null>(null);
  const [resolvedLng, setResolvedLng] = useState<number | null>(null);
  const [geocodeState, setGeocodeState] = useState<"idle" | "loading" | "ready" | "failed">("idle");

  const th = language === "th";
  const zh = language === "zh";
  const L = (thStr: string, enStr: string, zhStr: string) => (th ? thStr : zh ? zhStr : enStr);

  const isReliableXinjiangCoordinate = (latValue: number, lngValue: number) => {
    return Number.isFinite(latValue) && Number.isFinite(lngValue) && latValue >= 34 && latValue <= 49.5 && lngValue >= 73 && lngValue <= 96;
  };

  const normalizedAmapQuery = (() => {
    if (!amapQuery) return "";
    if (!/^https?:\/\//i.test(amapQuery)) return amapQuery;
    try {
      const url = new URL(amapQuery);
      return url.searchParams.get("query") || url.searchParams.get("q") || amapQuery;
    } catch {
      return amapQuery;
    }
  })();

  const searchQuery = [googleQuery, normalizedAmapQuery, name].filter(Boolean).join(" ");
  const hasExplicitCoordinates = typeof lat === "number" && typeof lng === "number" && isReliableXinjiangCoordinate(lat, lng);
  const mapLat = hasExplicitCoordinates ? lat : resolvedLat;
  const mapLng = hasExplicitCoordinates ? lng : resolvedLng;
  const hasVerifiedCoordinates = typeof mapLat === "number" && typeof mapLng === "number" && isReliableXinjiangCoordinate(mapLat, mapLng);

  useEffect(() => {
    if (hasExplicitCoordinates) {
      setResolvedLat(lat ?? null);
      setResolvedLng(lng ?? null);
      setGeocodeState("ready");
      return;
    }

    if (!searchQuery) {
      setResolvedLat(null);
      setResolvedLng(null);
      setGeocodeState("failed");
      return;
    }

    const controller = new AbortController();
    const runLookup = async () => {
      setGeocodeState("loading");
      try {
        const params = new URLSearchParams({
          format: "jsonv2",
          limit: "3",
          addressdetails: "1",
          "accept-language": "en",
          countrycodes: "cn",
          bounded: "1",
          viewbox: "73,49.5,96,34",
          q: searchQuery,
        });

        const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
          headers: { "Accept-Language": "en" },
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("geocode failed");

        const data: NominatimResult[] = await response.json();
        const match = data.find((item) => {
          const itemLat = Number.parseFloat(item.lat);
          const itemLng = Number.parseFloat(item.lon);
          return Number.isFinite(itemLat) && Number.isFinite(itemLng) && isReliableXinjiangCoordinate(itemLat, itemLng);
        });

        if (match) {
          setResolvedLat(Number.parseFloat(match.lat));
          setResolvedLng(Number.parseFloat(match.lon));
          setGeocodeState("ready");
        } else {
          setResolvedLat(null);
          setResolvedLng(null);
          setGeocodeState("failed");
        }
      } catch {
        setResolvedLat(null);
        setResolvedLng(null);
        setGeocodeState("failed");
      }
    };

    runLookup();
    return () => controller.abort();
  }, [amapQuery, googleQuery, hasExplicitCoordinates, lat, lng, name, searchQuery]);

  // Compute realtime distance whenever we have both positions
  useEffect(() => {
    if (userPos && typeof mapLat === "number" && typeof mapLng === "number") {
      const unitMeters = language === "th" ? "ม." : language === "zh" ? "米" : "m";
      const unitKm = language === "th" ? "กม." : language === "zh" ? "公里" : "km";
      const unitMin = language === "th" ? "นาที" : language === "zh" ? "分钟" : "min";
      const driveLabel = language === "th" ? "(ขับรถ)" : language === "zh" ? "(车程)" : "(drive)";
      const R = 6371; // km
      const dLat = ((mapLat - userPos.lat) * Math.PI) / 180;
      const dLng = ((mapLng - userPos.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((userPos.lat * Math.PI) / 180) *
          Math.cos((mapLat * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const km = R * c;
      const thb = km < 1 ? `${Math.round(km * 1000)} ${unitMeters}` : `${km.toFixed(1)} ${unitKm}`;
      // rough drive time ~ km / 40 (mixed city/highway)
      const mins = Math.max(1, Math.round(km / 40));
      setDistance(`${thb} • ~${mins} ${unitMin} ${driveLabel}`);
    } else {
      setDistance(null);
    }
  }, [userPos, mapLat, mapLng, language]);

  const locate = () => {
    if (!navigator.geolocation) {
      setGeoError(L("เบราว์เซอร์ไม่รองรับ GPS", "GPS not supported", "浏览器不支持定位"));
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      (err) => {
        setGeoError(
          err.code === err.PERMISSION_DENIED
            ? L("อนุญาตเข้าถึงตำแหน่งในเบราว์เซอร์ก่อน (ดูไอคอนล็อกในแอดเดรสบาร์)", "Please allow location access (see lock icon in address bar)", "请先允许浏览器定位（地址栏锁形图标）")
            : L("หาตำแหน่งไม่ได้ ลองอีกครั้ง", "Could not get location, try again", "无法获取位置，请重试")
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Try to auto-locate once on mount (non-blocking, silent on failure)
  useEffect(() => {
    if (autoTried || !navigator.geolocation) return;
    setAutoTried(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}, // silent fail — user can press the button manually
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, [autoTried]);

  // Amap embed (web preview — works without login)
  const amapEmbed = `https://www.amap.com/search?query=${encodeURIComponent(normalizedAmapQuery || name)}&src=tripapp`;
  const amapSearchUrl = amapEmbed;

  const safeLat = typeof mapLat === "number" ? mapLat : null;
  const safeLng = typeof mapLng === "number" ? mapLng : null;
  const hasSearchFallback = Boolean((normalizedAmapQuery || googleQuery || name).trim());

  // OpenStreetMap embed with a verified pin
  const osmEmbed = safeLat !== null && safeLng !== null
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${(safeLng - 0.01).toFixed(6)},${(safeLat - 0.01).toFixed(6)},${(safeLng + 0.01).toFixed(6)},${(safeLat + 0.01).toFixed(6)}&layer=mapnik&marker=${safeLat.toFixed(6)},${safeLng.toFixed(6)}`
    : "";
  const osmSearchUrl = safeLat !== null && safeLng !== null
    ? `https://www.openstreetmap.org/?mlat=${safeLat.toFixed(6)}&mlon=${safeLng.toFixed(6)}#map=14/${safeLat.toFixed(6)}/${safeLng.toFixed(6)}`
    : "";

  // Google Maps embed (default)
  const googleEmbed = `https://maps.google.com/maps?q=${encodeURIComponent((safeLat !== null && safeLng !== null) ? `${safeLat},${safeLng}` : (googleQuery || name))}&z=14&output=embed`;
  const googleSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(googleQuery || name)}`;

  const currentEmbed = provider === "google" ? googleEmbed : provider === "amap" ? amapEmbed : osmEmbed;
  const currentLink = provider === "google" ? googleSearchUrl : provider === "amap" ? amapSearchUrl : osmSearchUrl;

  if (!hasVerifiedCoordinates && !hasSearchFallback) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-medium text-slate-600">
        {geocodeState === "loading"
          ? L("กำลังค้นหาตำแหน่งบนแผนที่…", "Looking up the place on the map…", "正在定位地图位置…")
          : L("แผนที่ไม่แสดง เพราะยังไม่มีพิกัดที่ตรวจสอบได้อย่างน่าเชื่อถือ", "Map hidden because no verified coordinates are available", "地图未显示，因为没有可靠的已验证坐标")}
      </div>
    );
  }

  if (!hasVerifiedCoordinates) {
    return (
      <div className="flex flex-col gap-2">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] font-medium text-amber-800">
          {L(
            "ยังยืนยันพิกัดเชิงตัวเลขไม่ได้ จึงแสดงผลเป็นแผนที่ค้นหาจากชื่อสถานที่ที่ตรวจสอบได้แทน",
            "Exact coordinates could not be independently verified, so this map is showing the verified place search result instead.",
            "暂未独立核验精确坐标，因此此处改为显示已核验地点名称的搜索结果地图。"
          )}
        </div>

        <div className="relative w-full rounded-xl overflow-hidden border border-gray-900/10 bg-slate-100" style={{ aspectRatio: "16/9" }}>
          <iframe
            src={amapEmbed}
            className="w-full h-full border-none"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${name} map search`}
            allowFullScreen
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <a
            href={amapSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-bold text-brand-gold hover:underline"
          >
            {L("เปิดใน Amap", "Open in Amap", "高德地图打开")}
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href={googleSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-bold text-brand-blue hover:underline"
          >
            {L("เปิดใน Google Maps", "Open in Google Maps", "谷歌地图打开")}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Map preview */}
      <div className="relative w-full rounded-xl overflow-hidden border border-gray-900/10 bg-slate-100" style={{ aspectRatio: "16/9" }}>
        <iframe
          key={provider}
          src={currentEmbed}
          className="w-full h-full border-none"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`${name} map`}
          allowFullScreen
        />
        {/* Provider toggle */}
        <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-white/95 backdrop-blur rounded-lg p-0.5 shadow border border-gray-200">
          {(["osm", "google", "amap"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setProvider(p)}
              className={`px-2 py-1 rounded text-[9px] font-bold transition-all cursor-pointer ${
                provider === p ? "bg-brand-gold text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {p === "osm" ? "OSM" : p === "amap" ? "Amap" : "Google"}
            </button>
          ))}
        </div>
      </div>

      {/* Distance + open in app row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={locate}
          disabled={locating}
          className="flex items-center gap-1.5 text-[10px] font-bold text-brand-blue hover:underline cursor-pointer disabled:opacity-50"
        >
          {locating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Crosshair className="w-3 h-3" />}
          {L("หาระยะทางจากฉัน", "Distance from me", "距我多远")}
        </button>

        {distance && (
          <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <Navigation className="w-3 h-3" />
            {distance}
          </span>
        )}

        <a
          href={currentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] font-bold text-brand-gold hover:underline ml-auto"
        >
          {provider === "amap" ? L("เปิดใน Amap", "Open in Amap", "高德地图打开") : provider === "google" ? L("เปิดใน Google Maps", "Open in Google Maps", "谷歌地图打开") : L("เปิดใน OpenStreetMap", "Open in OpenStreetMap", "在 OpenStreetMap 中打开")}
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {geoError && (
        <p className="text-[9px] text-red-500 font-medium flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {geoError}
        </p>
      )}
    </div>
  );
}
