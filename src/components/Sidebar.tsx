"use client";

import React from "react";
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

  const t = TRANSLATIONS_DATA[language].ui;

  const navItems: NavItem[] = [
    { id: "overview", icon: LayoutDashboard },
    { id: "itinerary", icon: Calendar },
    { id: "schedule", icon: Clock },
    { id: "map", icon: Map },
    { id: "hotels", icon: Hotel },
    { id: "budget", icon: Coins },
    { id: "flights", icon: PlaneTakeoff },
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
      case "live":
        return t.live;
      case "support":
        return t.support;
      default:
        return id;
    }
  };

  return (
    <aside className="w-full lg:w-80 flex flex-col glass-panel-gold border-r border-brand-gold/15 bg-brand-bg-secondary/75 text-gray-200">
      {/* Branding Info */}
      <div className="p-6 border-b border-brand-gold/15 flex flex-col gap-2 relative overflow-hidden">
        {/* Subtle decorative gold glow */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-brand-gold/10 rounded-full blur-2xl animate-pulse-gold"></div>
        <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-brand-blue/5 rounded-full blur-xl"></div>

        <div className="flex items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-brand-gold animate-spin-slow" />
            <h1 className="font-display font-bold text-lg tracking-wider text-gold-gradient">
              {t.title}
            </h1>
          </div>

          {/* Inline Language Selector */}
          <div className="flex items-center gap-1 bg-brand-bg-primary/70 p-0.5 rounded border border-white/5">
            <Languages className="w-3.5 h-3.5 text-brand-gold px-0.5" />
            {(["en", "th", "zh"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition-all duration-300 ${
                  language === lang
                    ? "bg-brand-gold text-brand-bg-primary shadow"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[10px] text-brand-blue font-semibold tracking-widest uppercase">
          {t.subtitle}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-400 bg-brand-bg-primary/50 py-1.5 px-3 rounded border border-white/5">
          <span className="font-medium">29 OCT — 7 NOV 2026</span>
          <span className="text-[10px] text-brand-gold px-1.5 py-0.5 rounded bg-brand-gold/10 border border-brand-gold/20 font-bold uppercase">
            {t.days}
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative group ${
                isActive
                  ? "bg-brand-gold/15 text-brand-gold border border-brand-gold/30 shadow-[0_0_15px_rgba(225,166,59,0.1)]"
                  : "text-gray-400 hover:text-gray-100 hover:bg-white/5 border border-transparent"
              }`}
            >
              {/* Highlight active left border indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand-gold rounded-r"></div>
              )}
              <Icon
                className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? "text-brand-gold" : "text-gray-400 group-hover:text-brand-blue"
                }`}
              />
              <span>{getLabel(item.id)}</span>
            </button>
          );
        })}
      </nav>

      {/* Supabase Status Sync Indicator Footer */}
      <div className="p-4 border-t border-brand-gold/10 bg-brand-bg-primary/45 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-brand-blue" />
            Supabase State
          </span>
          <span
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              supabaseSyncStatus === "connected"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : supabaseSyncStatus === "syncing"
                ? "bg-brand-blue/10 text-brand-blue border border-brand-blue/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {supabaseSyncStatus === "connected" && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
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
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded bg-brand-bg-secondary hover:bg-brand-bg-secondary/70 border border-brand-gold/25 hover:border-brand-gold text-brand-gold hover:text-brand-gold-hover text-xs font-semibold tracking-wider transition-all duration-300 disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${supabaseSyncStatus === "syncing" ? "animate-spin" : ""}`}
          />
          Sync Cloud Data
        </button>
      </div>
    </aside>
  );
}
