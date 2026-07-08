"use client";

import React, { useState } from "react";
import { useTravelStore } from "../store/useTravelStore";
import { TRANSLATIONS_DATA } from "../data/translations";
import { 
  Users, 
  Contact, 
  Copy, 
  Check, 
  Mail, 
  Phone, 
  Search, 
  UserCheck,
  CreditCard,
  AlertCircle
} from "lucide-react";

interface Traveler {
  id: string;
  name: string;
  passport: string;
  gender: "M" | "F";
  status: string;
  role: string;
}

export default function TravelersScreen() {
  const { language } = useTravelStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const t = TRANSLATIONS_DATA[language].ui;

  const travelersData: Traveler[] = [
    { 
      id: "1", 
      name: "CHAIYA WIBOONSANTISUK", 
      passport: "AD1594767", 
      gender: "M", 
      status: "Verified",
      role: "Lead Traveler / Contact"
    },
    { 
      id: "4", 
      name: "NAKARED WATTANAMONTRI", 
      passport: "AC7411806", 
      gender: "M", 
      status: "Verified",
      role: "Traveler"
    },
    { 
      id: "6", 
      name: "NAPAS PATTARAAMORNPAN", 
      passport: "AD0644795", 
      gender: "M", 
      status: "Verified",
      role: "Traveler"
    },
    { 
      id: "2", 
      name: "NANUTDA PRAKHOD", 
      passport: "AD3496345", 
      gender: "F", 
      status: "Verified",
      role: "Traveler"
    },
    { 
      id: "3", 
      name: "TIPUBON HOMCHAN", 
      passport: "AC3909705", 
      gender: "F", 
      status: "Verified",
      role: "Traveler"
    },
    { 
      id: "5", 
      name: "NATTARIKA KHAMMA", 
      passport: "AD0644824", 
      gender: "F", 
      status: "Verified",
      role: "Traveler"
    }
  ];

  const contactInfo = {
    name: "WIBOONSANTISUK CHAIYA",
    email: "chaiyahao@gmail.com",
    phone: "+66 880055888",
    bookingNo: "165811362016273",
    pin: "9643"
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTravelers = travelersData.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.passport.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dict = {
    th: {
      title: "ผู้ร่วมทริป & ข้อมูลผู้โดยสาร",
      desc: "ข้อมูลหนังสือเดินทางและการติดต่อประสานงานสำหรับการยื่นเอกสารด่านตรวจในซินเจียงใต้",
      searchPlaceholder: "ค้นหาชื่อ หรือเลขพาสปอร์ต...",
      contactHeader: "ผู้ติดต่อและผู้ประสานงานหลัก",
      male: "ชาย",
      female: "หญิง",
      passportLabel: "หมายเลขพาสปอร์ต",
      statusLabel: "สถานะเอกสาร",
      verified: "ตรวจสอบแล้ว",
      copySuccess: "คัดลอกแล้ว",
      bookingLabel: "หมายเลขการจอง",
      contactPerson: "ชื่อผู้ติดต่อ",
      notSpecified: "ไม่ได้ระบุ"
    },
    en: {
      title: "Trip Companions & Passengers",
      desc: "Passport details and emergency contact references for check-point declarations in Southern Xinjiang.",
      searchPlaceholder: "Search name or passport...",
      contactHeader: "Primary Contact Person",
      male: "Male",
      female: "Female",
      passportLabel: "Passport Number",
      statusLabel: "Doc Status",
      verified: "Verified",
      copySuccess: "Copied",
      bookingLabel: "Booking Number",
      contactPerson: "Contact Person",
      notSpecified: "N/A"
    },
    zh: {
      title: "同行旅客与乘机人信息",
      desc: "用于中国南疆边防检查登记及机票对账的护照号码与联系人信息",
      searchPlaceholder: "搜索姓名或护照号...",
      contactHeader: "主要紧急联系人",
      male: "男",
      female: "女",
      passportLabel: "护照号",
      statusLabel: "文档状态",
      verified: "已核验",
      copySuccess: "已复制",
      bookingLabel: "预订确认号",
      contactPerson: "联系人姓名",
      notSpecified: "未指定"
    }
  }[language === "zh" ? "zh" : language === "th" ? "th" : "en"];

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 animate-fadeIn max-w-7xl mx-auto w-full text-gray-800">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-900/10 pb-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-gold-gradient tracking-tight">
            {dict.title}
          </h2>
          <p className="text-xs text-gray-700 font-semibold">
            {dict.desc}
          </p>
        </div>
      </div>

      {/* Booking Details Quickbar */}
      <div className="glass-panel p-4 rounded-xl border border-brand-gold/15 bg-brand-bg-secondary/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-brand-gold" />
          <span className="text-xs font-extrabold text-gray-900 uppercase">
            {dict.bookingLabel}: <span className="font-mono text-brand-blue select-all font-black">{contactInfo.bookingNo}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-200 bg-brand-bg-primary/60 border border-brand-gold/15 py-1 px-3 rounded-full font-bold">
          <AlertCircle className="w-3.5 h-3.5 text-brand-blue" />
          <span>PIN: {contactInfo.pin}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main List (Left) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder={dict.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-brand-gold/25 rounded-xl text-xs pl-10 pr-4 py-2.5 text-gray-900 placeholder-gray-500 font-semibold focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 shadow-inner transition-all"
            />
          </div>

          {/* Passenger Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTravelers.map((traveler) => (
              <div 
                key={traveler.id} 
                className="glass-panel p-5 rounded-xl border border-gray-900/5 hover:border-brand-gold/30 bg-white/70 shadow-sm flex flex-col justify-between gap-4 transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-brand-gold font-bold uppercase tracking-wider">
                      {traveler.role}
                    </span>
                    <h3 className="text-sm font-extrabold text-gray-900 select-all tracking-tight leading-tight">
                      {traveler.name}
                    </h3>
                  </div>

                  {/* Gender indicator icon/badge */}
                  <span 
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                      traveler.gender === "M" 
                        ? "bg-blue-50 text-blue-700 border-blue-200" 
                        : "bg-pink-50 text-pink-700 border-pink-200"
                    }`}
                  >
                    <span>{traveler.gender === "M" ? "♂" : "♀"}</span>
                    <span>{traveler.gender === "M" ? dict.male : dict.female}</span>
                  </span>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-gray-900/5">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-700 uppercase font-bold tracking-wider">
                        {dict.passportLabel}
                      </span>
                      <span className="font-mono font-black text-gray-900 select-all tracking-wide mt-0.5">
                        {traveler.passport}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(traveler.passport, traveler.id)}
                      className="p-2 rounded bg-gray-50 border border-gray-200 text-gray-700 hover:text-brand-blue hover:border-brand-blue hover:bg-white transition-all cursor-pointer shadow-sm flex items-center justify-center"
                      title="Copy Passport Number"
                    >
                      {copiedId === traveler.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 animate-scaleIn" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-gray-700 mt-1 font-semibold">
                    <span>{dict.statusLabel}:</span>
                    <span className="flex items-center gap-1 text-emerald-600 font-extrabold">
                      <UserCheck className="w-3.5 h-3.5" />
                      {dict.verified}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredTravelers.length === 0 && (
              <div className="col-span-2 text-center py-12 text-gray-700 bg-white/40 border border-dashed border-gray-300 rounded-xl">
                No companions match your search criteria.
              </div>
            )}
          </div>
        </div>

        {/* Contact Info (Right Card) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-xl border border-brand-gold/15 bg-brand-bg-secondary/40 flex flex-col gap-4">
            <h3 className="font-display font-bold text-base text-brand-gold flex items-center gap-2 border-b border-brand-gold/10 pb-3">
              <Contact className="w-5 h-5 text-brand-gold" />
              {dict.contactHeader}
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-700 font-bold uppercase tracking-wider">
                  {dict.contactPerson}
                </span>
                <span className="text-sm font-extrabold text-gray-900 mt-0.5 select-all">
                  {contactInfo.name}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/60 border border-gray-900/5 shadow-sm text-xs">
                <Mail className="w-4 h-4 text-brand-blue flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-700 uppercase font-bold tracking-wider">Email</span>
                  <a href={`mailto:${contactInfo.email}`} className="font-bold text-brand-blue hover:underline select-all mt-0.5">
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/60 border border-gray-900/5 shadow-sm text-xs">
                <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-pulse-slow" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-700 uppercase font-bold tracking-wider">Phone</span>
                  <a href={`tel:${contactInfo.phone}`} className="font-mono font-black text-gray-900 hover:text-brand-blue transition-colors select-all mt-0.5">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
