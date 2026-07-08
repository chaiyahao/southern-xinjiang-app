"use client";

import React, { useState, useEffect } from "react";
import { useTravelStore } from "../store/useTravelStore";
import { PHRASEBOOK_DATA, Phrase, PhraseCategory } from "../data/phrasebookData";
import { TRANSLATIONS_DATA } from "../data/translations";
import {
  Search,
  Volume2,
  Copy,
  Check,
  Languages,
  BookOpen,
  ShieldCheck,
  Utensils,
  Map,
  Coins,
  HeartPulse,
  Compass,
  Binary,
  Clock,
  VolumeX,
  Type
} from "lucide-react";

// Helper to map icon names to Lucide icons
const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Utensils,
  Map,
  Coins,
  HeartPulse,
  Compass,
  Binary,
  Clock
};

export default function PhrasebookScreen() {
  const { language, fontSize, setFontSize } = useTravelStore();
  const t = TRANSLATIONS_DATA[language].ui;

  const [activeCategory, setActiveCategory] = useState<string>("survival");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.speechSynthesis) {
      setSpeechSupported(false);
    }
  }, []);

  const copyPhraseText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const speak = (text: string, langType: "zh" | "uy" | "tg", phoneticString: string, id: string) => {
    if (typeof window === "undefined") return;

    // Cancel any native browser speech synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Stop any currently playing custom Audio element
    if ((window as any).currentPlayingAudio) {
      try {
        (window as any).currentPlayingAudio.pause();
      } catch (e) {
        console.error("Error pausing audio", e);
      }
      (window as any).currentPlayingAudio = null;
    }

    setSpeakingId(id);

    let utteranceText = text;
    let speakLang = "zh-CN";

    if (langType === "zh") {
      utteranceText = text.split(" (")[0];
      speakLang = "zh-CN";
    } else if (langType === "uy") {
      // Extract Uyghur text before parenthesis/pinyin
      utteranceText = text.split(" (")[0];
      speakLang = "ug";
    } else if (langType === "tg") {
      // Extract Tajik text before bracket
      utteranceText = text.split(" [")[0];
      speakLang = "tg";
    }

    // Google Translate TTS Endpoint
    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${speakLang}&client=gtx&q=${encodeURIComponent(utteranceText)}`;

    const audio = new Audio(googleTtsUrl);
    (window as any).currentPlayingAudio = audio;

    const runFallback = () => {
      if (!window.speechSynthesis) {
        setSpeakingId(null);
        return;
      }

      let fallbackLang = "zh-CN";
      let fallbackText = utteranceText;

      if (langType === "zh") {
        fallbackLang = "zh-CN";
      } else {
        const match = phoneticString.match(/\[(.*?)\]/);
        const thaiPhonetic = match ? match[1].replace(/-/g, "") : "";

        if (language === "th" && thaiPhonetic) {
          fallbackText = thaiPhonetic;
          fallbackLang = "th-TH";
        } else {
          const pinyinMatch = phoneticString.match(/\((.*?)\)/);
          fallbackText = pinyinMatch ? pinyinMatch[1] : phoneticString.split(" [")[0];
          fallbackLang = "en-US";
        }
      }

      const utterance = new SpeechSynthesisUtterance(fallbackText);
      utterance.lang = fallbackLang;
      utterance.rate = 0.8;

      utterance.onend = () => {
        setSpeakingId(null);
      };
      utterance.onerror = () => {
        setSpeakingId(null);
      };

      window.speechSynthesis.speak(utterance);
    };

    audio.onended = () => {
      setSpeakingId(null);
      (window as any).currentPlayingAudio = null;
    };

    audio.onerror = () => {
      runFallback();
    };

    audio.play().catch(() => {
      // Autoplay blocked or failed, use fallback
      runFallback();
    });
  };

  // Filter phrases based on search input
  const allPhrases = PHRASEBOOK_DATA.reduce<Array<{ phrase: Phrase; cat: PhraseCategory }>>((acc, cat) => {
    cat.phrases.forEach((phrase) => {
      acc.push({ phrase, cat });
    });
    return acc;
  }, []);

  const matchesSearch = (phrase: Phrase, query: string) => {
    const q = query.toLowerCase();
    return (
      phrase.th.toLowerCase().includes(q) ||
      phrase.en.toLowerCase().includes(q) ||
      phrase.zh.toLowerCase().includes(q) ||
      phrase.uy.toLowerCase().includes(q) ||
      phrase.tg.toLowerCase().includes(q)
    );
  };

  const displayCategories = searchQuery
    ? PHRASEBOOK_DATA.filter((cat) => cat.phrases.some((p) => matchesSearch(p, searchQuery)))
    : PHRASEBOOK_DATA;

  const activeCategoryData = PHRASEBOOK_DATA.find((c) => c.id === activeCategory);

  const translateUI = {
    title: language === "th" ? "คลังคำศัพท์ประจำทริปซินเจียง" : language === "zh" ? "新疆旅行常用语手册" : "Xinjiang Expedition Phrasebook",
    desc: language === "th" 
      ? "รวมประโยคและคำศัพท์สำคัญที่จำเป็นสำหรับการใช้ชีวิต เดินทาง สั่งอาหาร ช้อปปิ้ง และติดต่อสื่อสารในเขตซินเจียงใต้ (คัชการ์ ปามีร์ และทัชกูรกัน)" 
      : language === "zh" 
      ? "收录了在南疆地区（喀什、帕米尔、塔县）生活、出行、用餐及购物时最常用的汉语、维吾尔语和塔吉克语词汇。" 
      : "Essential vocabulary for travel, dining, shopping, and emergencies in Southern Xinjiang (Kashgar, Pamir Highway, and Tashkurgan).",
    searchPlaceholder: language === "th" ? "ค้นหาคำศัพท์... (พิมพ์ไทย, อังกฤษ, จีน, พินอิน หรือคำอ่านอุยกูร์)" : language === "zh" ? "搜索词汇... (支持中/英/泰/维文/拼音)" : "Search phrases... (TH, EN, ZH, Pinyin, or Uyghur)",
    fontSizeLabel: language === "th" ? "ขนาดตัวอักษร" : language === "zh" ? "字体大小" : "Font Size",
    noResult: language === "th" ? "ไม่พบคำศัพท์ที่ตรงกับการค้นหา" : language === "zh" ? "未找到匹配的词汇" : "No phrases found matching your search.",
    speechFallbackNote: language === "th" 
      ? "💡 สำหรับภาษาอุยกูร์ (UY) และทาจิก (TG) ระบบจะสังเคราะห์เสียงจำลองตามหลักคำอ่านไทยเพื่อการฝึกออกเสียงตาม" 
      : language === "zh" 
      ? "💡 维吾尔语(UY)和塔吉克语(TG)将采用模拟拼读发音，帮助您学习日常发音。" 
      : "💡 For Uyghur (UY) and Tajik (TG), the system reads the phonetic romanization to guide your pronunciation.",
    phoneticGuide: language === "th" ? "คำอ่านไทย" : language === "zh" ? "模拟读音" : "Phonetic Guide"
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 animate-fadeIn max-w-7xl mx-auto w-full">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-gold/10 border border-brand-gold/30 text-brand-gold">
              <Languages className="w-6 h-6 animate-pulse-gold" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-display font-extrabold text-gold-gradient tracking-tight">
              {translateUI.title}
            </h2>
          </div>
          <p className="text-xs lg:text-sm text-gray-600 font-medium max-w-3xl mt-1 leading-relaxed">
            {translateUI.desc}
          </p>
        </div>

      </div>

      {/* Main Phrasebook Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Sidebar/Categories Selector */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={translateUI.searchPlaceholder}
              className="w-full bg-brand-bg-secondary border border-brand-gold/25 rounded-xl text-xs lg:text-sm py-3 pl-10 pr-9 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-brand-gold/40 focus:ring-1 focus:ring-brand-gold/45 transition-all duration-300 shadow-sm"
            />
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3 text-[10px] text-gray-400 hover:text-gray-200 cursor-pointer py-1 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Categories Buttons (Hidden when searching since we search globally) */}
          {!searchQuery && (
            <div className="flex flex-col gap-1 w-full">
              {/* Swipe Guide Indicator */}
              <span className="text-[9px] uppercase tracking-wider text-brand-gold/75 lg:hidden block animate-pulse font-bold mb-1">
                {language === "th" ? "← เลื่อนแถบด้านล่างเพื่อดูหมวดหมู่เพิ่มเติม →" : language === "zh" ? "← 左右滑动查看更多分类 →" : "← Swipe horizontally to see more categories →"}
              </span>
              <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2 w-full scrollbar-thin scrollbar-thumb-brand-gold/30 scrollbar-track-transparent">
                {PHRASEBOOK_DATA.map((cat) => {
                  const CatIcon = IconMap[cat.iconName] || BookOpen;
                  const isActive = activeCategory === cat.id;
                  const nameLabel =
                    language === "th" ? cat.nameTh : language === "zh" ? cat.nameZh : cat.nameEn;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-300 cursor-pointer text-left whitespace-nowrap lg:whitespace-normal border w-auto lg:w-full flex-shrink-0 lg:flex-shrink ${
                        isActive
                          ? "bg-brand-gold/15 text-brand-gold border-brand-gold/30 shadow-[0_0_15px_rgba(225,166,59,0.08)] scale-102"
                          : "text-gray-400 hover:text-gray-100 hover:bg-white/5 border-transparent bg-brand-bg-secondary/20"
                      }`}
                    >
                      <CatIcon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-brand-gold" : "text-gray-500"}`} />
                      <span className="truncate">{nameLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Phrase Cards Container */}
        <div className="lg:col-span-9 flex flex-col gap-4">
          {/* Informative Tip */}
          <div className="p-3.5 rounded-xl bg-brand-bg-secondary/35 border border-white/5 text-[11px] text-gray-400 leading-normal flex items-start gap-2.5 shadow">
            <span className="text-brand-gold select-none font-bold">ℹ️</span>
            <div>
              <p className="font-medium text-gray-300 mb-0.5">{translateUI.speechFallbackNote}</p>
              {!speechSupported && (
                <p className="text-red-400 mt-1">⚠️ Web Speech API is not supported on this browser version.</p>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchQuery ? (
              // Search Mode: render all matching phrases across categories
              allPhrases.filter(({ phrase }) => matchesSearch(phrase, searchQuery)).length > 0 ? (
                allPhrases
                  .filter(({ phrase }) => matchesSearch(phrase, searchQuery))
                  .map(({ phrase, cat }) => (
                    <PhraseCard
                      key={phrase.id}
                      phrase={phrase}
                      categoryName={language === "th" ? cat.nameTh : language === "zh" ? cat.nameZh : cat.nameEn}
                      onCopy={copyPhraseText}
                      onSpeak={speak}
                      copiedId={copiedId}
                      speakingId={speakingId}
                      translateUI={translateUI}
                      language={language}
                    />
                  ))
              ) : (
                <div className="col-span-full py-16 text-center">
                  <VolumeX className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 italic">{translateUI.noResult}</p>
                </div>
              )
            ) : (
              // Category Mode: render phrases of selected category
              activeCategoryData?.phrases.map((phrase) => (
                <PhraseCard
                  key={phrase.id}
                  phrase={phrase}
                  onCopy={copyPhraseText}
                  onSpeak={speak}
                  copiedId={copiedId}
                  speakingId={speakingId}
                  translateUI={translateUI}
                  language={language}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Inner Component for Phrase Card to maximize clean rendering structure
interface PhraseCardProps {
  phrase: Phrase;
  categoryName?: string;
  onCopy: (text: string, id: string) => void;
  onSpeak: (text: string, langType: "zh" | "uy" | "tg", phoneticString: string, id: string) => void;
  copiedId: string | null;
  speakingId: string | null;
  translateUI: { phoneticGuide: string };
  language: string;
}

function PhraseCard({
  phrase,
  categoryName,
  onCopy,
  onSpeak,
  copiedId,
  speakingId,
  translateUI,
  language
}: PhraseCardProps) {
  // Extract standard Chinese without pinyin for clipboard copying
  const cleanChinese = phrase.zh.split(" (")[0];
  const cleanUyghur = phrase.uy.split(" (")[0];

  const fullCopyText = `${cleanChinese} (CN) | ${cleanUyghur} (UY) | ${phrase.tg.split(" (")[0]} (TG) - Translated via Southern Xinjiang Console`;

  return (
    <div className="glass-panel bg-brand-bg-secondary/40 p-5 rounded-2xl border border-white/5 hover:border-brand-gold/25 transition-all duration-300 flex flex-col justify-between gap-4 group relative shadow-md overflow-hidden">
      {/* Background soft glow when speaking */}
      {speakingId && speakingId.startsWith(phrase.id) && (
        <div className="absolute inset-0 bg-brand-gold/5 animate-pulse-gold pointer-events-none z-0"></div>
      )}

      {/* Top Section */}
      <div className="flex flex-col gap-2.5 relative z-10">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            {categoryName && (
              <span className="text-[9px] font-bold text-brand-blue uppercase tracking-widest mb-1 bg-brand-blue/5 border border-brand-blue/15 px-1.5 py-0.5 rounded-md self-start">
                {categoryName}
              </span>
            )}
             <span className="font-extrabold text-gray-900 text-sm tracking-wide leading-snug">
              {language === "th" ? phrase.th : language === "zh" ? phrase.zh.split(" (")[0] : phrase.en}
            </span>
            {language !== "en" && (
              <span className="text-[10px] text-gray-700 font-semibold mt-0.5">{phrase.en}</span>
            )}
            {language !== "th" && (
              <span className="text-[10px] text-gray-700 font-semibold mt-0.5">{phrase.th}</span>
            )}
          </div>

          {/* Master Copy Button */}
          <button
            onClick={() => onCopy(fullCopyText, phrase.id)}
            className="text-gray-500 hover:text-gray-300 p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer flex-shrink-0"
            title="Copy all translations"
          >
            {copiedId === phrase.id ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Translation Details Grid */}
        <div className="grid grid-cols-1 gap-2 border-t border-white/5 pt-3">
          {/* Chinese Mandarin */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-brand-bg-primary/55 border border-white/5 hover:border-brand-gold/15 transition-all">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-700 tracking-wider">CHINESE (จีนกลาง) 🇨🇳</span>
              <span className="text-sm font-extrabold text-gray-900 mt-0.5 font-sans">{cleanChinese}</span>
              <span className="text-[10px] text-brand-gold font-extrabold mt-0.5">
                {phrase.zh.includes(" (") ? phrase.zh.match(/\((.*?)\)/)?.[0] || phrase.zh : ""}
              </span>
            </div>
            <button
              onClick={() => onSpeak(phrase.zh, "zh", "", `${phrase.id}-zh`)}
              className={`p-2 rounded-lg bg-brand-gold/10 hover:bg-brand-gold hover:text-brand-bg-primary text-brand-gold transition-all duration-300 cursor-pointer ${
                speakingId === `${phrase.id}-zh` ? "animate-bounce" : ""
              }`}
              title="Speak Mandarin Chinese"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Uyghur Language */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-brand-bg-primary/55 border border-white/5 hover:border-brand-gold/15 transition-all">
            <div className="flex flex-col w-4/5">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-gray-700 tracking-wider">UYGHUR (อุยกูร์) 🕌</span>
                <span className="text-[8px] bg-sky-500/10 text-sky-600 font-bold px-1 rounded-md">Arab & Lat</span>
              </div>
              <span className="text-sm font-extrabold text-gray-900 mt-1 leading-normal font-sans" dir="rtl">
                {cleanUyghur}
              </span>
              <span className="text-[9px] text-gray-500 font-medium mt-0.5">
                Lat: {phrase.uy.includes(" (") ? phrase.uy.split(" (")[1].split(")")[0] : ""}
              </span>
              <span className="text-[10px] text-brand-blue font-bold mt-1 bg-brand-blue/10 py-0.5 px-1.5 rounded-md border border-brand-blue/20 self-start">
                🗣️ {translateUI.phoneticGuide}: {phrase.uy.includes(" [") ? phrase.uy.split(" [")[1].split("]")[0] : phrase.uy}
              </span>
            </div>
            <button
              onClick={() => onSpeak(phrase.uy, "uy", phrase.uy, `${phrase.id}-uy`)}
              className={`p-2 rounded-lg bg-brand-blue/10 hover:bg-brand-blue hover:text-brand-bg-primary text-brand-blue transition-all duration-300 cursor-pointer ${
                speakingId === `${phrase.id}-uy` ? "animate-bounce" : ""
              }`}
              title="Speak Simulated Uyghur"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Tajik / Sarikoli Language */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-brand-bg-primary/55 border border-white/5 hover:border-brand-gold/15 transition-all">
            <div className="flex flex-col w-4/5">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-gray-700 tracking-wider">TAJIK (ทาจิก/ซาริโกลี) 🏔️</span>
                <span className="text-[8px] bg-purple-500/10 text-purple-600 font-bold px-1 rounded-md">Pamir Oral</span>
              </div>
              <span className="text-xs font-bold text-gray-900 mt-1 font-sans">
                {phrase.tg.split(" [")[0]}
              </span>
              <span className="text-[10px] text-purple-700 font-bold mt-1 bg-purple-500/10 py-0.5 px-1.5 rounded-md border border-purple-500/20 self-start">
                🗣️ {translateUI.phoneticGuide}: {phrase.tg.includes(" [") ? phrase.tg.split(" [")[1].split("]")[0] : phrase.tg}
              </span>
            </div>
            <button
              onClick={() => onSpeak(phrase.tg, "tg", phrase.tg, `${phrase.id}-tg`)}
              className={`p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500 hover:text-brand-bg-primary text-purple-400 transition-all duration-300 cursor-pointer ${
                speakingId === `${phrase.id}-tg` ? "animate-bounce" : ""
              }`}
              title="Speak Simulated Tajik"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
