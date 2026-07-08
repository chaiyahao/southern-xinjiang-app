"use client";

import React, { useState } from "react";
import { RESTAURANTS_DATA, Restaurant } from "../data/restaurantsData";
import {
  Search, MapPin, Clock, Star, ChevronRight, Info, X, AlertCircle,
  Flame, UtensilsCrossed,
} from "lucide-react";
import { useTravelStore } from "../store/useTravelStore";

export default function RestaurantsScreen() {
  const { language } = useTravelStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selected, setSelected] = useState<Restaurant | null>(null);

  const th = language === "th";
  const zh = language === "zh";
  const L = (thStr: string, enStr: string, zhStr: string) => (th ? thStr : zh ? zhStr : enStr);

  const filtered = RESTAURANTS_DATA.filter((r) => {
    const regionMatch = activeFilter === "all" || r.region === activeFilter;
    const q = searchQuery.toLowerCase();
    const textSearch =
      !q ||
      (r.name.en + r.name.th + r.name.zh + r.cuisine.en + r.cuisine.th + r.cuisine.zh + r.signature.en + r.signature.th).toLowerCase().includes(q);
    return regionMatch && textSearch;
  });

  const filterTabs = [
    { id: "all", labels: { th: "ทั้งหมด", en: "All", zh: "全部" } },
    { id: "kashgar", labels: { th: "คัชการ์", en: "Kashgar", zh: "喀什" } },
    { id: "pamir", labels: { th: "ปามีร์/ทาชคูร์กัน", en: "Pamir/Tashkurgan", zh: "帕米尔/塔县" } },
    { id: "hotan", labels: { th: "เจ๋อผู่/โฮตัน", en: "Zepu/Hotan", zh: "泽普/和田" } },
    { id: "aksu", labels: { th: "อักซู", en: "Aksu", zh: "阿克苏" } },
  ];

  const regionEmoji: Record<string, string> = {
    kashgar: "🕌", pamir: "🏔️", hotan: "🏜️", aksu: "🍎",
  };

  const priceStars = (range: string) => {
    const m = range.match(/₴*/);
    if (!m) return "";
    return m[0].length === 1 ? "฿" : m[0].length === 2 ? "฿฿" : "฿฿฿";
  };

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-6 max-w-6xl mx-auto w-full animate-fadeIn pb-24 lg:pb-6">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl lg:text-2xl font-display font-extrabold text-gold-gradient tracking-wide uppercase">
          {L("ร้านอาหารยอดนิยม", "Popular Restaurants", "人气美食推荐")}
        </h2>
        <p className="text-xs text-gray-500 max-w-2xl font-medium">
          {L(
            "รวมร้านอาหารแนะนำยอดฮิตตามสถานที่ท่องเที่ยว พร้อมข้อมูลอัปเดตล่าสุด เพื่อการเดินทางที่อร่อยและปลอดภัย",
            "Curated list of must-try restaurants and street food spots at each destination, updated for your trip.",
            "精选各站必吃美食与人气餐厅推荐，助力您的美食之旅。"
          )}
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-brand-gold/15 pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex-shrink-0 cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-brand-gold text-brand-bg-primary shadow-md"
                  : "bg-brand-bg-secondary/40 text-gray-700 hover:text-brand-gold border border-white/5"
              }`}
            >
              {tab.id !== "all" && <span className="mr-1">{regionEmoji[tab.id]}</span>}
              {tab.labels[language] || tab.labels.en}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={L("ค้นหาร้านอาหาร...", "Search restaurants...", "搜索餐厅...")}
            className="w-full pl-9 pr-4 py-2 bg-brand-bg-secondary/50 border border-white/10 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-gold/45 transition-all font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Restaurant Cards Grid */}
      {filtered.length === 0 ? (
        <div className="glass-panel p-8 text-center flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10">
          <AlertCircle className="w-8 h-8 text-gray-400 animate-bounce" />
          <p className="text-xs text-gray-500 font-bold">{L("ไม่พบร้านอาหารที่ตรงกัน", "No restaurants match your query.", "未找到匹配的餐厅")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => {
            const name = r.name[language] || r.name.en;
            const loc = r.location[language] || r.location.en;
            const desc = r.description[language] || r.description.en;
            const sig = r.signature[language] || r.signature.en;
            const cuisine = r.cuisine[language] || r.cuisine.en;
            const tags = r.tags[language] || r.tags.en;
            const hours = r.hours[language] || r.hours.en;
            const price = r.priceRange[language] || r.priceRange.en;

            return (
              <div
                key={r.id}
                onClick={() => setSelected(r)}
                className="glass-panel rounded-2xl border border-white/10 overflow-hidden hover:border-brand-gold/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div className="p-5 flex flex-col gap-3">
                  {/* Region badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-brand-blue flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-gold" />
                      {loc}
                    </span>
                    <div className="flex items-center gap-1 text-[9px] text-amber-600 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {r.rating}
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-base font-display font-extrabold text-gray-900 group-hover:text-brand-gold transition-colors leading-snug">
                    {name}
                  </h3>

                  {/* Cuisine + Tags */}
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue font-semibold">
                      {cuisine}
                    </span>
                    {tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-brand-gold/10 text-brand-gold font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">{desc}</p>
                </div>

                {/* Footer */}
                <div className="bg-brand-bg-primary/30 border-t border-white/10 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span className="font-medium">{hours}</span>
                    <span className="text-brand-gold font-bold">{price}</span>
                  </div>
                  <span className="flex items-center text-brand-gold font-extrabold text-[10px] group-hover:translate-x-1 transition-transform">
                    {L("ดูเพิ่มเติม", "Detail", "详情")} <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div onClick={() => setSelected(null)} className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 no-print animate-fadeIn cursor-pointer">
          <div onClick={(e) => e.stopPropagation()} className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col relative animate-scaleUp cursor-default">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 p-5 lg:px-6 flex items-start justify-between z-10">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand-blue flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-gold" />
                  {selected.location[language] || selected.location.en}
                </span>
                <h3 className="text-lg lg:text-xl font-display font-extrabold text-gray-900">
                  {selected.name[language] || selected.name.en}
                </h3>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 rounded-full bg-slate-100 text-gray-500 hover:bg-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 lg:p-6 flex flex-col gap-5 text-xs text-gray-700 leading-relaxed">
              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase font-bold text-gray-500 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" /> {L("คะแนน", "Rating", "评分")}
                  </span>
                  <span className="text-gray-900 font-extrabold text-sm">{selected.rating} / 5.0</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase font-bold text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {L("เวลาเปิด", "Hours", "营业时间")}
                  </span>
                  <span className="text-gray-900 font-bold text-[10px]">{selected.hours[language] || selected.hours.en}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase font-bold text-gray-500 flex items-center gap-1">
                    <Flame className="w-3 h-3" /> {L("ราคา", "Price", "价格")}
                  </span>
                  <span className="text-gray-900 font-bold text-[10px]">{selected.priceRange[language] || selected.priceRange.en}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase font-bold text-gray-500 flex items-center gap-1">
                    <UtensilsCrossed className="w-3 h-3" /> {L("ประเภท", "Cuisine", "菜系")}
                  </span>
                  <span className="text-gray-900 font-bold text-[10px]">{selected.cuisine[language] || selected.cuisine.en}</span>
                </div>
              </div>

              {/* Signature dish */}
              <div className="bg-brand-gold/10 border border-brand-gold/30 p-3.5 rounded-2xl">
                <span className="text-[10px] font-extrabold text-brand-gold uppercase tracking-wider">
                  🍽️ {L("เมนูเด็ดประจำร้าน", "Signature Dish", "招牌菜")}
                </span>
                <p className="text-gray-900 font-bold mt-1 leading-relaxed">
                  {selected.signature[language] || selected.signature.en}
                </p>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                  {L("รายละเอียด", "About", "详细介绍")}
                </span>
                <p className="text-gray-800 font-semibold leading-relaxed bg-brand-bg-primary/10 border-l-2 border-brand-gold pl-3 py-1 italic">
                  {selected.description[language] || selected.description.en}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {(selected.tags[language] || selected.tags.en).map((tag, i) => (
                  <span key={i} className="text-[9px] px-2.5 py-1 rounded-full bg-brand-blue/10 text-brand-blue font-bold">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Local tip */}
              <div className="bg-amber-50 border border-amber-500/20 p-3.5 rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <strong className="text-[10px] text-amber-800 uppercase tracking-wide">
                    {L("เคล็ดลับท้องถิ่น", "Insider Tip", "当地贴士")}
                  </strong>
                  <p className="text-amber-900 font-semibold mt-0.5">
                    {selected.tip[language] || selected.tip.en}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-100 p-4 flex items-center justify-end rounded-b-3xl">
              <button onClick={() => setSelected(null)} className="px-5 py-1.5 bg-gray-800 text-white rounded-xl text-xs font-bold hover:bg-gray-900 cursor-pointer shadow-md">
                {L("ปิด", "Close", "关闭")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
