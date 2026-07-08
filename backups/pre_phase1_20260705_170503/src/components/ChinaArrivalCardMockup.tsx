"use client";

import React from "react";
import { Info, AlertTriangle, CheckCircle } from "lucide-react";

interface ChinaArrivalCardMockupProps {
  language: "en" | "th" | "zh";
}

export default function ChinaArrivalCardMockup({ language }: ChinaArrivalCardMockupProps) {
  const th = language === "th";
  const zh = language === "zh";
  const L = (thStr: string, enStr: string, zhStr: string) => (th ? thStr : zh ? zhStr : enStr);

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
      {/* Form Header - Mimicking official China NIA form */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 text-white p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-red-800 font-bold text-xs">国</span>
            </div>
            <div>
              <h3 className="font-bold text-sm">
                {L("中华人民共和国入境卡", "China Arrival Card", "中华人民共和国入境卡")}
              </h3>
              <p className="text-[10px] opacity-90">
                {L("国家移民管理局", "National Immigration Administration", "国家移民管理局")}
              </p>
            </div>
          </div>
          <div className="text-[10px] bg-white/20 px-2 py-1 rounded">
            {L("ดิจิทัล", "Digital", "电子版")}
          </div>
        </div>
      </div>

      {/* Form Body */}
      <div className="p-4 space-y-4">
        {/* Section 1: Personal Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-red-700 border-b border-red-200 pb-2">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            <span className="font-bold text-xs uppercase tracking-wider">
              {L("ข้อมูลส่วนตัว", "Personal Information", "个人信息")}
            </span>
          </div>

          {/* Name Field */}
          <div className="bg-gray-50 border border-gray-200 rounded p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <label className="text-[10px] text-gray-500 font-medium block mb-1">
                  {L("ชื่อ-นามสกุล (เต็ม)", "Full Name", "姓名")}
                </label>
                <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm font-mono text-gray-800">
                  SOMCHAI JAIDEE
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1">
                  <Info className="w-3 h-3 text-blue-600 mb-1" />
                  <p className="text-[9px] text-blue-700 leading-tight">
                    {L("ตามพาสปอร์ต", "Match passport", "与护照一致")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Gender, DOB, Nationality */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 border border-gray-200 rounded p-2">
              <label className="text-[9px] text-gray-500 font-medium block mb-1">
                {L("เพศ", "Gender", "性别")}
              </label>
              <div className="bg-white border border-gray-300 rounded px-2 py-1.5 text-xs font-medium">
                Male
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded p-2">
              <label className="text-[9px] text-gray-500 font-medium block mb-1">
                {L("วันเกิด", "Date of Birth", "出生日期")}
              </label>
              <div className="bg-white border border-gray-300 rounded px-2 py-1.5 text-xs font-mono">
                15/03/1990
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded p-2">
              <label className="text-[9px] text-gray-500 font-medium block mb-1">
                {L("สัญชาติ", "Nationality", "国籍")}
              </label>
              <div className="bg-white border border-gray-300 rounded px-2 py-1.5 text-xs font-medium">
                Thai
              </div>
            </div>
          </div>

          {/* Passport */}
          <div className="bg-gray-50 border border-gray-200 rounded p-3">
            <label className="text-[10px] text-gray-500 font-medium block mb-1">
              {L("เลขพาสปอร์ต / วันหมดอายุ", "Passport No. / Expiry", "护照号码/有效期")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm font-mono text-gray-800">
                AB1234567
              </div>
              <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm font-mono text-gray-800">
                12/2028
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Travel Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-red-700 border-b border-red-200 pb-2">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            <span className="font-bold text-xs uppercase tracking-wider">
              {L("ข้อมูลการเดินทาง", "Travel Information", "旅行信息")}
            </span>
          </div>

          {/* Transport & Flight */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 border border-gray-200 rounded p-2">
              <label className="text-[9px] text-gray-500 font-medium block mb-1">
                {L("พาหนะ", "Transport", "交通工具")}
              </label>
              <div className="bg-white border border-gray-300 rounded px-2 py-1.5 text-xs font-medium">
                Plane
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded p-2">
              <label className="text-[9px] text-gray-500 font-medium block mb-1">
                {L("เลขเที่ยวบิน", "Flight No.", "航班号")}
              </label>
              <div className="bg-white border border-gray-300 rounded px-2 py-1.5 text-xs font-mono">
                OQ2362
              </div>
            </div>
          </div>

          {/* Port of Entry */}
          <div className="bg-gray-50 border border-gray-200 rounded p-2">
            <label className="text-[10px] text-gray-500 font-medium block mb-1">
              {L("ด่านเข้า / เมือง", "Port of Entry / City", "入境口岸/城市")}
            </label>
            <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm font-medium">
              Chongqing (CKG)
            </div>
          </div>

          {/* Phone */}
          <div className="bg-gray-50 border border-gray-200 rounded p-2">
            <label className="text-[10px] text-gray-500 font-medium block mb-1">
              {L("เบอร์โทร (พร้อมรหัสประเทศ)", "Phone (with country code)", "电话（含国家代码）")}
            </label>
            <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm font-mono">
              +66 88-005-5888
            </div>
          </div>
        </div>

        {/* Section 3: Purpose & Visa - CRITICAL FOR THAI CITIZENS */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-red-700 border-b border-red-200 pb-2">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            <span className="font-bold text-xs uppercase tracking-wider">
              {L("วัตถุประสงค์ & วีซ่า", "Purpose & Visa", "入境目的与签证")}
            </span>
          </div>

          {/* Purpose */}
          <div className="bg-gray-50 border border-gray-200 rounded p-2">
            <label className="text-[10px] text-gray-500 font-medium block mb-1">
              {L("วัตถุประสงค์การเดินทาง", "Purpose of Visit", "入境目的")}
            </label>
            <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm font-medium">
              Tourism
            </div>
          </div>

          {/* Visa Selection - CRITICAL */}
          <div className="bg-red-50 border-2 border-red-300 rounded p-3">
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[10px] text-red-700 font-bold block">
                  {L("⚠️ สำคัญสำหรับคนไทย", "⚠️ Critical for Thai Citizens", "⚠️ 泰国公民重要提示")}
                </strong>
                <p className="text-[9px] text-red-800 font-medium mt-0.5 leading-relaxed">
                  {L(
                    "คนไทยเข้าประเทศจีนโดยไม่ต้องขอวีซ่าในกรณีท่องเที่ยวระยะสั้น — เลือก 'Visa-Free' และไม่ต้องกรอกเลขวีซ่า",
                    "Thai citizens can enter China visa-free for short tourist stays — select 'Visa-Free' and do not enter a visa number",
                    "泰国公民可在短期旅游停留下免签入境中国——请选择'免签'，无需填写签证号"
                  )}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white border border-gray-300 rounded p-2">
                <label className="text-[9px] text-gray-500 font-medium block mb-1">
                  {L("นโยบายการเข้าประเทศ", "Entry Policy", "入境政策")}
                </label>
                <div className="bg-green-50 border-2 border-green-400 rounded px-2 py-1.5 text-xs font-bold text-green-700">
                  Visa-Free ✓
                </div>
              </div>
              <div className="bg-white border border-gray-300 rounded p-2">
                <label className="text-[9px] text-gray-500 font-medium block mb-1">
                  {L("เลขวีซ่าจีน", "China Visa No.", "中国签证号")}
                </label>
                <div className="bg-white border border-gray-300 rounded px-2 py-1.5 text-xs font-mono">
                  E12345678
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Accommodation */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-red-700 border-b border-red-200 pb-2">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            <span className="font-bold text-xs uppercase tracking-wider">
              {L("ที่พัก", "Accommodation", "住宿信息")}
            </span>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-3">
            <label className="text-[10px] text-gray-500 font-medium block mb-1">
              {L("ที่อยู่เต็ม (ชื่อโรงแรม + ที่อยู่)", "Full Address (Hotel + Address)", "详细地址（酒店名+地址）")}
            </label>
            <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 leading-relaxed">
              季枫城市酒店, 喀什古城唐城国际美食街
            </div>
            <p className="text-[9px] text-gray-500 mt-1 italic">
              {L("JF Feng Hotel, Kashgar Old Town Food Street", "JF Feng Hotel, Kashgar Old Town Food Street", "季枫城市酒店，喀什古城")}
            </p>
          </div>
        </div>

        {/* Submit Button Mockup */}
        <div className="pt-3 border-t border-gray-200">
          <div className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg text-center cursor-pointer transition-colors flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{L("บันทึกและรับ QR Code", "Save & Get QR Code", "保存并获取二维码")}</span>
          </div>
          <p className="text-[9px] text-gray-500 text-center mt-2">
            {L("บันทึก QR Code ทันทีหลังกรอกเสร็จ", "Save QR code immediately after submitting", "提交后立即保存二维码")}
          </p>
        </div>
      </div>
    </div>
  );
}
