"use client";

import React, { useState } from "react";
import { SCHEDULE_DATA, DaySchedule, ScheduleItem } from "../data/scheduleData";
import { TRANSLATIONS_DATA } from "../data/translations";
import { useTravelStore } from "../store/useTravelStore";
import { HOTELS_DATA } from "../data/travelData";
import {
  Calendar,
  Clock,
  MapPin,
  Utensils,
  Hotel,
  Plane,
  Car,
  Compass,
  ArrowRight,
  ChevronRight,
  ListTodo,
  Grid,
  Info,
  ExternalLink,
  AlertTriangle
} from "lucide-react";

const getHotelObj = (hotelName: string) => {
  if (!hotelName || hotelName === "N/A") return null;
  const norm = (name: string) =>
    name
      .toLowerCase()
      .replace(/[’']/g, "")
      .replace(/\s+/g, "")
      .replace(/hotel/g, "")
      .replace(/camp/g, "")
      .trim();
  const searchName = norm(hotelName);
  
  return HOTELS_DATA.find((h) => {
    return norm(h.name).includes(searchName) || searchName.includes(norm(h.name));
  });
};

const getHotelBookingUrl = (hotelName: string) => {
  const found = getHotelObj(hotelName);
  return found ? found.bookingUrl : null;
};

const getAltitudeAdvisory = (dayNum: number, lang: "en" | "th" | "zh") => {
  const advisories: Record<number, Record<"en" | "th" | "zh", { title: string; desc: string }>> = {
    2: {
      en: {
        title: "Altitude Warning: 3,600m (Karakul Lake)",
        desc: "High altitude section. To prevent Acute Mountain Sickness (AMS), avoid quick movements, walk slowly, and drink plenty of warm water. Avoid hot showers tonight as it dilates blood vessels and increases heart rate, making acclimatization harder."
      },
      th: {
        title: "คำเตือนระดับความสูง: 3,600 เมตร (ทะเลสาบคาราคูล)",
        desc: "พื้นที่ราบสูงความดันอากาศต่ำ เพื่อป้องกันโรคแพ้ความสูง (AMS) โปรดหลีกเลี่ยงการเคลื่อนไหวร่างกายอย่างรวดเร็ว เดินช้าๆ และจิบน้ำอุ่นบ่อยๆ งดการอาบน้ำอุ่นจัดในคืนแรกนี้เพื่อหลีกเลี่ยงการขยายตัวของหลอดเลือดซึ่งอาจทำให้ร่างกายปรับตัวยากขึ้น"
      },
      zh: {
        title: "高海拔预警：3,600米（卡拉库里湖）",
        desc: "高海拔缺氧区域。为预防高原反应，请放慢活动节奏，切勿疾跑，多喝热水。今晚建议不要洗热水澡，以免血管扩张、心率加快，加重身体高原适应负担。"
      }
    },
    3: {
      en: {
        title: "Altitude Warning: 4,200m (Panlong Ancient Road)",
        desc: "Extreme high altitude pass! You will traverse the famous Panlong Road with 600+ curves. Keep portable oxygen bottles within arm's reach in the vehicle. If you experience dizziness or shortness of breath, inhale oxygen immediately and notify your guide."
      },
      th: {
        title: "คำเตือนระดับความสูง: 4,200 เมตร (ถนนพันโค้งพานหลง)",
        desc: "จุดผ่านทางระดับความสูงสูงจัด! วันนี้จะเดินทางผ่านโค้งหักศอกกว่า 600 โค้ง โปรดเตรียมกระป๋องออกซิเจนพกพาไว้ใกล้ตัวในรถตลอดเวลา หากมีอาการเวียนศีรษะหรือหายใจติดขัด ให้สูดออกซิเจนทันทีและแจ้งไกด์นำเที่ยว"
      },
      zh: {
        title: "高海拔预警：4,200米（盘龙古道）",
        desc: "极高海拔山口！今日将挑战拥有600多个弯道的盘龙古道。请务必将便携式氧气瓶放在车内触手可及的地方。若感到头晕或气短，请立即吸氧并告知导游。"
      }
    },
    4: {
      en: {
        title: "Altitude Warning: 4,300m (Muztagh Ata Glacier)",
        desc: "Peak altitude of the trip! The glacier park base is at 4,300 meters. Minimize walking duration, stay extremely warm, and do not carry heavy gear. In Kashgar this evening, the hotel is equipped with oxygen concentrators for your full recovery."
      },
      th: {
        title: "คำเตือนระดับความสูง: 4,300 เมตร (ธารน้ำแข็งมุซทัคอาตา)",
        desc: "ระดับความสูงที่สูงที่สุดในทริปนี้! จุดจอดธารน้ำแข็งสูงถึง 4,300 เมตร โปรดจำกัดเวลาการเดินเท้านอกรถ สวมเสื้อผ้าให้อบอุ่นที่สุด และไม่ถือสัมภาระหนัก ในค่ำคืนนี้เมื่อกลับถึงคัชการ์ โรงแรมที่พักจะมีเครื่องผลิตออกซิเจนพร้อมช่วยให้ร่างกายฟื้นตัวเต็มที่"
      },
      zh: {
        title: "高海拔预警：4,300米（慕士塔格峰冰川）",
        desc: "本次旅程的海拔最高点！冰川公园基地海拔达4,300米。请尽量缩短车外徒步时间，做好防寒保暖，切勿提重物。今晚返回喀什后，酒店房间配有弥散式吸氧设备供您恢复体力。"
      }
    }
  };
  return advisories[dayNum]?.[lang] || null;
};

export default function ScheduleScreen() {
  const { language, activeDay, setActiveDay } = useTravelStore();
  const t = TRANSLATIONS_DATA[language].ui;
  
  // Toggle between "timeline" (one day details) and "grid" (full 10-day summary)
  const [viewMode, setViewMode] = useState<"timeline" | "grid">("timeline");

  const currentDayData = SCHEDULE_DATA.find((d) => d.day === activeDay) || SCHEDULE_DATA[0];

  const getActivityIcon = (type: ScheduleItem["type"], sizeClass = "w-4 h-4") => {
    switch (type) {
      case "flight":
        return <Plane className={`${sizeClass} text-sky-400`} />;
      case "hotel":
        return <Hotel className={`${sizeClass} text-pink-400`} />;
      case "food":
        return <Utensils className={`${sizeClass} text-amber-400`} />;
      case "travel":
        return <Car className={`${sizeClass} text-emerald-400`} />;
      case "transit":
        return <Compass className={`${sizeClass} text-teal-400 animate-spin-slow`} />;
      case "stay":
      default:
        return <MapPin className={`${sizeClass} text-brand-gold`} />;
    }
  };

  const getActivityTypeColor = (type: ScheduleItem["type"]) => {
    switch (type) {
      case "flight":
        return "bg-sky-500/10 text-sky-300 border-sky-500/20";
      case "hotel":
        return "bg-pink-500/10 text-pink-300 border-pink-500/20";
      case "food":
        return "bg-amber-500/10 text-amber-300 border-amber-500/20";
      case "travel":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
      case "transit":
        return "bg-teal-500/10 text-teal-300 border-teal-500/20";
      case "stay":
      default:
        return "bg-brand-gold/10 text-brand-gold border-brand-gold/25";
    }
  };

  const getTranslatedTypeLabel = (type: ScheduleItem["type"]) => {
    const labels: Record<ScheduleItem["type"], Record<"en" | "th" | "zh", string>> = {
      flight: { en: "Flight", th: "เที่ยวบิน", zh: "航班" },
      hotel: { en: "Hotel", th: "ที่พัก", zh: "酒店入住" },
      food: { en: "Meal", th: "อาหาร", zh: "餐饮" },
      travel: { en: "Drive", th: "เดินทาง", zh: "乘车" },
      transit: { en: "Transit", th: "ต่อเครื่อง", zh: "过境/中转" },
      stay: { en: "Sightseeing", th: "ท่องเที่ยว", zh: "游览" },
    };
    return labels[type]?.[language] || labels[type]?.en || "";
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 animate-fadeIn max-w-7xl mx-auto w-full">
      {/* Tab Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-gold-gradient tracking-tight">
            {language === "th" ? "ตารางการเดินทางรายวัน" : language === "zh" ? "每日日程表" : "Daily Expedition Schedule"}
          </h2>
          <p className="text-xs text-gray-400">
            {language === "th"
              ? "กำหนดการเดินทางแบบละเอียดรายชั่วโมง เส้นทางขนส่ง และข้อมูลจองที่พัก"
              : language === "zh"
              ? "每小时详细行程规划、交通路线及酒店安排"
              : "Hourly breakdown of daily routes, transit milestones, and hotel arrivals."}
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex bg-brand-bg-primary p-1 rounded-xl border border-white/5 w-fit">
          <button
            onClick={() => setViewMode("timeline")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
              viewMode === "timeline"
                ? "bg-brand-gold text-brand-bg-primary shadow"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{language === "th" ? "เจาะลึกรายวัน" : language === "zh" ? "单日明细" : "Daily Timeline"}</span>
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
              viewMode === "grid"
                ? "bg-brand-gold text-brand-bg-primary shadow"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>{language === "th" ? "สรุป 10 วัน" : language === "zh" ? "10天总览" : "10-Day Master"}</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: DAILY TIMELINE */}
      {viewMode === "timeline" && (
        <div className="flex flex-col gap-6">
          {/* Days Swipe Guide Banner */}
          <span className="text-[9px] uppercase tracking-wider text-brand-gold/75 lg:hidden block animate-pulse font-bold mb-1">
            {language === "th" ? "← เลื่อนแถบด้านล่างเพื่อเลือกวัน (วัน 1-10) →" : language === "zh" ? "← 左右滑动选择天数 (第1-10天) →" : "← Scroll tabs to select Day (Days 1-10) →"}
          </span>
          {/* Days Quick-Selector Bar */}
          <div className="flex items-center gap-2 overflow-x-auto py-2 border-b border-white/10 w-full scrollbar-thin scrollbar-thumb-brand-gold/30 scrollbar-track-transparent">
            {SCHEDULE_DATA.map((dayData) => {
              const isSelected = activeDay === dayData.day;
              return (
                <button
                  key={dayData.day}
                  onClick={() => setActiveDay(dayData.day)}
                  className={`flex flex-col items-center justify-center p-2.5 min-w-[70px] rounded-xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-brand-gold border-brand-gold text-brand-bg-primary shadow-lg scale-105"
                      : "bg-brand-bg-secondary/40 border-white/5 hover:border-brand-gold/20 text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <span className={`text-[10px] font-bold tracking-wider uppercase ${isSelected ? "text-brand-bg-primary/80" : "text-gray-500"}`}>
                    {language === "th" ? "วัน" : language === "zh" ? "天" : "Day"}
                  </span>
                  <span className="text-xl font-display font-extrabold leading-none mt-0.5">
                    {dayData.day}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Current Day Details Banner */}
          <div className="glass-panel p-5 rounded-2xl border border-brand-gold/15 bg-brand-bg-secondary/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-xl border border-brand-gold/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  {language === "th" ? "วันที่" : language === "zh" ? "第" : "Day"} {currentDayData.day}{language === "zh" ? "天" : ""} • {currentDayData.date}
                </span>
                <span className="text-base font-extrabold text-gray-900 mt-0.5">
                  {currentDayData.route[language] || currentDayData.route.en}
                </span>
              </div>
            </div>

            {currentDayData.hotel && currentDayData.hotel !== "N/A" && (() => {
              const hotelObj = getHotelObj(currentDayData.hotel);
              const url = hotelObj ? hotelObj.bookingUrl : null;
              const amapUrl = hotelObj ? hotelObj.amapUrl : null;
              const transHotel = hotelObj ? TRANSLATIONS_DATA[language].hotels[hotelObj.id] : null;
              const hotelDisplayName = transHotel ? transHotel.name : currentDayData.hotel;
              const hotelAddress = transHotel ? transHotel.address : null;

              const HotelCard = (
                <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl bg-pink-500/5 border border-pink-500/15 text-pink-400 text-xs font-semibold transition-all duration-300 ${url ? 'hover:border-pink-500/40 hover:bg-pink-500/10 hover:scale-[1.01]' : ''}`}>
                  <Hotel className="w-4 h-4 text-pink-500 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-pink-400/80 uppercase tracking-widest leading-none font-bold flex items-center gap-1">
                      {language === "th" ? "โรงแรมคืนนี้ (จองผ่าน Trip.com)" : language === "zh" ? "今晚入住 (Trip.com)" : "Overnight Hotel (Trip.com)"}
                      {url && <ExternalLink className="w-2.5 h-2.5 text-pink-400/80" />}
                    </span>
                    <span className="mt-1 font-bold text-gray-800">{hotelDisplayName}</span>
                    {hotelAddress && (
                      <span className="text-[9px] text-gray-700 font-semibold mt-0.5 leading-tight">{hotelAddress}</span>
                    )}
                  </div>
                </div>
              );

              return (
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <div className="flex-1">
                    {url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
                        {HotelCard}
                      </a>
                    ) : (
                      HotelCard
                    )}
                  </div>
                  {amapUrl && (
                    <a
                      href={amapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-brand-blue/10 hover:bg-brand-blue text-brand-blue hover:text-white border border-brand-blue/20 hover:border-transparent text-xs font-bold transition-all duration-300 hover:scale-[1.01] flex-shrink-0"
                    >
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{language === "th" ? "แผนที่ Amap" : language === "zh" ? "高德地图" : "Amap"}</span>
                    </a>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Altitude Safety Warning Card */}
          {(() => {
            const advisor = getAltitudeAdvisory(currentDayData.day, language);
            if (!advisor) return null;
            return (
              <div className="glass-panel p-5 rounded-2xl border border-red-500/35 bg-red-500/5 flex items-start gap-4 shadow-sm animate-fadeIn">
                <div className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 flex-shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  <span className="font-extrabold text-red-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    ⚠️ {advisor.title}
                  </span>
                  <p className="text-gray-700 font-semibold leading-relaxed mt-1">
                    {advisor.desc}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Timeline Table Grid */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col gap-4">
            <div className="relative border-l-2 border-brand-gold/15 pl-6 ml-4 space-y-1.5 py-1">
              {currentDayData.items.map((item, idx) => (
                <div key={idx} className="relative group animate-fadeIn">
                  {/* Timeline bullet dot */}
                  <div className="absolute -left-[35px] top-[9px] w-6 h-6 rounded-full bg-brand-bg-secondary border-2 border-brand-gold flex items-center justify-center shadow-md">
                    {getActivityIcon(item.type, "w-3 h-3")}
                  </div>

                  {/* Schedule Row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5 md:gap-3 items-center bg-brand-bg-primary/30 border border-white/10 rounded-xl py-1.5 px-3 hover:border-brand-gold/20 transition-all duration-300">
                    
                    {/* Time Column */}
                    <div className="md:col-span-2 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-500 md:hidden" />
                      <span className="text-sm font-display font-extrabold text-brand-gold">
                        {item.time}
                      </span>
                    </div>

                    {/* Activity Column */}
                    <div className="md:col-span-8 flex flex-col gap-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold tracking-widest uppercase border ${getActivityTypeColor(item.type)}`}>
                          {getTranslatedTypeLabel(item.type)}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-800 leading-relaxed mt-0.5">
                        {item.activity[language] || item.activity.en}
                      </p>
                    </div>

                    {/* Duration Column */}
                    <div className="md:col-span-2 flex md:justify-end">
                      {item.duration && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-gray-800 text-[10px] font-extrabold">
                          {item.duration[language] || item.duration.en}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: 10-DAY MASTER SCHEDULE TABLE */}
      {viewMode === "grid" && (
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-brand-gold border-b border-white/10 pb-3 mb-2">
            <Info className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {language === "th" ? "สรุปกำหนดการเดินทาง 10 วัน" : language === "zh" ? "10天行程主控表" : "10-Day Route master control sheet"}
            </span>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-gray-800 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3 w-[80px]">Day</th>
                  <th className="py-3 px-3 w-[120px]">Date</th>
                  <th className="py-3 px-3 w-[250px]">Route Route</th>
                  <th className="py-3 px-3">Hotel Accommodation</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {SCHEDULE_DATA.map((dayData) => (
                  <tr
                    key={dayData.day}
                    onClick={() => {
                      setActiveDay(dayData.day);
                      setViewMode("timeline");
                    }}
                    className={`border-b border-slate-100 hover:bg-brand-gold/5 transition-colors cursor-pointer group ${
                      activeDay === dayData.day ? "bg-brand-gold/5" : ""
                    }`}
                  >
                    <td className="py-4 px-3 font-display font-extrabold text-brand-gold group-hover:scale-105 transition-transform">
                      {language === "th" ? "วันที่" : language === "zh" ? "第" : "Day"} {dayData.day}{language === "zh" ? "天" : ""}
                    </td>
                    <td className="py-4 px-3 text-gray-800 font-bold">{dayData.date}</td>
                    <td className="py-4 px-3 font-bold text-gray-900">
                      {dayData.route[language] || dayData.route.en}
                    </td>
                    <td className="py-4 px-3 font-bold text-pink-700">
                      {dayData.hotel && dayData.hotel !== "N/A" ? (() => {
                        const url = getHotelBookingUrl(dayData.hotel);
                        return url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="hover:underline flex items-center gap-1 cursor-pointer w-fit text-pink-700 hover:text-pink-800"
                          >
                            <span>{dayData.hotel}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-pink-700" />
                          </a>
                        ) : (
                          <span>{dayData.hotel}</span>
                        );
                      })() : "-"}
                    </td>
                    <td className="py-4 px-3 text-right text-brand-gold font-bold">
                      <span className="flex items-center justify-end gap-1 text-[10px] uppercase tracking-wider group-hover:underline">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards List View */}
          <div className="md:hidden flex flex-col gap-4">
            {SCHEDULE_DATA.map((dayData) => (
              <div
                key={dayData.day}
                onClick={() => {
                  setActiveDay(dayData.day);
                  setViewMode("timeline");
                }}
                className={`p-4 rounded-xl bg-brand-bg-primary/50 border flex flex-col gap-2 relative transition-all duration-300 cursor-pointer ${
                  activeDay === dayData.day ? "border-brand-gold bg-brand-gold/5 shadow" : "border-white/5"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-display font-extrabold text-brand-gold">
                    {language === "th" ? "วันที่" : language === "zh" ? "第" : "Day"} {dayData.day}{language === "zh" ? "天" : ""}
                  </span>
                  <span className="text-[10px] text-gray-700 font-bold">{dayData.date}</span>
                </div>
                <div className="text-xs font-bold text-gray-800 mt-1">
                  {dayData.route[language] || dayData.route.en}
                </div>
                {dayData.hotel && dayData.hotel !== "N/A" && (() => {
                  const url = getHotelBookingUrl(dayData.hotel);
                  return url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] text-pink-400 hover:text-pink-300 flex items-center gap-1 mt-1 font-medium hover:underline cursor-pointer w-fit"
                    >
                      <Hotel className="w-3 h-3 text-pink-400" />
                      <span>{dayData.hotel}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-pink-400" />
                    </a>
                  ) : (
                    <div className="text-[10px] text-pink-300 flex items-center gap-1 mt-1 font-medium">
                      <Hotel className="w-3 h-3" />
                      <span>{dayData.hotel}</span>
                    </div>
                  );
                })()}
                <div className="text-[9px] text-brand-gold font-extrabold uppercase tracking-wider self-end mt-2 flex items-center gap-0.5">
                  <span>View day timeline</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
