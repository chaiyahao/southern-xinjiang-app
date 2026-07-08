"use client";

import React, { useState } from "react";
import { useTravelStore } from "../store/useTravelStore";
import { ATTRACTIONS_DATA, Attraction } from "../data/attractionsData";
import { 
  Search, 
  MapPin, 
  Clock, 
  Compass, 
  Tag, 
  ChevronRight, 
  Info, 
  Calendar, 
  X,
  AlertCircle
} from "lucide-react";

export default function AttractionsScreen() {
  const { language, fontSize } = useTravelStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);

  // Region mapping for filters
  const getAttractionRegion = (id: string): string => {
    if (id.includes("kashgar")) return "kashgar";
    if (id.includes("baisha") || id.includes("karakul") || id.includes("panlong")) return "pamir";
    if (id.includes("zepu") || id.includes("yotkan") || id.includes("taklamakan")) return "hotan";
    if (id.includes("tomur")) return "aksu";
    return "other";
  };

  const filteredAttractions = ATTRACTIONS_DATA.filter((att) => {
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
          {language === "th" ? "ข้อมูลสถานที่ท่องเที่ยวเชิงลึก" : language === "zh" ? "西域景点深度指南" : "Sightseeing Attraction Insights"}
        </h2>
        <p className="text-xs text-gray-500 max-w-2xl font-medium">
          {language === "th" 
            ? "เจาะลึกข้อมูลทางประวัติศาสตร์ วัฒนธรรม และคำแนะนำที่เป็นจริงเพื่อการเตรียมตัวเดินทางอย่างชาญฉลาดในดินแดนซินเจียงใต้" 
            : language === "zh" 
            ? "真实权威的南疆景点人文历史解密，搭配专业游玩提示，带您领略丝绸之路的无限魅力。" 
            : "Explore verified historical facts, cultural background, and practical traveler tips for all major spots in Southern Xinjiang."}
        </p>
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

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === "th" ? "ค้นหาชื่อสถานที่ ไฮไลต์ หรือข้อมูล..." : 
              language === "zh" ? "搜索景点名称、亮点或介绍..." : "Search attractions, tips..."
            }
            className="w-full pl-9 pr-4 py-2 bg-brand-bg-secondary/50 border border-white/10 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-gold/45 focus:bg-brand-bg-secondary/80 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Attractions Cards */}
      {filteredAttractions.length === 0 ? (
        <div className="glass-panel p-8 text-center flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10">
          <AlertCircle className="w-8 h-8 text-gray-400 animate-bounce" />
          <p className="text-xs text-gray-500 font-bold">
            {language === "th" ? "ไม่พบข้อมูลสถานที่ท่องเที่ยวที่ตรงกับการค้นหา" : language === "zh" ? "未找到匹配的景点信息" : "No attractions match your query."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAttractions.map((att) => {
            const name = att.name[language] || att.name.en;
            const location = att.location[language] || att.location.en;
            const desc = att.description[language] || att.description.en;
            const bestTime = att.bestTime[language] || att.bestTime.en;
            const firstHighlight = att.highlights[language]?.[0] || att.highlights.en?.[0];

            return (
              <div
                key={att.id}
                onClick={() => setSelectedAttraction(att)}
                className="glass-panel rounded-2xl border border-white/10 overflow-hidden hover:border-brand-gold/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                {/* Upper Section */}
                <div className="p-5 flex flex-col gap-3.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-brand-blue flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-gold" />
                      {location}
                    </span>
                    <h3 className="text-base font-display font-extrabold text-gray-900 group-hover:text-brand-gold transition-colors">
                      {name}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">
                    {desc}
                  </p>
                </div>

                {/* Lower Section (Highlights & Footer) */}
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
    </div>
  );
}
