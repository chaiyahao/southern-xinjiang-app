"use client";

import React, { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import Sidebar from "../components/Sidebar";
import { useTravelStore } from "../store/useTravelStore";
import type { ActiveTab } from "../types";
import { 
  Printer, 
  X, 
  CheckCircle2,
  LayoutDashboard,
  Calendar,
  Clock,
  Map,
  Hotel,
  Coins,
  Plane,
  Radio,
  Headphones,
  Languages,
  Menu,
  Users,
  Route,
  Compass,
  Sun,
  MessageSquare,
  Scale
} from "lucide-react";
import { ITINERARY_DATA, HOTELS_DATA, FLIGHTS_DATA } from "../data/travelData";
import { TRANSLATIONS_DATA } from "../data/translations";

// Screens
import OverviewScreen from "../components/OverviewScreen";
import ItineraryScreen from "../components/ItineraryScreen";
import ScheduleScreen from "../components/ScheduleScreen";
import MapScreen from "../components/MapScreen";
import HotelsScreen from "../components/HotelsScreen";
import BudgetScreen from "../components/BudgetScreen";
import FlightsScreen from "../components/FlightsScreen";
import LiveScreen from "../components/LiveScreen";
import PhrasebookScreen from "../components/PhrasebookScreen";
import TravelersScreen from "../components/TravelersScreen";
import TimelineScreen from "../components/TimelineScreen";
import AttractionsScreen from "../components/AttractionsScreen";
import ExpenseSplitScreen from "../components/ExpenseSplitScreen";

export default function Home() {
  const { 
    activeTab, 
    setActiveTab, 
    loadPersistedData, 
    notes, 
    customExpenses, 
    language, 
    setLanguage,
    fontSize,
    setFontSize,
    simulatedDate,
    setSimulatedDate,
    fetchExchangeRate,
    setActiveDay,
    activeDay,
    isSimulating,
    travelerLocations,
    updateTravelerLocation,
    updateTelemetry
  } = useTravelStore();

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [flights, setFlights] = useState<typeof FLIGHTS_DATA>(FLIGHTS_DATA);
  
  const [printSections, setPrintSections] = React.useState({
    cover: true,
    itinerary: true,
    hotels: true,
    flights: true,
    travelers: true,
    attractions: true,
    budget: true,
    notes: true,
  });

  const [hasAutoRouted, setHasAutoRouted] = useState(false);
  const [weatherAlertDay, setWeatherAlertDay] = useState<number | null>(null);

  const getTripDayForDate = (dateStr: string) => {
    const tripDates: Record<string, number> = {
      "2026-10-29": 1,
      "2026-10-30": 2,
      "2026-10-31": 3,
      "2026-11-01": 4,
      "2026-11-02": 5,
      "2026-11-03": 6,
      "2026-11-04": 7,
      "2026-11-05": 8,
      "2026-11-06": 9,
      "2026-11-07": 10,
    };
    return tripDates[dateStr] || null;
  };

  useEffect(() => {
    loadPersistedData();
    fetchExchangeRate();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    fetch("/api/flights")
      .then(res => res.json())
      .then(data => setFlights(data))
      .catch(err => console.error("Error loading flights in page.tsx:", err));

    return () => clearInterval(timer);
  }, [loadPersistedData, fetchExchangeRate]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab") as any;
    if (tabParam) {
      setActiveTab(tabParam);
      setHasAutoRouted(true);
    }
  }, [setActiveTab]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") !== activeTab) {
      params.set("tab", activeTab);
      const newRelativePathQuery = window.location.pathname + "?" + params.toString() + window.location.hash;
      window.history.replaceState(null, "", newRelativePathQuery);
    }
  }, [activeTab]);

  // Travel Day Auto Routing Detection
  useEffect(() => {
    if (hasAutoRouted) return;
    
    const today = new Date();
    const dateQuery = simulatedDate || `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const tripDay = getTripDayForDate(dateQuery);
    if (tripDay !== null) {
      setActiveTab("itinerary");
      setActiveDay(tripDay);
      setWeatherAlertDay(tripDay);
      setHasAutoRouted(true);
    }
  }, [simulatedDate, hasAutoRouted, setActiveTab, setActiveDay]);

  // Global coordinates and telemetry simulation loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isSimulating) {
      interval = setInterval(() => {
        // 1. Simulate other traveler locations moving slightly
        const baseCoords = ITINERARY_DATA[activeDay - 1]?.coordinates || [75.98, 39.47];
        const baseLng = baseCoords[0];
        const baseLat = baseCoords[1];
        
        Object.keys(travelerLocations).forEach((id, index) => {
          const offsetLat = (index - 2.5) * 0.003;
          const offsetLng = (index - 2.5) * 0.003;
          
          const currentLoc = travelerLocations[id];
          const currentLat = currentLoc ? currentLoc.lat : baseLat + offsetLat;
          const currentLng = currentLoc ? currentLoc.lng : baseLng + offsetLng;
          
          const jitterLat = currentLat + (Math.random() * 0.0002 - 0.0001);
          const jitterLng = currentLng + (Math.random() * 0.0002 - 0.0001);
          
          const boundOffset = 0.015;
          const targetLat = baseLat + offsetLat;
          const targetLng = baseLng + offsetLng;
          const finalLat = Math.max(targetLat - boundOffset, Math.min(targetLat + boundOffset, jitterLat));
          const finalLng = Math.max(targetLng - boundOffset, Math.min(targetLng + boundOffset, jitterLng));
          
          updateTravelerLocation(id, finalLat, finalLng);
        });

        // 2. Simulate telemetry fluctuations
        updateTelemetry((prev) => {
          const deltaSpeed = Math.floor(Math.random() * 9) - 4; // -4 to +4
          const nextSpeed = Math.max(45, Math.min(110, prev.speedKmh + deltaSpeed));
          const nextEta = Math.max(0, prev.etaMinutes - (Math.random() > 0.7 ? 1 : 0));

          let targetAltitude = 1300;
          if (activeDay === 2 || activeDay === 3 || activeDay === 4) targetAltitude = 3100;
          else if (activeDay === 7) targetAltitude = 1400;

          const deltaAlt = Math.floor(Math.random() * 11) - 5; // -5 to +5
          const nextAltitude = Math.max(
            800,
            prev.currentAltitudeM + (prev.currentAltitudeM < targetAltitude ? 4 : -4) + deltaAlt
          );

          const deltaTemp = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          const nextTemp = Math.max(-15, Math.min(25, prev.weatherTemp + deltaTemp));

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
  }, [isSimulating, activeDay, travelerLocations, updateTravelerLocation, updateTelemetry]);



  const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
  const bangkokTime = new Date(utc + (3600000 * 7));
  const beijingTime = new Date(utc + (3600000 * 8));

  const formatClock = (d: Date) => {
    return d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
  };

  const departureDate = new Date("2026-10-29T00:30:00+07:00");
  const diffTime = departureDate.getTime() - currentTime.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const mainContent = document.querySelector("main");
      if (mainContent) {
        mainContent.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [activeTab]);

  // Dynamic budget calculations for PDF print matching Custom Expense modifications
  const flightsCustomSum = customExpenses.filter((e) => e.category === "flights").reduce((sum, e) => sum + e.amountThb, 0);
  const transportCustomSum = customExpenses.filter((e) => e.category === "transport").reduce((sum, e) => sum + e.amountThb, 0);
  const hotelsCustomSum = customExpenses.filter((e) => e.category === "hotels").reduce((sum, e) => sum + e.amountThb, 0);
  const ticketsCustomSum = customExpenses.filter((e) => e.category === "tickets").reduce((sum, e) => sum + e.amountThb, 0);
  const otherCustomSum = customExpenses.filter((e) => e.category === "other").reduce((sum, e) => sum + e.amountThb, 0);

  const dynamicBudgetData = [
    { name: "Outbound/Return Flights", amountThb: 19875 + flightsCustomSum, color: "#5EA8FF" },
    { name: "Private Van & Driver", amountThb: 8000 + transportCustomSum, color: "#E1A63B" },
    { name: "Luxury Hotels (9 Nights)", amountThb: 5850 + hotelsCustomSum, color: "#EC4899" },
    { name: "Entrance Fees & Tickets", amountThb: 1500 + ticketsCustomSum, color: "#10B981" },
  ];

  if (otherCustomSum > 0) {
    dynamicBudgetData.push({ name: "Other Expenses", amountThb: otherCustomSum, color: "#8B5CF6" });
  }

  const dynamicTotal = dynamicBudgetData.reduce((sum, item) => sum + item.amountThb, 0);
  const printBudgetData = dynamicBudgetData.map((entry) => ({
    ...entry,
    percentage: dynamicTotal > 0 ? parseFloat(((entry.amountThb / dynamicTotal) * 100).toFixed(1)) : 0,
  }));

  const handlePrint = () => {
    flushSync(() => {
      setShowPrintModal(false);
    });
    window.print();
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewScreen />;
      case "itinerary":
        return <ItineraryScreen />;
      case "timeline":
        return <TimelineScreen />;
      case "schedule":
        return <ScheduleScreen />;
      case "map":
        return <MapScreen />;
      case "hotels":
        return <HotelsScreen />;
      case "budget":
        return <BudgetScreen />;
      case "flights":
        return <FlightsScreen />;
      case "live":
        return <LiveScreen />;
      case "phrasebook":
        return <PhrasebookScreen />;
      case "travelers":
        return <TravelersScreen />;
      case "attractions":
        return <AttractionsScreen />;
      case "expense-split":
        return <ExpenseSplitScreen />;
      default:
        return <OverviewScreen />;
    }
  };

  const toggleSection = (section: keyof typeof printSections) => {
    setPrintSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getTripDayWeatherAlert = (dayNum: number, lang: string) => {
    const alerts: Record<number, { title: string; desc: string; advice: string }> = {
      1: {
        title: lang === "th" ? "ยินดีต้อนรับสู่คัชการ์! (Kashgar)" : "Welcome to Kashgar!",
        desc: lang === "th" ? "อุณหภูมิ 5°C ถึง 20°C อากาศเย็นสบายในตอนกลางคืน ท้องฟ้าโปร่ง" : "Temp 5°C to 20°C. Cool evening breeze, clear skies.",
        advice: lang === "th" ? "การเตรียมตัว: สวมเสื้อแจ็คเก็ตบางในตอนเย็น พกพาสปอร์ตติดตัวตลอดเวลาเพื่อการตรวจค้นด่านในเมือง" : "Advice: Wear light jackets in the evening. Keep your passport handy for local security checks."
      },
      2: {
        title: lang === "th" ? "คำเตือน: ทางหลวงคาราโกรัม & ทะเลสาบคาราคูล (ความสูง 3,600 ม.)" : "Warning: Karakoram Highway & Karakul Lake (3,600m)",
        desc: lang === "th" ? "อุณหภูมิ -4°C ถึง 9°C ลมพัดแรงจัดและหนาวจัดบนที่ราบสูง" : "Temp -4°C to 9°C. Extreme cold, wind gusts on the plateau.",
        advice: lang === "th" ? "การเตรียมตัว: สวมเสื้อโค้ทกันหนาวขนเป็ดหนา แว่นกันแดด UV ทาลิปมันกันปากแตก และทานยา Diamox เพื่อป้องกันการแพ้ความสูง หลีกเลี่ยงการออกแรงทางกายภาพหนัก" : "Advice: Wear heavy thermal windbreakers, sunglasses, lip balm, and take Diamox for altitude sickness. Avoid heavy physical exercise."
      },
      3: {
        title: lang === "th" ? "คำเตือน: โค้งพานหลง (Panlong Ancient Road)" : "Warning: Panlong Ancient Road",
        desc: lang === "th" ? "อุณหภูมิ -2°C ถึง 12°C ลมปานกลาง ทัศนวิสัยปกติ แต่เส้นทางคดเคี้ยวมาก" : "Temp -2°C to 12°C. Normal visibility, but extremely winding road segments.",
        advice: lang === "th" ? "การเตรียมตัว: สวมเสื้อผ้าหนาหลายชั้น ทานยาแก้เมารถก่อนเดินทางล่วงหน้า 30 นาทีเนื่องจากมีโค้งหักศอกมากกว่า 600 โค้ง!" : "Advice: Dress in layers. Take motion sickness medication 30 mins before departure due to over 600 hairpin turns!"
      },
      4: {
        title: lang === "th" ? "คำเตือน: ธารน้ำแข็งมุซทัคอาตา (Muztagh Ata Glacier - 4,300 ม.)" : "Warning: Muztagh Ata Glacier (4,300m)",
        desc: lang === "th" ? "อุณหภูมิ -8°C ถึง 5°C หนาวจัด อากาศบางเบามาก หิมะตกเล็กน้อย" : "Temp -8°C to 5°C. Extreme freezing temperatures, low oxygen, light snow.",
        advice: lang === "th" ? "การเตรียมตัว: ต้องใช้ถังออกซิเจนพกพา สวมหมวกไหมพรม ถุงมือกันหนาว และหน้ากากป้องกันลมหนาว" : "Advice: Use portable oxygen cylinders. Wear beanies, thick gloves, and windproof face masks."
      },
      5: {
        title: lang === "th" ? "สภาพอากาศ: ป่าต้นปอปลาร์เจ๋อผู่ (Zepu Poplar Forest)" : "Weather: Zepu Poplar Forest",
        desc: lang === "th" ? "อุณหภูมิ 8°C ถึง 18°C อากาศเย็นสบาย ป่ามีสีเหลืองทองสวยงาม" : "Temp 8°C to 18°C. Cool breeze, scenic yellow forest view.",
        advice: lang === "th" ? "การเตรียมตัว: สวมแจ็คเก็ตกันลมทั่วไป รองเท้าเดินสบายสำหรับเดินเที่ยวชมป่า" : "Advice: Wear light windbreakers and comfortable walking shoes."
      },
    };
    
    return alerts[dayNum] || {
      title: lang === "th" ? "สภาพอากาศการเดินทางวันนี้" : "Today's Travel Weather",
      desc: lang === "th" ? "อุณหภูมิเฉลี่ย 8°C ถึง 16°C อากาศเย็นสบาย ท้องฟ้าแจ่มใส" : "Temp 8°C to 16°C. Cool weather, clear skies.",
      advice: lang === "th" ? "การเตรียมตัว: สวมแจ็คเก็ตกันลมธรรมดาและเตรียมน้ำดื่มให้เพียงพอเนื่องจากอากาศในซินเจียงค่อนข้างแห้ง" : "Advice: Wear windproof jackets and drink plenty of water due to dry Xinjiang air."
    };
  };

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen bg-brand-bg-primary text-gray-800 font-sans antialiased relative overflow-x-hidden ${
      fontSize === "large" ? "font-size-large" : fontSize === "xl" ? "font-size-xl" : ""
    }`}>
      {/* Weather Pop-up Advisory */}
      {weatherAlertDay !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 no-print animate-fadeIn">
          <div className="bg-white border border-brand-gold/30 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-brand-gold">
              <div className="p-2.5 rounded-xl bg-brand-gold/10">
                <Sun className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-xs text-navy uppercase tracking-wider">
                  {language === "th" ? "ประกาศสภาพอากาศ & ข้อควรระวังวันนี้" : "Weather Advisory & Travel Alert"}
                </h3>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  {language === "th" ? `วันเดินทางที่ ${weatherAlertDay} ของทริป` : `Trip Day ${weatherAlertDay}`}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2.5 text-xs text-gray-750 leading-relaxed pt-2 border-t border-gray-100">
              <p className="font-bold text-gray-900 font-display">
                {getTripDayWeatherAlert(weatherAlertDay, language).title}
              </p>
              <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-800 italic">
                {getTripDayWeatherAlert(weatherAlertDay, language).desc}
              </p>
              <p className="font-medium text-amber-800 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                {getTripDayWeatherAlert(weatherAlertDay, language).advice}
              </p>
            </div>

            <button
              onClick={() => setWeatherAlertDay(null)}
              className="mt-2 w-full py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-bg-primary font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>{language === "th" ? "รับทราบและปิดหน้าต่าง" : "Acknowledge & Collapse"}</span>
            </button>
          </div>
        </div>
      )}

      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-brand-blue/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-20 w-[450px] h-[450px] rounded-full bg-brand-gold/5 blur-3xl pointer-events-none"></div>

      <div className="no-print hidden lg:flex">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col overflow-y-auto max-h-screen relative z-10 no-print pb-24 lg:pb-0">
        <header className="p-4 lg:p-6 border-b border-brand-gold/15 bg-brand-bg-secondary/75 flex flex-col gap-2.5 lg:gap-0 lg:flex-row lg:items-center justify-between no-print sticky top-0 z-30 backdrop-blur-md">
          <div className="w-full flex items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <h1 
                onClick={() => window.location.reload()}
                className="text-xl lg:text-3xl font-display font-extrabold tracking-[0.25em] text-gold-gradient leading-none cursor-pointer hover:opacity-85 active:scale-[0.98] transition-all"
                title="Refresh Dashboard"
              >
                XINJIANG
              </h1>
              <span className="text-[9px] lg:text-[10px] font-bold text-brand-blue tracking-[0.12em] uppercase pl-0.5 animate-pulse-slow">
                {language === "th"
                  ? "คู่มือนำเที่ยว ซินเจียงใต้ ประเทศจีน"
                  : language === "zh"
                  ? "中国南疆旅游指南"
                  : "Southern Xinjiang, China | Tour Guide"}
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-gray-400">
              <div className="hidden sm:flex lg:hidden items-center gap-2 bg-brand-bg-primary/80 px-2.5 py-1 rounded-lg border border-white/10 text-[9px] font-bold text-gray-300 font-display">
                <span>BKK: {formatClock(bangkokTime)}</span>
                <span>•</span>
                <span>PEK: {formatClock(beijingTime)}</span>
                <span>•</span>
                <span>🚀 {daysLeft > 0 ? `${daysLeft}d` : "Today"}</span>
              </div>

              <div className="flex lg:hidden items-center gap-1 bg-brand-bg-primary/75 p-0.5 rounded border border-white/10">
                {(["en", "th", "zh"] as const).map((lang) => {
                  const flagMap = { en: "🇺🇸", th: "🇹🇭", zh: "🇨🇳" };
                  return (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all duration-300 flex items-center justify-center cursor-pointer ${
                        language === lang
                          ? "bg-brand-gold text-brand-bg-primary shadow scale-105"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <span className="text-sm leading-none">{flagMap[lang]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Top Bar Font Sizing Selector (Only visible on large screens here) */}
              <div className="hidden lg:flex items-center gap-1 bg-brand-bg-primary/75 p-0.5 rounded border border-white/10 shadow-sm">
                {(["normal", "large", "xl"] as const).map((size) => {
                  const labelMap = { normal: "A", large: "A+", xl: "A++" };
                  const descMap = { normal: "Normal Text", large: "Large Text", xl: "Huge Text" };
                  const isActive = fontSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      title={descMap[size]}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all duration-300 flex items-center justify-center min-w-[26px] cursor-pointer ${
                        isActive
                          ? "bg-brand-gold text-brand-bg-primary shadow scale-105"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {labelMap[size]}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setShowPrintModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-brand-gold hover:bg-brand-gold-hover text-brand-bg-primary font-bold text-xs shadow-md transition-all duration-300 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print Guide (PDF)</span>
              </button>
            </div>
          </div>

          {/* Row 2: Mobile Font Sizing Selector */}
          <div className="lg:hidden w-full flex items-center justify-end border-t border-brand-gold/10 pt-2 gap-2">
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
              {language === "th" ? "ปรับขนาดตัวอักษร:" : language === "zh" ? "调整字号:" : "Adjust Font Size:"}
            </span>
            <div className="flex items-center gap-1 bg-brand-bg-primary/75 p-0.5 rounded border border-white/10 shadow-sm">
              {(["normal", "large", "xl"] as const).map((size) => {
                const labelMap = { normal: "A", large: "A+", xl: "A++" };
                const descMap = { normal: "Normal Text", large: "Large Text", xl: "Huge Text" };
                const isActive = fontSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    title={descMap[size]}
                    className={`px-3 py-0.5 rounded text-[10px] font-bold transition-all duration-300 flex items-center justify-center min-w-[28px] cursor-pointer ${
                      isActive
                        ? "bg-brand-gold text-brand-bg-primary shadow scale-105"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {labelMap[size]}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Date Simulator Control Panel - Hidden in real use as requested: "ไม่ต้องแสดงจริง" */}
        {/*
        <div className="bg-slate-100 border-b border-brand-gold/15 p-2.5 px-4 flex flex-wrap items-center justify-between gap-3 text-xs z-20 no-print">
          <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
            <Clock className="w-4 h-4 text-brand-gold animate-pulse" />
            <span>{language === "th" ? "ตัวจำลองวันเดินทาง (Trip Date Simulator):" : "Trip Date Simulator:"}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                setSimulatedDate(null);
                setHasAutoRouted(false);
              }}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                simulatedDate === null
                  ? "bg-brand-gold text-brand-bg-primary border-brand-gold/20 shadow-sm"
                  : "bg-white text-gray-700 hover:bg-slate-50 border-slate-200"
              }`}
            >
              {language === "th" ? "วันปัจจุบัน (Real Date)" : "Real Date"}
            </button>
            {[
              { label: language === "th" ? "ก่อนทริป (25 ต.ค. 2569)" : "Pre-trip (Oct 25)", date: "2026-10-25" },
              { label: language === "th" ? "วันที่ 1 (29 ต.ค.)" : "Day 1 (Oct 29)", date: "2026-10-29" },
              { label: language === "th" ? "วันที่ 2 (30 ต.ค.)" : "Day 2 (Oct 30)", date: "2026-10-30" },
              { label: language === "th" ? "วันที่ 3 (31 ต.ค.)" : "Day 3 (Oct 31)", date: "2026-10-31" },
              { label: language === "th" ? "วันที่ 4 (1 พ.ย.)" : "Day 4 (Nov 1)", date: "2026-11-01" },
              { label: language === "th" ? "หลังทริป (15 พ.ย.)" : "Post-trip (Nov 15)", date: "2026-11-15" }
            ].map(item => (
              <button
                key={item.date}
                onClick={() => {
                  setSimulatedDate(item.date);
                  setHasAutoRouted(false);
                }}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                  simulatedDate === item.date
                    ? "bg-brand-gold text-brand-bg-primary border-brand-gold/20 shadow-sm"
                    : "bg-white text-gray-700 hover:bg-slate-50 border-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        */}

        <div className="flex-1 w-full relative">
          {renderActiveScreen()}
        </div>
      </main>

      <div className="lg:hidden fixed bottom-5 left-4 right-4 z-40 bg-white/95 backdrop-blur border border-slate-200/80 rounded-2xl shadow-xl flex items-center justify-around py-1 px-1.5 text-[8px] sm:text-[9.5px] font-bold text-gray-500">
        {([
          { id: "overview", label: language === "th" ? "ภาพรวม" : language === "zh" ? "概览" : "Overview", icon: LayoutDashboard },
          { id: "timeline", label: language === "th" ? "ไทม์ไลน์" : language === "zh" ? "全行程" : "Timeline", icon: Route },
          { id: "itinerary", label: language === "th" ? "แผนเดินทาง" : language === "zh" ? "行程" : "Itinerary", icon: Calendar },
          { id: "expense-split", label: language === "th" ? "หารเงินกลุ่ม" : language === "zh" ? "费用分摊" : "Cost Share", icon: Scale },
          { id: "live", label: language === "th" ? "แชท" : language === "zh" ? "群聊" : "Chat", icon: MessageSquare },
        ] as { id: ActiveTab; label: string; icon: any }[]).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setShowMobileDrawer(false);
              }}
              className={`flex flex-col items-center gap-0 py-0.5 px-1 sm:px-2 rounded-xl transition-all cursor-pointer ${
                isActive ? "text-brand-gold animate-scaleUp font-extrabold" : "hover:text-gray-800"
              }`}
            >
              <Icon className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setShowMobileDrawer(true)}
          className={`flex flex-col items-center gap-0 py-0.5 px-1 sm:px-2 rounded-xl transition-all cursor-pointer ${
            showMobileDrawer ? "text-brand-gold animate-pulse font-extrabold" : "hover:text-gray-800"
          }`}
        >
          <Menu className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
          <span>{language === "th" ? "เพิ่มเติม" : language === "zh" ? "更多" : "More"}</span>
        </button>
      </div>

      {showMobileDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-slate-950/65 backdrop-blur-sm animate-fadeIn">
          <div className="flex-1" onClick={() => setShowMobileDrawer(false)}></div>
          <div className="bg-white border-t border-slate-200/80 rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 animate-slideUp max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">
                {language === "th" ? "เมนูทั้งหมด" : language === "zh" ? "探索全部" : "Explore More"}
              </span>
              <button 
                onClick={() => setShowMobileDrawer(false)}
                className="p-1 rounded-full bg-slate-100 text-gray-500 hover:bg-slate-250 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-2.5 my-1.5">
              {([
                { id: "schedule", label: language === "th" ? "ตารางเวลา" : language === "zh" ? "日程" : "Schedule", icon: Clock },
                { id: "flights", label: language === "th" ? "เที่ยวบิน" : language === "zh" ? "航班" : "Flights", icon: Plane },
                { id: "hotels", label: language === "th" ? "ที่พัก" : language === "zh" ? "住宿" : "Stays", icon: Hotel },
                { id: "budget", label: language === "th" ? "บันทึกค่าใช้จ่าย" : language === "zh" ? "费用" : "Expenses", icon: Coins },
                { id: "phrasebook", label: language === "th" ? "คู่มือสนทนา" : language === "zh" ? "常用短语" : "Phrases", icon: Languages },
                { id: "attractions", label: language === "th" ? "สถานที่เที่ยว" : language === "zh" ? "景点" : "Sights", icon: Compass },
                { id: "travelers", label: language === "th" ? "ผู้ร่วมทริป" : language === "zh" ? "旅客" : "Travelers", icon: Users },
                { id: "map", label: language === "th" ? "แผนที่" : language === "zh" ? "地图" : "Map", icon: Map },
              ] as { id: ActiveTab; label: string; icon: any }[]).map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowMobileDrawer(false);
                    }}
                    className={`flex flex-col items-center justify-center gap-1 py-2.5 px-0.5 rounded-xl text-[9px] font-bold border transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? "bg-brand-gold/10 text-brand-gold border-brand-gold/30 shadow-[0_4px_12px_rgba(181,137,44,0.06)]"
                        : "bg-slate-50 border-slate-100 text-gray-500 hover:text-gray-700 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    <span className="truncate max-w-full text-center px-0.5">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showPrintModal && (
        <div 
          onClick={() => setShowPrintModal(false)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 no-print animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-5 relative overflow-hidden animate-scaleUp"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-slate-150 pb-3 relative z-10">
              <h3 className="font-display font-bold text-base text-brand-gold flex items-center gap-2">
                <Printer className="w-5 h-5" />
                Customize Travel Guide PDF
              </h3>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer relative z-20 p-1 hover:bg-slate-100 rounded-full transition-all"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Select which sections to include in the exported travel booklet. Your customized budgets and personal notes will sync automatically.
            </p>

            <div className="flex flex-col gap-3 py-1">
              {(Object.keys(printSections) as Array<keyof typeof printSections>).map((section) => {
                const label = 
                  section === "cover" ? "Title & Cover Page" :
                  section === "itinerary" ? "10-Day Detailed Itinerary" :
                  section === "hotels" ? "Accommodations & Bookings" :
                  section === "flights" ? "Flight Transit Schedule" :
                  section === "travelers" ? "Travelers & Passenger Details" :
                  section === "budget" ? "Dynamic Cost Breakdown" : "Personal Travel Notes";
                
                return (
                  <button
                    key={section}
                    onClick={() => toggleSection(section)}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-brand-gold/30 transition-all text-xs font-semibold cursor-pointer group text-left"
                  >
                    <span className="text-gray-600 group-hover:text-gray-800">{label}</span>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      printSections[section] 
                        ? "bg-brand-gold border-brand-gold text-brand-bg-primary" 
                        : "border-slate-300 text-transparent"
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-brand-gold/5 border border-brand-gold/15 rounded-lg p-3 text-[10px] text-brand-gold leading-normal">
              💡 **Tip:** For the best visual results, ensure that **"Background graphics"** is enabled in your browser's print options sheet before saving.
            </div>

            <button
              onClick={handlePrint}
              className="w-full py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-bg-primary text-xs font-extrabold transition-all cursor-pointer shadow-lg tracking-wider"
            >
              Generate & Print PDF
            </button>
          </div>
        </div>
      )}

      <div className="print-only hidden p-8 max-w-4xl mx-auto text-black font-sans">
        {printSections.cover && (
          <div className="text-center border-b-4 border-double border-gray-800 pb-8 mb-8 print-break-after">
            <h1 className="text-4xl font-extrabold tracking-tight uppercase mb-2">
              {language === "th" ? "คู่มือนำทางบันทึกการเดินทางซินเจียงใต้" : language === "zh" ? "南疆秘境探索出行手册" : "Southern Xinjiang Expedition"}
            </h1>
            <p className="text-lg font-semibold text-gray-600 mb-6">
              {language === "th" ? "แผนการเดินทาง 10 วัน บนที่ราบสูงปามีร์และเส้นทางสายไหมในตำนาน" : language === "zh" ? "十天九晚帕米尔高原与丝绸之路环线行车指南" : "10-Day Legendary Silk Road & High-Altitude Loop"}
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto text-left text-sm border-t border-gray-300 pt-6">
              <div>
                <p><strong>Expedition Coordinator:</strong> Arthur Xie</p>
                <p><strong>Contact Email:</strong> <span className="underline">chaiyahao@gmail.com</span></p>
                <p><strong>Hotline:</strong> +66 (0) 88-005-5888</p>
              </div>
              <div className="text-right">
                <p><strong>Total Route Distance:</strong> 2,540 km</p>
                <p><strong>VIP Route Status:</strong> Active & Confirmed</p>
                <p><strong>Total Package Cost:</strong> {dynamicTotal.toLocaleString()} THB / person</p>
              </div>
            </div>
          </div>
        )}

        {printSections.itinerary && (
          <div className="mb-8 print-break-after">
            <h2 className="text-2xl font-bold border-b-2 border-gray-800 pb-2 mb-4 uppercase">I. Detailed Daily Itinerary</h2>
            <div className="space-y-6">
              {ITINERARY_DATA.map((day) => {
                const transDay = TRANSLATIONS_DATA[language].itinerary[day.day] || {
                  title: day.title,
                  subtitle: day.subtitle,
                  description: day.description,
                  activities: day.activities
                };
                return (
                  <div key={day.day} className="print-avoid-break border-b border-gray-200 pb-4">
                    <h3 className="text-base font-bold text-gray-900">
                      {language === "th" ? "วันที่" : language === "zh" ? "第" : "Day"} {day.day}{language === "zh" ? "天" : ""} ({day.date}): {transDay.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-semibold mb-1">
                      Route: {day.startLocation} → {day.endLocation} | Distance: {day.distanceKm} km | Drive Time: {day.driveTime}
                    </p>
                    <p className="text-xs text-gray-700 leading-relaxed mb-2">{transDay.description}</p>
                    <div className="pl-4 border-l-2 border-gray-300">
                      <span className="text-[10px] uppercase font-bold text-gray-600 tracking-wider">Scheduled Activities:</span>
                      <ul className="list-disc pl-4 text-xs text-gray-600 mt-1">
                        {transDay.activities.map((act, aIdx) => (
                          <li key={aIdx}>{act}</li>
                        ))}
                      </ul>
                    </div>

                    {printSections.notes && notes[day.day] && (
                      <div className="mt-2.5 pl-4 py-2 border-l-2 border-brand-blue bg-brand-blue/10 rounded">
                        <span className="text-[9px] uppercase font-bold text-navy tracking-wider">My Travel Notes:</span>
                        <p className="text-xs text-gray-700 italic mt-0.5 whitespace-pre-wrap">{notes[day.day]}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {printSections.hotels && (
          <div className="mb-8 print-break-after">
            <h2 className="text-2xl font-bold border-b-2 border-gray-800 pb-2 mb-4 uppercase">II. Accommodation Bookings</h2>
            <div className="space-y-4">
              {HOTELS_DATA.map((hotel) => {
                const transHotel = TRANSLATIONS_DATA[language].hotels[hotel.id] || {
                  name: hotel.name,
                  location: hotel.location,
                  description: hotel.description,
                  address: ""
                };
                return (
                  <div key={hotel.id} className="print-avoid-break border border-gray-300 p-3 rounded">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold text-gray-900">{transHotel.name}</h3>
                      <span className="text-xs text-gray-600 font-semibold">{hotel.daysStayed}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium mb-1.5">{transHotel.location} | Rating: {hotel.rating} ⭐</p>
                    {transHotel.address && (
                      <p className="text-[10px] text-gray-500 italic mb-2"><strong>Address:</strong> {transHotel.address}</p>
                    )}
                    <p className="text-xs text-gray-700 leading-relaxed mb-2">{transHotel.description}</p>
                    <p className="text-[10px] text-gray-600 font-mono">
                      <strong>Booking Reference URL:</strong> {hotel.bookingUrl}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {printSections.flights && (
          <div className="mb-8 print-break-after">
            <h2 className="text-2xl font-bold border-b-2 border-gray-800 pb-2 mb-4 uppercase">III. Flight Transit Tickets</h2>
            <div className="space-y-4">
              {flights.map((ticket, tIdx) => (
                <div key={tIdx} className="print-avoid-break border border-gray-300 p-3 rounded">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                    <span className="text-sm font-bold uppercase">
                      {ticket.type === "Outbound"
                        ? (language === "th" ? "เที่ยวบินขาไป" : language === "zh" ? "去程航班" : "Outbound Journey")
                        : (language === "th" ? "เที่ยวบินขากลับ" : language === "zh" ? "回程航班" : "Return Journey")
                      }: {ticket.route}
                    </span>
                    <span className="text-xs font-semibold text-gray-600">Duration: {ticket.totalDuration}</span>
                  </div>
                  <div className="space-y-3">
                    {ticket.legs.map((leg, lIdx) => (
                      <div key={lIdx} className="text-xs text-gray-700">
                        <div className="font-bold text-gray-900">
                          {leg.flightNo} - {leg.carrier} ({leg.aircraft})
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 mt-1">
                          <div><strong>Departure:</strong> {leg.departureAirport} at {leg.departureTime} ({leg.date})</div>
                          <div><strong>Arrival:</strong> {leg.arrivalAirport} at {leg.arrivalTime} ({leg.date})</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {printSections.travelers && (
          <div className="mb-8 print-avoid-break">
            <h2 className="text-2xl font-bold border-b-2 border-gray-800 pb-2 mb-4 uppercase">IV. Travelers & Passenger Details</h2>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-gray-300 font-bold">
                  <th className="py-2">Passenger Name</th>
                  <th className="py-2">Passport Number</th>
                  <th className="py-2">Gender</th>
                  <th className="py-2 text-right">Role</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "CHAIYA WIBOONSANTISUK", passport: "AD1594767", gender: "M", role: "Lead Traveler / Contact" },
                  { name: "NANUTDA PRAKHOD", passport: "AD3496345", gender: "F", role: "Traveler" },
                  { name: "TIPUBON HOMCHAN", passport: "AC3909705", gender: "F", role: "Traveler" },
                  { name: "NAPAS PATTARAAMORNPAN", passport: "AC2596853", gender: "M", role: "Traveler" },
                ].map((tr, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="py-2 font-bold">{tr.name}</td>
                    <td className="py-2 font-mono">{tr.passport}</td>
                    <td className="py-2">{tr.gender === "M" ? (language === "th" ? "ชาย" : "Male") : (language === "th" ? "หญิง" : "Female")}</td>
                    <td className="py-2 text-right font-medium text-gray-600">{tr.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {printSections.budget && (
          <div className="print-avoid-break">
            <h2 className="text-2xl font-bold border-b-2 border-gray-800 pb-2 mb-4 uppercase">V. Financial & Budget Breakdown</h2>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-gray-300 font-bold">
                  <th className="py-2">Category Description</th>
                  <th className="py-2 text-right">Amount (THB)</th>
                  <th className="py-2 text-right">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {printBudgetData.map((entry, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="py-2 font-medium">{entry.name}</td>
                    <td className="py-2 text-right font-semibold">{entry.amountThb.toLocaleString()} THB</td>
                    <td className="py-2 text-right text-gray-600">{entry.percentage}%</td>
                  </tr>
                ))}
                <tr className="font-bold text-sm border-t-2 border-gray-800">
                  <td className="py-3">Total Expenses (with Custom Additions)</td>
                  <td className="py-3 text-right">{dynamicTotal.toLocaleString()} THB</td>
                  <td className="py-3 text-right">100%</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[10px] text-gray-500 mt-4 text-center">
              Generated by Southern Xinjiang VIP Expedition Console. Map and telemetry synchronization provided by Beidou-3 Satellite Network.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
