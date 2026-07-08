"use client";

import React, { useState } from "react";
import { Lock, Fingerprint, ShieldCheck } from "lucide-react";
import { useTravelStore } from "../store/useTravelStore";

interface SecurityVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  titleTh?: string;
  titleEn?: string;
}

export default function SecurityVerificationModal({
  isOpen,
  onClose,
  onSuccess,
  titleTh = "การยืนยันตัวตนเพื่อความปลอดภัย",
  titleEn = "Security Verification Required",
}: SecurityVerificationModalProps) {
  const { language } = useTravelStore();
  const [activeVerificationMethod, setActiveVerificationMethod] = useState<"pin" | "biometric">("pin");
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [biometricError, setBiometricError] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Valid pins based on TRAVELERS pin or master pin 9643
    const validPins = ["9643", "1111", "2222", "3333", "4444", "5555", "6666"];
    if (validPins.includes(pinInput)) {
      setPinError(false);
      setVerificationSuccess(true);
      setTimeout(() => {
        setVerificationSuccess(false);
        setPinInput("");
        onSuccess();
      }, 1000);
    } else {
      setPinError(true);
    }
  };

  const handleBiometricVerification = async () => {
    setBiometricError("");
    if (!window.isSecureContext || !navigator.credentials || typeof navigator.credentials.create !== "function") {
      setBiometricError(
        language === "th"
          ? "WebAuthn ต้องใช้ HTTPS/localhost และเบราว์เซอร์ที่รองรับ"
          : "WebAuthn requires HTTPS/localhost and a supported browser."
      );
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
          setVerificationSuccess(false);
          setBiometricError("");
          onSuccess();
        }, 700);
      }
    } catch {
      setBiometricError(
        language === "th"
          ? "ยืนยันตัวตนด้วยอุปกรณ์ไม่สำเร็จ กรุณาลองใหม่หรือใช้ PIN"
          : "Device biometric verification was cancelled or failed. Try again or use PIN."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 no-print animate-fadeIn">
      <div className="bg-white border border-brand-gold/30 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-5 relative overflow-hidden text-gray-800">
        <div className="flex items-center gap-3 text-brand-gold border-b border-gray-100 pb-3">
          <div className="p-2 bg-brand-gold/10 rounded-xl border border-brand-gold/20">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-xs text-navy uppercase tracking-wider">
              {language === "th" ? titleTh : titleEn}
            </h3>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
              {language === "th" ? "กรุณายืนยันตัวตนเพื่อดำเนินการต่อ" : "Authenticate to continue"}
            </span>
          </div>
        </div>

        <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[10px] font-bold">
          {[
            { id: "pin", label: language === "th" ? "ป้อนรหัส PIN" : "PIN Code" },
            { id: "biometric", label: language === "th" ? "สแกนนิ้ว/ใบหน้า" : "Device Biometric" },
          ].map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => {
                setActiveVerificationMethod(method.id as any);
                setPinInput("");
                setPinError(false);
                setBiometricError("");
              }}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                activeVerificationMethod === method.id ? "bg-white text-navy shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>

        {verificationSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 gap-3 text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 animate-scaleUp">
              <ShieldCheck className="w-8 h-8 animate-pulse" />
            </div>
            <h4 className="text-sm font-extrabold text-emerald-700">
              {language === "th" ? "ยืนยันตัวตนสำเร็จ!" : "Verification Successful!"}
            </h4>
            <p className="text-[11px] text-gray-500">
              {language === "th" ? "การยืนยันตัวตนผ่านเรียบร้อยแล้ว" : "Access granted."}
            </p>
          </div>
        ) : (
          <div className="min-h-[160px] flex flex-col justify-center">
            {activeVerificationMethod === "pin" && (
              <form onSubmit={handlePinSubmit} className="flex flex-col gap-3">
                <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                  {language === "th"
                    ? "ป้อนรหัสผ่านหลักของทริป (9643) หรือรหัสผ่านส่วนตัวของผู้ร่วมเดินทางเพื่อปลดล็อก:"
                    : "Enter trip PIN (9643) or traveler personal PIN to unlock:"}
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
                  {language === "th" ? "ยืนยันการทำรายการ" : "Verify & Approve"}
                </button>
              </form>
            )}

            {activeVerificationMethod === "biometric" && (
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="text-[11px] text-gray-650 font-medium leading-relaxed">
                  {language === "th"
                    ? "ยืนยันด้วยระบบความปลอดภัยของอุปกรณ์นี้ เช่น Face ID, Touch ID, Windows Hello หรือสแกนลายนิ้วมือบนมือถือ"
                    : "Verify with this device's secure biometric system such as Face ID, Touch ID, Windows Hello, or mobile fingerprint."}
                </p>

                <button
                  type="button"
                  onClick={handleBiometricVerification}
                  className="w-full py-2.5 bg-brand-gold hover:bg-brand-gold-hover text-brand-bg-primary font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <Fingerprint className="w-4 h-4" />
                  {language === "th" ? "ยืนยันด้วยอุปกรณ์นี้" : "Verify with this device"}
                </button>

                {biometricError && (
                  <span className="text-[10px] text-amber-605 font-bold leading-snug">
                    {biometricError}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-gray-500 font-bold text-xs rounded-xl transition-all cursor-pointer"
        >
          {language === "th" ? "ยกเลิก" : "Cancel"}
        </button>
      </div>
    </div>
  );
}
