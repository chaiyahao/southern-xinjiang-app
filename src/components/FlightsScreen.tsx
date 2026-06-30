"use client";

import React, { useState } from "react";
import { FLIGHTS_DATA } from "../data/travelData";
import { TRANSLATIONS_DATA } from "../data/translations";
import { useTravelStore } from "../store/useTravelStore";
import { Plane, PlaneTakeoff, PlaneLanding, Clock, ShieldAlert, Award, Luggage, Compass, History, Loader2, Calendar } from "lucide-react";

interface HistoryRecord {
  date: string;
  flightNo: string;
  aircraft: string;
  departureScheduled: string;
  departureActual: string;
  arrivalScheduled: string;
  arrivalActual: string;
  delayMinutes: number;
  status: "Landed" | "Delayed";
}

export default function FlightsScreen() {
  const { language } = useTravelStore();
  const t = TRANSLATIONS_DATA[language].ui;

  // Track which flight leg's history is currently expanded
  // e.g. "Outbound-0" or "Return-1"
  const [expandedLegKey, setExpandedLegKey] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<Record<string, HistoryRecord[]>>({});
  const [loadingLegs, setLoadingLegs] = useState<Record<string, boolean>>({});

  const toggleHistory = async (ticketType: string, legIdx: number, flightNo: string, depAirport: string) => {
    const key = `${ticketType}-${legIdx}`;
    
    if (expandedLegKey === key) {
      setExpandedLegKey(null);
      return;
    }

    setExpandedLegKey(key);

    // If data is already fetched, don't fetch again
    if (historyData[key]) return;

    setLoadingLegs((prev) => ({ ...prev, [key]: true }));

    try {
      const cleanNo = flightNo.includes("/") ? flightNo.split("/")[0].trim() : flightNo.trim();
      // Identify origin code to send to API for segment-specific history
      const originCode = depAirport.includes("Bangkok") || depAirport.includes("BKK")
        ? "BKK"
        : depAirport.includes("Aksu") || depAirport.includes("AKU")
        ? "AKU"
        : "CKG";

      const res = await fetch(`/api/flights/history?flightNo=${cleanNo} (${originCode})`);
      if (res.ok) {
        const data = await res.json();
        setHistoryData((prev) => ({ ...prev, [key]: data }));
      }
    } catch (err) {
      console.error("Failed to load flight history:", err);
    } finally {
      setLoadingLegs((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 animate-fadeIn max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-gold-gradient tracking-tight">
            {t.flightHeader}
          </h2>
          <p className="text-xs text-gray-400">
            {t.flightDesc}
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-brand-blue/10 border border-brand-blue/20 px-3 py-1 rounded-full text-brand-blue text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Star Alliance / SkyTeam</span>
        </div>
      </div>

      {/* Flight Cards list */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {FLIGHTS_DATA.map((ticket, tIdx) => (
          <div
            key={tIdx}
            className="glass-panel hover:border-brand-blue/30 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 relative h-fit"
          >
            {/* Boarding pass accent */}
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 ${
                ticket.type === "Outbound" ? "bg-brand-gold" : "bg-brand-blue"
              }`}
            ></div>

            {/* Ticket Header */}
            <div className="p-6 border-b border-white/5 bg-brand-bg-secondary/35 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-lg ${
                    ticket.type === "Outbound"
                      ? "bg-brand-gold/15 text-brand-gold"
                      : "bg-brand-blue/15 text-brand-blue"
                  }`}
                >
                  <Plane className={`w-5 h-5 ${ticket.type === "Return" ? "rotate-180" : ""}`} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
                    {ticket.type === "Outbound" 
                      ? (language === "th" ? "เที่ยวบินขาไป" : language === "zh" ? "去程航班" : "Outbound Journey")
                      : (language === "th" ? "เที่ยวบินขากลับ" : language === "zh" ? "回程航班" : "Return Journey")
                    }
                  </h3>
                  <span className="text-xs text-gray-400 font-light">{ticket.route}</span>
                </div>
              </div>

              <div className="flex flex-col text-right">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                  {t.flightDuration}
                </span>
                <span className="text-sm font-bold text-gray-300 font-display">
                  {ticket.totalDuration}
                </span>
              </div>
            </div>

            {/* Flight Legs / Layovers */}
            <div className="p-6 flex flex-col gap-6 relative">
              {ticket.legs.map((leg, lIdx) => {
                const legKey = `${ticket.type}-${lIdx}`;
                const isExpanded = expandedLegKey === legKey;
                const isLoading = loadingLegs[legKey];
                const history = historyData[legKey] || [];

                return (
                  <div key={lIdx} className="flex flex-col gap-3.5 relative">
                    {/* Layover Indicator */}
                    {lIdx > 0 && (
                      <div className="flex items-center gap-2 py-1.5 px-3 rounded bg-brand-bg-primary/70 border border-white/5 text-[10px] text-brand-blue font-semibold uppercase tracking-wider w-fit self-center -my-3.5 z-10">
                        <Clock className="w-3 h-3 text-brand-blue" />
                        {language === "th" ? "ต่อเครื่องที่ ฉงชิ่ง (CKG)" : language === "zh" ? "在重庆（CKG）中转" : "Layover in CKG (Chongqing)"}
                      </div>
                    )}

                    {/* Leg Detail */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Airline Info */}
                      <div className="md:col-span-3 flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-gray-200">{leg.carrier}</span>
                        <span className="text-[10px] text-brand-gold font-semibold uppercase tracking-wider">
                          {leg.flightNo}
                        </span>
                        <span className="text-[9px] text-gray-500 font-light mt-0.5">{leg.aircraft}</span>
                      </div>

                      {/* Timeline Node Outbound Departure */}
                      <div className="md:col-span-3 flex flex-col">
                        <span className="text-lg font-bold text-gray-100 font-display">
                          {leg.departureTime}
                        </span>
                        <span className="text-[10px] text-brand-blue font-semibold uppercase tracking-wider truncate max-w-full" title={leg.departureAirport}>
                          {leg.departureAirport.split(" ")[0]}
                        </span>
                        <span className="text-[9px] text-gray-500 font-light mt-0.5">{leg.date}</span>
                      </div>

                      {/* Directional Indicator */}
                      <div className="md:col-span-3 flex flex-col items-center justify-center text-center py-2 px-1 relative">
                        <div className="w-full flex items-center justify-between text-gray-600 gap-1">
                          <PlaneTakeoff className="w-3.5 h-3.5 text-gray-500" />
                          <span className="h-0.5 flex-1 bg-white/10 border-t border-dashed border-white/20"></span>
                          <PlaneLanding className="w-3.5 h-3.5 text-gray-500" />
                        </div>
                        <span className="text-[9px] text-gray-500 mt-1 font-light flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {leg.duration}
                        </span>
                      </div>

                      {/* Timeline Node Outbound Arrival */}
                      <div className="md:col-span-3 flex flex-col text-left md:text-right">
                        <span className="text-lg font-bold text-gray-100 font-display">
                          {leg.arrivalTime}
                        </span>
                        <span className="text-[10px] text-brand-blue font-semibold uppercase tracking-wider truncate max-w-full" title={leg.arrivalAirport}>
                          {leg.arrivalAirport.split(" ")[0]}
                        </span>
                        <span className="text-[9px] text-gray-500 font-light mt-0.5">{leg.date}</span>
                      </div>
                    </div>

                    {/* Live status check links & History Toggle */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-1 pt-2 border-t border-white/5 text-[10px]">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-gray-500 font-semibold uppercase tracking-wider mr-1">
                          {language === "th" ? "เช็กสด:" : language === "zh" ? "实时状态:" : "Live Track:"}
                        </span>
                        {(() => {
                          const cleanFlightNo = leg.flightNo.includes("/") 
                            ? leg.flightNo.split("/")[0].trim() 
                            : leg.flightNo.trim();
                          
                          return (
                            <>
                              <a
                                href={`https://www.flightradar24.com/data/flights/${cleanFlightNo.toLowerCase()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500 hover:text-black border border-brand-gold/30 hover:border-transparent text-brand-gold transition-all duration-300 font-medium"
                              >
                                FlightRadar24 ↗
                              </a>
                              <a
                                href={`https://www.google.com/search?q=flight+status+${cleanFlightNo.toUpperCase()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-0.5 rounded bg-blue-500/10 hover:bg-blue-500 hover:text-white border border-brand-blue/30 hover:border-transparent text-brand-blue transition-all duration-300 font-medium"
                              >
                                {language === "th" ? "เช็คใน Google ↗" : language === "zh" ? "谷歌搜索 ↗" : "Google Status ↗"}
                              </a>
                            </>
                          );
                        })()}
                      </div>

                      {/* Expander Button */}
                      <button
                        onClick={() => toggleHistory(ticket.type, lIdx, leg.flightNo, leg.departureAirport)}
                        className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all duration-300 border font-semibold tracking-wider uppercase text-[9px] ${
                          isExpanded
                            ? "bg-brand-gold text-brand-bg-primary border-transparent"
                            : "bg-brand-bg-primary hover:bg-brand-bg-secondary text-brand-gold border-brand-gold/30"
                        }`}
                      >
                        <History className="w-3 h-3" />
                        {language === "th" ? "ประวัติ 2 สัปดาห์" : language === "zh" ? "2周航班历史" : "2-Week History"}
                      </button>
                    </div>

                    {/* Flight History Collapsible Drawer */}
                    {isExpanded && (
                      <div className="mt-3 p-4 rounded-xl bg-brand-bg-primary/90 border border-brand-gold/20 animate-fadeIn flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] font-bold text-brand-gold flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {language === "th"
                              ? `ประวัติย้อนหลัง 14 วันของ ${leg.flightNo}`
                              : language === "zh"
                              ? `${leg.flightNo} 过去14天飞行轨迹`
                              : `14-Day Performance History for ${leg.flightNo}`}
                          </span>
                          <span className="text-[9px] text-gray-500 font-light">Data updated in real-time</span>
                        </div>

                        {isLoading ? (
                          <div className="flex flex-col items-center justify-center py-6 text-brand-gold text-xs gap-2">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span>Loading flight records...</span>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-[10px] text-gray-300">
                              <thead>
                                <tr className="border-b border-white/10 text-gray-500 font-semibold uppercase tracking-wider">
                                  <th className="py-2 px-1">Date</th>
                                  <th className="py-2 px-1">Aircraft</th>
                                  <th className="py-2 px-1">Scheduled</th>
                                  <th className="py-2 px-1">Actual Times</th>
                                  <th className="py-2 px-1">Delay</th>
                                  <th className="py-2 px-1 text-right">Status</th>
                                  <th className="py-2 px-1 text-right">Source</th>
                                </tr>
                              </thead>
                              <tbody>
                                {history.map((record, rIdx) => (
                                  <tr
                                    key={rIdx}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                  >
                                    <td className="py-2.5 px-1 font-medium">{record.date}</td>
                                    <td className="py-2.5 px-1 text-gray-400">{record.aircraft}</td>
                                    <td className="py-2.5 px-1 text-gray-500">
                                      {record.departureScheduled} ➔ {record.arrivalScheduled}
                                    </td>
                                    <td className="py-2.5 px-1 font-semibold text-gray-200">
                                      {record.departureActual} ➔ {record.arrivalActual}
                                    </td>
                                    <td className="py-2.5 px-1">
                                      {record.delayMinutes > 0 ? (
                                        <span className={record.delayMinutes > 20 ? "text-red-400 font-bold" : "text-amber-400"}>
                                          +{record.delayMinutes}m
                                        </span>
                                      ) : (
                                        <span className="text-emerald-400">On Time</span>
                                      )}
                                    </td>
                                    <td className="py-2.5 px-1 text-right">
                                      <span
                                        className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                                          record.status === "Landed"
                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                                        }`}
                                      >
                                        {record.status}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-1 text-right">
                                      <a
                                        href={`https://www.flightradar24.com/data/flights/${record.flightNo.toLowerCase().split("/")[0].trim()}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[8px] font-bold text-brand-blue hover:text-brand-blue-hover hover:underline transition-colors uppercase tracking-wider"
                                      >
                                        Info ↗
                                      </a>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Ticket Footer / Luggage info */}
            <div className="p-4 bg-brand-bg-secondary/45 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <Luggage className="w-4 h-4 text-brand-gold" />
                <span>{t.flightAllowance}: <strong className="text-gray-200">{ticket.baggageLimit}</strong></span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-amber-400/90 font-light bg-amber-500/5 px-2.5 py-1 rounded border border-amber-500/10">
                <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{t.flightAlert}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Airspace Radar Widget */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4 mt-2">
        <h3 className="font-display font-bold text-base text-brand-gold flex items-center gap-2 border-b border-white/10 pb-3">
          <Compass className="w-5 h-5 text-brand-gold animate-pulse-gold" />
          {language === "th" ? "เรดาร์การบินน่านฟ้าซินเจียงแบบเรียลไทม์" : language === "zh" ? "实时新疆领空飞行雷达图" : "Live Xinjiang Airspace Flight Radar"}
        </h3>
        <p className="text-xs text-gray-400">
          {language === "th"
            ? "แผนที่เรดาร์การบินแสดงน่านฟ้าบริเวณซินเจียงตอนใต้ (คัชการ์, อักซู, ทัชเคอร์กัน) แบบสดๆ คุณสามารถซูมเข้า-ออกและคลิกดูข้อมูลเครื่องบินแต่ละลำได้โดยตรง"
            : language === "zh" ? "实时监控南疆上空（喀什、阿克苏、乌鲁木齐等地区）的所有飞行动态图。" : "Interactive flight radar screen showing live commercial airspace traffic operating over Southern Xinjiang and transit hubs."}
        </p>

        {/* Embedded Iframe */}
        <div className="w-full aspect-[2.3/1] min-h-[380px] rounded-xl overflow-hidden border border-white/10 relative bg-brand-bg-primary/50 shadow-inner">
          <iframe
            src="https://www.radarbox.com/widget?lat=39.5&lng=80.5&z=5&theme=dark"
            className="w-full h-full border-none opacity-85 hover:opacity-100 transition-opacity duration-300"
            title="Xinjiang Live Flight Radar"
          />
        </div>
      </div>
    </div>
  );
}
