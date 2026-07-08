"use client";

import React from "react";
import { useTravelStore } from "../store/useTravelStore";
import { TRANSLATIONS_DATA } from "../data/translations";
import { ITINERARY_DATA, FLIGHTS_DATA, HOTELS_DATA } from "../data/travelData";
import { SCHEDULE_DATA } from "../data/scheduleData";
import { 
  Plane, 
  Car, 
  Hotel, 
  MapPin, 
  Mountain,
  Compass, 
  Clock, 
  ChevronRight,
  AlertCircle,
  Briefcase
} from "lucide-react";

export default function TimelineScreen() {
  const { language, setActiveTab, setActiveDay } = useTravelStore();

  const t = TRANSLATIONS_DATA[language].ui;
  const tItinerary = TRANSLATIONS_DATA[language].itinerary;

  const getAirportName = (codeOrName: string, lang: string) => {
    const code = codeOrName.toUpperCase();
    if (code.includes("BKK") || code.includes("BANGKOK")) {
      return lang === "th" ? "ท่าอากาศยานสุวรรณภูมิ (BKK)" : lang === "zh" ? "曼谷苏万那普机场 (BKK)" : "Bangkok Suvarnabhumi Airport (BKK)";
    }
    if (code.includes("CKG") || code.includes("CHONGQING")) {
      return lang === "th" ? "ท่าอากาศยานนานาชาติฉงชิ่งเจียงเป่ย์ T3 (CKG)" : lang === "zh" ? "重庆江北国际机场 T3 (CKG)" : "Chongqing Jiangbei Intl Airport T3 (CKG)";
    }
    if (code.includes("KHG") || code.includes("KASHGAR")) {
      return lang === "th" ? "ท่าอากาศยานคาชิ T2 (KHG)" : lang === "zh" ? "喀什机场 T2 (KHG)" : "Kashgar Airport T2 (KHG)";
    }
    if (code.includes("AKU") || code.includes("AKSU")) {
      return lang === "th" ? "ท่าอากาศยานอักซู (AKU)" : lang === "zh" ? "阿克苏温宿机场 (AKU)" : "Aksu Airport (AKU)";
    }
    return codeOrName;
  };

  const getHotelDisplayName = (hotelName: string, lang: "en" | "th" | "zh") => {
    if (!hotelName || hotelName === "N/A") return "-";
    const norm = (name: string) =>
      name.toLowerCase().replace(/[’']/g, "").replace(/\s+/g, "").replace(/hotel/g, "").replace(/camp/g, "").trim();
    const searchName = norm(hotelName);
    const found = HOTELS_DATA.find((h) => norm(h.name).includes(searchName) || searchName.includes(norm(h.name)));
    if (found) {
      const trans = TRANSLATIONS_DATA[lang].hotels[found.id];
      return trans ? trans.name : found.name;
    }
    return hotelName;
  };

  const handleDayClick = (dayNum: number) => {
    setActiveDay(dayNum);
    setActiveTab("itinerary");
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 animate-fadeIn max-w-5xl mx-auto w-full text-gray-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-950/10 pb-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-gold-gradient tracking-tight">
            {language === "th" ? "แผนการเดินทางรวม (Trip Timeline)" : language === "zh" ? "全行程时间线" : "Trip Timeline"}
          </h2>
          <p className="text-xs text-gray-600 font-semibold">
            {language === "th"
              ? "ดูภาพรวมแผนการเดินทางของทุกวัน เที่ยวบิน และโรงแรมในหน้าเดียว"
              : language === "zh"
              ? "在单一页面中查看每日行程安排、航班时刻以及酒店住宿概览"
              : "Overview of your daily routes, flight transfers, and hotels stayed in a single rolling timeline."}
          </p>
        </div>
      </div>

      {/* Vertical Timeline Container */}
      <div className="relative border-l-2 border-brand-gold/15 ml-4 pl-8 space-y-12 py-4">
        {/* DAY 1 - Flight segments */}
        <div className="relative">
          {/* Timeline node */}
          <div className="absolute -left-[45px] top-1.5 w-8 h-8 rounded-full bg-brand-gold text-brand-bg-primary flex items-center justify-center font-bold text-sm shadow-md border-2 border-brand-bg-primary">
            1
          </div>

          <div className="flex flex-col gap-3">
            {/* Header info */}
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Day 1 • 29 Oct 2026</span>
              <h3 className="text-base font-extrabold text-gray-900 mt-0.5">
                {language === "th" ? "เดินทาง กรุงเทพฯ → คัชการ์ (ต่อเครื่องที่ฉงชิ่ง)" : language === "zh" ? "乘机前往喀什 (重庆中转)" : "Flight departure: Bangkok to Kashgar (Transit Chongqing)"}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-[10px] font-bold text-purple-700 border border-purple-100">
                  <Mountain className="w-3 h-3" />
                  <span>{language === "th" ? `ความสูงสูงสุด 1,290 ม. (คัชการ์)` : `Max Elevation: 1,290m (Kashgar)`}</span>
                </span>
              </div>
            </div>

            {/* Flight Legs vertically */}
            <div className="flex flex-col gap-4 max-w-3xl">
              {FLIGHTS_DATA[0].legs.map((leg, lIdx) => (
                <div key={lIdx} className="flex flex-col gap-3">
                  {/* Layover warning box */}
                  {lIdx > 0 && (
                    <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-slate-100/90 border border-slate-205 text-xs self-start w-full">
                      <div className="flex items-center justify-between text-brand-blue font-extrabold uppercase text-[10px] tracking-wider">
                        <span>{language === "th" ? "เปลี่ยนเครื่องที่ฉงชิ่ง (CKG) • รอต่อเครื่อง 8 ชม. 30 นาที" : "Transit Chongqing (CKG) • 8h 30m layover"}</span>
                      </div>
                      <div className="text-amber-700 font-extrabold text-[10px] flex items-center gap-1.5 pt-1.5 border-t border-slate-200 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>{language === "th" ? "ต้องทำการตรวจรับกระเป๋าเดินทางและโหลดซ้ำที่ฉงชิ่ง" : "Baggage recheck required in Chongqing"}</span>
                      </div>
                    </div>
                  )}

                  {/* Flight Leg Detail Card */}
                  <div className="border border-slate-205 bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3 hover:border-brand-gold/25 transition-all">
                    <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <Plane className="w-3.5 h-3.5 text-brand-gold" />
                        <span className="font-extrabold text-gray-900">{leg.flightNo}</span>
                        <span className="text-[10px] text-gray-500 font-medium">({leg.aircraft})</span>
                      </div>
                      <span className="text-[10px] text-gray-700 font-extrabold bg-brand-gold/10 px-2 py-0.5 rounded">
                        Ref: {leg.bookingRef}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
                      <div className="sm:col-span-4">
                        <span className="text-base font-black text-gray-900 leading-none">{leg.departureTime}</span>
                        <p className="font-bold text-gray-900 mt-1.5 leading-snug">{getAirportName(leg.departureAirport, language)}</p>
                      </div>
                      <div className="sm:col-span-4 flex flex-col items-center justify-center text-center">
                        <span className="text-[9px] text-gray-600 font-bold">{leg.duration}</span>
                        <div className="w-full flex items-center gap-1 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                          <span className="flex-1 h-0.5 border-t border-dashed border-slate-250"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
                        </div>
                      </div>
                      <div className="sm:col-span-4 sm:text-right">
                        <span className="text-base font-black text-gray-900 leading-none">{leg.arrivalTime}</span>
                        <p className="font-bold text-gray-900 mt-1.5 leading-snug">{getAirportName(leg.arrivalAirport, language)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hotel card for Day 1 night */}
            <div className="max-w-3xl border border-pink-100 bg-pink-500/5 rounded-xl p-4 flex justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <Hotel className="w-5 h-5 text-pink-500" />
                <div className="flex flex-col">
                  <span className="text-[8px] text-pink-500 font-extrabold tracking-widest uppercase">Overnight Stay</span>
                  <span className="text-xs font-black text-gray-800 mt-0.5">
                    {getHotelDisplayName(SCHEDULE_DATA[0].hotel, language)}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => handleDayClick(1)}
                className="text-[10px] text-brand-gold hover:underline font-extrabold flex items-center gap-0.5 cursor-pointer"
              >
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* DAYS 2 TO 9 - Land segments */}
        {SCHEDULE_DATA.slice(1, 9).map((daySchedule) => {
          const dayNum = daySchedule.day;
          const itineraryRow = ITINERARY_DATA[dayNum - 1];
          const hasDriving = itineraryRow.distanceKm > 0;
          
          return (
            <div key={dayNum} className="relative">
              {/* Timeline node */}
              <div className="absolute -left-[45px] top-1.5 w-8 h-8 rounded-full bg-brand-gold text-brand-bg-primary flex items-center justify-center font-bold text-sm shadow-md border-2 border-brand-bg-primary">
                {dayNum}
              </div>

              <div className="flex flex-col gap-3">
                {/* Header */}
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Day {dayNum} • {daySchedule.date}</span>
                  <h3 className="text-base font-extrabold text-gray-900 mt-0.5">
                    {daySchedule.route[language] || daySchedule.route.en}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {hasDriving && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                        <Car className="w-3 h-3" />
                        <span>{itineraryRow.distanceKm} km / {itineraryRow.driveTime}</span>
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-[10px] font-bold text-purple-700 border border-purple-100">
                      <Mountain className="w-3 h-3" />
                      <span>{language === "th" ? `ความสูงสูงสุด ${itineraryRow.maxElevationM} ม.` : `Max Elevation: ${itineraryRow.maxElevationM}m`}</span>
                    </span>
                  </div>
                </div>

                {/* Day Card details */}
                <div className="max-w-3xl border border-slate-205 bg-white rounded-xl p-5 shadow-sm flex flex-col gap-4 hover:border-brand-gold/25 transition-all">
                  {/* Sights lists */}
                  <div>
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Today's schedule highlights</span>
                    <div className="flex flex-col gap-2 pl-0">
                      {daySchedule.items.filter(item => item.type === "stay" || item.type === "travel" || item.type === "hotel").map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-800 font-bold">
                          <span className="text-brand-gold font-extrabold mt-0.5">•</span>
                          <div className="flex flex-col">
                            <span className="text-gray-900 leading-snug">{item.activity[language] || item.activity.en}</span>
                            {item.duration && (
                              <span className="text-[10px] text-gray-500 font-medium mt-0.5">({item.duration[language] || item.duration.en})</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sights Image gallery */}
                  {itineraryRow.images && itineraryRow.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-slate-100 pt-3">
                      {itineraryRow.images.map((img, imgIdx) => (
                        <div key={imgIdx} className="relative rounded-lg overflow-hidden aspect-[4/3] border border-slate-200 bg-slate-50">
                          <img 
                            src={img.url} 
                            alt={img.label} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-1.5 flex flex-col justify-end">
                            <span className="text-[8px] text-brand-gold font-bold uppercase leading-none truncate">
                              {language === "th" ? img.labelTh : language === "zh" ? img.labelZh : img.label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hotel accommodation */}
                  {daySchedule.hotel && daySchedule.hotel !== "N/A" && (
                    <div className="border-t border-slate-100 pt-3 flex justify-between items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Hotel className="w-4 h-4 text-pink-500" />
                        <div className="flex flex-col">
                          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider leading-none">Stay Overnight</span>
                          <span className="text-xs font-bold text-pink-700 mt-1">
                            {getHotelDisplayName(daySchedule.hotel, language)}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDayClick(dayNum)}
                        className="flex items-center gap-0.5 text-[10px] text-brand-gold hover:underline font-extrabold cursor-pointer"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* DAY 10 - Return flights */}
        <div className="relative">
          {/* Timeline node */}
          <div className="absolute -left-[45px] top-1.5 w-8 h-8 rounded-full bg-brand-gold text-brand-bg-primary flex items-center justify-center font-bold text-sm shadow-md border-2 border-brand-bg-primary">
            10
          </div>

          <div className="flex flex-col gap-3">
            {/* Header info */}
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Day 10 • 7 Nov 2026</span>
              <h3 className="text-base font-extrabold text-gray-900 mt-0.5">
                {language === "th" ? "เดินทางกลับ อักซู → กรุงเทพฯ (ต่อเครื่องที่ฉงชิ่ง)" : language === "zh" ? "乘机返回曼谷 (重庆中转)" : "Flight departure: Aksu to Bangkok (Transit Chongqing)"}
              </h3>
            </div>

            {/* Flight Legs vertically */}
            <div className="flex flex-col gap-4 max-w-3xl">
              {FLIGHTS_DATA[1].legs.map((leg, lIdx) => (
                <div key={lIdx} className="flex flex-col gap-3">
                  {/* Layover warning box */}
                  {lIdx > 0 && (
                    <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-slate-100/90 border border-slate-205 text-xs self-start w-full">
                      <div className="flex items-center justify-between text-brand-blue font-extrabold uppercase text-[10px] tracking-wider">
                        <span>{language === "th" ? "เปลี่ยนเครื่องที่ฉงชิ่ง (CKG) • รอต่อเครื่อง 4 ชม. 35 นาที" : "Transit Chongqing (CKG) • 4h 35m layover"}</span>
                      </div>
                      <div className="text-amber-700 font-extrabold text-[10px] flex items-center gap-1.5 pt-1.5 border-t border-slate-200 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>{language === "th" ? "ต้องทำการตรวจรับกระเป๋าเดินทางและโหลดซ้ำที่ฉงชิ่ง" : "Baggage recheck required in Chongqing"}</span>
                      </div>
                    </div>
                  )}

                  {/* Flight Leg Detail Card */}
                  <div className="border border-slate-205 bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3 hover:border-brand-gold/25 transition-all">
                    <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <Plane className="w-3.5 h-3.5 text-brand-gold" />
                        <span className="font-extrabold text-gray-900">{leg.flightNo}</span>
                        <span className="text-[10px] text-gray-500 font-medium">({leg.aircraft})</span>
                      </div>
                      <span className="text-[10px] text-gray-700 font-extrabold bg-brand-gold/10 px-2 py-0.5 rounded">
                        Ref: {leg.bookingRef}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
                      <div className="sm:col-span-4">
                        <span className="text-base font-black text-gray-900 leading-none">{leg.departureTime}</span>
                        <p className="font-bold text-gray-900 mt-1.5 leading-snug">{getAirportName(leg.departureAirport, language)}</p>
                      </div>
                      <div className="sm:col-span-4 flex flex-col items-center justify-center text-center">
                        <span className="text-[9px] text-gray-600 font-bold">{leg.duration}</span>
                        <div className="w-full flex items-center gap-1 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                          <span className="flex-1 h-0.5 border-t border-dashed border-slate-250"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
                        </div>
                      </div>
                      <div className="sm:col-span-4 sm:text-right">
                        <span className="text-base font-black text-gray-900 leading-none">{leg.arrivalTime}</span>
                        <p className="font-bold text-gray-900 mt-1.5 leading-snug">{getAirportName(leg.arrivalAirport, language)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Travel complete success info */}
            <div className="max-w-3xl border border-emerald-100 bg-emerald-500/5 rounded-xl p-4 flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="flex flex-col text-xs text-emerald-800 leading-normal">
                <span className="font-extrabold uppercase text-[8px] tracking-widest text-emerald-600">Trip Completed</span>
                <span className="font-bold mt-0.5">
                  {language === "th" ? "เดินทางกลับถึงกรุงเทพฯ โดยสวัสดิภาพ • สิ้นสุดทริปหรูลุยซินเจียงใต้" : "Arrived in Bangkok safely. Luxury Southern Xinjiang loop completed successfully!"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
