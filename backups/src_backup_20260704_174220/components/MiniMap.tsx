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

/**
 * MiniMap — embeds a live preview map (Amap by default, Google toggle)
 * + shows realtime GPS distance from the user's current location.
 * No login required for either map preview.
 */
export default function MiniMap({ name, lat, lng, amapQuery, googleQuery, language }: MiniMapProps) {
  const [provider, setProvider] = useState<"amap" | "google">("amap");
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const th = language === "th";
  const zh = language === "zh";
  const L = (thStr: string, enStr: string, zhStr: string) => (th ? thStr : zh ? zhStr : enStr);

  // Compute realtime distance whenever we have both positions
  useEffect(() => {
    if (userPos && typeof lat === "number" && typeof lng === "number") {
      const R = 6371; // km
      const dLat = ((lat - userPos.lat) * Math.PI) / 180;
      const dLng = ((lng - userPos.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((userPos.lat * Math.PI) / 180) *
          Math.cos((lat * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const km = R * c;
      const thb = km < 1 ? `${Math.round(km * 1000)} ${L("ม.", "m", "米")}` : `${km.toFixed(1)} ${L("กม.", "km", "公里")}`;
      // rough drive time ~ km / 40 (mixed city/highway)
      const mins = Math.max(1, Math.round(km / 40));
      setDistance(`${thb} • ~${mins} ${L("นาที", "min", "分钟")} ${L("(ขับรถ)", "(drive)", "(车程)")}`);
    } else {
      setDistance(null);
    }
  }, [userPos, lat, lng, language]);

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
            ? L("อนุญาตเข้าถึงตำแหน่งในเบราว์เซอร์ก่อน", "Please allow location access", "请先允许浏览器定位")
            : L("หาตำแหน่งไม่ได้", "Could not get location", "无法获取位置")
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Try to auto-locate once on mount (non-blocking)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}, // silent fail — user can press button
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 120000 }
      );
    }
  }, []);

  const amapEmbed = amapQuery
    ? `https://uri.amap.com/marker?position=${lng ?? ""},${lat ?? ""}&name=${encodeURIComponent(name)}&src=tripapp&coordinate=wgs84&callnative=0`
    : undefined;
  const amapSearchUrl = amapQuery
    ? `https://www.amap.com/search?query=${encodeURIComponent(amapQuery)}`
    : undefined;

  const googleEmbed = `https://www.google.com/maps?q=${encodeURIComponent(googleQuery || name)}${lat ? `&center=${lat},${lng}` : ""}&z=14&output=embed`;
  const googleSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(googleQuery || name)}`;

  const currentEmbed = provider === "amap" ? amapEmbed || googleEmbed : googleEmbed;
  const currentLink = provider === "amap" ? amapSearchUrl || googleSearchUrl : googleSearchUrl;

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
          {(["amap", "google"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setProvider(p)}
              className={`px-2 py-1 rounded text-[9px] font-bold transition-all cursor-pointer ${
                provider === p ? "bg-brand-gold text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {p === "amap" ? "Amap" : "Google"}
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
          {provider === "amap" ? L("เปิดใน Amap", "Open in Amap", "高德地图打开") : L("เปิดใน Google Maps", "Open in Google Maps", "谷歌地图打开")}
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
