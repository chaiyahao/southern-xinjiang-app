"use client";

import React from "react";
import { useTravelStore } from "../store/useTravelStore";
import { ITINERARY_DATA } from "../data/travelData";
import { TRANSLATIONS_DATA } from "../data/translations";
import {
  CalendarDays,
  Compass,
  MapPin,
  Mountain,
  Sun,
  Coins,
  ArrowRight,
  Map,
} from "lucide-react";

export default function OverviewScreen() {
  const { activeDay, setActiveDay, setActiveTab, language } = useTravelStore();

  const t = TRANSLATIONS_DATA[language].ui;
  const tItinerary = TRANSLATIONS_DATA[language].itinerary;

  const rawDayData = ITINERARY_DATA[activeDay - 1];
  const localizedDay = tItinerary[activeDay];
  
  const currentDayData = {
    ...rawDayData,
    title: localizedDay.title,
    subtitle: localizedDay.subtitle,
    description: localizedDay.description,
    activities: localizedDay.activities,
    weather: {
      ...rawDayData.weather,
      forecast: localizedDay.weatherForecast,
    },
  };

  // Calculate total trip distance and max altitude
  const totalDistance = ITINERARY_DATA.reduce((acc, curr) => acc + curr.distanceKm, 0);
  const maxAltitude = Math.max(...ITINERARY_DATA.map((d) => d.maxElevationM));

  const stats = [
    {
      label: t.itinerary,
      value: t.days,
      sub: "29 Oct - 7 Nov 2026",
      icon: CalendarDays,
      color: "text-brand-gold bg-brand-gold/10 border-brand-gold/20",
    },
    {
      label: t.totalDistance,
      value: `${totalDistance} km`,
      sub: "Oasis & Highway",
      icon: Compass,
      color: "text-brand-blue bg-brand-blue/10 border-brand-blue/20",
    },
    {
      label: t.maxElevation,
      value: `${maxAltitude} m`,
      sub: "Pamir Plateau Pass",
      icon: Mountain,
      color: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    },
    {
      label: t.luxuryCost,
      value: "35,225 THB",
      sub: "All-inclusive per person",
      icon: Coins,
      color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 animate-fadeIn max-w-7xl mx-auto w-full">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden glass-panel border border-brand-gold/20 min-h-[300px] flex flex-col justify-end p-6 lg:p-10">
        {/* Dynamic Dark Luxury Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg-primary via-brand-bg-primary/60 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-bg-secondary/80 to-transparent z-10"></div>
        {/* Abstract luxury shapes */}
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-brand-gold/5 blur-3xl animate-pulse-gold"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-brand-blue/5 blur-3xl"></div>

        <div className="relative z-20 max-w-3xl flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-brand-gold"></span>
            <span className="text-xs font-bold text-brand-gold tracking-widest uppercase">
              Exclusive Silk Road Expedition
            </span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-gold-gradient tracking-tight">
            {t.title}
          </h2>
          <p className="text-sm lg:text-base text-gray-300 font-light mt-2 leading-relaxed">
            {language === "th"
              ? "ร่วมเดินทางไปตามเส้นทางสายไหมในตำนานทางหลวงคาราโกรัม สัมผัสความยิ่งใหญ่ของธารน้ำแข็งมุซทัคอาตา ข้ามทะเลทรายทากลามากานที่กว้างขวาง และค้นพบวัฒนธรรมพันปีในเมืองโบราณคัชการ์ แผนการเดินทางระดับหรูหราที่คัดสรรมาเป็นพิเศษสำหรับคุณ"
              : language === "zh"
              ? "踏上著名的中巴公路，探索神秘的帕米尔高原，仰望万年冰川慕士塔格峰，跨越死亡之海塔克拉玛干沙漠，探寻千年喀什古城的繁华。为您量身定制的极致南疆奢华之旅。"
              : "Traverse the legendary Karakoram Highway, witness the frozen peaks of Muztagh Ata, cross the vast sands of the Taklamakan Desert, and dive into the millennium-old culture of Kashgar Old Town. A meticulously designed luxury itinerary for discerning travelers."}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="glass-panel-blue bg-brand-bg-secondary/40 p-5 rounded-xl border border-white/5 flex items-center justify-between group hover:border-brand-gold/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  {stat.label}
                </span>
                <span className="text-2xl font-bold font-display text-gray-100 group-hover:text-brand-gold transition-colors duration-300">
                  {stat.value}
                </span>
                <span className="text-[10px] text-gray-500 font-light">{stat.sub}</span>
              </div>
              <div className={`p-3 rounded-lg border ${stat.color} transition-all duration-300 group-hover:scale-110`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Route summary & Day preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Route Summary (Left) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-display font-bold text-lg text-brand-gold flex items-center gap-2">
              <Compass className="w-5 h-5 text-brand-gold" />
              {t.routeSummary}
            </h3>
            <button
              onClick={() => setActiveTab("map")}
              className="text-xs text-brand-blue hover:text-brand-blue-hover flex items-center gap-1 font-semibold transition-colors duration-300"
            >
              {t.interactiveMapBtn}
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="relative pl-6 space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-brand-gold via-brand-blue to-emerald-400"></div>

            {ITINERARY_DATA.map((day) => {
              const dayTrans = tItinerary[day.day];
              return (
                <div
                  key={day.day}
                  onClick={() => setActiveDay(day.day)}
                  className={`flex items-start justify-between p-3 rounded-lg border cursor-pointer transition-all duration-300 group ${
                    activeDay === day.day
                      ? "bg-brand-gold/10 border-brand-gold/30 text-brand-gold"
                      : "border-transparent text-gray-300 hover:bg-white/5 hover:border-white/5"
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Timeline dot */}
                    <div
                      className={`w-4 h-4 rounded-full mt-1 border-2 flex items-center justify-center transition-all duration-300 z-10 ${
                        activeDay === day.day
                          ? "bg-brand-gold border-brand-gold shadow-[0_0_8px_#E1A63B]"
                          : "bg-brand-bg-primary border-gray-500 group-hover:border-brand-blue"
                      }`}
                    >
                      {activeDay === day.day && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-bg-primary"></span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-sm flex items-center gap-1.5">
                        <span>Day {day.day}: {dayTrans.title}</span>
                        <span className="text-[10px] text-gray-500 font-light">({day.date})</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 line-clamp-1 group-hover:text-gray-300 transition-colors">
                        {day.startLocation === day.endLocation
                          ? `${day.startLocation}`
                          : `${day.startLocation} → ${day.endLocation}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-center">
                    <span className="text-xs font-bold text-gray-300">
                      {day.distanceKm > 0 ? `${day.distanceKm} km` : "Stay"}
                    </span>
                    <span className="text-[10px] text-gray-500">{day.driveTime !== "N/A" ? day.driveTime : ""}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Preview (Right) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel-gold bg-brand-bg-secondary/45 p-6 rounded-xl border border-brand-gold/20 flex flex-col gap-5 flex-1 relative overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl"></div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded-full border border-brand-gold/25 uppercase tracking-wider">
                {t.activeDayPreview.replace("{day}", String(currentDayData.day))}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-brand-blue">
                <Sun className="w-4 h-4" />
                <span>{currentDayData.weather.tempRange}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="font-display font-extrabold text-xl text-gray-100 leading-tight">
                {currentDayData.title}
              </h4>
              <p className="text-xs font-semibold text-brand-blue tracking-wide uppercase mt-1">
                {currentDayData.subtitle}
              </p>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-light flex-1">
              {currentDayData.description}
            </p>

            <div className="grid grid-cols-2 gap-3 bg-brand-bg-primary/40 p-3 rounded-lg border border-white/5 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-gray-500 font-medium uppercase tracking-wider text-[9px]">
                  {t.hotels}
                </span>
                <span className="font-bold text-gray-200 truncate">{currentDayData.hotelName}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-gray-500 font-medium uppercase tracking-wider text-[9px]">
                  Drive Details
                </span>
                <span className="font-bold text-gray-200">
                  {currentDayData.distanceKm > 0
                    ? `${currentDayData.distanceKm} km / ${currentDayData.driveTime}`
                    : "No driving"}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("itinerary")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-brand-gold hover:bg-brand-gold-hover text-brand-bg-primary text-xs font-bold tracking-wider transition-all duration-300 shadow-[0_4px_14px_rgba(225,166,59,0.3)] hover:scale-[1.02]"
              >
                {t.viewItineraryBtn}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveTab("map")}
                className="p-2.5 rounded bg-brand-bg-secondary hover:bg-brand-bg-secondary/80 border border-brand-blue/30 text-brand-blue transition-all duration-300"
                title="View Route Map"
              >
                <Map className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
