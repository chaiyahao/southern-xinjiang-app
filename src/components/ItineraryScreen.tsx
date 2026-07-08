"use client";

import React, { useState, useEffect } from "react";
import { useTravelStore } from "../store/useTravelStore";
import { ITINERARY_DATA } from "../data/travelData";
import { TRANSLATIONS_DATA } from "../data/translations";
import {
  CalendarDays,
  Compass,
  MapPin,
  Mountain,
  Sun,
  Snowflake,
  Wind,
  CloudSun,
  Hotel,
  Activity,
  FileText,
  AlertTriangle,
  ArrowRightLeft,
  Navigation,
} from "lucide-react";

export default function ItineraryScreen() {
  const { activeDay, setActiveDay, notes, updateNote, language, simulatedDate } = useTravelStore();
  const [liveWeather, setLiveWeather] = useState<{ tempHigh: number; tempLow: number; condition: string } | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Ticking time hook for live countdown update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const t = TRANSLATIONS_DATA[language].ui;
  const tItinerary = TRANSLATIONS_DATA[language].itinerary;

  const rawDayData = ITINERARY_DATA[activeDay - 1];
  const localizedDay = tItinerary[activeDay];

  useEffect(() => {
    setLoadingWeather(true);
    fetch(`/api/weather?location=${rawDayData.endLocation}&altitude=${rawDayData.maxElevationM}`)
      .then(res => res.json())
      .then(data => {
        setLiveWeather(data);
        setLoadingWeather(false);
      })
      .catch(err => {
        console.error("Error fetching live weather:", err);
        setLoadingWeather(false);
        setLiveWeather(null);
      });
  }, [activeDay, rawDayData.endLocation, rawDayData.maxElevationM]);

  // Compute simulated/virtual clock time in Beijing Time (GMT+8)
  const getVirtualBeijingTime = () => {
    // Get current time in UTC
    const utcTime = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    // Convert to Beijing Time (UTC+8)
    const bjTime = new Date(utcTime + (3600000 * 8));

    if (!simulatedDate) return bjTime;

    // Parse simulated date YYYY-MM-DD
    const [y, m, d] = simulatedDate.split("-").map(Number);
    const virtualBj = new Date(bjTime.getTime());
    virtualBj.setFullYear(y, m - 1, d);
    return virtualBj;
  };

  const virtualBeijingTime = getVirtualBeijingTime();
  const day1ArrivalTime = new Date("2026-10-29T15:30:00+08:00"); // 15:30 Beijing time
  const isBeforeArrival = activeDay === 1 && virtualBeijingTime < day1ArrivalTime;

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

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNote(activeDay, e.target.value);
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 animate-fadeIn max-w-7xl mx-auto w-full text-gray-800">
      {/* Header and Day Selector */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-2xl font-display font-extrabold text-gold-gradient tracking-tight">
              {t.itinerary}
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              {language === "th"
                ? "เลือกวันที่ด้านล่างเพื่อตรวจสอบแผนการเดินทาง โรงแรมที่พัก และบันทึกเดินทางส่วนตัวของคุณ"
                : language === "zh"
                ? "选择下方天数以探索详细行程、酒店住宿以及您的自定义旅途笔记。"
                : "Select a day below to explore the detailed itinerary, hotels, and custom travel notes."}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-blue font-bold">
            <CalendarDays className="w-4 h-4 text-brand-gold" />
            <span>29 OCT — 7 NOV 2026</span>
          </div>
        </div>

        {/* 10 Day Grid Selector */}
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {ITINERARY_DATA.map((day) => (
            <button
              key={day.day}
              onClick={() => setActiveDay(day.day)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all duration-300 hover:scale-105 cursor-pointer ${
                activeDay === day.day
                  ? "bg-brand-gold/10 border-brand-gold text-brand-gold shadow-[0_0_12px_rgba(0,92,171,0.15)] font-extrabold"
                  : "bg-white border-gray-200 text-gray-600 hover:text-brand-blue hover:border-brand-blue/30"
              }`}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider">Day</span>
              <span className="text-lg leading-tight font-display font-extrabold">{day.day}</span>
              <span className="text-[9px] text-gray-500 font-normal truncate w-full max-w-full px-1">
                {day.date.split(" ")[0]} {day.date.split(" ")[1]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Details Timeline (Left) & Notes Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Timeline Details (Left) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Day 1 Transit Dashboard Banner (Shown if Day 1 is active and current virtual time is before arrival) */}
          {isBeforeArrival && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <div className="glass-panel bg-white/95 p-6 rounded-2xl flex flex-col gap-6 border border-brand-primary/25 shadow-lg text-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-extrabold text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-2.5 py-1 rounded border border-brand-primary/20 w-max">
                      {language === "th" ? "อยู่ระหว่างการบินข้ามประเทศ" : "INTERNATIONAL TRANSIT EN ROUTE"}
                    </span>
                    <h3 className="text-lg lg:text-xl font-display font-extrabold text-gray-900 mt-2 leading-tight">
                      {language === "th" ? "สุวรรณภูมิ (BKK) ✈ คัชการ์ (KHG)" : "Bangkok (BKK) ✈ Kashgar (KHG)"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 animate-pulse w-max">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[9px] font-extrabold text-emerald-700 uppercase tracking-widest">IN FLIGHT // AQ-1239</span>
                  </div>
                </div>

                {/* Flight Progress Diagram */}
                <div className="flex flex-col items-center py-6 bg-gray-50 rounded-2xl p-5 border border-gray-200 relative z-10">
                  <div className="w-full flex justify-between items-center text-xs font-semibold px-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">BKK DEPART</span>
                      <span className="text-lg font-bold text-brand-primary font-display mt-0.5">10:10</span>
                      <span className="text-[9px] text-gray-505 mt-0.5">Bangkok, TH</span>
                    </div>

                    {/* Flight Path SVG Line */}
                    <div className="flex-1 px-4 relative flex items-center justify-center">
                      <div className="w-full h-0.5 border-t border-dashed border-gray-300 relative flex items-center">
                        <div className="absolute top-1/2 left-0 w-3/4 h-0.5 bg-gradient-to-r from-brand-primary to-brand-secondary transform -translate-y-1/2 origin-left"></div>
                        <div className="absolute top-1/2 left-[70%] transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
                          <Navigation className="w-5 h-5 text-brand-primary transform rotate-90" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end text-right">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">KHG ARRIVE</span>
                      <span className="text-lg font-bold text-brand-primary font-display mt-0.5">15:30</span>
                      <span className="text-[9px] text-gray-505 mt-0.5">Kashgar, CN (GMT+8)</span>
                    </div>
                  </div>

                  {/* Countdown Ticker */}
                  <div className="mt-8 flex flex-col items-center gap-1 text-center">
                    <span className="text-[10px] text-gray-550 font-mono tracking-widest uppercase font-extrabold">
                      {language === "th" ? "เวลาก่อนเครื่องบินลงจอด (เวลาปักกิ่ง)" : "COUNTDOWN TO LANDING (BEIJING TIME)"}
                    </span>
                    <div className="text-3xl sm:text-4xl font-display font-extrabold text-brand-primary tracking-widest drop-shadow-[0_2px_8px_rgba(0,92,171,0.1)] mt-1">
                      {(() => {
                        const diffMs = day1ArrivalTime.getTime() - virtualBeijingTime.getTime();
                        if (diffMs <= 0) return "00:00:00";
                        const hours = Math.floor(diffMs / 3600000);
                        const minutes = Math.floor((diffMs % 3600000) / 60000);
                        const seconds = Math.floor((diffMs % 60000) / 1000);
                        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
                      })()}
                    </div>
                  </div>
                </div>

                {/* Checklist & Preparation Card */}
                <div className="flex flex-col gap-3.5 bg-gray-50 p-5 rounded-2xl border border-gray-200 z-10">
                  <h4 className="text-xs font-extrabold text-brand-primary uppercase tracking-widest border-b border-gray-200 pb-2.5 flex items-center gap-2">
                    <span>📋</span>
                    <span>{language === "th" ? "ข้อมูลเตรียมตัวเข้าด่านตรวจคนเข้าเมืองซินเจียง" : "KASHGAR IMMIGRATION PREPARATION"}</span>
                  </h4>
                  <div className="flex flex-col gap-3 text-xs text-gray-700 font-semibold">
                    <div className="flex items-start gap-2.5">
                      <span className="text-emerald-600">✔</span>
                      <p className="leading-relaxed">
                        {language === "th" 
                          ? "กรุณาจัดเตรียมพาสปอร์ตตัวจริงและใบตรวจสอบวีซ่ากลุ่มให้เรียบร้อยเพื่อความรวดเร็วที่ด่านสนามบินคัชการ์ (KHG)" 
                          : "Ensure your physical passport and group visa documents are easily accessible for customs check."}
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-emerald-600">✔</span>
                      <p className="leading-relaxed">
                        {language === "th" 
                          ? "ตั้งเวลาบนอุปกรณ์ล่วงหน้า 1 ชั่วโมง เป็นเขตเวลาปักกิ่ง (Beijing Time - GMT+8) ทันทีที่เครื่องเข้าสู่น่านฟ้าจีน" 
                          : "Adjust your phone time ahead by 1 hour to Beijing Time (GMT+8) once entering Chinese airspace."}
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-emerald-600">✔</span>
                      <p className="leading-relaxed">
                        {language === "th" 
                          ? "หลีกเลี่ยงการถ่ายภาพในบริเวณเขตควบคุมตรวจคนเข้าเมืองและดุลยศุลกากรสนามบินโดยเด็ดขาด" 
                          : "Photography is strictly prohibited inside the Kashgar airport customs and immigration control zones."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Day Highlight Panel */}
          <div className="glass-panel p-6 rounded-xl flex flex-col gap-4 relative overflow-hidden">
            {/* Background design */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/5 rounded-full blur-3xl"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-gray-200 relative z-10">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-brand-gold uppercase tracking-wider bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/25">
                    Day {currentDayData.day}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">({currentDayData.date})</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-display font-extrabold text-gray-900 mt-1 leading-tight">
                  {currentDayData.title}
                </h3>
                <span className="text-xs text-brand-blue font-bold tracking-wider uppercase mt-0.5">
                  {currentDayData.subtitle}
                </span>
              </div>

              {/* Weather Forecast Badge */}
              <div className="flex items-center gap-3 bg-brand-bg-primary/50 py-2 px-4 rounded-xl border border-gray-200">
                {(() => {
                  const cond = (liveWeather ? liveWeather.condition : currentDayData.weather.forecast).toLowerCase();
                  if (cond.includes("snow")) return <Snowflake className="w-6 h-6 text-sky-500 animate-pulse" />;
                  if (cond.includes("wind")) return <Wind className="w-6 h-6 text-teal-600" />;
                  if (cond.includes("cloud") || cond.includes("overcast") || cond.includes("hazy") || cond.includes("partly")) return <CloudSun className="w-6 h-6 text-gray-500" />;
                  return <Sun className="w-6 h-6 text-amber-500 animate-spin-slow" />;
                })()}
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-gray-800">
                    {loadingWeather 
                      ? "Loading..." 
                      : liveWeather 
                      ? `${liveWeather.tempLow}°C to ${liveWeather.tempHigh}°C` 
                      : currentDayData.weather.tempRange}
                  </span>
                  <span className="text-gray-500 text-[10px] truncate max-w-[120px] font-medium">
                    {liveWeather ? liveWeather.condition : currentDayData.weather.forecast}
                  </span>
                </div>
              </div>
            </div>

            {/* Travel Segment Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              <div className="bg-brand-bg-secondary p-4 rounded-lg border border-gray-200 flex items-center gap-3">
                <div className="p-2 rounded bg-brand-blue/15 text-brand-blue">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-xs">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                    Travel Path
                  </span>
                  <span className="font-bold text-gray-800 truncate max-w-[150px] mt-0.5">
                    {currentDayData.startLocation} → {currentDayData.endLocation}
                  </span>
                </div>
              </div>

              <div className="bg-brand-bg-secondary p-4 rounded-lg border border-gray-200 flex items-center gap-3">
                <div className="p-2 rounded bg-brand-gold/15 text-brand-gold">
                  <Navigation className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-xs">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                    Drive Distance
                  </span>
                  <span className="font-bold text-gray-800 mt-0.5">
                    {currentDayData.distanceKm > 0
                      ? `${currentDayData.distanceKm} km / ${currentDayData.driveTime}`
                      : "Exploration Stay"}
                  </span>
                </div>
              </div>

              <div className="bg-brand-bg-secondary p-4 rounded-lg border border-gray-200 flex items-center gap-3">
                <div className="p-2 rounded bg-purple-400/15 text-purple-400">
                  <Mountain className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-xs">
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                    Max Elevation
                  </span>
                  <span className="font-bold text-gray-800 mt-0.5">
                    {currentDayData.maxElevationM} meters
                  </span>
                </div>
              </div>
            </div>

            {/* Itinerary Description */}
            <div className="text-sm text-gray-700 leading-relaxed font-normal mt-2 relative z-10">
              {currentDayData.description}
            </div>

            {/* Scenic Landmark Gallery */}
            {currentDayData.images && currentDayData.images.length > 0 && (
              <div className="flex flex-col gap-2 mt-2.5 relative z-10 border-t border-gray-200 pt-3">
                <span className="text-[9px] uppercase font-extrabold tracking-widest text-brand-gold">
                  {language === "th" ? "แกลเลอรีภาพสถานที่ท่องเที่ยวจริง" : language === "zh" ? "今日实景自然风光图" : "Scenic Highlight Gallery"}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentDayData.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="aspect-[2/1] rounded-lg overflow-hidden border border-gray-200 relative group bg-brand-bg-primary shadow-sm"
                    >
                      <img 
                        src={img.url} 
                        alt={img.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none flex items-end p-3">
                        <span className="text-[10px] text-white font-bold filter drop-shadow">
                          {language === "th" ? img.labelTh : language === "zh" ? img.labelZh : img.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Altitude Warning Alert (Tashkurgan) */}
            {currentDayData.maxElevationM >= 3000 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3 mt-1 relative z-10 animate-fadeIn">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col text-xs">
                  <span className="font-extrabold text-red-800">{t.altitudeWarningTitle}</span>
                  <span className="text-gray-700 mt-0.5 leading-normal font-medium">
                    {t.altitudeWarningDesc}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Activities list */}
          <div className="glass-panel p-6 rounded-xl flex flex-col gap-4 border border-gray-200">
            <h4 className="font-display font-bold text-base text-brand-gold flex items-center gap-2 border-b border-gray-200 pb-3">
              <Activity className="w-5 h-5 text-brand-gold" />
              {language === "th" ? "กิจกรรมไฮไลท์ประจำวัน" : language === "zh" ? "今日行程亮点与体验" : "Day Highlights & Curated Experiences"}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentDayData.activities.map((act, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded bg-brand-bg-secondary border border-gray-200 hover:border-brand-gold/40 transition-all duration-300 shadow-sm"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-gray-700 leading-normal font-medium">{act}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notes & Accommodations Panel (Right) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Accommodation Info Card */}
          <div className="glass-panel-gold bg-brand-bg-secondary/75 p-6 rounded-xl border border-brand-gold/20 flex flex-col gap-4 shadow-sm">
            <h4 className="font-display font-bold text-base text-brand-gold flex items-center gap-2 border-b border-brand-gold/25 pb-3">
              <Hotel className="w-5 h-5 text-brand-gold" />
              {t.hotels}
            </h4>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-brand-blue font-extrabold tracking-wider uppercase">
                Stay Lodging
              </span>
              <span className="text-lg font-extrabold text-gray-900 leading-tight">
                {currentDayData.hotelName}
              </span>
              <p className="text-xs text-gray-600 font-normal leading-relaxed mt-1">
                {language === "th"
                  ? "บริการพรีเมียมห้องพักจองในโรงแรมนี้เรียบร้อยแล้ว มีระบบปุ่มกดออกซิเจนในกรณีฉุกเฉินที่เลานจ์และล็อบบี้"
                  : language === "zh"
                  ? "已为您安排今日高规格行政套房入住。前台与VIP休息室均配备有备用吸氧装置。"
                  : "Premium services are booked for this day. Oxygen devices are available at the lobby and VIP lounges."}
              </p>
            </div>
          </div>

          {/* Interactive Notes Area */}
          <div className="glass-panel p-6 rounded-xl flex flex-col gap-4 border border-gray-200 shadow-sm">
            <h4 className="font-display font-bold text-base text-brand-gold flex items-center gap-2 border-b border-gray-200 pb-3">
              <FileText className="w-5 h-5 text-brand-gold" />
              {t.notesHeader}
            </h4>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest font-extrabold">
                {t.notesLabel}
              </label>
              <textarea
                value={notes[activeDay] || ""}
                onChange={handleNoteChange}
                placeholder={t.notesPlaceholder}
                className="w-full min-h-[140px] p-3 rounded bg-white border border-gray-300 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold focus:outline-none text-xs text-gray-800 leading-normal resize-none placeholder-gray-400 transition-colors shadow-inner"
              />
              <p className="text-[10px] text-gray-500 font-medium">
                {t.notesSync}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
