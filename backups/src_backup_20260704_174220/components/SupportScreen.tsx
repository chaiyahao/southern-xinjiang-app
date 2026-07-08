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
          <p className="text-xs text-gray-500 font-medium">
            {t.supportDesc}
          </p>
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
              <h3 className="font-display font-bold text-xl text-gray-900">
                {supportDetails.manager}
              </h3>
              <span className="text-xs text-brand-blue font-bold uppercase tracking-wider">
                {supportDetails.role}
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {supportDetails.languages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] text-gray-600 bg-white/10 px-2 py-0.5 rounded border border-gray-300 font-medium"
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

          <div className="flex flex-col gap-3.5 border-t border-white/10 pt-5">
            {/* Phone contact */}
            <a
              href={`tel:${supportDetails.phone.replace(/[^+\d]/g, "")}`}
              className="flex items-center gap-3.5 p-3 rounded-lg bg-brand-bg-primary/50 hover:bg-brand-bg-secondary/50 border border-white/10 hover:border-brand-gold/30 transition-all duration-300 group"
            >
              <div className="p-2 rounded bg-brand-gold/10 text-brand-gold group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-xs">
                <span className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">
                  {t.supportCall}
                </span>
                <span className="font-bold text-gray-800 group-hover:text-brand-gold transition-colors">
                  {supportDetails.phone}
                </span>
              </div>
            </a>

            {/* WeChat contact */}
            <div className="flex items-center gap-3.5 p-3 rounded-lg bg-brand-bg-primary/50 border border-white/10">
              <div className="p-2 rounded bg-brand-blue/10 text-brand-blue">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-xs">
                <span className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">
                  {t.supportWechat}
                </span>
                <span className="font-bold text-gray-800">
                  {supportDetails.wechat}
                </span>
              </div>
            </div>

            {/* Email contact */}
            <a
              href={`mailto:${supportDetails.email}`}
              className="flex items-center gap-3.5 p-3 rounded-lg bg-brand-bg-primary/50 hover:bg-brand-bg-secondary/50 border border-white/10 hover:border-brand-blue/30 transition-all duration-300 group"
            >
              <div className="p-2 rounded bg-brand-blue/10 text-brand-blue group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-xs">
                <span className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">
                  {t.supportEmail}
                </span>
                <span className="font-bold text-gray-800 group-hover:text-brand-blue transition-colors">
                  {supportDetails.email}
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* FAQ / Emergency details (Right) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
            <h4 className="font-display font-bold text-base text-brand-gold flex items-center gap-2 border-b border-white/10 pb-3">
              <Headphones className="w-5 h-5 text-brand-gold" />
              {t.supportLiaison}
            </h4>

            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-gray-900">
                    {language === "th" ? "คำแนะนำการปรับตัวบนที่ราบสูง" : language === "zh" ? "高海拔适应指南" : "Altitude Acclimatization Tips"}
                  </span>
                  <span className="text-gray-700 font-medium leading-normal">
                    {language === "th"
                      ? "โปรดหลีกเลี่ยงการออกกำลังกายหักโหม คอยจิบน้ำอุ่นบ่อยๆ สวมหมวกกันลมเพื่อรักษาความอบอุ่นของศีรษะ และนำกระป๋องออกซิเจนพกพาติดตัวไว้"
                      : language === "zh"
                      ? "避免剧烈运动，勤喝温水，佩戴防风帽以保持头部温暖，并随身携带便携式氧气瓶。"
                      : "Avoid strenuous exercise, sip warm water frequently, wear a windproof beanie to keep your head warm, and carry portable oxygen canisters."}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Globe className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-gray-900">
                    {language === "th" ? "การจัดเก็บและดูแลรักษาหนังสือเดินทาง" : language === "zh" ? "护照与出入境文件管理" : "Passport & Document Safety"}
                  </span>
                  <span className="text-gray-700 font-medium leading-normal">
                    {language === "th"
                      ? "เก็บหนังสือเดินทางและเอกสารสำคัญในกระเป๋าติดตัวตลอดเวลา ถ่ายภาพเอกสารเก็บไว้ในโทรศัพท์ หรือสำรองเอกสารกระดาษแยกไว้เพื่อความปลอดภัย"
                      : language === "zh"
                      ? "请将护照及随身重要文件存放在随身包中。在手机内保留电子版照片，或准备纸质复印件以备不时之需。"
                      : "Keep your passport and vital travel documents in a secure body bag. Keep photos of your documents on your phone or carry printed copies separately."}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Thai Embassy & Emergency Contacts Card */}
          <div className="glass-panel-blue bg-brand-bg-secondary/40 p-6 rounded-2xl border border-brand-blue/15 flex flex-col gap-4 shadow-md">
            <h4 className="font-display font-bold text-base text-brand-blue flex items-center gap-2 border-b border-brand-blue/10 pb-3">
              <ShieldCheck className="w-5 h-5 text-brand-blue" />
              <span>{language === "th" ? "ช่วยเหลือคนไทยในจีน" : language === "zh" ? "泰籍公民紧急保障" : "Thai Emergency Services"}</span>
            </h4>
            <div className="space-y-3.5 text-xs">
              <p className="text-[10px] text-gray-500 font-light leading-relaxed">
                {language === "th" 
                  ? "มณฑลซินเจียงอยู่ภายใต้ความดูแลโดยตรงของสถานเอกอัครราชทูต ณ กรุงปักกิ่ง หากเกิดกรณีฉุกเฉินเร่งด่วน เช่น หนังสือเดินทางสูญหาย หรืออุบัติเหตุ สามารถติดต่อหน่วยงานด้านล่างได้ทันที"
                  : language === "zh"
                  ? "新疆维吾尔自治区属于泰国驻华大使馆（北京）直接管辖。如遇紧急情况（护照遗失、人身安全等），请立即联系以下官方机构。"
                  : "Xinjiang is under the direct jurisdiction of the Royal Thai Embassy in Beijing. For urgent emergencies (lost passport, accidents, distress), please contact the agencies below."}
              </p>
              
              {/* Embassy Hotline */}
              <a
                href="tel:+8615727312531"
                className="flex items-center gap-3 p-2.5 rounded-lg bg-brand-bg-primary/50 hover:bg-brand-bg-secondary/60 border border-brand-blue/15 hover:border-brand-blue transition-all duration-300 group"
              >
                <div className="p-2 rounded bg-brand-blue/10 text-brand-blue group-hover:scale-105 transition-transform flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">
                    {language === "th" ? "สายด่วนฉุกเฉินคนไทยในจีน (24 ชม.)" : language === "zh" ? "泰籍公民24小时紧急热线" : "24/7 Thai Citizens Emergency Hotline"}
                  </span>
                  <span className="font-bold text-gray-800 transition-colors">
                    +86 157-2731-2531
                  </span>
                </div>
              </a>

              {/* Embassy Consular Office */}
              <a
                href="tel:+861085318767"
                className="flex items-center gap-3 p-2.5 rounded-lg bg-brand-bg-primary/50 hover:bg-brand-bg-secondary/60 border border-white/10 hover:border-brand-blue transition-all duration-300 group"
              >
                <div className="p-2 rounded bg-brand-blue/5 text-brand-blue group-hover:scale-105 transition-transform flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">
                    {language === "th" ? "เบอร์ฝ่ายกงสุลปักกิ่ง (ภาษาไทย)" : language === "zh" ? "使馆领事办公室（泰语）" : "Consular Office Beijing (Thai Line)"}
                  </span>
                  <span className="font-bold text-gray-800 transition-colors">
                    +86 (10) 8531-8767
                  </span>
                </div>
              </a>

              {/* General Embassy */}
              <a
                href="tel:+861085318700"
                className="flex items-center gap-3 p-2.5 rounded-lg bg-brand-bg-primary/50 hover:bg-brand-bg-secondary/60 border border-white/10 hover:border-brand-blue transition-all duration-300 group"
              >
                <div className="p-2 rounded bg-brand-blue/5 text-brand-blue group-hover:scale-105 transition-transform flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">
                    {language === "th" ? "เบอร์หลักสถานทูตไทย ณ กรุงปักกิ่ง" : language === "zh" ? "泰国驻华大使馆总机" : "Royal Thai Embassy Main Tel"}
                  </span>
                  <span className="font-bold text-gray-800 transition-colors">
                    +86 (10) 8531-8700
                  </span>
                </div>
              </a>

              {/* Bangkok MFA Hotline */}
              <a
                href="tel:+6625728442"
                className="flex items-center gap-3 p-2.5 rounded-lg bg-brand-bg-primary/50 hover:bg-brand-bg-secondary/60 border border-white/10 hover:border-brand-blue transition-all duration-300 group"
              >
                <div className="p-2 rounded bg-brand-blue/5 text-brand-blue group-hover:scale-105 transition-transform flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">
                    {language === "th" ? "Call Center กรมการกงสุลไทย (24 ชม.)" : language === "zh" ? "泰国领事事务部呼叫中心" : "Consular Affairs Call Center BKK (24h)"}
                  </span>
                  <span className="font-bold text-gray-800 transition-colors">
                    +66 (0) 2-572-8442
                  </span>
                </div>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
