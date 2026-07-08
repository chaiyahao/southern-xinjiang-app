"use client";

import React, { useState, useEffect } from "react";
import { useTravelStore } from "../store/useTravelStore";
import { ITINERARY_DATA, HOTELS_DATA } from "../data/travelData";
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

export default function ItineraryScreen() {
  const { activeDay, setActiveDay, notes, updateNote, language } = useTravelStore();
  const [liveWeather, setLiveWeather] = useState<{ tempHigh: number; tempLow: number; condition: string } | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

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
    <div className="flex flex-col gap-6 p-4 lg:p-8 animate-fadeIn max-w-7xl mx-auto w-full">
      {/* Header and Day Selector */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-display font-extrabold text-gold-gradient tracking-tight">
              {t.itinerary}
            </h2>
            <p className="text-xs text-gray-700">
              {language === "th"
                ? "เลือกวันที่ด้านล่างเพื่อตรวจสอบแผนการเดินทาง โรงแรมที่พัก และบันทึกเดินทางส่วนตัวของคุณ"
                : language === "zh"
                ? "选择下方天数以探索详细行程、酒店住宿以及您的自定义旅途笔记。"
                : "Select a day below to explore the detailed itinerary, hotels, and custom travel notes."}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-blue font-semibold">
            <CalendarDays className="w-4 h-4" />
            <span>29 OCT — 7 NOV 2026</span>
          </div>
        </div>

        {/* 10 Day Grid Selector */}
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {ITINERARY_DATA.map((day) => (
            <button
              key={day.day}
              onClick={() => setActiveDay(day.day)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all duration-300 hover:scale-105 ${
                activeDay === day.day
                  ? "bg-brand-gold/15 border-brand-gold text-brand-gold shadow-[0_0_12px_rgba(225,166,59,0.15)] font-bold"
                  : "bg-brand-bg-secondary/40 border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400"
              }`}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider">
                {language === "th" ? "วัน" : language === "zh" ? "天" : "Day"}
              </span>
              <span className="text-lg leading-tight font-display">{day.day}</span>
              <span className="text-[9px] text-gray-500 font-medium truncate w-full max-w-full px-1">
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
          {/* Day Highlight Panel */}
          <div className="glass-panel p-6 rounded-xl flex flex-col gap-4 border border-white/10 relative overflow-hidden">
            {/* Background design */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/5 rounded-full blur-3xl"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-white/10 relative z-10">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-brand-gold uppercase tracking-wider bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/25">
                    {language === "th" ? "วันที่" : language === "zh" ? "第" : "Day"} {currentDayData.day}{language === "zh" ? "天" : ""}
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
              <div className="flex items-center gap-3 bg-brand-bg-primary/50 py-2 px-4 rounded-xl border border-white/10">
                {(() => {
                  const cond = (liveWeather ? liveWeather.condition : currentDayData.weather.forecast).toLowerCase();
                  if (cond.includes("snow")) return <Snowflake className="w-6 h-6 text-brand-blue animate-pulse" />;
                  if (cond.includes("wind")) return <Wind className="w-6 h-6 text-teal-400" />;
                  if (cond.includes("cloud") || cond.includes("overcast") || cond.includes("hazy") || cond.includes("partly")) return <CloudSun className="w-6 h-6 text-gray-400" />;
                  return <Sun className="w-6 h-6 text-brand-gold animate-spin-slow" />;
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
              <div className="bg-brand-bg-secondary/45 p-4 rounded-lg border border-brand-gold/15 flex items-center gap-3 shadow-sm">
                <div className="p-2 rounded bg-brand-blue/15 text-brand-blue">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-xs">
                  <span className="text-gray-700 font-bold uppercase text-[9px] tracking-wider">
                    Travel Path
                  </span>
                  <span className="font-bold text-gray-950 font-extrabold truncate max-w-[150px]">
                    {currentDayData.startLocation} → {currentDayData.endLocation}
                  </span>
                </div>
              </div>

              <div className="bg-brand-bg-secondary/45 p-4 rounded-lg border border-brand-gold/15 flex items-center gap-3 shadow-sm">
                <div className="p-2 rounded bg-brand-gold/15 text-brand-gold">
                  <Navigation className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-xs">
                  <span className="text-gray-700 font-bold uppercase text-[9px] tracking-wider">
                    Drive Distance
                  </span>
                  <span className="font-bold text-gray-950 font-extrabold">
                    {currentDayData.distanceKm > 0
                      ? `${currentDayData.distanceKm} km / ${currentDayData.driveTime}`
                      : "Exploration Stay"}
                  </span>
                </div>
              </div>

              <div className="bg-brand-bg-secondary/45 p-4 rounded-lg border border-brand-gold/15 flex items-center gap-3 shadow-sm">
                <div className="p-2 rounded bg-purple-400/15 text-purple-600">
                  <Mountain className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-xs">
                  <span className="text-gray-700 font-bold uppercase text-[9px] tracking-wider">
                    Max Elevation
                  </span>
                  <span className="font-bold text-gray-950 font-extrabold">
                    {currentDayData.maxElevationM} meters
                  </span>
                </div>
              </div>
            </div>

            {/* Altitude Safety Warning Card */}
            {(() => {
              const advisor = getAltitudeAdvisory(currentDayData.day, language);
              if (!advisor) return null;
              return (
                <div className="glass-panel p-4 rounded-xl border border-red-500/35 bg-red-500/5 flex items-start gap-4 shadow-sm animate-fadeIn relative z-10">
                  <div className="p-2 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="flex flex-col gap-0.5 text-xs">
                    <span className="font-extrabold text-red-700 uppercase tracking-wider text-[9px] flex items-center gap-1">
                      ⚠️ {advisor.title}
                    </span>
                    <p className="text-gray-800 font-semibold leading-relaxed mt-1">
                      {advisor.desc}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Itinerary Description */}
            <div className="text-sm text-gray-800 leading-relaxed font-semibold mt-2 relative z-10">
              {currentDayData.description}
            </div>

            {/* Scenic Landmark Gallery */}
            {currentDayData.images && currentDayData.images.length > 0 && (
              <div className="flex flex-col gap-2 mt-2.5 relative z-10 border-t border-white/5 pt-3">
                <span className="text-[9px] uppercase font-bold tracking-widest text-brand-gold">
                  {language === "th" ? "แกลเลอรีภาพสถานที่ท่องเที่ยวจริง" : language === "zh" ? "今日实景自然风光图" : "Scenic Highlight Gallery"}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentDayData.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="aspect-[2/1] rounded-lg overflow-hidden border border-white/10 relative group bg-brand-bg-primary shadow-lg"
                    >
                      <img 
                        src={img.url} 
                        alt={img.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-75 group-hover:opacity-100" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-bg-primary via-brand-bg-primary/50 to-transparent pointer-events-none flex items-end p-3">
                        <span className="text-[10px] text-brand-gold font-bold filter drop-shadow">
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
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-3 mt-1 relative z-10">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5 animate-pulse" />
                <div className="flex flex-col text-xs">
                  <span className="font-extrabold text-red-700 uppercase tracking-wider">{t.altitudeWarningTitle}</span>
                  <span className="text-gray-800 font-semibold mt-0.5 leading-normal">
                    {t.altitudeWarningDesc}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Activities list */}
          <div className="glass-panel p-6 rounded-xl flex flex-col gap-4 border border-white/5">
            <h4 className="font-display font-bold text-base text-brand-gold flex items-center gap-2 border-b border-white/10 pb-3">
              <Activity className="w-5 h-5 text-brand-gold" />
              {language === "th" ? "กิจกรรมไฮไลท์ประจำวัน" : language === "zh" ? "今日行程亮点与体验" : "Day Highlights & Curated Experiences"}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentDayData.activities.map((act, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded bg-brand-bg-secondary/20 border border-white/5 hover:border-brand-gold/20 transition-all duration-300"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-gray-800 font-semibold leading-normal">{act}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notes & Accommodations Panel (Right) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Accommodation Info Card */}
          <div className="glass-panel-gold bg-brand-bg-secondary/45 p-6 rounded-xl border border-brand-gold/15 flex flex-col gap-4">
            <h4 className="font-display font-bold text-base text-brand-gold flex items-center gap-2 border-b border-brand-gold/10 pb-3">
              <Hotel className="w-5 h-5 text-brand-gold" />
              {t.hotels}
            </h4>
            {(() => {
              const hotelObj = getHotelObj(currentDayData.hotelName);
              const amapUrl = hotelObj ? hotelObj.amapUrl : null;
              const transHotel = hotelObj ? (TRANSLATIONS_DATA[language]?.hotels as any)?.[hotelObj.id] : null;
              const desc = transHotel?.description || (language === "th" ? "บริการจองที่พักเรียบร้อยแล้ว" : "Premium lodging reserved.");

              return (
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-brand-blue font-bold tracking-wider uppercase">
                    Stay Lodging
                  </span>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-lg font-extrabold text-gray-950 font-display">
                      {currentDayData.hotelName}
                    </span>
                    {amapUrl && (
                      <a
                        href={amapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-blue/10 hover:bg-brand-blue text-brand-blue hover:text-white border border-brand-blue/20 hover:border-transparent text-[10px] font-bold uppercase tracking-wider transition-all duration-300 shadow-sm"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{language === "th" ? "แผนที่ Amap" : language === "zh" ? "高德地图" : "Amap Pin"}</span>
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-gray-700 font-semibold leading-relaxed mt-1">
                    {desc}
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Interactive Notes Area */}
          <div className="glass-panel p-6 rounded-xl flex flex-col gap-4 border border-white/5">
            <h4 className="font-display font-bold text-base text-brand-gold flex items-center gap-2 border-b border-white/10 pb-3">
              <FileText className="w-5 h-5 text-brand-gold" />
              {t.notesHeader}
            </h4>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-gray-600 uppercase tracking-widest font-extrabold">
                {language === "th" ? "บันทึกนำทางเพิ่มเติม (จดบันทึกของฉัน)" : "Personal Nav Notes (Saves locally)"}
              </label>
              <textarea
                value={notes[activeDay] || ""}
                onChange={(e) => updateNote(activeDay, e.target.value)}
                placeholder={t.notesPlaceholder}
                className="w-full min-h-[140px] p-3 rounded bg-brand-bg-primary/60 border border-brand-gold/20 focus:border-brand-gold focus:outline-none text-xs text-gray-900 font-semibold leading-normal resize-none placeholder-gray-500 transition-colors shadow-inner"
              />
              <p className="text-[10px] text-gray-500 font-semibold">
                {t.notesSync}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
