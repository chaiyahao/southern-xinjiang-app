"use client";

import React, { useState } from "react";
import { useTravelStore } from "../store/useTravelStore";
import { formatDisplayName } from "../utils/travelers";
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
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  Fingerprint,
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
  const { language, isUnlockedPassports, unlockPassports } = useTravelStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [activeVerificationMethod, setActiveVerificationMethod] = useState<"pin" | "biometric">("pin");
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [biometricError, setBiometricError] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [activeTravelerId, setActiveTravelerId] = useState<string | null>(null);

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

  const completePassportUnlock = (reset: () => void) => {
    unlockPassports(true);
    setShowVerificationModal(false);
    setVerificationSuccess(false);
    reset();
    if (activeTravelerId) {
      const tr = travelersData.find(x => x.id === activeTravelerId);
      if (tr) {
        navigator.clipboard.writeText(tr.passport);
        setCopiedId(activeTravelerId);
        setTimeout(() => setCopiedId(null), 2000);
      }
      setActiveTravelerId(null);
    }
  };

  const handleActualBiometricVerification = async () => {
    setBiometricError("");

    if (!window.isSecureContext || !navigator.credentials || typeof navigator.credentials.create !== "function") {
      setBiometricError(language === "th" ? "WebAuthn ต้องใช้ HTTPS/localhost และเบราว์เซอร์ที่รองรับ" : "WebAuthn requires HTTPS/localhost and a supported browser.");
      return;
    }

    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      const userId = new Uint8Array(16);
      crypto.getRandomValues(userId);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "Southern Xinjiang Travel App" },
          user: {
            id: userId,
            name: "xinjiang-traveler",
            displayName: "Xinjiang Traveler",
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },
            { type: "public-key", alg: -257 },
          ],
          timeout: 60000,
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
            residentKey: "discouraged",
            requireResidentKey: false,
          },
          attestation: "none",
        },
      });

      if (credential) {
        setVerificationSuccess(true);
        setTimeout(() => {
          completePassportUnlock(() => {
            setBiometricError("");
          });
        }, 700);
      }
    } catch {
      setBiometricError(language === "th" ? "ยืนยันตัวตนด้วยอุปกรณ์ไม่สำเร็จ กรุณาลองใหม่หรือใช้ PIN" : "Device biometric verification was cancelled or failed. Try again or use PIN.");
    }
  };

  const handleCopy = (text: string, id: string) => {
    if (!isUnlockedPassports) {
      setActiveTravelerId(id);
      setShowVerificationModal(true);
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleLock = () => {
    if (isUnlockedPassports) {
      unlockPassports(false);
    } else {
      setShowVerificationModal(true);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validPins = ["9643", "1111", "2222", "3333", "4444", "5555", "6666"];
    if (validPins.includes(pinInput)) {
      setPinError(false);
      setVerificationSuccess(true);
      setTimeout(() => {
        unlockPassports(true);
        setShowVerificationModal(false);
        setPinInput("");
        setVerificationSuccess(false);
        if (activeTravelerId) {
          const tr = travelersData.find(x => x.id === activeTravelerId);
          if (tr) {
            navigator.clipboard.writeText(tr.passport);
            setCopiedId(activeTravelerId);
            setTimeout(() => setCopiedId(null), 2000);
          }
          setActiveTravelerId(null);
        }
      }, 1000);
    } else {
      setPinError(true);
    }
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

        <button
          onClick={handleToggleLock}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm border ${
            isUnlockedPassports
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-brand-gold text-brand-bg-primary border-brand-gold/15 hover:bg-brand-gold-hover"
          }`}
        >
          {isUnlockedPassports ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span>
            {isUnlockedPassports 
              ? (language === "th" ? "ล็อกข้อมูลพาสปอร์ต" : "Lock Passport Data")
              : (language === "th" ? "ปลดล็อกเลขพาสปอร์ตทั้งหมด" : "Unlock All Passports")
            }
          </span>
        </button>
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
                      {formatDisplayName(traveler.name, "combined")}
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
                        {isUnlockedPassports ? traveler.passport : "*****" + traveler.passport.slice(-4)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleToggleLock}
                        className="p-2 rounded bg-gray-55 border border-gray-200 text-gray-700 hover:text-brand-blue hover:border-brand-blue hover:bg-white transition-all cursor-pointer shadow-sm flex items-center justify-center"
                        title={isUnlockedPassports ? "Lock Passport" : "Unlock Passport"}
                      >
                        {isUnlockedPassports ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-gray-400" />}
                      </button>

                      <button
                        onClick={() => handleCopy(traveler.passport, traveler.id)}
                        className="p-2 rounded bg-gray-55 border border-gray-200 text-gray-700 hover:text-brand-blue hover:border-brand-blue hover:bg-white transition-all cursor-pointer shadow-sm flex items-center justify-center"
                        title="Copy Passport Number"
                      >
                        {copiedId === traveler.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 animate-scaleIn" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
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

      {/* Security Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 no-print animate-fadeIn">
          <div className="bg-white border border-brand-gold/30 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-5 relative overflow-hidden animate-scaleUp text-gray-800">
            <div className="flex items-center gap-3 text-brand-gold border-b border-gray-100 pb-3">
              <div className="p-2 bg-brand-gold/10 rounded-xl border border-brand-gold/20">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-xs text-navy uppercase tracking-wider">
                  {language === "th" ? "การยืนยันตัวตนเพื่อความปลอดภัย" : "Security Verification Required"}
                </h3>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                  {language === "th" ? "เข้าถึงข้อมูลหนังสือเดินทาง" : "Access Encrypted Passport Records"}
                </span>
              </div>
            </div>

            {/* Tabs Selector for Verification Method */}
            <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[10px] font-bold">
              {[
                { id: "pin", label: language === "th" ? "ป้อนรหัส PIN" : "PIN Code" },
                { id: "biometric", label: language === "th" ? "สแกนนิ้ว/ใบหน้า" : "Device Biometric" }
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => {
                    setActiveVerificationMethod(method.id as any);
                    setPinInput("");
                    setPinError(false);
                    setBiometricError("");
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                    activeVerificationMethod === method.id 
                      ? "bg-white text-navy shadow-sm" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>

            {/* Verification Success Screen */}
            {verificationSuccess ? (
              <div className="flex flex-col items-center justify-center py-6 gap-3 text-center animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 animate-scaleUp">
                  <ShieldCheck className="w-8 h-8 animate-pulse" />
                </div>
                <h4 className="text-sm font-extrabold text-emerald-700">
                  {language === "th" ? "ยืนยันตัวตนสำเร็จ!" : "Verification Successful!"}
                </h4>
                <p className="text-[11px] text-gray-500">
                  {language === "th" ? "ปลดล็อกข้อมูลและแชร์ข้อมูลพาสปอร์ตเรียบร้อย" : "Decryption and access granted."}
                </p>
              </div>
            ) : (
              <div className="min-h-[160px] flex flex-col justify-center">
                {/* Method 1: PIN Input */}
                {activeVerificationMethod === "pin" && (
                  <form onSubmit={handlePinSubmit} className="flex flex-col gap-3">
                    <p className="text-[11px] text-gray-605 font-medium leading-relaxed">
                      {language === "th" ? "ป้อนรหัสผ่านหลักของทริป (9643) หรือรหัสผ่านส่วนตัวของผู้ร่วมเดินทางเพื่อปลดล็อก:" : "Enter trip PIN (9643) or traveler personal PIN to unlock:"}
                    </p>
                    <input
                      type="password"
                      placeholder="••••"
                      maxLength={4}
                      value={pinInput}
                      onChange={(e) => {
                        setPinInput(e.target.value);
                        setPinError(false);
                      }}
                      className="w-full text-center text-xl font-mono tracking-[1em] py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 shadow-inner"
                    />
                    {pinError && (
                      <span className="text-[10px] text-red-500 font-bold text-center">
                        ⚠️ {language === "th" ? "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่" : "Invalid passcode. Please try again."}
                      </span>
                    )}
                    <button
                      type="submit"
                      disabled={pinInput.length < 4}
                      className="mt-2 w-full py-2.5 bg-brand-gold hover:bg-brand-gold-hover text-brand-bg-primary font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {language === "th" ? "ปลดล็อกข้อมูล" : "Verify & Unlock"}
                    </button>
                  </form>
                )}

                {/* Method 2: Biometric Simulation */}
                {activeVerificationMethod === "biometric" && (
                  <div className="flex flex-col items-center gap-4 text-center">
                    <p className="text-[11px] text-gray-650 font-medium leading-relaxed">
                      {language === "th" ? "ยืนยันด้วยระบบความปลอดภัยของอุปกรณ์นี้ เช่น Face ID, Touch ID, Windows Hello หรือสแกนลายนิ้วมือบนมือถือ" : "Verify with this device's secure biometric system such as Face ID, Touch ID, Windows Hello, or mobile fingerprint."}
                    </p>

                    <button
                      type="button"
                      onClick={handleActualBiometricVerification}
                      className="w-full py-2.5 bg-brand-gold hover:bg-brand-gold-hover text-brand-bg-primary font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                    >
                      <Fingerprint className="w-4 h-4" />
                      {language === "th" ? "ยืนยันด้วยอุปกรณ์นี้" : "Verify with this device"}
                    </button>

                    {biometricError && (
                      <span className="text-[10px] text-amber-600 font-bold leading-snug">
                        {biometricError}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => {
                setShowVerificationModal(false);
                setPinInput("");
                setPinError(false);
                setActiveTravelerId(null);
              }}
              className="w-full py-2 bg-slate-50 border border-slate-205 hover:bg-slate-100 text-gray-500 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              {language === "th" ? "ยกเลิก" : "Cancel"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
