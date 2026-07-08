"use client";

import React, { useState } from "react";
import { FLIGHTS_DATA } from "../data/travelData";
import { TRANSLATIONS_DATA } from "../data/translations";
import { useTravelStore } from "../store/useTravelStore";
import { FlightLeg } from "../types";
import {
  Plane, PlaneTakeoff, PlaneLanding, Clock, ShieldAlert, Award, Luggage,
  Compass, History, Loader2, Calendar, Activity, AlertCircle, Wifi,
  ArrowRight, Building2, Gauge, Tag,
} from "lucide-react";

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

// Extract the 3-letter IATA code from a label like "Bangkok Suvarnabhumi (BKK)"
const iataOf = (label: string): string => {
  const m = label.match(/\(([A-Z]{3})\)/);
  return m ? m[1] : "";
};

// Friendly localized status label + color
const statusBadge = (status: string, lang: "en" | "th" | "zh") => {
  const labelMap: Record<string, { th: string; en: string; zh: string; cls: string }> = {
    landed: { th: "ลงจอดแล้ว", en: "Landed", zh: "已降落", cls: "bg-emerald-500/15 text-emerald-700 border-emerald-500/25" },
    active: { th: "กำลังบิน", en: "In Flight", zh: "飞行中", cls: "bg-brand-blue/15 text-brand-blue border-brand-blue/25" },
    scheduled: { th: "ตามตาราง", en: "Scheduled", zh: "已计划", cls: "bg-amber-500/15 text-amber-700 border-amber-500/25" },
    cancelled: { th: "ยกเลิก", en: "Cancelled", zh: "已取消", cls: "bg-red-500/15 text-red-600 border-red-500/25" },
    incident: { th: "ผิดปกติ", en: "Incident", zh: "事故", cls: "bg-red-500/15 text-red-600 border-red-500/25" },
    diverted: { th: "เปลี่ยนเส้นทาง", en: "Diverted", zh: "备降", cls: "bg-orange-500/15 text-orange-700 border-orange-500/25" },
  };
  const s = labelMap[status] || labelMap.scheduled;
  return { label: s[lang], cls: s.cls };
};

export default function FlightsScreen() {
  const { language } = useTravelStore();
  const t = TRANSLATIONS_DATA[language].ui;

  const [expandedLegKey, setExpandedLegKey] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<Record<string, HistoryRecord[]>>({});
  const [loadingLegs, setLoadingLegs] = useState<Record<string, boolean>>({});

  // Real-time live status states
  const [liveFlightData, setLiveFlightData] = useState<Record<string, any>>({});
  const [loadingLive, setLoadingLive] = useState<Record<string, boolean>>({});
  const [liveError, setLiveError] = useState<Record<string, string | null>>({});
  const [liveUpdatedAt, setLiveUpdatedAt] = useState<Record<string, string>>({});

  const fetchLiveFlightStatus = async (leg: FlightLeg, legKey: string) => {
    setLoadingLive((prev) => ({ ...prev, [legKey]: true }));
    setLiveError((prev) => ({ ...prev, [legKey]: null }));
    try {
      const cleanNo = leg.flightNo.includes("/") ? leg.flightNo.split("/")[0].trim() : leg.flightNo.trim();
      const depIata = iataOf(leg.departureAirport);
      const arrIata = iataOf(leg.arrivalAirport);
      const res = await fetch(
        `/api/flights/live?flightNo=${cleanNo}&depIata=${depIata}&arrIata=${arrIata}`
      );
      if (res.ok) {
        const data = await res.json();
        setLiveFlightData((prev) => ({ ...prev, [legKey]: data }));
        setLiveUpdatedAt((prev) => ({
          ...prev,
          [legKey]: new Date().toLocaleTimeString(language === "th" ? "th-TH" : "en-GB"),
        }));
      } else {
        setLiveError((prev) => ({ ...prev, [legKey]: "Failed to fetch live flight status." }));
      }
    } catch (err) {
      console.error("Failed to load live flight status:", err);
      setLiveError((prev) => ({ ...prev, [legKey]: "Network error." }));
    } finally {
      setLoadingLive((prev) => ({ ...prev, [legKey]: false }));
    }
  };

  const toggleHistory = async (ticketType: string, legIdx: number, leg: FlightLeg) => {
    const key = `${ticketType}-${legIdx}`;
    if (expandedLegKey === key) {
      setExpandedLegKey(null);
      return;
    }
    setExpandedLegKey(key);
    if (historyData[key]) return;

    setLoadingLegs((prev) => ({ ...prev, [key]: true }));
    try {
      const cleanNo = leg.flightNo.includes("/") ? leg.flightNo.split("/")[0].trim() : leg.flightNo.trim();
      const originCode = iataOf(leg.departureAirport) || "CKG";
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

  const th = language === "th";
  const zh = language === "zh";
  const L = (thStr: string, enStr: string, zhStr: string) => (th ? thStr : zh ? zhStr : enStr);

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 animate-fadeIn max-w-6xl mx-auto w-full pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 border-b border-gray-900/10 pb-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-gold-gradient tracking-tight">
            {t.flightHeader}
          </h2>
          <p className="text-xs text-gray-600">{t.flightDesc}</p>
        </div>
        <div className="flex items-center gap-1.5 bg-brand-blue/10 border border-brand-blue/20 px-3 py-1 rounded-full text-brand-blue text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Star Alliance / SkyTeam</span>
        </div>
      </div>

      {/* Flight Tickets (Trip.com-style vertical journey timeline) */}
      <div className="flex flex-col gap-6">
        {FLIGHTS_DATA.map((ticket, tIdx) => {
          const isOut = ticket.type === "Outbound";
          return (
            <div
              key={tIdx}
              className="glass-panel rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:border-brand-blue/30 relative"
            >
              {/* Top accent bar */}
              <div className={`h-1.5 ${isOut ? "bg-brand-gold" : "bg-brand-blue"}`}></div>

              {/* Ticket Header */}
              <div className="p-5 flex items-center justify-between gap-4 bg-brand-bg-secondary/40">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isOut ? "bg-brand-gold/15 text-brand-gold" : "bg-brand-blue/15 text-brand-blue"}`}>
                    <Plane className={`w-5 h-5 ${!isOut ? "rotate-180" : ""}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                      {isOut ? L("เที่ยวบินขาไป", "Outbound Journey", "去程航班") : L("เที่ยวบินขากลับ", "Return Journey", "回程航班")}
                    </h3>
                    <span className="text-[11px] text-gray-600 font-medium">{ticket.route}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end text-right">
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">{t.flightDuration}</span>
                  <span className="text-sm font-bold text-gray-700 font-display">{ticket.totalDuration}</span>
                </div>
              </div>

              {/* Legs — Trip.com timeline */}
              <div className="p-5 flex flex-col gap-4">
                {ticket.legs.map((leg, lIdx) => {
                  const legKey = `${ticket.type}-${lIdx}`;
                  const isExpanded = expandedLegKey === legKey;
                  const isLoading = loadingLegs[legKey];
                  const history = historyData[legKey] || [];
                  const live = liveFlightData[legKey];
                  const cleanFlightNo = leg.flightNo.includes("/") ? leg.flightNo.split("/")[0].trim() : leg.flightNo.trim();
                  const depCity = leg.departureAirport.split("(")[0].trim();
                  const arrCity = leg.arrivalAirport.split("(")[0].trim();
                  const depIata = iataOf(leg.departureAirport);
                  const arrIata = iataOf(leg.arrivalAirport);

                  return (
                    <div key={lIdx} className="flex flex-col gap-3">
                      {/* Layover chip between legs */}
                      {lIdx > 0 && (
                        <div className="flex items-center justify-center -my-1 z-10">
                          <div className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-[10px] text-brand-blue font-semibold uppercase tracking-wider">
                            <Clock className="w-3 h-3" />
                            {L(`ต่อเครื่องที่ ${depCity}`, `Layover in ${depCity}`, `${depCity}中转`)}
                          </div>
                        </div>
                      )}

                      {/* ===== Trip.com-style flight card ===== */}
                      <div className="rounded-2xl border border-gray-900/8 bg-white/70 hover:bg-white transition-colors overflow-hidden">
                        {/* Carrier row */}
                        <div className="flex items-center justify-between px-4 py-2.5 bg-brand-bg-secondary/40 border-b border-gray-900/5">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isOut ? "bg-brand-gold/15" : "bg-brand-blue/15"}`}>
                              <Plane className={`w-3.5 h-3.5 ${isOut ? "text-brand-gold" : "text-brand-blue rotate-180"}`} />
                            </div>
                            <div className="flex flex-col leading-tight">
                              <span className="text-[11px] font-bold text-gray-800">{leg.carrier}</span>
                              <span className="text-[9px] text-brand-gold font-bold tracking-wider">{leg.flightNo}</span>
                            </div>
                          </div>
                          <span className="text-[9px] text-gray-500 font-medium hidden sm:block">
                            {leg.date} • {leg.aircraft}
                          </span>
                        </div>

                        {/* Timeline body: departure ── plane ── arrival */}
                        <div className="px-4 py-4">
                          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                            {/* Departure */}
                            <div className="flex flex-col">
                              <span className="text-2xl font-extrabold text-gray-900 font-display leading-none tracking-tight">
                                {leg.departureTime}
                              </span>
                              <span className="text-base font-extrabold text-gray-800 mt-1 leading-none">{depIata}</span>
                              <span className="text-[10px] text-gray-500 mt-1 line-clamp-1" title={depCity}>{depCity}</span>
                              <span className="text-[9px] text-gray-400 mt-0.5">{leg.date}</span>
                            </div>

                            {/* Connector */}
                            <div className="flex flex-col items-center gap-1 px-2 min-w-[70px]">
                              <span className="text-[9px] text-gray-500 font-semibold flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" /> {leg.duration}
                              </span>
                              <div className="w-full flex items-center justify-between relative">
                                <PlaneTakeoff className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                <div className="flex-1 mx-1 relative h-px">
                                  <div className="absolute inset-0 border-t border-dashed border-gray-300"></div>
                                  <div className="absolute left-1/2 -top-[7px] -translate-x-1/2">
                                    <Plane className="w-3.5 h-3.5 text-brand-gold rotate-90" />
                                  </div>
                                </div>
                                <PlaneLanding className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              </div>
                              <span className="text-[8px] text-gray-400 font-medium">{L("ตรง", "Direct", "直飞")}</span>
                            </div>

                            {/* Arrival */}
                            <div className="flex flex-col items-end text-right">
                              <span className="text-2xl font-extrabold text-gray-900 font-display leading-none tracking-tight">
                                {leg.arrivalTime}
                              </span>
                              <span className="text-base font-extrabold text-gray-800 mt-1 leading-none">{arrIata}</span>
                              <span className="text-[10px] text-gray-500 mt-1 line-clamp-1" title={arrCity}>{arrCity}</span>
                              <span className="text-[9px] text-gray-400 mt-0.5">{leg.date}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-t border-gray-900/5 bg-brand-bg-secondary/30">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <a
                              href={`https://www.flightradar24.com/data/flights/${cleanFlightNo.toLowerCase()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 rounded bg-brand-gold/10 hover:bg-brand-gold hover:text-white border border-brand-gold/30 text-brand-gold text-[9px] font-medium transition-all"
                            >
                              FlightRadar24 ↗
                            </a>
                            <a
                              href={`https://www.google.com/search?q=flight+status+${cleanFlightNo.toUpperCase()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 rounded bg-brand-blue/10 hover:bg-brand-blue hover:text-white border border-brand-blue/30 text-brand-blue text-[9px] font-medium transition-all"
                            >
                              {L("เช็คใน Google ↗", "Google Status ↗", "谷歌搜索 ↗")}
                            </a>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => fetchLiveFlightStatus(leg, legKey)}
                              disabled={loadingLive[legKey]}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                                live ? "bg-emerald-600 text-white border-transparent" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                              }`}
                            >
                              {loadingLive[legKey] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Activity className="w-3 h-3" />}
                              {L("ข้อมูลเรียลไทม์", "Real-Time Live", "真实实时数据")}
                            </button>
                            <button
                              onClick={() => toggleHistory(ticket.type, lIdx, leg)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                                isExpanded ? "bg-brand-gold text-brand-bg-primary border-transparent" : "bg-brand-bg-primary hover:bg-brand-bg-secondary text-brand-gold border-brand-gold/30"
                              }`}
                            >
                              <History className="w-3 h-3" />
                              {L("ประวัติ 2 สัปดาห์", "2-Week History", "2周航班历史")}
                            </button>
                          </div>
                        </div>

                        {/* ===== Live real-time result ===== */}
                        {liveError[legKey] && (
                          <div className="mx-4 mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span>{liveError[legKey]}</span>
                          </div>
                        )}

                        {live !== undefined && (
                          <div className="mx-4 mb-4 rounded-xl bg-slate-50 border border-brand-gold/30 animate-fadeIn overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-900/10 bg-white/60">
                              <span className="text-[10px] font-extrabold text-brand-gold flex items-center gap-1.5">
                                <Activity className="w-3.5 h-3.5 animate-pulse" />
                                {L(
                                  `ข้อมูลเที่ยวบินสด (${leg.flightNo})`,
                                  `Live Flight Telemetry (${leg.flightNo})`,
                                  `实时航班数据 (${leg.flightNo})`
                                )}
                              </span>
                              <span className="text-[8px] text-emerald-700 font-extrabold bg-emerald-500/15 border border-emerald-500/25 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <Wifi className="w-2.5 h-2.5" /> LIVE
                              </span>
                            </div>

                            {live === null ? (
                              <div className="px-4 py-3 text-xs text-amber-700 font-semibold flex items-start gap-1.5">
                                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                <span>
                                  {L(
                                    "API เชื่อมต่อสำเร็จ แต่ยังไม่พบข้อมูลเที่ยวบินสดสำหรับเส้นทางนี้ในขณะนี้ (เที่ยวบินอยู่นอกช่วงเวลาบิน)",
                                    "AVIATIONSTACK connected, but no active record found for this exact route right now (flight is outside its scheduled window).",
                                    "API已连接，但当前该航线暂无实时数据（航班不在运行时段）。"
                                  )}
                                </span>
                              </div>
                            ) : (
                              <div className="px-4 py-3 flex flex-col gap-3">
                                {/* Live route summary */}
                                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-lg font-extrabold text-gray-900 font-display leading-none">
                                      {live.departure?.actualTime || live.departure?.scheduledTime || leg.departureTime}
                                    </span>
                                    <span className="text-[10px] text-gray-500 mt-0.5">
                                      {live.departure?.airport || depCity} ({live.departure?.iata || depIata})
                                    </span>
                                  </div>
                                  <Plane className="w-4 h-4 text-brand-gold rotate-90" />
                                  <div className="flex flex-col items-end text-right">
                                    <span className="text-lg font-extrabold text-gray-900 font-display leading-none">
                                      {live.arrival?.actualTime || live.arrival?.estimatedTime || live.arrival?.scheduledTime || leg.arrivalTime}
                                    </span>
                                    <span className="text-[10px] text-gray-500 mt-0.5">
                                      {live.arrival?.airport || arrCity} ({live.arrival?.iata || arrIata})
                                    </span>
                                  </div>
                                </div>

                                {/* Live data grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px]">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-gray-500 font-bold uppercase flex items-center gap-1">
                                      <Gauge className="w-3 h-3" /> {L("สถานะ", "Status", "状态")}
                                    </span>
                                    <span className={`inline-flex w-fit px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${statusBadge(live.status, language).cls}`}>
                                      {statusBadge(live.status, language).label}
                                    </span>
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-gray-500 font-bold uppercase flex items-center gap-1">
                                      <Plane className="w-3 h-3" /> {L("เครื่องบิน", "Aircraft", "机型")}
                                    </span>
                                    <span className="font-bold text-gray-800">{live.aircraft || "—"}</span>
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-gray-500 font-bold uppercase flex items-center gap-1">
                                      <Building2 className="w-3 h-3" /> {L("เทอร์มินัล/เกตต้นทาง", "Dep Terminal/Gate", "出发航站楼/登机口")}
                                    </span>
                                    <span className="font-bold text-gray-800">
                                      {live.departure?.terminal ? `T${live.departure.terminal}` : "—"}
                                      {live.departure?.gate ? ` • Gate ${live.departure.gate}` : ""}
                                    </span>
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-gray-500 font-bold uppercase flex items-center gap-1">
                                      <Luggage className="w-3 h-3" /> {L("สายพานกระเป๋า/เกตปลายทาง", "Baggage/Arr Gate", "行李带/到达口")}
                                    </span>
                                    <span className="font-bold text-gray-800">
                                      {live.arrival?.baggage ? `Belt ${live.arrival.baggage}` : ""}
                                      {live.arrival?.gate ? `${live.arrival.baggage ? " • " : ""}Gate ${live.arrival.gate}` : ""}
                                      {!live.arrival?.baggage && !live.arrival?.gate ? "—" : ""}
                                    </span>
                                  </div>
                                </div>

                                {live.flightDate && (
                                  <div className="text-[9px] text-gray-500 font-semibold flex items-center gap-1 border-t border-gray-900/5 pt-2">
                                    <Calendar className="w-3 h-3" />
                                    {L("วันที่บิน", "Flight date", "航班日期")}: {live.flightDate}
                                  </div>
                                )}
                              </div>
                            )}

                            {liveUpdatedAt[legKey] && (
                              <div className="px-4 py-2 text-[9px] text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-500/5 border-t border-emerald-500/15">
                                <Wifi className="w-2.5 h-2.5" />
                                {L(
                                  `เชื่อมต่อ AVIATIONSTACK สำเร็จ • อัปเดตล่าสุด ${liveUpdatedAt[legKey]}`,
                                  `AVIATIONSTACK connected • last updated ${liveUpdatedAt[legKey]}`,
                                  `AVIATIONSTACK 已连接 • 最近更新 ${liveUpdatedAt[legKey]}`
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* ===== History drawer ===== */}
                        {isExpanded && (
                          <div className="mx-4 mb-4 p-3 rounded-xl bg-slate-50 border border-brand-gold/20 animate-fadeIn">
                            <div className="flex items-center justify-between border-b border-gray-900/10 pb-2">
                              <span className="text-[10px] font-bold text-brand-gold flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {L(
                                  `ประวัติย้อนหลัง 14 วันของ ${leg.flightNo}`,
                                  `14-Day Performance History for ${leg.flightNo}`,
                                  `${leg.flightNo} 过去14天飞行记录`
                                )}
                              </span>
                              <span className="text-[9px] text-gray-500">{L("ข้อมูลอัปเดตเรียลไทม์", "Real-time data", "实时数据")}</span>
                            </div>

                            {isLoading ? (
                              <div className="flex flex-col items-center justify-center py-6 text-brand-gold text-xs gap-2">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span>Loading flight records...</span>
                              </div>
                            ) : (
                              <div className="overflow-x-auto mt-2">
                                <table className="w-full text-left border-collapse text-[10px] text-gray-700">
                                  <thead>
                                    <tr className="border-b border-gray-900/10 text-gray-500 font-semibold uppercase tracking-wider">
                                      <th className="py-2 px-1">{L("วันที่", "Date", "日期")}</th>
                                      <th className="py-2 px-1">{L("เครื่องบิน", "Aircraft", "机型")}</th>
                                      <th className="py-2 px-1">{L("ตามตาราง", "Scheduled", "计划")}</th>
                                      <th className="py-2 px-1">{L("เวลาจริง", "Actual", "实际")}</th>
                                      <th className="py-2 px-1">{L("ความล่าช้า", "Delay", "延误")}</th>
                                      <th className="py-2 px-1 text-right">{L("สถานะ", "Status", "状态")}</th>
                                      <th className="py-2 px-1 text-right">{L("แหล่งข้อมูล", "Source", "来源")}</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {history.map((record, rIdx) => (
                                      <tr key={rIdx} className="border-b border-gray-900/5 hover:bg-gray-900/5">
                                        <td className="py-2.5 px-1 font-medium text-gray-800">{record.date}</td>
                                        <td className="py-2.5 px-1 text-gray-600">{record.aircraft}</td>
                                        <td className="py-2.5 px-1 text-gray-500">{record.departureScheduled} ➔ {record.arrivalScheduled}</td>
                                        <td className="py-2.5 px-1 font-semibold text-gray-800">{record.departureActual} ➔ {record.arrivalActual}</td>
                                        <td className="py-2.5 px-1">
                                          {record.delayMinutes > 0 ? (
                                            <span className={record.delayMinutes > 20 ? "text-red-600 font-bold" : "text-amber-600"}>
                                              +{record.delayMinutes}m
                                            </span>
                                          ) : (
                                            <span className="text-emerald-600">{L("ตรงเวลา", "On Time", "准点")}</span>
                                          )}
                                        </td>
                                        <td className="py-2.5 px-1 text-right">
                                          <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${record.status === "Landed" ? "bg-emerald-500/15 text-emerald-700 border border-emerald-500/25" : "bg-red-500/15 text-red-600 border border-red-500/25"}`}>
                                            {record.status}
                                          </span>
                                        </td>
                                        <td className="py-2.5 px-1 text-right">
                                          <a
                                            href={`https://www.flightradar24.com/data/flights/${record.flightNo.toLowerCase().split("/")[0].trim()}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[8px] font-bold text-brand-blue hover:underline uppercase tracking-wider"
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
                    </div>
                  );
                })}
              </div>

              {/* Ticket footer — luggage & alert */}
              <div className="p-4 bg-brand-bg-secondary/50 border-t border-gray-900/5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Luggage className="w-4 h-4 text-brand-gold" />
                  <span>{t.flightAllowance}: <strong className="text-gray-800">{ticket.baggageLimit}</strong></span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-amber-700 font-medium bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                  <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{t.flightAlert}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Airspace Radar Widget */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-900/5 flex flex-col gap-4 mt-2">
        <h3 className="font-display font-bold text-base text-brand-gold flex items-center gap-2 border-b border-gray-900/10 pb-3">
          <Compass className="w-5 h-5 text-brand-gold animate-pulse-gold" />
          {L("เรดาร์การบินน่านฟ้าซินเจียงแบบเรียลไทม์", "Live Xinjiang Airspace Flight Radar", "实时新疆领空飞行雷达图")}
        </h3>
        <p className="text-xs text-gray-600">
          {L(
            "แผนที่เรดาร์การบินแสดงน่านฟ้าบริเวณซินเจียงตอนใต้ (คัชการ์, อักซู, ทัชเคอร์กัน) แบบสดๆ สามารถซูมและคลิกดูข้อมูลเครื่องบินแต่ละลำได้",
            "Interactive flight radar showing live commercial airspace traffic over Southern Xinjiang and transit hubs.",
            "实时监控南疆上空（喀什、阿克苏、塔什库尔干）的所有飞行动态。"
          )}
        </p>
        <div className="w-full aspect-[2.3/1] min-h-[380px] rounded-xl overflow-hidden border border-gray-900/10 relative bg-brand-bg-primary/50 shadow-inner">
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
