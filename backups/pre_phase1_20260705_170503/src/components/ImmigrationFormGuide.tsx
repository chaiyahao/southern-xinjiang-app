"use client";

import React, { useState } from "react";
import {
  FileText, Info, CheckCircle2, AlertCircle, ChevronDown, ChevronRight,
  Globe, Smartphone, QrCode, X, Eye, List,
} from "lucide-react";
import ChinaArrivalCardMockup from "./ChinaArrivalCardMockup";

interface Field {
  label: { th: string; en: string; zh: string };
  hint: { th: string; en: string; zh: string };
  example?: { th: string; en: string; zh: string };
}

interface FormData {
  id: string;
  country: { th: string; en: string; zh: string };
  flag: string;
  title: { th: string; en: string; zh: string };
  desc: { th: string; en: string; zh: string };
  channels: { th: string; en: string; zh: string }[];
  fields: Field[];
  officialUrl: string;
  tips: { th: string; en: string; zh: string };
}

const FORMS: FormData[] = [
  {
    id: "china_arrival",
    country: { th: "จีน (ฉงชิ่ง CKG)", en: "China (Chongqing CKG)", zh: "中国 (重庆 CKG)" },
    flag: "🇨🇳",
    title: {
      th: "China Arrival Card — ใบกรอกข้อมูลเข้าจีน (ดิจิทัล)",
      en: "China Arrival Card — Digital Entry Form",
      zh: "中国入境卡（电子版）",
    },
    desc: {
      th: "ตั้งแต่ 20 พ.ย. 2025 จีนใช้ระบบดิจิทัล กรอกล่วงหน้าก่อนถึง 24-72 ชม. — ประหยัดเวลาที่ด่านตรวจคนเข้าเมือง บันทึก QR code ไว้แสดงต่อเจ้าหน้าที่",
      en: "Since Nov 20, 2025 China uses a digital arrival card. Fill it 24-72h before arrival to save time at immigration. Save the QR code to show officers.",
      zh: "自2025年11月20日起中国启用电子入境卡。建议提前24-72小时填写，节省通关时间，保存二维码向工作人员出示。",
    },
    channels: [
      { th: "เว็บ NIA: s.nia.gov.cn/ArrivalCardFillingPC", en: "NIA Website: s.nia.gov.cn/ArrivalCardFillingPC", zh: "国家移民管理局网站" },
      { th: "แอป '移民局 12367' (iOS/Android)", en: "'NIA 12367' app (iOS/Android)", zh: "'移民局 12367' App" },
      { th: "WeChat/Alipay มินิโปรแกรม '移民局 12367'", en: "WeChat/Alipay mini-program 'NIA 12367'", zh: "微信/支付宝小程序'移民局 12367'" },
      { th: "ตู้บริการตนเองที่สนามบิน (สแกนพาสปอร์ต)", en: "Self-service kiosk at airport (scan passport)", zh: "机场自助机（扫描护照）" },
    ],
    officialUrl: "https://s.nia.gov.cn/ArrivalCardFillingPC/",
    fields: [
      {
        label: { th: "ชื่อ-นามสกุล (เต็ม)", en: "Full Name", zh: "姓名" },
        hint: { th: "กรอกตามพาสปอร์ต ห้ามย่อ ตัวอย่าง: SOMCHAI JAIDEE", en: "Match passport exactly, no abbreviations", zh: "与护照完全一致" },
        example: { th: "SOMCHAI JAIDEE", en: "SOMCHAI JAIDEE", zh: "SOMCHAI JAIDEE" },
      },
      {
        label: { th: "เพศ / วันเกิด / สัญชาติ", en: "Gender / DOB / Nationality", zh: "性别/出生日期/国籍" },
        hint: { th: "เลือก Male/Female + วันเดือนปีเกิด + Thai", en: "Select Male/Female + DOB + Thai", zh: "选择性别+出生日期+泰国" },
        example: { th: "Male • 15/03/1990 • Thai", en: "Male • 15/03/1990 • Thai", zh: "Male • 15/03/1990 • Thai" },
      },
      {
        label: { th: "เลขพาสปอร์ต / หมดอายุ", en: "Passport No. / Expiry", zh: "护照号码/有效期" },
        hint: { th: "อัปโหลดรูปหน้าพาสปอร์ต ระบบจะดึงอัตโนมัติ ตรวจดูอีกครั้ง", en: "Upload passport photo page, system auto-fills, then verify", zh: "上传护照页，系统自动识别，需核对" },
        example: { th: "AB1234567 • 12/2028", en: "AB1234567 • 12/2028", zh: "AB1234567 • 12/2028" },
      },
      {
        label: { th: "พาหนะ / หมายเลขเที่ยวบิน", en: "Transport / Flight No.", zh: "交通工具/航班号" },
        hint: { th: "เครื่องบิน • รหัสเที่ยวบินที่นั่งมา", en: "Plane • your flight number", zh: "飞机•航班号" },
        example: { th: "Plane • OQ2362", en: "Plane • OQ2362", zh: "飞机 • OQ2362" },
      },
      {
        label: { th: "ด่านเข้า / เมือง", en: "Port of Entry / City", zh: "入境口岸/城市" },
        hint: { th: "Chongqing Jiangbei International Airport", en: "Chongqing Jiangbei International Airport", zh: "重庆江北国际机场" },
        example: { th: "Chongqing (CKG)", en: "Chongqing (CKG)", zh: "重庆 (CKG)" },
      },
      {
        label: { th: "เบอร์โทร (พร้อมรหัสประเทศ)", en: "Phone (with country code)", zh: "电话（含国家代码）" },
        hint: { th: "+66 ตามด้วยเบอร์ไทย", en: "+66 followed by Thai number", zh: "+66开头泰国号码" },
        example: { th: "+66 88-005-5888", en: "+66 88-005-5888", zh: "+66 88-005-5888" },
      },
      {
        label: { th: "วัตถุประสงค์การเดินทาง", en: "Purpose of Visit", zh: "入境目的" },
        hint: { th: "เลือก Tourism", en: "Select Tourism", zh: "选择旅游" },
        example: { th: "Tourism", en: "Tourism", zh: "旅游" },
      },
      {
        label: { th: "นโยบายการเข้าประเทศ (สำคัญ!)", en: "Entry Policy (Critical!)", zh: "入境政策（重要！）" },
        hint: {
          th: "คนไทยเข้าประเทศจีนโดยไม่ต้องขอวีซ่าในกรณีท่องเที่ยวระยะสั้น — เลือก 'Visa-Free' และไม่ต้องกรอกเลขวีซ่า",
          en: "Thai citizens can enter China visa-free for short tourist stays — select 'Visa-Free' and do not enter a visa number",
          zh: "泰国公民可在短期旅游停留下免签入境中国——请选择'免签'，无需填写签证号",
        },
        example: { th: "Visa-Free • ไม่ต้องกรอกเลขวีซ่า", en: "Visa-Free • no visa number required", zh: "免签 • 无需填写签证号" },
      },
      {
        label: { th: "ที่พัก (ที่อยู่เต็ม)", en: "Accommodation (Full Address)", zh: "住宿（详细地址）" },
        hint: { th: "ชื่อโรงแรม + ที่อยู่เต็ม — คัดลอกจากอีเมลยืนยันโรงแรม", en: "Hotel name + full address — copy from booking confirmation", zh: "酒店名+完整地址，从预订邮件复制" },
        example: { th: "季枫城市酒店, 喀什古城唐城国际美食街", en: "JF Feng Hotel, Kashgar Old Town Food Street", zh: "季枫城市酒店，喀什古城" },
      },
    ],
    tips: {
      th: "บันทึก QR code ทันทีหลังกรอกเสร็จ — ถ่ายภาพหน้าจอ + ส่งอีเมลสำรอง ทุกครั้งที่เข้าจีนต้องกรอกใหม่",
      en: "Save the QR code immediately after submitting — screenshot + email backup. A new card is required for every China entry.",
      zh: "提交后立即保存二维码——截图+邮件备份。每次入境中国都要重新填写。",
    },
  },
];

export default function ImmigrationFormGuide({ language }: { language: "en" | "th" | "zh" }) {
  const [openForm, setOpenForm] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "visual">("visual");
  const th = language === "th";
  const zh = language === "zh";
  const L = (thStr: string, enStr: string, zhStr: string) => (th ? thStr : zh ? zhStr : enStr);

  return (
    <div className="glass-panel rounded-2xl border border-brand-blue/15 flex flex-col gap-4 p-5 lg:p-6">
      <div className="flex items-center justify-between border-b border-gray-900/10 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-blue" />
          <h3 className="font-display font-bold text-base text-navy">
            {L("คู่มือกรอกแบบฟอร์มตรวจคนเข้าเมือง", "Immigration Form Guide", "入境卡填写指南")}
          </h3>
        </div>
        <div className="flex items-center gap-1 bg-brand-bg-primary/75 p-0.5 rounded border border-white/10">
          <button
            onClick={() => setViewMode("visual")}
            className={`px-2 py-1 rounded text-[10px] font-bold transition-all flex items-center gap-1 ${
              viewMode === "visual"
                ? "bg-brand-gold text-brand-bg-primary shadow"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Eye className="w-3 h-3" />
            {L("ฟอร์มจำลอง", "Visual", "表单")}
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-2 py-1 rounded text-[10px] font-bold transition-all flex items-center gap-1 ${
              viewMode === "list"
                ? "bg-brand-gold text-brand-bg-primary shadow"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <List className="w-3 h-3" />
            {L("รายการ", "List", "列表")}
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed">
        {L(
          "จำลองหน้าฟอร์มจริงพร้อมคำอธิบายภาษาไทย — เตรียมกรอกล่วงหน้าก่อนถึงด่าน เผื่อเวลา 30 นาทีสำรอง",
          "Realistic form mockups with Thai explanations — fill in advance, allow 30 min buffer",
          "真实表单模拟附泰文说明——建议提前填写，预留30分钟"
        )}
      </p>

      {/* Form selector buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {FORMS.map((f) => {
          const isOpen = openForm === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setOpenForm(isOpen ? null : f.id)}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left cursor-pointer ${
                isOpen
                  ? "bg-brand-blue text-white border-brand-blue shadow-md"
                  : "bg-white border-gray-200 hover:border-brand-blue/40 text-gray-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{f.flag}</span>
                <div>
                  <div className={`text-sm font-bold ${isOpen ? "text-white" : "text-navy"}`}>
                    {f.country[language] || f.country.en}
                  </div>
                  <div className={`text-[10px] font-medium ${isOpen ? "text-white/80" : "text-gray-500"}`}>
                    {f.title[language] || f.title.en}
                  </div>
                </div>
              </div>
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          );
        })}
      </div>

      {/* Selected form detail */}
      {openForm && (() => {
        const f = FORMS.find((x) => x.id === openForm)!;
        return (
          <div className="flex flex-col gap-4 animate-fadeIn bg-brand-blue/5 border border-brand-blue/15 rounded-xl p-4 lg:p-5">
            {/* Description */}
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                {f.desc[language] || f.desc.en}
              </p>
            </div>

            {/* Official channels */}
            <div>
              <span className="text-[10px] font-extrabold text-brand-blue uppercase tracking-wider flex items-center gap-1 mb-2">
                <Smartphone className="w-3 h-3" /> {L("ช่องทางทางการ (ฟรี ห้ามใช้เว็บปลอม)", "Official Channels (Free — avoid fake sites)", "官方渠道（免费，谨防假冒）")}
              </span>
              <ul className="flex flex-col gap-1">
                {f.channels.map((ch, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-gray-700">
                    <span className="text-brand-blue font-bold mt-0.5">{i + 1}.</span>
                    <span>{ch[language] || ch.en}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual Form Mockup or Field List */}
            {viewMode === "visual" ? (
              <div>
                <span className="text-[10px] font-extrabold text-brand-blue uppercase tracking-wider flex items-center gap-1 mb-2">
                  <Eye className="w-3 h-3" /> {L("ฟอร์มจำลอง (คล้ายจริง)", "Visual Form Mockup", "表单模拟")}
                </span>
                <div className="max-w-md mx-auto">
                  {f.id === "china_arrival" && <ChinaArrivalCardMockup language={language} />}
                </div>
              </div>
            ) : (
              <div>
                <span className="text-[10px] font-extrabold text-brand-blue uppercase tracking-wider flex items-center gap-1 mb-2">
                  <FileText className="w-3 h-3" /> {L("ฟิลด์ที่ต้องกรอก (พร้อมตัวอย่าง)", "Fields to Fill (with examples)", "需填字段（含示例）")}
                </span>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {f.fields.map((field, i) => (
                    <div
                      key={i}
                      className={`p-3 flex flex-col gap-1 ${i !== f.fields.length - 1 ? "border-b border-gray-100" : ""}`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-bold text-navy">
                          <span className="text-gray-400 mr-1.5">{i + 1}.</span>
                          {field.label[language] || field.label.en}
                        </span>
                        {field.example && (
                          <span className="text-[10px] font-mono bg-brand-blue/10 text-brand-blue px-1.5 py-0.5 rounded font-bold flex-shrink-0">
                            {field.example[language] || field.example.en}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500 leading-relaxed italic flex items-start gap-1">
                        <Info className="w-2.5 h-2.5 mt-0.5 flex-shrink-0 text-gray-400" />
                        {field.hint[language] || field.hint.en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tip + official link */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-emerald-800 font-semibold leading-relaxed">
                {f.tips[language] || f.tips.en}
              </p>
            </div>

            <a
              href={f.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold transition-all"
            >
              <Globe className="w-4 h-4" />
              {L("เปิดเว็บกรอกฟอร์มทางการ", "Open Official Form", "打开官方表单")}
            </a>

            {/* Special warning for Thai citizens entering China */}
            {f.id === "china_arrival" && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[11px] text-red-700 font-extrabold block">
                    {L("⚠️ สำคัญสำหรับคนไทย", "⚠️ Critical for Thai Citizens", "⚠️ 泰国公民重要提示")}
                  </strong>
                  <p className="text-[10px] text-red-800 font-medium mt-0.5 leading-relaxed">
                    {L(
                      "คนไทยเข้าประเทศจีนโดยไม่ต้องขอวีซ่าในกรณีท่องเที่ยวระยะสั้น — เลือก 'Visa-Free' ในฟอร์มและไม่ต้องกรอกเลขวีซ่า",
                      "Thai citizens can enter China visa-free for short tourist stays — select 'Visa-Free' on the form and do not enter a visa number",
                      "泰国公民可在短期旅游停留下免签入境中国——在表单中选择'免签'，无需填写签证号"
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
