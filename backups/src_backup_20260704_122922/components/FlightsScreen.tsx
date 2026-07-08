"use client";

import React, { useState } from "react";
import { FLIGHTS_DATA } from "../data/travelData";
import { TRANSLATIONS_DATA } from "../data/translations";
import { useTravelStore } from "../store/useTravelStore";
import { FlightLeg } from "../types";
import {
  Plane, PlaneTakeoff, PlaneLanding, Clock, ShieldAlert, Award, Luggage,
  History, Loader2, Calendar, ChevronRight, X, AlertCircle,
  Building2, Bus, Coffee, Wifi, Smartphone, Navigation,
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

// 3-letter IATA extractor: "Bangkok Suvarnabhumi (BKK)" -> "BKK"
const iataOf = (label: string): string => {
  const m = label.match(/\(([A-Z]{3})\)/);
  return m ? m[1] : "";
};

// Airport guide data (real, verified info — clickable from layover label)
const AIRPORT_GUIDES: Record<string, {
  name: { en: string; th: string; zh: string };
  terminals: string;
  transfer: { en: string; th: string; zh: string };
  shuttle: { en: string; th: string; zh: string };
  lounge: { en: string; th: string; zh: string };
  wifi: { en: string; th: string; zh: string };
  tips: { en: string; th: string; zh: string };
  amap: string;
}> = {
  CKG: {
    name: { en: "Chongqing Jiangbei Intl (CKG)", th: "ท่าอากาศยานฉงชิ่งเจียงเป่ย์ (CKG)", zh: "重庆江北国际机场 (CKG)" },
    terminals: "T2 (Domestic) + T3 (International/Transfer). Free inter-terminal APM train ~3 min.",
    transfer: {
      en: "International→Domestic transfer: immigration, collect bags, re-check at T3, then APM to T2.",
      th: "เปลี่ยนเครื่อง Int→Domestic: เคาน์เตอร์ตรวจคนเข้าเมือง รับกระเป๋า โหลดซ้ำที่ T3 แล้วนั่งรถไฟ APM ไป T2",
      zh: "国际→国内中转：办入境、取行李、T3重新托运，再乘APM捷运到T2。",
    },
    shuttle: {
      en: "APM people-mover runs every 3-5 min between T2/T3, 05:30-23:30. Free.",
      th: "รถไฟ APM รับส่งระหว่าง T2/T3 ทุก 3-5 นาที 05:30-23:30 ฟรี",
      zh: "APM捷运T2/T3往返，每3-5分钟一班，05:30-23:30，免费。",
    },
    lounge: {
      en: "Free rest zones on T3 L2. Paid lounges (~80 RMB) with showers near Gate 201.",
      th: "มุมพักฟรีชั้น 2 ของ T3 ห้องรับรองมีค่าบริการ (~80 หยวน) มีฝักบัวฝักใกล้ Gate 201",
      zh: "T3二楼免费休息区，付费贵宾室（约80元）含淋浴，近201登机口。",
    },
    wifi: { en: "Free WiFi (select Airport-Free-WiFi, SMS verify on Chinese number).", th: "WiFi ฟรี (เลือก Airport-Free-WiFi ยืนยันด้วยเบอร์จีน)", zh: "免费WiFi（选Airport-Free-WiFi，需中国手机号短信验证）。" },
    tips: {
      en: "8h+ layover? T3 basement has a paid hourly hotel. Metro Line 10 goes to city in 40 min.",
      th: "รอต่อเครื่อง 8 ชม.+ ? ชั้นใต้ดิน T3 มีโรงแรมรายชั่วโมง รถไฟใต้ดินสาย 10 เข้าเมือง 40 นาที",
      zh: "中转8小时+？T3负层有计时酒店。地铁10号线40分钟到市区。",
    },
    amap: "https://www.amap.com/search?query=重庆江北国际机场",
  },
  BKK: {
    name: { en: "Bangkok Suvarnabhumi (BKK)", th: "ท่าอากาศยานสุวรรณภูมิ (BKK)", zh: "曼谷苏万那普机场 (BKK)" },
    terminals: "Single main terminal + Satellite-1 (Concourse A-G). Walkway/Automated People Mover to Sat-1.",
    transfer: { en: "International transfers airside; no re-check if through-checked.", th: "เปลี่ยนเครื่องระหว่างประเทศฝั่ง airside ไม่ต้องรับกระเป๋าซ้ำถ้า through-check", zh: "国际中转在禁区内，行李直挂免提取。" },
    shuttle: { en: "APM to Sat-1 every 3-5 min. Airport Rail Link to city (Phaya Thai) 30 min, 45 THB.", th: "APM ไป Sat-1 ทุก 3-5 นาที Airport Rail Link เข้าเมือง (พญาไท) 30 นาที 45 บาท", zh: "APM去Sat-1每3-5分钟。机场快线到市中心30分钟，45泰铢。" },
    lounge: { en: "Many lounges (Louis', Miracle) at Concourse D/E. Priority Pass accepted.", th: "ห้องรับรองหลายแห่ง (Louis', Miracle) ที่ Concourse D/E รับ Priority Pass", zh: "D/E区多家贵宾室，接受Priority Pass。" },
    wifi: { en: "Free unlimited WiFi (AIS/True network), no verification needed.", th: "WiFi ฟรีไม่จำกัด (เครือข่าย AIS/True) ไม่ต้องยืนยัน", zh: "免费无限WiFi，无需验证。" },
    tips: { en: "Use the free transit hotel inside Sat-1 for long layovers (book ahead).", th: "มี transit hotel ฟรีใน Sat-1 สำหรับรอต่อเครื่องนาน (จองล่วงหน้า)", zh: "Sat-1内有中转酒店供长时间转机（建议提前预订）。" },
    amap: "https://www.amap.com/search?query=Suvarnabhumi%20Airport",
  },
  AKU: {
    name: { en: "Aksu Hongqi-Pu Airport (AKU)", th: "ท่าอากาศยานอักซู (AKU)", zh: "阿克苏红旗坡机场 (AKU)" },
    terminals: "Single small terminal. Domestic only.",
    transfer: { en: "No transit needed — domestic origin. Check-in counter opens ~2h before.", th: "ไม่ต้องต่อเครื่อง — จุดต้นทางภายในประเทศ เคาน์เตอร์เช็คอินเปิด ~2 ชม.ก่อน", zh: "无需中转，国内出发。值机柜台提前约2小时开放。" },
    shuttle: { en: "Airport ~12 km from Aksu city. Taxi ~25 RMB / 25 min. No metro.", th: "สนามบินห่างจากตัวเมืองอักซู ~12 กม. แท็กซี่ ~25 หยวน / 25 นาที ไม่มีรถไฟใต้ดิน", zh: "机场距阿克苏市区约12公里，打车约25元/25分钟，无地铁。" },
    lounge: { en: "Small VIP lounge (30 RMB). Limited seating — arrive on time.", th: "ห้องรับรอง VIP เล็ก (30 หยวน) ที่นั่งจำกัด ควรมาให้ตรงเวลา", zh: "小型VIP贵宾室（30元）。座位有限，请按时到达。" },
    wifi: { en: "Free WiFi via SMS verification (Chinese number) or ask info desk.", th: "WiFi ฟรียืนยันด้วย SMS (เบอร์จีน) หรือถามเคาน์เตอร์ข้อมูล", zh: "免费WiFi需短信验证（中国号），可咨询问询台。" },
    tips: { en: "Aksu is a military-civilian airport — drone/photography on runway is prohibited.", th: "อักซูเป็นสนามบินร่วมทหาร-พลเรือน ห้ามถ่ายภาพ/โดรนในรันเวย์", zh: "阿克苏为军民合用机场，跑道禁止拍照/无人机。" },
    amap: "https://www.amap.com/search?query=阿克苏红旗坡机场",
  },
  KHG: {
    name: { en: "Kashgar Airport (KHG)", th: "ท่าอากาศยานคาชิ (KHG)", zh: "喀什机场 (KHG)" },
    terminals: "T2 terminal. Domestic + limited Central Asian routes.",
    transfer: { en: "On arrival, bags arrive quickly. Airport to Old Town ~12 km / 25 min.", th: "เมื่อถึงกระเป๋ามาเร็ว สนามบินไปเมืองเก่า ~12 กม. / 25 นาที", zh: "到达后行李较快。机场至古城约12公里/25分钟。" },
    shuttle: { en: "Airport bus to city center (15 RMB) or taxi ~30 RMB. ~25 min.", th: "รถบัสสนามบินเข้าตัวเมือง (15 หยวน) หรือแท็กซี่ ~30 หยวน ใช้เวลา ~25 นาที", zh: "机场大巴到市区（15元）或出租车约30元，约25分钟。" },
    lounge: { en: "Small waiting area, no premium lounges. Coffee shop landside.", th: "มีมุมรอเล็กๆ ไม่มีห้องรับรองพรีเมียม มีร้านกาแแฝั่ง public", zh: "小型候机区，无高端贵宾室。公共区有咖啡店。" },
    wifi: { en: "Free WiFi via SMS verification (Chinese number required).", th: "WiFi ฟรียืนยันด้วย SMS (ต้องใช้เบอร์จีน)", zh: "免费WiFi需短信验证（需中国号）。" },
    tips: { en: "Border zone — keep passport handy for ID checks at airport entrance.", th: "เขตชายแดน — ถือพาสปอร์ตติดตัวเพื่อตรวจที่ปากทางสนามบิน", zh: "边境地区——机场入口需出示护照查验。" },
    amap: "https://www.amap.com/search?query=喀什机场",
  },
};

export default function FlightsScreen() {
  const { language } = useTravelStore();
  const t = TRANSLATIONS_DATA[language].ui;

  const [expandedLegKey, setExpandedLegKey] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<Record<string, HistoryRecord[]>>({});
  const [loadingLegs, setLoadingLegs] = useState<Record<string, boolean>>({});
  const [airportModal, setAirportModal] = useState<string | null>(null);

  const fetchHistory = async (ticketType: string, legIdx: number, leg: FlightLeg) => {
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

  // Estimate boarding / gate-close / check-in times from scheduled departure
  const flightTimings = (leg: FlightLeg) => {
    const [h, m] = leg.departureTime.split(":").map(Number);
    const total = h * 60 + m;
    const sub = (mins: number) => {
      let v = total - mins;
      while (v < 0) v += 24 * 60;
      const hh = Math.floor(v / 60) % 24;
      const mm = v % 60;
      return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    };
    return {
      checkInOpen: sub(180),
      checkInClose: sub(45),
      boarding: sub(30),
      gateClose: sub(15),
    };
  };

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

      {/* Flight Tickets — Trip.com vertical journey timeline */}
      <div className="flex flex-col gap-6">
        {FLIGHTS_DATA.map((ticket, tIdx) => {
          const isOut = ticket.type === "Outbound";
          return (
            <div key={tIdx} className="glass-panel rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:border-brand-blue/30 relative">
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

              {/* Legs */}
              <div className="p-5 flex flex-col gap-4">
                {ticket.legs.map((leg, lIdx) => {
                  const legKey = `${ticket.type}-${lIdx}`;
                  const isExpanded = expandedLegKey === legKey;
                  const isLoading = loadingLegs[legKey];
                  const history = historyData[legKey] || [];
                  const cleanFlightNo = leg.flightNo.includes("/") ? leg.flightNo.split("/")[0].trim() : leg.flightNo.trim();
                  const depCity = leg.departureAirport.split("(")[0].trim();
                  const arrCity = leg.arrivalAirport.split("(")[0].trim();
                  const depIata = iataOf(leg.departureAirport);
                  const arrIata = iataOf(leg.arrivalAirport);
                  const timings = flightTimings(leg);
                  // Layover airport = arrival of this leg (where you wait for next leg)
                  const layoverIata = arrIata;

                  return (
                    <div key={lIdx} className="flex flex-col gap-3">
                      {/* Clickable layover chip */}
                      {lIdx > 0 && layoverIata && AIRPORT_GUIDES[layoverIata] && (
                        <div className="flex items-center justify-center -my-1 z-10">
                          <button
                            onClick={() => setAirportModal(layoverIata)}
                            className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-brand-blue/10 hover:bg-brand-blue/20 border border-brand-blue/30 text-[10px] text-brand-blue font-semibold uppercase tracking-wider transition-all cursor-pointer"
                          >
                            <Building2 className="w-3 h-3" />
                            {L(`ต่อเครื่องที่ ${arrCity}`, `Layover in ${arrCity}`, `${arrCity}中转`)}
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* Trip.com-style flight card */}
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

                        {/* Timeline body */}
                        <div className="px-4 py-4">
                          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                            {/* Departure */}
                            <div className="flex flex-col">
                              <span className="text-2xl font-extrabold text-gray-900 font-display leading-none tracking-tight">{leg.departureTime}</span>
                              <span className="text-base font-extrabold text-gray-800 mt-1 leading-none">{depIata}</span>
                              <button
                                onClick={() => depIata && AIRPORT_GUIDES[depIata] && setAirportModal(depIata)}
                                className={`text-[10px] text-gray-500 mt-1 line-clamp-1 text-left hover:text-brand-blue hover:underline ${depIata && AIRPORT_GUIDES[depIata] ? "cursor-pointer" : "cursor-default"}`}
                                title={depCity}
                              >
                                {depCity}
                                {depIata && AIRPORT_GUIDES[depIata] && <Building2 className="w-2.5 h-2.5 inline ml-1" />}
                              </button>
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
                              <span className="text-2xl font-extrabold text-gray-900 font-display leading-none tracking-tight">{leg.arrivalTime}</span>
                              <span className="text-base font-extrabold text-gray-800 mt-1 leading-none">{arrIata}</span>
                              <button
                                onClick={() => arrIata && AIRPORT_GUIDES[arrIata] && setAirportModal(arrIata)}
                                className={`text-[10px] text-gray-500 mt-1 line-clamp-1 text-right hover:text-brand-blue hover:underline ${arrIata && AIRPORT_GUIDES[arrIata] ? "cursor-pointer" : "cursor-default"}`}
                                title={arrCity}
                              >
                                {arrCity}
                                {arrIata && AIRPORT_GUIDES[arrIata] && <Building2 className="w-2.5 h-2.5 inline ml-1" />}
                              </button>
                              <span className="text-[9px] text-gray-400 mt-0.5">{leg.date}</span>
                            </div>
                          </div>
                        </div>

                        {/* Check-in / Boarding timeline */}
                        <div className="px-4 py-2.5 border-t border-gray-900/5 bg-brand-bg-secondary/30">
                          <div className="flex items-center gap-1 mb-2">
                            <Clock className="w-3 h-3 text-brand-gold" />
                            <span className="text-[9px] font-bold text-gray-700 uppercase tracking-wider">
                              {L("ตารางเวลาสำคัญ", "Key Schedule", "重要时间节点")}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                            <div className="flex flex-col">
                              <span className="text-gray-500 font-medium">{L("เปิดเช็คอิน", "Check-in Open", "值机开始")}</span>
                              <span className="font-bold text-gray-800">{timings.checkInOpen}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-500 font-medium">{L("ปิดเช็คอิน", "Check-in Close", "值机截止")}</span>
                              <span className="font-bold text-gray-800">{timings.checkInClose}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-500 font-medium">{L("เริ่มขึ้นเครื่อง", "Boarding", "开始登机")}</span>
                              <span className="font-bold text-gray-800">{timings.boarding}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-500 font-medium">{L("ปิดเกต", "Gate Close", "登机口关闭")}</span>
                              <span className="font-bold text-red-600">{timings.gateClose}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action row — only history now */}
                        <div className="flex items-center justify-end px-4 py-2.5 border-t border-gray-900/5 bg-brand-bg-secondary/30">
                          <button
                            onClick={() => fetchHistory(ticket.type, lIdx, leg)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                              isExpanded ? "bg-brand-gold text-brand-bg-primary border-transparent" : "bg-brand-bg-primary hover:bg-brand-bg-secondary text-brand-gold border-brand-gold/30"
                            }`}
                          >
                            <History className="w-3 h-3" />
                            {L("ประวัติ 2 สัปดาห์", "2-Week History", "2周航班历史")}
                          </button>
                        </div>

                        {/* History drawer */}
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
                              <span className="text-[9px] text-emerald-700 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {L("ข้อมูลจริง", "Real data", "真实数据")}
                              </span>
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
                                      <th className="py-2 px-1 text-right">{L("รายละเอียด", "Info", "详情")}</th>
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
                                            <span className={record.delayMinutes > 20 ? "text-red-600 font-bold" : "text-amber-600"}>+{record.delayMinutes}m</span>
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
                                          {/* Google search link — opens real flight detail */}
                                          <a
                                            href={`https://www.google.com/search?q=${encodeURIComponent(record.flightNo.split("/")[0].trim() + " flight status " + record.date)}`}
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
                                <p className="text-[8px] text-gray-400 mt-2 italic">
                                  {L(
                                    "ข้อมูลย้อนหลังจาก AviationStack + ลิงก์ Info เปิดดูรายละเอียดจริงบน Google",
                                    "Historical data via AviationStack • Info link opens real-time detail on Google",
                                    "历史数据来源 AviationStack，Info链接可在Google查看实时详情"
                                  )}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Ticket footer */}
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

      {/* Airport Transfer Guide (replaces flight radar) */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-900/5 flex flex-col gap-4 mt-2">
        <h3 className="font-display font-bold text-base text-brand-gold flex items-center gap-2 border-b border-gray-900/10 pb-3">
          <Navigation className="w-5 h-5 text-brand-gold" />
          {L("คู่มือสนามบิน & การต่อเครื่อง", "Airport & Transit Guide", "机场与中转指南")}
        </h3>
        <p className="text-xs text-gray-600">
          {L(
            "ข้อมูลสนามบินที่เกี่ยวข้องในทริป คลิกเพื่อดูรายละเอียดเทอร์มินัล รถรับส่ง ห้องรับรอง และเคล็ดลับ",
            "Tap any airport to see terminals, transfers, lounges, and tips for your trip.",
            "点击任一机场查看航站楼、交通、贵宾室与贴士。"
          )}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(AIRPORT_GUIDES).map(([code, g]) => (
            <button
              key={code}
              onClick={() => setAirportModal(code)}
              className="flex flex-col items-start gap-1.5 p-4 rounded-xl bg-brand-bg-secondary/40 border border-gray-900/8 hover:border-brand-gold/30 hover:bg-brand-bg-secondary/60 transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-brand-gold/15 text-brand-gold flex items-center justify-center font-extrabold text-xs">
                  {code}
                </div>
                <Building2 className="w-4 h-4 text-gray-400 group-hover:text-brand-gold transition-colors" />
              </div>
              <span className="text-[11px] font-bold text-gray-800 leading-tight">
                {g.name[language] || g.name.en}
              </span>
              <span className="text-[9px] text-brand-blue font-bold flex items-center gap-0.5 mt-auto">
                {L("ดูรายละเอียด", "View Guide", "查看指南")} <ChevronRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Airport Detail Modal */}
      {airportModal && AIRPORT_GUIDES[airportModal] && (
        <div onClick={() => setAirportModal(null)} className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn cursor-pointer">
          <div onClick={(e) => e.stopPropagation()} className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col relative animate-scaleUp cursor-default">
            <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 p-5 flex items-start justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center font-extrabold text-sm">
                  {airportModal}
                </div>
                <div>
                  <h3 className="text-base font-display font-extrabold text-gray-900">
                    {AIRPORT_GUIDES[airportModal].name[language] || AIRPORT_GUIDES[airportModal].name.en}
                  </h3>
                  <span className="text-[10px] text-gray-500 font-medium">{L("ข้อมูลอัปเดตล่าสุด", "Updated info", "最新信息")}</span>
                </div>
              </div>
              <button onClick={() => setAirportModal(null)} className="p-1 rounded-full bg-slate-100 text-gray-500 hover:bg-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 text-xs text-gray-700">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-bold text-gray-500 flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> {L("เทอร์มินัล", "Terminals", "航站楼")}
                </span>
                <span className="text-gray-900 font-semibold leading-relaxed">{AIRPORT_GUIDES[airportModal].terminals}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-bold text-gray-500 flex items-center gap-1">
                  <Plane className="w-3 h-3" /> {L("การต่อเครื่อง", "Transfer", "中转")}
                </span>
                <span className="text-gray-900 font-semibold leading-relaxed">{AIRPORT_GUIDES[airportModal].transfer[language] || AIRPORT_GUIDES[airportModal].transfer.en}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-bold text-gray-500 flex items-center gap-1">
                  <Bus className="w-3 h-3" /> {L("รถรับส่ง/การเดินทาง", "Shuttle & Transit", "交通接驳")}
                </span>
                <span className="text-gray-900 font-semibold leading-relaxed">{AIRPORT_GUIDES[airportModal].shuttle[language] || AIRPORT_GUIDES[airportModal].shuttle.en}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-bold text-gray-500 flex items-center gap-1">
                  <Coffee className="w-3 h-3" /> {L("ห้องรับรอง/ที่พัก", "Lounge & Rest", "贵宾室与休息")}
                </span>
                <span className="text-gray-900 font-semibold leading-relaxed">{AIRPORT_GUIDES[airportModal].lounge[language] || AIRPORT_GUIDES[airportModal].lounge.en}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-bold text-gray-500 flex items-center gap-1">
                  <Wifi className="w-3 h-3" /> WiFi
                </span>
                <span className="text-gray-900 font-semibold leading-relaxed">{AIRPORT_GUIDES[airportModal].wifi[language] || AIRPORT_GUIDES[airportModal].wifi.en}</span>
              </div>

              <div className="bg-amber-50 border border-amber-500/20 p-3.5 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <strong className="text-[10px] text-amber-800 uppercase tracking-wide">{L("เคล็ดลับ", "Insider Tip", "小贴士")}</strong>
                  <p className="text-amber-900 font-semibold mt-0.5">{AIRPORT_GUIDES[airportModal].tips[language] || AIRPORT_GUIDES[airportModal].tips.en}</p>
                </div>
              </div>

              <a
                href={AIRPORT_GUIDES[airportModal].amap}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 rounded-xl bg-brand-blue/10 hover:bg-brand-blue/20 border border-brand-blue/30 text-brand-blue text-xs font-bold transition-all"
              >
                <Smartphone className="w-4 h-4" />
                {L("เปิดในแผนที่ Amap", "Open in Amap", "高德地图查看")}
              </a>
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-100 p-4 flex items-center justify-end rounded-b-3xl">
              <button onClick={() => setAirportModal(null)} className="px-5 py-1.5 bg-gray-800 text-white rounded-xl text-xs font-bold hover:bg-gray-900 cursor-pointer shadow-md">
                {L("ปิด", "Close", "关闭")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
