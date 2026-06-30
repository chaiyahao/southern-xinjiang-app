"use client";

import React, { useState } from "react";
import { TRANSLATIONS_DATA } from "../data/translations";
import { useTravelStore } from "../store/useTravelStore";
import { 
  Headphones, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Mail, 
  Globe, 
  MapPin, 
  Languages, 
  Copy, 
  Check, 
  Search, 
  Volume2 
} from "lucide-react";

export default function SupportScreen() {
  const { language } = useTravelStore();
  const t = TRANSLATIONS_DATA[language].ui;

  const [activeCategory, setActiveCategory] = useState<"survival" | "food" | "directions" | "shopping">("survival");
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const translatorData = {
    survival: [
      { th: "สวัสดี", zh: "你好 (Nǐ hǎo)", uy: "Yaxshimusiz [ยัคชิมุสิซ]" },
      { th: "ขอบคุณ", zh: "谢谢 (Xièxiè)", uy: "Rahmat [ระห์มัต]" },
      { th: "ใช่ / ไม่ใช่", zh: "是 (Shì) / 不是 (Bú shì)", uy: "Hawa [แฮวา] / Yaq [ยัก]" },
      { th: "ต้องการความช่วยเหลือ!", zh: "救命! (Jiùmìng!)", uy: "Yordam bering! [ยอร์ดัม เบริง]" },
      { th: "ยินดีที่ได้รู้จัก", zh: "很高兴认识你 (Hěn gāoxìng rènshi nǐ)", uy: "Tonushqanimizgha hursendmen [ทอนุกคานิมิซกา คูร์เซ็นต์เม็น]" },
      { th: "ช่วยหน่อยได้ไหม?", zh: "你能帮我吗? (Nǐ néng bāng wǒ ma?)", uy: "Yordam kilalamsiz? [ยอร์ดัม กิลาลัมสิซ]" },
      { th: "ฉันฟังไม่เข้าใจ", zh: "我听不懂 (Wǒ tīng bù dǒng)", uy: "Chushenmidim [ชูเช็นมิดิม]" },
    ],
    food: [
      { th: "เช็คบิล / เก็บเงิน", zh: "买单 (Mǎidān)", uy: "Hesab [เฮซับ]" },
      { th: "อร่อยมาก", zh: "很好吃 (Hěn hǎo chī)", uy: "Bek temlik [เบก เติมลิก]" },
      { th: "น้ำเปล่า", zh: "水 (Shuǐ)", uy: "Su [ซู]" },
      { th: "ไม่ใส่ผักชี", zh: "不要香菜 (Bú yào xiāngcài)", uy: "Kashnich salmang [คัชนิช ซัลมัง]" },
      { th: "น้ำชา", zh: "茶 (Chá)", uy: "Chay [ชาย]" },
      { th: "เนื้อแกะย่าง (กะบับ)", zh: "羊肉串 (Yángròuchuàn)", uy: "Kawaap [คาวาป]" },
      { th: "แป้งจี่ / ขนมปังนาน", zh: "烤馕 (Kǎonáng)", uy: "Nan [นาน]" },
      { th: "เนื้อแกะ", zh: "羊肉 (Yángròu)", uy: "Qoy göshi [คอย เกอชิ]" },
      { th: "เนื้อวัว", zh: "牛肉 (Niúròu)", uy: "Kala göshi [คาลา เกอชิ]" },
      { th: "เนื้อไก่", zh: "鸡肉 (Jīròu)", uy: "Toho göshi [โทโฮ เกอชิ]" },
      { th: "ไก่ผัดจานใหญ่ (ต้าพ่านจี)", zh: "大盘鸡 (Dàpánjī)", uy: "Chong texse toho qorumisi [ชอง เทกเซ โทโฮ โครูมิซิ]" },
    ],
    directions: [
      { th: "ห้องน้ำอยู่ไหน?", zh: "厕所在哪里? (Cèsuǒ zài nǎlǐ?)", uy: "Hajathana qeyerde? [ฮาจัตคานา เควเยอร์เด]" },
      { th: "โรงพยาบาล", zh: "医院 (Yīyuàn)", uy: "Dohturhana [โดกตูร์คานา]" },
      { th: "ไปสนามบิน", zh: "去机场 (Qù jīchǎng)", uy: "Aportqa bérish [อาปอร์ตกา เบริช]" },
      { th: "หยุดตรงนี้", zh: "停在这里 (Tíng zài zhèlǐ)", uy: "Shu yerde tohtang [ชู เยว์เด โตะตัง]" },
      { th: "โรงแรมอยู่ที่ไหน?", zh: "酒店在哪里? (Jiǔdiàn zài nǎlǐ?)", uy: "Mehmanhana qeyerde? [เมห์มานคานา เควเยอร์เด]" },
      { th: "เลี้ยวซ้าย / เลี้ยวขวา", zh: "左转 (Zuǒ zhuǎn) / 右转 (Yòu zhuǎn)", uy: "Solgha burulung [ซอลกา บุรุลุง] / Onggha burulung [อองกา บุรุลุง]" },
      { th: "สถานีรถไฟ", zh: "火车站 (Huǒchēzhàn)", uy: "Poyiz istansisi [โปยิซ อิสตันซิซิ]" },
    ],
    shopping: [
      { th: "ราคาเท่าไหร่?", zh: "多少钱? (Duōshǎo qián?)", uy: "Qanchilik? [คันชิลิก]" },
      { th: "แพงเกินไป", zh: "太贵了 (Tài guì le)", uy: "Bek qimmat [เบก คิมมัต]" },
      { th: "ลดหน่อยได้ไหม?", zh: "便宜一点可以吗? (Piányi yīdiǎn kěyǐ ma?)", uy: "Arzanrak bering? [อาร์ซันรัก เบริง]" },
      { th: "หมวกดอปปา (หมวกอุยกูร์)", zh: "花帽 (Huāmào) / 多帕 (Duōpà)", uy: "Doppa [ดอปปา]" },
      { th: "ต้องการซื้ออันนี้", zh: "我要买这个 (Wǒ yào mǎi zhè ge)", uy: "Buni alimen [บุหนิ อะลิเมน]" },
      { th: "มีอันอื่นอีกไหม?", zh: "有别的吗? (Yǒu bié de ma?)", uy: "Bashqa barmu? [บัชคัง บาร์มุ]" },
      { th: "เงินสด / สแกนจ่าย", zh: "现金 (Xiànjīn) / 扫码支付 (Sǎomǎ zhīfù)", uy: "Naqd pul [นัคด์ พูล] / Skanerlep tolesh [สแกนเนอร์เล็ป โทเลช]" },
    ]
  };

  const copyPhrase = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextId(id);
    setTimeout(() => setCopiedTextId(null), 1500);
  };

  const speakPhrase = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    
    // Extract actual Chinese characters before pinyin parentheses
    // e.g. "你好 (Nǐ hǎo)" -> "你好"
    let cleanText = text;
    if (text.includes(" (")) {
      cleanText = text.split(" (")[0];
    }
    
    // Cancel currently speaking utterance
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "zh-CN";
    utterance.rate = 0.85; // slower for clear pronunciation
    window.speechSynthesis.speak(utterance);
  };

  const supportDetails = {
    manager: "Arthur Xie",
    role: language === "th" ? "ผู้ประสานงานทริป" : language === "zh" ? "行程协调员" : "Trip Coordinator",
    phone: "+66 (0) 88-005-5888",
    wechat: "Rhaohaohao",
    email: "chaiyahao@gmail.com",
    languages: ["Thai", "English", "Chinese (Mandarin)"],
  };

  // Filter phrases based on search input
  const filteredPhrases = translatorData[activeCategory].filter(phrase => {
    const q = searchQuery.toLowerCase();
    return (
      phrase.th.toLowerCase().includes(q) ||
      phrase.zh.toLowerCase().includes(q) ||
      phrase.uy.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 animate-fadeIn max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-gold-gradient tracking-tight">
            {t.supportHeader}
          </h2>
          <p className="text-xs text-gray-400">
            {t.supportDesc}
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t.supportDuty}</span>
        </div>
      </div>

      {/* Main Support Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Support Card (Left) */}
        <div className="lg:col-span-7 glass-panel-gold bg-brand-bg-secondary/40 p-6 rounded-2xl border border-brand-gold/15 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl"></div>

          <div className="flex items-start gap-4">
            <div className="p-4 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-2xl font-bold flex items-center justify-center w-16 h-16">
              AX
            </div>
            <div className="flex flex-col">
              <h3 className="font-display font-bold text-xl text-gray-100">
                {supportDetails.manager}
              </h3>
              <span className="text-xs text-brand-blue font-semibold uppercase tracking-wider">
                {supportDetails.role}
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {supportDetails.languages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5"
                  >
                    {lang === "Thai" && language === "th" ? "ภาษาไทย" :
                     lang === "Thai" && language === "zh" ? "泰语" :
                     lang === "English" && language === "th" ? "ภาษาอังกฤษ" :
                     lang === "English" && language === "zh" ? "英语" :
                     lang === "Chinese (Mandarin)" && language === "th" ? "ภาษาจีนกลาง" :
                     lang === "Chinese (Mandarin)" && language === "zh" ? "中文（普通话）" : lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3.5 border-t border-white/5 pt-5">
            {/* Phone contact */}
            <a
              href={`tel:${supportDetails.phone.replace(/[^+\d]/g, "")}`}
              className="flex items-center gap-3.5 p-3 rounded-lg bg-brand-bg-primary/50 hover:bg-brand-bg-secondary/50 border border-white/5 hover:border-brand-gold/30 transition-all duration-300 group"
            >
              <div className="p-2 rounded bg-brand-gold/10 text-brand-gold group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-xs">
                <span className="text-gray-500 font-semibold uppercase text-[9px] tracking-wider">
                  {t.supportCall}
                </span>
                <span className="font-bold text-gray-200 group-hover:text-brand-gold transition-colors">
                  {supportDetails.phone}
                </span>
              </div>
            </a>

            {/* WeChat contact */}
            <div className="flex items-center gap-3.5 p-3 rounded-lg bg-brand-bg-primary/50 border border-white/5">
              <div className="p-2 rounded bg-brand-blue/10 text-brand-blue">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-xs">
                <span className="text-gray-500 font-semibold uppercase text-[9px] tracking-wider">
                  {t.supportWechat}
                </span>
                <span className="font-bold text-gray-200">
                  {supportDetails.wechat}
                </span>
              </div>
            </div>

            {/* Email contact */}
            <a
              href={`mailto:${supportDetails.email}`}
              className="flex items-center gap-3.5 p-3 rounded-lg bg-brand-bg-primary/50 hover:bg-brand-bg-secondary/50 border border-white/5 hover:border-brand-blue/30 transition-all duration-300 group"
            >
              <div className="p-2 rounded bg-brand-blue/10 text-brand-blue group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-xs">
                <span className="text-gray-500 font-semibold uppercase text-[9px] tracking-wider">
                  {t.supportEmail}
                </span>
                <span className="font-bold text-gray-200 group-hover:text-brand-blue transition-colors">
                  {supportDetails.email}
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* FAQ / Emergency details (Right) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
            <h4 className="font-display font-bold text-base text-brand-gold flex items-center gap-2 border-b border-white/10 pb-3">
              <Headphones className="w-5 h-5 text-brand-gold" />
              {t.supportLiaison}
            </h4>

            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-gray-200">
                    {language === "th" ? "เปิดใช้งานระบบสื่อสารผ่านดาวเทียม" : language === "zh" ? "北斗卫星接收终端已激活" : "Satellite Link Active"}
                  </span>
                  <span className="text-gray-400 font-light leading-normal">
                    {language === "th"
                      ? "ในเส้นทางข้ามช่องเขาที่สูง สัญญาณมือถือหลักอาจดับ ทีมนำเที่ยวมีระบบวิทยุดาวเทียม Beidou ที่ใช้งานได้ตลอดเวลา"
                      : language === "zh"
                      ? "帕米尔高海拔段部分基站信号偏弱，车队配有全天候北斗应急通信，确保无盲区覆盖。"
                      : "In Pamir high passes, mobile network can drop. The crew carries active Beidou Satellite messengers."}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Globe className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-gray-200">
                    {language === "th" ? "บริการตรวจสอบข้อมูลผ่านทางหลวง VIP" : language === "zh" ? "边防检查VIP通道对接" : "VIP Local Logistics"}
                  </span>
                  <span className="text-gray-400 font-light leading-normal">
                    {language === "th"
                      ? "ไกด์ส่วนตัวจะอำนวยความสะดวกในการตรวจหนังสือเดินทางและใบอนุญาตเดินทางสำหรับทางหลวงปามีร์และจุดตรวจทุกแห่ง"
                      : language === "zh"
                      ? "沿线检查站与边防通道均有专属地接协调核验，全力保障快速通关通行。"
                      : "Your guide will assist with passport verification at all regional stops and highway checkpoints."}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Language Translator Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
            <h4 className="font-display font-bold text-base text-brand-gold flex items-center gap-2 border-b border-white/10 pb-3">
              <Languages className="w-5 h-5 text-brand-gold" />
              <span>{language === "th" ? "พจนานุกรมแปลภาษาด่วน (Xinjiang Translator)" : language === "zh" ? "极速语言翻译助手" : "Quick Language Translator"}</span>
            </h4>

            {/* Phrase search bar */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === "th" ? "ค้นหาวลีแปล... (ไทย, จีน, อุยกูร์)" : language === "zh" ? "搜中/维/泰文短语..." : "Search phrases... (TH, CN, UY)"}
                className="w-full bg-brand-bg-primary/50 border border-white/10 rounded-lg text-xs py-2 pl-9 pr-8 text-white focus:outline-none focus:border-brand-gold/40"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-500" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2 text-[10px] text-gray-400 hover:text-gray-200 cursor-pointer py-1"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category tabs */}
            <div className="flex justify-between bg-brand-bg-primary/65 p-1 rounded-lg border border-white/5 text-[9px] font-bold uppercase tracking-wider">
              {Object.keys(translatorData).map((cat) => {
                const isActive = activeCategory === cat;
                const label = 
                  cat === "survival" ? (language === "th" ? "ทั่วไป" : "Survival") :
                  cat === "food" ? (language === "th" ? "อาหาร" : "Food") :
                  cat === "directions" ? (language === "th" ? "นำทาง" : "Directions") :
                  (language === "th" ? "ช้อปปิ้ง" : "Shopping");
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat as any)}
                    className={`flex-1 py-1 rounded text-center transition-all duration-300 cursor-pointer ${
                      isActive ? "bg-brand-gold text-brand-bg-primary font-extrabold" : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Phrase items list */}
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {filteredPhrases.length > 0 ? (
                filteredPhrases.map((phrase, idx) => {
                  const phraseId = `${activeCategory}-${idx}`;
                  const isCopied = copiedTextId === phraseId;

                  return (
                    <div key={idx} className="p-3 rounded-lg bg-brand-bg-primary/50 border border-white/5 flex flex-col gap-1 text-[11px] relative group hover:border-brand-gold/20 transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-gray-400">{phrase.th}</span>
                        <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                          {/* Speak Pronunciation Button */}
                          <button
                            onClick={() => speakPhrase(phrase.zh)}
                            className="text-brand-gold hover:text-brand-gold-hover p-0.5 cursor-pointer"
                            title="Speak Chinese"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          {/* Copy Button */}
                          <button
                            onClick={() => copyPhrase(`${phrase.zh.split(" (")[0]} / ${phrase.uy}`, phraseId)}
                            className="text-brand-blue hover:text-brand-blue-hover p-0.5 cursor-pointer"
                            title="Copy phrase"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-0.5 mt-1 font-sans">
                        <span className="text-gray-200 font-bold">CN: {phrase.zh}</span>
                        <span className="text-brand-gold font-bold">UY: {phrase.uy}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-xs text-gray-500 italic py-4">
                  No phrases match your search.
                </p>
              )}
            </div>
            <span className="text-[8px] text-gray-500 italic text-center block mt-1">
              UY = Uyghur language transliterated in Latin. Speaker icon uses browser speech synthesis for Chinese.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
