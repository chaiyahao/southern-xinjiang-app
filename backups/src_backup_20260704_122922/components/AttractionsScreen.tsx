"use client";

import React, { useState } from "react";
import { useTravelStore } from "../store/useTravelStore";
import { ATTRACTIONS_DATA, Attraction } from "../data/attractionsData";
import { RESTAURANTS_DATA, Restaurant } from "../data/restaurantsData";
import {
  Search, MapPin, Clock, Compass, Tag, ChevronRight, Info, Calendar, X,
  AlertCircle, UtensilsCrossed, Star, Flame,
} from "lucide-react";

type View = "attractions" | "restaurants";

export default function AttractionsScreen() {
  const { language, fontSize } = useTravelStore();
  const [view, setView] = useState<View>("attractions");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showWaypoints, setShowWaypoints] = useState(true);

  // Region mapping for filters
  const getAttractionRegion = (id: string): string => {
    if (id.includes("kashgar") || id.includes("wp_id_kah")) return "kashgar";
    if (id.includes("baisha") || id.includes("karakul") || id.includes("panlong") || id.includes("wp_opal") || id.includes("wp_stone") || id.includes("wp_pamir")) return "pamir";
    if (id.includes("zepu") || id.includes("yotkan") || id.includes("taklamakan") || id.includes("wp_yarkant") || id.includes("wp_xitiya") || id.includes("wp_desert")) return "hotan";
    if (id.includes("tomur") || id.includes("wp_wensu")) return "aksu";
    return "other";
  };

  const filteredAttractions = ATTRACTIONS_DATA.filter((att) => {
    // Hide waypoints unless toggled on
    if (att.isWaypoint && !showWaypoints) return false;

    const region = getAttractionRegion(att.id);
    const regionMatch = activeFilter === "all" || region === activeFilter;

    const query = searchQuery.toLowerCase();
    const nameText = (att.name[language] || att.name.en).toLowerCase();
    const locText = (att.location[language] || att.location.en).toLowerCase();
    const descText = (att.description[language] || att.description.en).toLowerCase();
    const highlightsText = (att.highlights[language] || att.highlights.en).join(" ").toLowerCase();

    const searchMatch =
      !query ||
      nameText.includes(query) ||
      locText.includes(query) ||
      descText.includes(query) ||
      highlightsText.includes(query);

    return regionMatch && searchMatch;
  });

  const filteredRestaurants = RESTAURANTS_DATA.filter((r) => {
    const regionMatch = activeFilter === "all" || r.region === activeFilter;
    const q = searchQuery.toLowerCase();
    const searchMatch =
      !q ||
      (r.name[language] || r.name.en).toLowerCase().includes(q) ||
      (r.cuisine[language] || r.cuisine.en).toLowerCase().includes(q) ||
      (r.signature[language] || r.signature.en).toLowerCase().includes(q);
    return regionMatch && searchMatch;
  });

  // Sort: main attractions first, waypoints after
  const sortedAttractions = [...filteredAttractions].sort((a, b) => {
    if (a.isWaypoint && !b.isWaypoint) return 1;
    if (!a.isWaypoint && b.isWaypoint) return -1;
    return 0;
  });

  const filterTabs = [
    { id: "all", labels: { th: "ทั้งหมด", en: "All", zh: "全部" } },
    { id: "kashgar", labels: { th: "คัชการ์", en: "Kashgar", zh: "喀什" } },
    { id: "pamir", labels: { th: "ปามีร์/ทาชคูร์กัน", en: "Pamir/Tashkurgan", zh: "帕米尔/塔县" } },
    { id: "hotan", labels: { th: "เจ๋อผู่/โฮตัน", en: "Zepu/Hotan", zh: "泽普/和田" } },
    { id: "aksu", labels: { th: "อักซู", en: "Aksu", zh: "阿克苏" } }
  ];

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-6 max-w-6xl mx-auto w-full animate-fadeIn pb-24 lg:pb-6">
      {/* Title Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl lg:text-2xl font-display font-extrabold text-gold-gradient tracking-wide uppercase">
          {view === "attractions"
            ? (language === "th" ? "ข้อมูลสถานที่ท่องเที่ยวเชิงลึก" : language === "zh" ? "西域景点深度指南" : "Sightseeing Attraction Insights")
            : (language === "th" ? "ร้านอาหารยอดนิยม" : language === "zh" ? "人气美食推荐" : "Popular Restaurants")}
        </h2>
        <p className="text-xs text-gray-500 max-w-2xl font-medium">
          {view === "attractions"
            ? (language === "th"
                ? "เจาะลึกข้อมูลทางประวัติศาสตร์ วัฒนธรรม และคำแนะนำที่เป็นจริงเพื่อการเตรียมตัวเดินทางอย่างชาญฉลาดในดินแดนซินเจียงใต้"
                : language === "zh"
                ? "真实权威的南疆景点人文历史解密，搭配专业游玩提示，带您领略丝绸之路的无限魅力。"
                : "Explore verified historical facts, cultural background, and practical traveler tips for all major spots in Southern Xinjiang.")
            : (language === "th"
                ? "รวมร้านอาหารแนะนำยอดฮิตตามสถานที่ท่องเที่ยว พร้อมข้อมูลอัปเดตล่าสุด เพื่อการเดินทางที่อร่อยและปลอดภัย"
                : language === "zh"
                ? "精选各站必吃美食与人气餐厅推荐，助力您的美食之旅。"
                : "Curated list of must-try restaurants and street food spots at each destination, updated for your trip.")}
        </p>
      </div>

      {/* View Toggle: Attractions | Restaurants */}
      <div className="flex items-center gap-1 bg-brand-bg-secondary/40 p-1 rounded-xl border border-gray-900/8 w-fit">
        <button
          onClick={() => { setView("attractions"); setActiveFilter("all"); }}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            view === "attractions" ? "bg-brand-gold text-brand-bg-primary shadow" : "text-gray-700 hover:text-brand-gold"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          {language === "th" ? "สถานที่ท่องเที่ยว" : language === "zh" ? "景点" : "Attractions"}
        </button>
        <button
          onClick={() => { setView("restaurants"); setActiveFilter("all"); }}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            view === "restaurants" ? "bg-brand-gold text-brand-bg-primary shadow" : "text-gray-700 hover:text-brand-gold"
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          {language === "th" ? "ร้านอาหาร" : language === "zh" ? "餐厅" : "Restaurants"}
        </button>
      </div>

      {/* Control Bar: Search & Filter Tabs */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-brand-gold/15 pb-4">
        {/* Region Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-thin scrollbar-thumb-brand-gold/20 w-full md:w-auto">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex-shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-brand-gold text-brand-bg-primary shadow-md scale-102"
                    : "bg-brand-bg-secondary/40 text-gray-700 hover:text-brand-gold border border-white/5"
                }`}
              >
                {tab.labels[language] || tab.labels.en}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Waypoint toggle (attractions only) */}
          {view === "attractions" && (
            <label className="flex items-center gap-1.5 text-[10px] text-gray-600 font-bold cursor-pointer whitespace-nowrap select-none">
              <input
                type="checkbox"
                checked={showWaypoints}
                onChange={(e) => setShowWaypoints(e.target.checked)}
                className="accent-brand-gold w-3 h-3 cursor-pointer"
              />
              {language === "th" ? "แสดงจุดแวะระหว่างทาง" : language === "zh" ? "显示途中景点" : "Show waypoints"}
            </label>
          )}

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                view === "attractions"
                  ? (language === "th" ? "ค้นหาชื่อสถานที่ ไฮไลต์ หรือข้อมูล..." : language === "zh" ? "搜索景点名称、亮点或介绍..." : "Search attractions, tips...")
                  : (language === "th" ? "ค้นหาร้านอาหาร..." : language === "zh" ? "搜索餐厅..." : "Search restaurants...")
              }
              className="w-full pl-9 pr-4 py-2 bg-brand-bg-secondary/50 border border-white/10 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-gold/45 focus:bg-brand-bg-secondary/80 transition-all font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===== RESTAURANTS VIEW ===== */}
      {view === "restaurants" ? (
        filteredRestaurants.length === 0 ? (
          <div className="glass-panel p-8 text-center flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10">
            <AlertCircle className="w-8 h-8 text-gray-400 animate-bounce" />
            <p className="text-xs text-gray-500 font-bold">
              {language === "th" ? "ไม่พบร้านอาหารที่ตรงกัน" : language === "zh" ? "未找到匹配的餐厅" : "No restaurants match your query."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((r) => {
              const name = r.name[language] || r.name.en;
              const loc = r.location[language] || r.location.en;
              const desc = r.description[language] || r.description.en;
              const sig = r.signature[language] || r.signature.en;
              const cuisine = r.cuisine[language] || r.cuisine.en;
              const hours = r.hours[language] || r.hours.en;
              const price = r.priceRange[language] || r.priceRange.en;
              const tags = r.tags[language] || r.tags.en;

              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRestaurant(r)}
                  className="glass-panel rounded-2xl border border-white/10 overflow-hidden hover:border-brand-gold/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-brand-blue flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-gold" />
                        {loc}
                      </span>
                      <span className="flex items-center gap-1 text-[9px] text-amber-600 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {r.rating}
                      </span>
                    </div>
                    <h3 className="text-base font-display font-extrabold text-gray-900 group-hover:text-brand-gold transition-colors leading-snug">{name}</h3>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[9px] px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue font-semibold">{cuisine}</span>
                      {tags.slice(0, 1).map((tag, i) => (
                        <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-brand-gold/10 text-brand-gold font-semibold">{tag}</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">{desc}</p>
                  </div>
                  <div className="bg-brand-bg-primary/30 border-t border-white/10 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold">
                      <Flame className="w-3 h-3 text-brand-gold" />
                      <span>{price}</span>
                    </div>
                    <span className="flex items-center text-brand-gold font-extrabold text-[10px] group-hover:translate-x-1 transition-transform">
                      {language === "th" ? "ดูเพิ่มเติม" : language === "zh" ? "详情" : "Detail"}
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* ===== ATTRACTIONS VIEW ===== */
        sortedAttractions.length === 0 ? (
          <div className="glass-panel p-8 text-center flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10">
            <AlertCircle className="w-8 h-8 text-gray-400 animate-bounce" />
            <p className="text-xs text-gray-500 font-bold">
              {language === "th" ? "ไม่พบข้อมูลสถานที่ท่องเที่ยวที่ตรงกับการค้นหา" : language === "zh" ? "未找到匹配的景点信息" : "No attractions match your query."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAttractions.map((att) => {
              const name = att.name[language] || att.name.en;
              const location = att.location[language] || att.location.en;
              const desc = att.description[language] || att.description.en;
              const bestTime = att.bestTime[language] || att.bestTime.en;
              const firstHighlight = att.highlights[language]?.[0] || att.highlights.en?.[0];
              const isWaypoint = att.isWaypoint;

              return (
                <div
                  key={att.id}
                  onClick={() => setSelectedAttraction(att)}
                  className={`glass-panel rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer border ${
                    isWaypoint
                      ? "border-dashed border-gray-300 hover:border-brand-gold/40 opacity-90 hover:opacity-100"
                      : "border-white/10 hover:border-brand-gold/30"
                  }`}
                >
                  {/* Waypoint badge */}
                  {isWaypoint && (
                    <div className="absolute top-2 right-2 z-10 text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100/90 text-gray-600 border border-gray-300 flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" />
                      {language === "th" ? "จุดแวะ" : language === "zh" ? "途经" : "Waypoint"}
                    </div>
                  )}

                  {/* Upper Section */}
                  <div className="p-5 flex flex-col gap-3.5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-brand-blue flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-gold" />
                        {location}
                      </span>
                      <h3 className={`font-display font-extrabold text-gray-900 group-hover:text-brand-gold transition-colors ${isWaypoint ? "text-sm" : "text-base"}`}>
                        {name}
                      </h3>
                    </div>

                    <p className={`text-gray-700 leading-relaxed line-clamp-3 ${isWaypoint ? "text-[11px]" : "text-xs"}`}>
                      {desc}
                    </p>
                  </div>

                  {/* Lower Section */}
                  <div className="bg-brand-bg-primary/30 border-t border-white/10 p-4 flex flex-col gap-2.5">
                    {firstHighlight && (
                      <div className="flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 text-brand-gold flex-shrink-0 mt-0.5" />
                        <span className="text-[10px] text-gray-600 font-semibold leading-relaxed line-clamp-1 italic">
                          {firstHighlight}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] border-t border-gray-900/5 pt-2">
                      <div className="flex items-center gap-1 text-gray-500 font-bold">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span>{bestTime.split(",")[0]}</span>
                      </div>
                      <span className="flex items-center text-brand-gold font-extrabold group-hover:translate-x-1 transition-transform">
                        {language === "th" ? "อ่านรายละเอียด" : language === "zh" ? "深度解析" : "Read Detail"}
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Attractions Detail Modal Popup */}
      {selectedAttraction && (
        <div 
          onClick={() => setSelectedAttraction(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 no-print animate-fadeIn cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col relative animate-scaleUp cursor-default"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 p-5 lg:px-6 flex items-start justify-between z-10">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand-blue flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-gold" />
                  {selectedAttraction.location[language] || selectedAttraction.location.en}
                </span>
                <h3 className="text-lg lg:text-xl font-display font-extrabold text-gray-900">
                  {selectedAttraction.name[language] || selectedAttraction.name.en}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAttraction(null)}
                className="p-1 rounded-full bg-slate-100 text-gray-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content body */}
            <div className="p-5 lg:p-6 flex flex-col gap-5 text-xs text-gray-700 leading-relaxed font-sans">
              
              {/* Coordinates Info block */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-150 p-2.5 rounded-xl font-mono text-[10px] text-gray-600">
                <Compass className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <strong>GPS Coordinates:</strong> {selectedAttraction.coordinates}
              </div>

              {/* Description section */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                  {language === "th" ? "รายละเอียดสถานที่เชิงลึก" : language === "zh" ? "景点解析" : "In-depth Description"}
                </span>
                <p className="text-gray-800 font-semibold leading-relaxed bg-brand-bg-primary/10 border-l-2 border-brand-gold pl-3 py-1 italic">
                  {selectedAttraction.description[language] || selectedAttraction.description.en}
                </p>
              </div>

              {/* Core Information stats grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 border border-slate-150 p-4 rounded-2xl">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase font-bold text-gray-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-gold" />
                    {language === "th" ? "เวลาเปิดทำการ" : language === "zh" ? "开放时间" : "Open Hours"}
                  </span>
                  <span className="text-gray-900 font-bold text-[10px]">
                    {selectedAttraction.openHours[language] || selectedAttraction.openHours.en}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase font-bold text-gray-500 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-brand-gold" />
                    {language === "th" ? "ค่าเข้าชมโดยประมาณ" : language === "zh" ? "门票价格" : "Ticket Fees"}
                  </span>
                  <span className="text-gray-900 font-bold text-[10px]">
                    {selectedAttraction.ticketPrice[language] || selectedAttraction.ticketPrice.en}
                  </span>
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2 border-t border-slate-200 pt-2.5">
                  <span className="text-[9px] uppercase font-bold text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                    {language === "th" ? "ช่วงเวลาแนะนำที่ดีที่สุด" : language === "zh" ? "最佳旅游季节" : "Best Time to Visit"}
                  </span>
                  <span className="text-gray-900 font-bold text-[10px]">
                    {selectedAttraction.bestTime[language] || selectedAttraction.bestTime.en}
                  </span>
                </div>
              </div>

              {/* Highlights Bullet list */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                  {language === "th" ? "จุดเด่นและมุมเช็คอินทำคอนเทนต์" : language === "zh" ? "核心体验亮点" : "Highlights & Activities"}
                </span>
                <ul className="space-y-2">
                  {(selectedAttraction.highlights[language] || selectedAttraction.highlights.en).map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 bg-brand-gold/5 border border-brand-gold/10 p-2.5 rounded-xl">
                      <span className="w-5 h-5 rounded-full bg-brand-gold text-brand-bg-primary text-[10px] font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-gray-900 font-bold leading-normal">
                        {hl}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Local Secret Tips Alert */}
              <div className="bg-amber-50 border border-amber-500/20 p-3.5 rounded-2xl flex items-start gap-3 mt-1">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <strong className="text-[10px] text-amber-800 uppercase tracking-wide">
                    {language === "th" ? "คำแนะนำ/เคล็ดลับท้องถิ่น" : language === "zh" ? "当地独家贴士" : "Insider Travel Tip"}
                  </strong>
                  <p className="text-amber-900 font-semibold mt-0.5">
                    {selectedAttraction.localTips[language] || selectedAttraction.localTips.en}
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-100 p-4 flex items-center justify-end rounded-b-3xl">
              <button
                onClick={() => setSelectedAttraction(null)}
                className="px-5 py-1.5 bg-gray-800 text-white rounded-xl text-xs font-bold hover:bg-gray-900 cursor-pointer shadow-md"
              >
                {language === "th" ? "ปิดหน้าต่าง" : language === "zh" ? "关闭" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restaurant Detail Modal */}
      {selectedRestaurant && (
        <div onClick={() => setSelectedRestaurant(null)} className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 no-print animate-fadeIn cursor-pointer">
          <div onClick={(e) => e.stopPropagation()} className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col relative animate-scaleUp cursor-default">
            <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 p-5 lg:px-6 flex items-start justify-between z-10">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand-blue flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-gold" />
                  {selectedRestaurant.location[language] || selectedRestaurant.location.en}
                </span>
                <h3 className="text-lg lg:text-xl font-display font-extrabold text-gray-900">
                  {selectedRestaurant.name[language] || selectedRestaurant.name.en}
                </h3>
              </div>
              <button onClick={() => setSelectedRestaurant(null)} className="p-1 rounded-full bg-slate-100 text-gray-500 hover:bg-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 lg:p-6 flex flex-col gap-5 text-xs text-gray-700 leading-relaxed">
              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase font-bold text-gray-500 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" /> {language === "th" ? "คะแนน" : language === "zh" ? "评分" : "Rating"}
                  </span>
                  <span className="text-gray-900 font-extrabold text-sm">{selectedRestaurant.rating} / 5.0</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase font-bold text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {language === "th" ? "เวลาเปิด" : language === "zh" ? "营业时间" : "Hours"}
                  </span>
                  <span className="text-gray-900 font-bold text-[10px]">{selectedRestaurant.hours[language] || selectedRestaurant.hours.en}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase font-bold text-gray-500 flex items-center gap-1">
                    <Flame className="w-3 h-3" /> {language === "th" ? "ราคา" : language === "zh" ? "价格" : "Price"}
                  </span>
                  <span className="text-gray-900 font-bold text-[10px]">{selectedRestaurant.priceRange[language] || selectedRestaurant.priceRange.en}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase font-bold text-gray-500 flex items-center gap-1">
                    <UtensilsCrossed className="w-3 h-3" /> {language === "th" ? "ประเภท" : language === "zh" ? "菜系" : "Cuisine"}
                  </span>
                  <span className="text-gray-900 font-bold text-[10px]">{selectedRestaurant.cuisine[language] || selectedRestaurant.cuisine.en}</span>
                </div>
              </div>

              {/* Signature dish */}
              <div className="bg-brand-gold/10 border border-brand-gold/30 p-3.5 rounded-2xl">
                <span className="text-[10px] font-extrabold text-brand-gold uppercase tracking-wider">
                  🍽️ {language === "th" ? "เมนูเด็ดประจำร้าน" : language === "zh" ? "招牌菜" : "Signature Dish"}
                </span>
                <p className="text-gray-900 font-bold mt-1 leading-relaxed">
                  {selectedRestaurant.signature[language] || selectedRestaurant.signature.en}
                </p>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                  {language === "th" ? "รายละเอียด" : language === "zh" ? "详细介绍" : "About"}
                </span>
                <p className="text-gray-800 font-semibold leading-relaxed bg-brand-bg-primary/10 border-l-2 border-brand-gold pl-3 py-1 italic">
                  {selectedRestaurant.description[language] || selectedRestaurant.description.en}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {(selectedRestaurant.tags[language] || selectedRestaurant.tags.en).map((tag, i) => (
                  <span key={i} className="text-[9px] px-2.5 py-1 rounded-full bg-brand-blue/10 text-brand-blue font-bold">{tag}</span>
                ))}
              </div>

              {/* Tip */}
              <div className="bg-amber-50 border border-amber-500/20 p-3.5 rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <strong className="text-[10px] text-amber-800 uppercase tracking-wide">
                    {language === "th" ? "เคล็ดลับท้องถิ่น" : language === "zh" ? "当地贴士" : "Insider Tip"}
                  </strong>
                  <p className="text-amber-900 font-semibold mt-0.5">
                    {selectedRestaurant.tip[language] || selectedRestaurant.tip.en}
                  </p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-100 p-4 flex items-center justify-end rounded-b-3xl">
              <button onClick={() => setSelectedRestaurant(null)} className="px-5 py-1.5 bg-gray-800 text-white rounded-xl text-xs font-bold hover:bg-gray-900 cursor-pointer shadow-md">
                {language === "th" ? "ปิด" : language === "zh" ? "关闭" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
