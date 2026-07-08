"use client";

import React, { useState, useEffect } from "react";
import { useTravelStore } from "../store/useTravelStore";
import { formatDisplayName, PARTICIPANTS } from "../utils/travelers";
import { ITINERARY_DATA } from "../data/travelData";
import { TRANSLATIONS_DATA } from "../data/translations";
import {
  CalendarDays,
  Compass,
  MapPin,
  Mountain,
  Coins,
  ArrowRight,
  Map,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Droplets,
  CheckSquare,
  Square,
  Trash2,
  Sparkles,
  Navigation,
  Target,
  ArrowLeftRight,
  Camera,
  Headphones,
  Languages,
  Receipt,
  Sun,
  Snowflake,
  Pencil,
  User,
  X
} from "lucide-react";

export default function OverviewScreen() {
  const { activeDay, setActiveDay, setActiveTab, language, visitorName, setVisitorName } = useTravelStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(visitorName || "");
  const [showNameSelectorPopup, setShowNameSelectorPopup] = useState(false);

  useEffect(() => {
    if (!visitorName) {
      setShowNameSelectorPopup(true);
    } else {
      setShowNameSelectorPopup(false);
    }
  }, [visitorName]);

  useEffect(() => {
    setNameInput(visitorName || "");
  }, [visitorName]);

  const t = TRANSLATIONS_DATA[language].ui;
  const tItinerary = TRANSLATIONS_DATA[language].itinerary;

  const rawDayData = ITINERARY_DATA[activeDay - 1];
  const localizedDay = tItinerary[activeDay];
  
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

  // Calculate total trip distance and max altitude
  const totalDistance = ITINERARY_DATA.reduce((acc, curr) => acc + curr.distanceKm, 0);
  const maxAltitude = Math.max(...ITINERARY_DATA.map((d) => d.maxElevationM));

  const getClothingAdvisory = (dayNum: number, lang: "en" | "th" | "zh") => {
    const advisories: Record<number, Record<"en" | "th" | "zh", string>> = {
      1: {
        en: "Comfortable travel wear. Bring a light windbreaker or jacket for cooling evening temperatures in Kashgar.",
        th: "ชุดเดินทางใส่สบาย เตรียมเสื้อคลุมกันลมน้ำหนักเบาสำหรับเดินเที่ยวชมเมืองโบราณคัชการ์ในตอนเย็นที่อากาศเริ่มเย็นลง",
        zh: "舒适便服。喀什晚间气温较低，建议携带轻便风衣或外套。"
      },
      2: {
        en: "Cold Plateau Wear: Thermal base layer (Heattech), thick down jacket, windproof pants, warm beanie, and insulated gloves. Pamir winds are very strong.",
        th: "ชุดลุยหนาวบนที่ราบสูง: ลองจอห์น (Thermal) + เสื้อโค้ทขนเป็ดหนากันลม + กางเกงกันลม + หมวกไหมพรม + ถุงมือกันหนาว ลมปามีร์พัดแรงและอุณหภูมิใกล้จุดเยือกแข็ง",
        zh: "高原保暖装备：防风保暖内衣（秋衣裤）、重度羽绒服、防风裤、针织帽及保暖手套。帕米尔高原风大且寒冷。"
      },
      3: {
        en: "Heavy Winter Gear: Sub-zero mountain winds. Thermal base layers, fleece mid-layer, heavy windproof down jacket, scarf, beanie, and gloves.",
        th: "ชุดกันหนาวระดับสูงสุด: เตรียมพร้อมปะทะลมหนาวติดลบ ลองจอห์น + เสื้อฟรีซ + เสื้อขนเป็ดหนาพิเศษ + ผ้าพันคอ + หมวกคลุมหู และถุงมือแบบหนา",
        zh: "重度御寒装备：高山大风且伴有零下低温。建议保暖秋衣裤、抓绒衣、重羽绒服、围巾、保暖帽及厚手套。"
      },
      4: {
        en: "Plateau to City Layers: Heavy thermals for the glacier walk, transitioning to standard layers/light jacket upon returning to Kashgar city.",
        th: "ชุดแบบเลเยอร์ปรับได้: เสื้อหนาวหนาพิเศษสำหรับเดินธารน้ำแข็งมุซทัคอาตา และสามารถถอดออกเหลือเสื้อแจ็คเก็ตทั่วไปเมื่อเดินทางกลับถึงคัชการ์",
        zh: "分层穿搭：冰川漫步需要重度羽绒服，返回喀什市区后可换为常规外套或夹克。"
      },
      5: {
        en: "Cool Autumn Wear: Light sweater or fleece jacket. Comfortable walking shoes/boots for the Poplar forest stroll.",
        th: "ชุดรับลมใบไม้ร่วง: เสื้อคอเต่าหรือเสื้อแจ็คเก็ตฟรีซน้ำหนักเบา กางเกงขายาว และรองเท้าผ้าใบที่เดินสบายสำหรับชมป่าสนสีทอง",
        zh: "秋季保暖便服：轻薄毛衣或抓绒夹克。建议穿舒适的徒步鞋或运动鞋游览金胡杨林。"
      },
      6: {
        en: "Smart Casual / Light Layers: Comfortable pants and a light jacket. Perfect for walking around the Yotkan city lights show.",
        th: "ชุดลำลองเก๋ๆ: เสื้อแขนยาวคู่กับเสื้อคลุมบาง กางเกงขายาว ใส่เดินถ่ายภาพแสงสียามค่ำคืนในเมืองโบราณโยตกันได้อย่างสวยงาม",
        zh: "休闲穿搭：长袖配轻便外套，适合夜间游览约特干故城灯光秀。"
      },
      7: {
        en: "Desert Protection: High UV! Windbreaker, long sleeve shirt, sunglasses, sun hat, and a face scarf to protect from flying dust.",
        th: "ชุดลุยทะเลทราย: ป้องกัน UV สูง! เสื้อแขนยาวระบายอากาศดี หมวกกันแดด แว่นกันแดด และผ้าบัฟพันคอกันฝุ่นและทรายปลิวข้ามถนน",
        zh: "防风防沙装备：紫外线极强！建议轻便防风衣、遮阳帽、偏光镜，以及防尘口罩或面罩。"
      },
      8: {
        en: "Hiking Active Wear: Durable hiking pants, breathable layers, windproof shell, and sturdy hiking shoes for the Tomur Canyon canyon trek.",
        th: "ชุดเดินป่าคล่องตัว: กางเกงลุยเดินป่า เสื้อระบายอากาศ เสื้อกันลมกันฝุ่น และรองเท้าเดินป่า/บูทที่ยึดเกาะดีสำหรับปีนแกรนด์แคนยอนทอมูร์",
        zh: "户外运动装：耐磨防风裤、透气排汗层、防风外壳和专业登山鞋，适合温宿大峡谷徒步。"
      },
      9: {
        en: "Casual Autumn Layers: Lightweight sweater or cardigan, denim or chinos, and comfortable sneakers for exploring Aksu bazaar.",
        th: "ชุดลำลองสบายๆ: เสื้อสเวตเตอร์บางหรือแจ็คเก็ตยีนส์ กางเกงขายาว รองเท้าผ้าใบใส่สบายสำหรับเดินตลาดบาร์ซาร์โบราณในเมืองอักซู",
        zh: "休闲便装：轻便针织衫或秋款夹克，搭配休闲裤，便于逛阿克苏老街巴扎。"
      },
      10: {
        en: "Transit Wear: Comfortable clothing layers for the flights back to Chongqing and Bangkok. Keep a light jacket handy for cabin temperatures.",
        th: "ชุดเดินทางเดินทางกลับ: เสื้อยืดกางเกงสแล็กใส่สบาย และเสื้อหนาวบางสำหรับคลุมกันหนาวบนเครื่องบินขณะเดินทางกลับกรุงเทพฯ",
        zh: "乘机便服：舒适长袖长裤，建议随身带件外套防机舱冷气，方便转机重庆及返回曼谷。"
      }
    };
    return advisories[dayNum]?.[lang] || advisories[dayNum]?.en || "";
  };

  const stats = [
    {
      label: t.itinerary,
      value: t.days,
      sub: "29 Oct - 7 Nov 2026",
      icon: CalendarDays,
      color: "text-brand-gold bg-brand-gold/10 border-brand-gold/20",
    },
    {
      label: t.totalDistance,
      value: `${totalDistance} km`,
      sub: "Oasis & Highway",
      icon: Compass,
      color: "text-brand-blue bg-brand-blue/10 border-brand-blue/20",
    },
    {
      label: t.maxElevation,
      value: `${maxAltitude} m`,
      sub: "Pamir Plateau Pass",
      icon: Mountain,
      color: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    },
    {
      label: t.luxuryCost,
      value: "35,225 THB",
      sub: "All-inclusive per person",
      icon: Coins,
      color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 animate-fadeIn max-w-7xl mx-auto w-full">
      {/* ===== Greeting Bar (Arthur concierge style) ===== */}
      {!isEditingName ? (
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl lg:text-3xl font-display font-extrabold text-navy tracking-tight">
                {visitorName 
                  ? (language === "th" ? `หนีห่าว ! คุณ ${formatDisplayName(visitorName, "nickname")}` : language === "zh" ? `您好！${formatDisplayName(visitorName, "nickname")}` : `Ni Hao, ${formatDisplayName(visitorName, "nickname")}!`)
                  : (language === "th" ? "หนีห่าว ! เหล่านักเดินทาง" : language === "zh" ? "您好！各位旅人" : "Ni Hao, Explorers!")
                }
              </h1>
              <button
                onClick={() => setShowNameSelectorPopup(true)}
                className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-gray-500 cursor-pointer transition-all"
                title={language === "th" ? "เลือกชื่อของคุณ" : "Select your name"}
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs lg:text-sm text-gray-500 font-medium">
              {language === "th"
                ? `เข้าสู่วันที่ ${currentDayData.day} ของการผจญภัยครั้งสำคัญบนเส้นทางสายไหม`
                : language === "zh"
                ? `进入丝路之旅第 ${currentDayData.day} 天`
                : `Day ${currentDayData.day} of your legendary Silk Road expedition`}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl max-w-md animate-fadeIn text-gray-800">
          <label className="text-[10px] text-gray-550 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-brand-gold" />
            <span>{language === "th" ? "ตั้งค่าชื่อเล่นของคุณ" : "Set your nickname"}</span>
          </label>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder={language === "th" ? "เช่น ชัยยะ, ณัฐรินทร์..." : "e.g., Chaiya, Nanutda..."}
              className="flex-1 bg-white border border-slate-300 rounded-xl text-xs px-3 py-2 text-gray-900 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 shadow-inner"
              maxLength={18}
            />
            <button
              onClick={() => {
                setVisitorName(nameInput.trim());
                setIsEditingName(false);
              }}
              className="px-3 py-2 bg-brand-gold hover:bg-brand-gold-hover text-brand-bg-primary text-xs font-bold rounded-xl shadow-sm cursor-pointer transition-all"
            >
              {language === "th" ? "บันทึก" : "Save"}
            </button>
            <button
              onClick={() => {
                setNameInput(visitorName || "");
                setIsEditingName(false);
              }}
              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-gray-600 text-xs font-bold rounded-xl cursor-pointer transition-all"
            >
              {language === "th" ? "ยกเลิก" : "Cancel"}
            </button>
          </div>
          {/* Quick select from travelers list */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider self-center mr-1">
              {language === "th" ? "เลือกคน:" : "Quick select:"}
            </span>
            {["CHAIYA", "NAKARED", "NAPAS", "NANUTDA", "TIPUBON", "NATTARIKA"].map((name) => (
              <button
                key={name}
                onClick={() => {
                  const formatted = name.charAt(0) + name.slice(1).toLowerCase();
                  setNameInput(formatted);
                }}
                className="text-[9px] font-bold px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-gray-600 cursor-pointer shadow-sm"
              >
                {name.charAt(0) + name.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== Hero Banner (redesigned, blue-accent) ===== */}
      <div
        className="relative rounded-3xl overflow-hidden min-h-[300px] flex flex-col justify-end p-6 lg:p-10 border border-brand-blue/30 shadow-xl bg-cover bg-center"
        style={{ backgroundImage: `url('/images/karakoram_highway.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a101f] via-[#0a101f]/60 to-black/30 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a101f]/80 to-transparent z-10"></div>

        <div className="relative z-20 max-w-3xl flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-brand-gold"></span>
            <span className="text-xs font-bold text-gold-accent tracking-widest uppercase">
              {language === "th" ? "ทริปหรูสุดคุ้ม • เส้นทางสายไหม" : language === "zh" ? "超值奢华 · 丝路之旅" : "Best-Value Luxury · Silk Road"}
            </span>
          </div>

          <h2 className="text-2xl lg:text-4xl font-display font-extrabold text-white tracking-tight">
            {language === "th" ? "ซินเจียงใต้ (ประเทศจีน)" : language === "zh" ? "探秘中国南疆" : "Southern Xinjiang Loop"}
          </h2>

          <p className="text-xs lg:text-sm text-slate-100 font-medium leading-relaxed max-w-2xl mt-1 select-all">
            {language === "th"
              ? "ร่วมเดินทางไปตามเส้นทางสายไหมในตำนาน สัมผัสความยิ่งใหญ่ของธารน้ำแข็งมุซทัคอาตา ข้ามทะเลทรายทากลามากาน และค้นพบวัฒนธรรมพันปีในเมืองโบราณคัชการ์"
              : language === "zh"
              ? "沿着传奇的喀喇昆仑公路飞驰，探索雄伟的慕士塔格峰冰川，穿越塔克拉玛干沙漠，探寻喀什古城的千年文化。"
              : "Traverse the legendary Karakoram Highway, witness the frozen giants of Muztagh Ata, cross the vast Taklamakan Desert dunes, and discover centuries of rich culture inside historic Kashgar Old Town."}
          </p>
        </div>
      </div>

      {/* ===== Live Trip Progress Hero Card (NEW) ===== */}
      <div className="glass-panel-blue rounded-2xl p-5 lg:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-blue" />
            <span className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">
              {language === "th" ? "พิกัดปัจจุบัน" : language === "zh" ? "当前位置" : "Current Location"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-brand-blue/10 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"></span>
            <span className="text-[9px] font-extrabold text-brand-blue tracking-wider">LIVE TRACKING</span>
          </div>
        </div>
        <div>
          <h3 className="text-xl lg:text-2xl font-display font-extrabold text-navy leading-tight">
            {language === "th" ? `มุ่งหน้าสู่ ${currentDayData.endLocation}` : language === "zh" ? `前往 ${currentDayData.endLocation}` : `En route to ${currentDayData.endLocation}`}
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {currentDayData.subtitle}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-brand-blue" />
            <span className="text-xs font-bold text-brand-blue">
              {language === "th"
                ? `เส้นทางวันที่ ${currentDayData.day} • ${currentDayData.distanceKm > 0 ? currentDayData.distanceKm + " กม." : "พักผ่อน"}`
                : `Day ${currentDayData.day} route • ${currentDayData.distanceKm > 0 ? currentDayData.distanceKm + " km" : "rest"}`}
            </span>
          </div>
          <span className="text-[10px] font-bold text-gray-400 tracking-wider">
            {language === "th" ? `ความคืบหน้า ${Math.round((currentDayData.day / 10) * 100)}%` : `PROGRESS ${Math.round((currentDayData.day / 10) * 100)}%`}
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-progress-gradient rounded-full transition-all duration-700"
            style={{ width: `${(currentDayData.day / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* ===== Concierge Insight + Weather + Currency Row ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Concierge Insight */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-brand-blue" />
              </div>
              <span className="text-[10px] font-extrabold text-brand-blue tracking-widest uppercase">
                {language === "th" ? "คำแนะนำจากไกด์" : language === "zh" ? "向导贴士" : "CONCIERGE INSIGHT"}
              </span>
            </div>
          </div>
          <h4 className="text-base font-bold text-navy">
            {language === "th" ? getClothingAdvisory(currentDayData.day, "th").split(":", 1)[0] || "เตรียมตัวให้พร้อม" : language === "zh" ? "出行准备" : "Be Prepared"}
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed font-medium line-clamp-3">
            {getClothingAdvisory(currentDayData.day, language)}
          </p>
        </div>

        {/* Weather */}
        <div className="lg:col-span-3 glass-panel rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                {language === "th" ? "อากาศ" : language === "zh" ? "天气" : "Weather"}
              </span>
              <span className="text-2xl font-extrabold text-navy font-display">{currentDayData.weather.tempRange.split(" to ")[0]}</span>
              <p className="text-[11px] text-gray-500 font-medium leading-tight">{currentDayData.weather.forecast}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-brand-gold/15 flex items-center justify-center flex-shrink-0">
              {currentDayData.weather.icon === "Sun" ? <Sun className="w-5 h-5 text-brand-gold" /> : <Snowflake className="w-5 h-5 text-brand-blue" />}
            </div>
          </div>
        </div>

        {/* Currency Converter mini */}
        <div className="lg:col-span-3 glass-panel rounded-2xl p-5 flex flex-col gap-2 border-brand-gold/20">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            {language === "th" ? "แลกเงิน" : language === "zh" ? "汇率" : "FX Rate"}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-extrabold text-navy">¥1</span>
            <ArrowLeftRight className="w-3.5 h-3.5 text-brand-blue/60" />
            <span className="text-sm font-extrabold text-brand-blue">฿5</span>
          </div>
          <button
            onClick={() => setActiveTab("budget")}
            className="text-[10px] font-bold text-brand-gold hover:underline mt-auto flex items-center gap-1 cursor-pointer"
          >
            {language === "th" ? "คำนวณงบ" : "Calc Budget"} <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ===== Next-Up Hero Card (today's highlight image) ===== */}
      {currentDayData.images && currentDayData.images.length > 0 && (
        <div className="glass-panel rounded-3xl overflow-hidden flex flex-col md:flex-row border border-gray-900/5">
          <div className="relative md:w-2/5 min-h-[180px]">
            <img
              src={currentDayData.images[0].url}
              alt={currentDayData.images[0].label}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3 bg-brand-gold text-navy text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider">
              {language === "th" ? "จุดหมายถัดไป" : language === "zh" ? "下一站" : "Next Up"}
            </div>
          </div>
          <div className="md:w-3/5 p-5 lg:p-6 flex flex-col justify-center gap-2">
            <h3 className="text-lg lg:text-xl font-bold text-navy leading-snug">
              {currentDayData.images[0].label}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              {currentDayData.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-600 bg-brand-bg-secondary border border-gray-200 px-2.5 py-1 rounded-lg">
                <Camera className="w-3 h-3 text-brand-blue" />
                {language === "th" ? "จุดถ่ายภาพ" : "Photo Spot"}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-600 bg-brand-bg-secondary border border-gray-200 px-2.5 py-1 rounded-lg">
                <Mountain className="w-3 h-3 text-brand-blue" />
                {currentDayData.maxElevationM}m
              </span>
            </div>
            <button
              onClick={() => setActiveTab("itinerary")}
              className="self-start mt-2 inline-flex items-center gap-1.5 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              {language === "th" ? "ดูแผนวันนี้" : language === "zh" ? "查看今日行程" : "View Today's Plan"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ===== Quick Access Grid ===== */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-brand-blue tracking-widest uppercase">
            {language === "th" ? "บริการ & ความช่วยเหลือ" : language === "zh" ? "服务与协助" : "SERVICES & ASSISTANCE"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Map, label: language === "th" ? "แผนที่" : language === "zh" ? "地图" : "Map", tab: "map" as const },
            { icon: Languages, label: language === "th" ? "คำศัพท์" : language === "zh" ? "常用语" : "Phrases", tab: "phrasebook" as const },
            { icon: Receipt, label: language === "th" ? "งบประมาณ" : language === "zh" ? "预算" : "Budget", tab: "budget" as const },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(item.tab)}
                className="flex flex-col items-center gap-2 p-3 glass-panel rounded-2xl border border-gray-900/5 hover:border-brand-blue/30 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5 text-brand-blue" />
                </div>
                <span className="text-[11px] font-bold text-gray-600 text-center">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Widgets Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="glass-panel p-5 rounded-2xl border border-gray-900/5 hover:border-brand-gold/15 bg-white/60 flex flex-col gap-1 transition-all duration-350"
            >
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-lg border flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <span className="text-lg lg:text-2xl font-display font-extrabold text-gray-900 select-all leading-tight mt-1">
                {stat.value}
              </span>
              <span className="text-[10px] text-gray-500 font-bold leading-normal truncate">
                {stat.sub}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Right Side / Active Day Snapshot Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-gray-900/5 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-900/10 pb-3">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  Day {currentDayData.day} Snapshot Route
                </span>
                <h3 className="text-xl font-extrabold text-gray-900 mt-1 leading-snug">
                  {currentDayData.title}
                </h3>
                <span className="text-[10px] text-brand-blue font-bold uppercase tracking-wide mt-1">
                  {currentDayData.startLocation} → {currentDayData.endLocation}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 bg-brand-bg-primary/95 border border-white/10 rounded-xl p-1 font-display">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
                  <button
                    key={d}
                    onClick={() => setActiveDay(d)}
                    className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                      activeDay === d
                        ? "bg-brand-gold text-brand-bg-primary shadow scale-105"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed font-semibold">
              {currentDayData.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-900/5 pt-4">
              <div>
                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-wider block mb-2">
                  Today's Highlights & Activities
                </span>
                <ul className="flex flex-col gap-1.5 pl-0 text-xs text-gray-800 font-bold list-none">
                  {currentDayData.activities.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-brand-gold mt-0.5 font-bold">✦</span>
                      <span className="leading-snug select-all">{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {currentDayData.images && currentDayData.images.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] text-gray-600 font-bold uppercase tracking-wider block">
                    Visual Highlights
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {currentDayData.images.map((img, idx) => (
                      <div 
                        key={idx} 
                        className="relative rounded-xl overflow-hidden aspect-[4/3] border border-gray-900/5 group shadow-sm bg-slate-100"
                      >
                        <img 
                          src={img.url} 
                          alt={img.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent p-2 flex flex-col justify-end">
                          <span className="text-[8px] text-brand-gold font-bold uppercase tracking-widest leading-none truncate">
                            {language === "th" ? img.labelTh : language === "zh" ? img.labelZh : img.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Left Side / Advisories & Dynamic Checklist Checkboxes */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Quick Route Status Widget */}
          <div className="glass-panel p-5 rounded-xl border border-gray-900/5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-900/10 pb-2">
              <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                {language === "th" ? "ข้อมูลการเดินทาง" : language === "zh" ? "行程路线数据" : "Segment Telemetry"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-gray-700 font-bold uppercase tracking-wider text-[9px]">
                  Elevation Range
                </span>
                <span className="font-extrabold text-gray-900">
                  {currentDayData.maxElevationM} meters
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-gray-700 font-bold uppercase tracking-wider text-[9px]">
                  {language === "th" ? "ข้อมูลการเดินทาง" : language === "zh" ? "行程信息" : "Travel Info"}
                </span>
                <span className="font-extrabold text-gray-900">
                  {currentDayData.distanceKm > 0
                    ? `${currentDayData.distanceKm} km / ${currentDayData.driveTime}`
                    : currentDayData.day === 1
                      ? (language === "th"
                          ? "สนามบิน → ที่พัก (~12 กม. / 25 นาที)"
                          : language === "zh"
                            ? "机场 → 酒店（约12公里/25分钟）"
                            : "Airport → Hotel (~12 km / 25 min)")
                      : (language === "th"
                          ? "วันพักผ่อน ไม่มีการขับขี่"
                          : language === "zh"
                            ? "休整日 无长途驾驶"
                            : "Rest day — no long-distance driving")}
                </span>
              </div>
            </div>

            {/* Smart Clothing & Weather Advisory Box */}
            <div className="flex flex-col gap-1 bg-brand-gold/10 border border-brand-gold/30 p-3 rounded-lg text-[11px] leading-relaxed shadow-sm">
              <span className="font-extrabold text-brand-gold uppercase tracking-wider text-[9px] flex items-center gap-1">
                👕 {language === "th" ? "คำแนะนำการแต่งกาย" : language === "zh" ? "穿衣建议" : "Clothing Advisory"}
              </span>
              <p className="text-gray-800 font-semibold leading-relaxed">
                {getClothingAdvisory(currentDayData.day, language)}
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setActiveTab("itinerary")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-brand-gold hover:bg-brand-gold-hover text-brand-bg-primary text-xs font-bold tracking-wider transition-all duration-300 shadow-[0_4px_14px_rgba(150,114,35,0.3)] hover:scale-[1.02] cursor-pointer"
              >
                {t.viewItineraryBtn}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveTab("map")}
                className="p-2.5 rounded bg-brand-bg-secondary hover:bg-brand-bg-secondary/80 border border-brand-blue/30 text-brand-blue transition-all duration-300 cursor-pointer"
                title="View Route Map"
              >
                <Map className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dynamic Safety Advisor Card */}
          {(() => {
            const elevation = currentDayData.maxElevationM;
            const isHighAltitude = elevation >= 3000;
            const tempStr = currentDayData.weather.tempRange;
            const isFreezing = tempStr.includes("-") || tempStr.split(" to ").some(tVal => parseInt(tVal) < 5);
            const isDesert = currentDayData.title.toLowerCase().includes("desert") || currentDayData.subtitle.toLowerCase().includes("desert");

            if (!isHighAltitude && !isFreezing && !isDesert) return null;

            return (
              <div className="glass-panel p-5 rounded-xl border border-red-500/10 flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl"></div>
                <div className="flex items-center gap-2 border-b border-gray-900/10 pb-2">
                  <AlertTriangle className="w-4 h-4 text-brand-gold" />
                  <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                    {language === "th" ? "คำแนะนำการเดินทาง" : language === "zh" ? "出行风险评估" : "Safety Advisor"}
                  </span>
                </div>
                
                <div className="flex flex-col gap-2.5 text-[11px] leading-relaxed">
                  {isHighAltitude && (
                    <div className="flex gap-2 text-gray-800 font-semibold">
                      <Mountain className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-950 font-extrabold block">
                          {language === "th" ? "พื้นที่สูงเกิน 3,000 เมตร (เสี่ยง AMS)" : language === "zh" ? "海拔超过3000米（低氧风险）" : "High Altitude Warning (AMS Risk)"}
                        </strong>
                        <span>
                          {language === "th"
                            ? `วันนี้เดินทางข้ามระดับความสูงสูงสุด ${elevation} ม. ควรหลีกเลี่ยงการเคลื่อนไหวเร็ว เตรียมออกซิเจนกระป๋อง และดื่มน้ำอุ่นบ่อยๆ`
                            : language === "zh"
                            ? `今日最高海拔达 ${elevation} 米。建议放慢动作，备好便携氧气，多喝热水，预防高原反应。`
                            : `Peak elevation is ${elevation}m. Move slowly, keep oxygen bottles ready, stay hydrated, and rest frequently.`}
                        </span>
                      </div>
                    </div>
                  )}

                  {isFreezing && (
                    <div className="flex gap-2 text-gray-800 font-semibold">
                      <Flame className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-950 font-extrabold block">
                          {language === "th" ? "สภาพอากาศหนาวจัด / ลมแรงภูเขา" : language === "zh" ? "极寒气候/高山强风" : "Freezing Temperatures / Mountain Gale"}
                        </strong>
                        <span>
                          {language === "th"
                            ? "อุณหภูมิยอดเขาลดต่ำใกล้หรือต่ำกว่าจุดเยือกแข็ง จำเป็นต้องสวมเสื้อโค้ทกันลมหนาพิเศษ (Down Jacket) ถุงมือ และหมวกกันลม"
                            : language === "zh"
                            ? "气温降至冰点附近。请务必穿着重度防风羽绒服、保暖手套及防寒帽。"
                            : "Temps are near freezing. Wear a heavy windbreaker down jacket, thermal gloves, and a beanie."}
                        </span>
                      </div>
                    </div>
                  )}

                  {isFreezing && isDesert && <div className="border-t border-gray-950/10 my-1"></div>}

                  {isDesert && (
                    <div className="flex gap-2 text-gray-800 font-semibold">
                      <Droplets className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-950 font-extrabold block">
                          {language === "th" ? "พื้นที่แห้งแล้งทะเลทราย / รังสี UV สูง" : language === "zh" ? "沙漠干燥气候/极强紫外线" : "Arid Desert / High UV Exposure"}
                        </strong>
                        <span>
                          {language === "th"
                            ? "อากาศแห้งจัดและแสงแดดแรงมากตลอดวัน ควรทาครีมกันแดด พกแว่นกันแดด ดื่มน้ำสม่ำเสมอ และเตรียมผ้าพันคอกันฝุ่นทราย"
                            : language === "zh"
                            ? "沙漠气候空气极其干燥，紫外线强。请注意防晒，佩戴墨镜，多补充水分，并备好防沙面罩。"
                            : "Air is extremely dry with high solar index. Apply sunscreen, wear sunglasses, drink water, and bring a dust scarf."}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Smart China Travel Packing Checklist Card */}
          {(() => {
            const defaultItems = [
              { key: "passport", th: "หนังสือเดินทาง (อายุเหลือ > 6 เดือน)", en: "Passport (valid > 6 months)", zh: "护照 (有效期 > 6个月)" },
              { key: "visaExempt", th: "พาสปอร์ตไทยยกเว้นวีซ่าจีนท่องเที่ยว 30 วัน", en: "Thai visa-free tourist exemption entry check", zh: "中泰互免签证30天游客核验" },
              { key: "vpnEsim", th: "ติดตั้ง VPN / เปิดบริการ Roaming / eSIM", en: "Install VPN & configure eSIM/Roaming", zh: "安装网络接驳VPN及中国漫游/eSIM" },
              { key: "diamox", th: "เตรียมยา Diamox (ป้องกันแพ้ความสูง)", en: "Diamox medication (AMS prevention)", zh: "准备乙酰唑胺/高反药品" },
              { key: "thermalJacket", th: "เสื้อโค้ทหนา/ลองจอนรองรับลมที่ราบสูง", en: "Heavy down coat / plateau thermal layers", zh: "高原御寒重度羽绒服/保暖内衣" },
              { key: "offlineMaps", th: "ดาวน์โหลดแผนที่ออฟไลน์ (Amap/Mapbox)", en: "Download offline navigation maps", zh: "下载离线高德地图/Mapbox" },
              { key: "powerBank", th: "พาวเวอร์แบงก์ความจุไม่เกิน 20,000 mAh", en: "Power bank under 20,000 mAh limit", zh: "随身充电宝限制在 20,000 mAh 以下" },
            ];

            const [checklist, setChecklist] = useState<Record<string, boolean>>({});
            const [checklistItems, setChecklistItems] = useState<Array<{ key: string; th: string; en: string; zh: string; isCustom?: boolean }>>([]);
            const [newItemText, setNewItemText] = useState("");

            useEffect(() => {
              // Load checkbox statuses
              const savedCheck = localStorage.getItem("xinjiang_packing_checklist");
              if (savedCheck) {
                try {
                  setChecklist(JSON.parse(savedCheck));
                } catch (e) {
                  console.error(e);
                }
              }

              // Load items list
              const savedItems = localStorage.getItem("xinjiang_packing_checklist_items");
              if (savedItems) {
                try {
                  setChecklistItems(JSON.parse(savedItems));
                } catch (e) {
                  console.error(e);
                  setChecklistItems(defaultItems);
                }
              } else {
                setChecklistItems(defaultItems);
                localStorage.setItem("xinjiang_packing_checklist_items", JSON.stringify(defaultItems));
              }
            }, []);

            const toggleChecklistItem = (key: string) => {
              const updated = { ...checklist, [key]: !checklist[key] };
              setChecklist(updated);
              localStorage.setItem("xinjiang_packing_checklist", JSON.stringify(updated));
            };

            const handleAddItem = (e: React.FormEvent) => {
              e.preventDefault();
              if (!newItemText.trim()) return;

              const newItem = {
                key: "custom_" + Date.now(),
                th: newItemText.trim(),
                en: newItemText.trim(),
                zh: newItemText.trim(),
                isCustom: true
              };

              const updatedItems = [...checklistItems, newItem];
              setChecklistItems(updatedItems);
              localStorage.setItem("xinjiang_packing_checklist_items", JSON.stringify(updatedItems));
              setNewItemText("");
            };

            const handleDeleteItem = (key: string, e: React.MouseEvent) => {
              e.stopPropagation();
              const updatedItems = checklistItems.filter(item => item.key !== key);
              setChecklistItems(updatedItems);
              localStorage.setItem("xinjiang_packing_checklist_items", JSON.stringify(updatedItems));

              const updatedChecklist = { ...checklist };
              delete updatedChecklist[key];
              setChecklist(updatedChecklist);
              localStorage.setItem("xinjiang_packing_checklist", JSON.stringify(updatedChecklist));
            };

            return (
              <div className="glass-panel p-5 rounded-xl border border-gray-900/5 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-gray-900/10 pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-brand-blue" />
                    <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                      {language === "th" ? "เช็กลิสต์ก่อนบิน" : language === "zh" ? "行前清单" : "Pre-Flight Checklist"}
                    </h4>
                  </div>
                  <span className="text-[10px] text-gray-600 font-bold bg-brand-gold/10 px-2 py-0.5 rounded">
                    {checklistItems.filter(item => checklist[item.key]).length} / {checklistItems.length}
                  </span>
                </div>

                {/* Items List */}
                <div className="flex flex-col gap-2">
                  {checklistItems.map((item) => {
                    const isChecked = checklist[item.key] || false;
                    return (
                      <div
                        key={item.key}
                        className="flex items-center justify-between text-left py-1 text-gray-800 text-[11px] font-semibold transition-all group"
                      >
                        <button
                          onClick={() => toggleChecklistItem(item.key)}
                          className="flex items-center gap-3 text-left hover:text-gray-950 cursor-pointer flex-1"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-brand-gold flex-shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-700 hover:text-brand-blue flex-shrink-0" />
                          )}
                          <span className={`${isChecked ? "line-through text-gray-600 font-normal" : ""}`}>
                            {language === "th" ? item.th : language === "zh" ? item.zh : item.en}
                          </span>
                        </button>

                        {item.isCustom && (
                          <button
                            onClick={(e) => handleDeleteItem(item.key, e)}
                            className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-slate-100 transition-all cursor-pointer"
                            title="Delete custom item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add Custom Item Form */}
                <form onSubmit={handleAddItem} className="flex gap-2 border-t border-gray-900/10 pt-3">
                  <input
                    type="text"
                    placeholder={language === "th" ? "เพิ่มรายการ..." : language === "zh" ? "添加行李..." : "Add packing item..."}
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    className="flex-1 bg-white border border-brand-gold/20 rounded-lg text-[10px] px-3 py-1.5 focus:outline-none focus:border-brand-gold text-gray-900 placeholder-gray-400 font-semibold"
                  />
                  <button
                    type="submit"
                    className="bg-brand-gold hover:bg-brand-gold-hover text-brand-bg-primary font-bold text-[10px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {language === "th" ? "เพิ่ม" : language === "zh" ? "添加" : "Add"}
                  </button>
                </form>
              </div>
            );
          })()}
        </div>
      </div>

      {showNameSelectorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white border border-brand-gold/20 p-6 shadow-2xl animate-scaleUp relative overflow-hidden text-gray-800">
            {/* Subtle decorative gold glow */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl"></div>

            {visitorName && (
              <button
                onClick={() => setShowNameSelectorPopup(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-slate-100 p-1.5 rounded-full transition-all cursor-pointer border border-transparent"
                type="button"
                aria-label="Close name selection"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="text-center mb-6">
              <h2 className="text-xl font-display font-extrabold text-brand-gold flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 animate-pulse text-brand-gold" />
                {language === "th" ? "หนีห่าว ! ยินดีต้อนรับ" : language === "zh" ? "您好！欢迎" : "Ni Hao! Welcome"}
              </h2>
              <p className="text-xs text-gray-500 font-semibold mt-1.5">
                {language === "th"
                  ? "กรุณาเลือกชื่อของคุณจากรายชื่อผู้ร่วมทริปเพื่อเริ่มต้นใช้งาน"
                  : language === "zh"
                  ? "请从旅客名单中选择您的名字以开始"
                  : "Please select your name from the travelers list to start"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 py-1">
              {PARTICIPANTS.map((p) => {
                const isSelected = visitorName === p.nickname;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setVisitorName(p.nickname);
                      setShowNameSelectorPopup(false);
                    }}
                    type="button"
                    className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border text-center transition-all duration-300 hover:scale-[1.03] cursor-pointer hover:border-brand-gold/40 hover:bg-slate-50 ${
                      isSelected
                        ? "bg-brand-gold/10 border-brand-gold shadow-[0_4px_12px_rgba(181,137,44,0.08)] font-extrabold"
                        : "bg-slate-50/50 border-slate-200 text-gray-700"
                    }`}
                  >
                    <div
                      style={{ backgroundColor: p.color }}
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white font-extrabold text-xs uppercase shadow-md transition-transform duration-300 group-hover:scale-105"
                    >
                      {p.nickname.slice(0, 2)}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-xs text-gray-900 leading-tight">{p.nickname}</span>
                      <span className="text-[9px] text-gray-400 font-semibold truncate max-w-[120px]">{p.fullName}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
