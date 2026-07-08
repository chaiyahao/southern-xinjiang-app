"use client";

import React, { useState, useEffect } from "react";
import { useTravelStore } from "../store/useTravelStore";
import { ActiveTab, Language } from "../types";
import { TRANSLATIONS_DATA } from "../data/translations";
import {
  LayoutDashboard,
  Calendar,
  Map,
  Hotel,
  Coins,
  PlaneTakeoff,
  Radio,
  Headphones,
  Compass,
  Link2,
  RefreshCw,
  Languages,
  Clock,
  Users,
  Route
} from "lucide-react";

interface NavItem {
  id: ActiveTab;
  icon: React.ComponentType<{ className?: string }>;
}

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    supabaseSyncStatus,
    triggerSupabaseSync,
    language,
    setLanguage,
  } = useTravelStore();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute timezone offsets (independent of user system timezone)
  // Xinjiang uses Beijing Time (UTC+8) officially — same clock as the rest of China
  const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
  const bangkokTime = new Date(utc + (3600000 * 7));
  const beijingTime = new Date(utc + (3600000 * 8));

  const formatClock = (d: Date) => {
    return d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
  };

  const departureDate = new Date("2026-10-29T00:30:00+07:00");
  const diffTime = departureDate.getTime() - currentTime.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const t = TRANSLATIONS_DATA[language].ui;

  const navItems: NavItem[] = [
    { id: "overview", icon: LayoutDashboard },
    { id: "timeline", icon: Route },
    { id: "itinerary", icon: Calendar },
    { id: "attractions", icon: Compass },
    { id: "map", icon: Map },
    { id: "phrasebook", icon: Languages },
    { id: "schedule", icon: Clock },
    { id: "hotels", icon: Hotel },
    { id: "budget", icon: Coins },
    { id: "flights", icon: PlaneTakeoff },
    { id: "travelers", icon: Users },
    { id: "live", icon: Radio },
    { id: "support", icon: Headphones },
  ];

  const getLabel = (id: ActiveTab) => {
    switch (id) {
      case "overview":
        return t.overview;
      case "itinerary":
        return t.itinerary;
      case "schedule":
        return t.schedule;
      case "map":
        return t.map;
      case "hotels":
        return t.hotels;
      case "budget":
        return t.budget;
      case "flights":
        return t.flights;
      case "phrasebook":
        return language === "th" ? "คลังภาษา" : language === "zh" ? "旅行常用语" : "Phrasebook";
      case "travelers":
        return language === "th" ? "ผู้ร่วมทริป" : language === "zh" ? "同行旅客" : "Travelers";
      case "live":
        return t.live;
      case "support":
        return t.support;
      case "timeline":
        return language === "th" ? "ไทม์ไลน์" : language === "zh" ? "全行程时间线" : "Trip Timeline";
      case "attractions":
        return language === "th" ? "เที่ยว & กิน" : language === "zh" ? "景点与美食" : "Explore & Dine";
      default:
        return id;
    }
  };

  return (
    <aside className="w-full lg:w-80 flex flex-col glass-panel-gold border-r border-brand-gold/15 bg-brand-bg-secondary/75 text-gray-800">
      {/* Branding Info */}
      <div className="p-6 border-b border-brand-gold/15 flex flex-col gap-2 relative overflow-hidden">
        {/* Subtle decorative gold glow */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl animate-pulse-gold"></div>
        <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-brand-blue/5 rounded-full blur-xl"></div>

        <div className="flex items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-brand-gold animate-spin-slow" />
            <h1 className="font-display font-bold text-lg tracking-wider text-gold-gradient">
              {t.title}
            </h1>
          </div>

          {/* Inline Language Selector */}
          <div className="flex items-center gap-1.5 bg-brand-bg-primary/75 p-0.5 rounded border border-gray-300 shadow-sm">
            {(["en", "th", "zh"] as const).map((lang) => {
              const flagMap = { en: "🇺🇸", th: "🇹🇭", zh: "🇨🇳" };
              return (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`p-1 rounded text-sm font-bold uppercase transition-all duration-300 flex items-center justify-center cursor-pointer hover:scale-110 ${
                    language === lang
                      ? "bg-brand-gold text-brand-bg-primary shadow scale-105 border border-brand-gold/15"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  title={lang.toUpperCase()}
                >
                  <span className="leading-none">{flagMap[lang]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-[10px] text-brand-blue font-semibold tracking-widest uppercase">
          {t.subtitle}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-700 bg-brand-bg-primary/60 py-1.5 px-3 rounded border border-gray-300">
          <span className="font-semibold">29 OCT — 7 NOV 2026</span>
          <span className="text-[10px] text-brand-gold px-1.5 py-0.5 rounded bg-brand-gold/10 border border-brand-gold/20 font-extrabold uppercase">
            {t.days}
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 relative group cursor-pointer ${
                isActive
                  ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/25 shadow-[0_4px_12px_rgba(150,114,35,0.06)]"
                  : "text-gray-700 hover:text-brand-gold hover:bg-brand-gold/5 border border-transparent"
              }`}
            >
              {/* Highlight active left border indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand-gold rounded-r"></div>
              )}
              <Icon
                className={`w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? "text-brand-gold" : "text-gray-600 group-hover:text-brand-blue"
                }`}
              />
              <span>{getLabel(item.id)}</span>
            </button>
          );
        })}
      </nav>

      {/* Timezone Hub & Countdown Widget */}
      <div className="px-5 py-4 border-t border-brand-gold/10 flex flex-col gap-2.5 bg-brand-bg-primary/10">
        <div className="flex items-center gap-1.5 border-b border-brand-gold/5 pb-1">
          <Clock className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
          <span className="text-[10px] font-extrabold text-gray-700 uppercase tracking-widest">
            {language === "th" ? "นาฬิกา • นับถอยหลังตะลุยซินเจียง" : language === "zh" ? "时区 · 出发倒计时" : "Clocks • Departure Countdown"}
          </span>
        </div>

        {/* Timezones */}
        <div className="grid grid-cols-2 gap-2 text-center text-[10px] leading-tight">
          <div className="bg-brand-bg-secondary p-1.5 rounded border border-gray-300">
            <span className="text-gray-700 block font-bold text-[8px]">BKK · TH</span>
            <strong className="text-gray-800 font-display block mt-0.5 text-xs">{formatClock(bangkokTime)}</strong>
          </div>
          <div className="bg-brand-gold/10 p-1.5 rounded border border-brand-gold/25">
            <span className="text-brand-gold block font-bold text-[8px]">จีน · รวมซินเจียง</span>
            <strong className="text-gray-800 font-display block mt-0.5 text-xs">{formatClock(beijingTime)}</strong>
          </div>
        </div>

        {/* Countdown */}
        <div className="bg-brand-gold/5 border border-brand-gold/20 p-2 rounded-lg text-center text-xs">
          {daysLeft > 0 ? (
            <span className="font-extrabold text-brand-gold">
              🚀 {daysLeft} {language === "th" ? "วันจะออกเดินทาง" : language === "zh" ? "天后出发" : "Days until Departure"}
            </span>
          ) : daysLeft === 0 ? (
            <span className="font-extrabold text-emerald-600 animate-pulse">
              ✈️ {language === "th" ? "วันนี้วันออกเดินทาง!" : language === "zh" ? "今天出发！" : "Departure Day Today!"}
            </span>
          ) : (
            <span className="font-extrabold text-gray-800">
              🌍 {language === "th" ? "ทริปกำลังดำเนินการ / สิ้นสุดแล้ว" : language === "zh" ? "旅程进行中/已结束" : "Trip Active / Completed"}
            </span>
          )}
        </div>
      </div>

      {/* Supabase Status Sync Indicator Footer */}
      <div className="p-4 border-t border-brand-gold/10 bg-brand-bg-primary/25 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-gray-700 flex items-center gap-1 font-bold">
            <Link2 className="w-3 h-3 text-brand-blue" />
            Cloud State
          </span>
          <span
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
              supabaseSyncStatus === "connected"
                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                : supabaseSyncStatus === "syncing"
                ? "bg-brand-blue/10 text-brand-blue border border-brand-blue/20"
                : "bg-red-500/10 text-red-600 border border-red-500/20"
            }`}
          >
            {supabaseSyncStatus === "connected" && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            )}
            {supabaseSyncStatus === "syncing" && (
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            )}
            {supabaseSyncStatus}
          </span>
        </div>
        <button
          onClick={triggerSupabaseSync}
          disabled={supabaseSyncStatus === "syncing"}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-brand-bg-secondary hover:bg-brand-bg-primary/30 border border-brand-gold/25 hover:border-brand-gold text-brand-gold hover:text-brand-gold-hover text-[11px] font-bold tracking-wider transition-all duration-300 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw
            className={`w-3 h-3 ${supabaseSyncStatus === "syncing" ? "animate-spin" : ""}`}
          />
          Sync Cloud Data
        </button>
      </div>
    </aside>
  );
}
