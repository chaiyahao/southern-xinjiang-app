"use client";

import React, { useState, useEffect } from "react";
import { BUDGET_DATA, TOTAL_BUDGET } from "../data/travelData";
import { TRANSLATIONS_DATA } from "../data/translations";
import { useTravelStore } from "../store/useTravelStore";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Coins, Receipt, Scale, Plus, Trash2 } from "lucide-react";

export default function BudgetScreen() {
  const { language, customExpenses, addCustomExpense, deleteCustomExpense } = useTravelStore();
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Form states
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState<"flights" | "transport" | "hotels" | "tickets" | "other">("other");
  const [expenseNote, setExpenseNote] = useState("");

  // Group Splitter states
  const [groupSize, setGroupSize] = useState(6);
  const [exchangeRateRmb, setExchangeRateRmb] = useState(4.8);
  const [exchangeRateUsd, setExchangeRateUsd] = useState(35.5);
  const [primaryCurrency, setPrimaryCurrency] = useState<"THB" | "RMB" | "USD">("THB");

  const convertCost = (amountInThb: number) => {
    if (primaryCurrency === "RMB") return exchangeRateRmb > 0 ? amountInThb / exchangeRateRmb : 0;
    if (primaryCurrency === "USD") return exchangeRateUsd > 0 ? amountInThb / exchangeRateUsd : 0;
    return amountInThb;
  };

  const formatCurrency = (amountInThb: number, maxDigits = 0) => {
    const val = convertCost(amountInThb);
    const formatted = val.toLocaleString(undefined, { maximumFractionDigits: maxDigits });
    if (primaryCurrency === "RMB") return `¥${formatted} RMB`;
    if (primaryCurrency === "USD") return `$${val.toLocaleString(undefined, { maximumFractionDigits: 1 })} USD`;
    return `฿${formatted} THB`;
  };

  const t = TRANSLATIONS_DATA[language].ui;
  const tBudget = TRANSLATIONS_DATA[language].budget;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-400">
        Loading budget analytics...
      </div>
    );
  }

  const handlePieMouseEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handlePieMouseLeave = () => {
    setActiveIndex(null);
  };

  const getBudgetTranslation = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("flight")) return tBudget.flights;
    if (n.includes("driver") || n.includes("van") || n.includes("transport")) return tBudget.transport;
    if (n.includes("hotel") || n.includes("accommodation")) return tBudget.hotels;
    if (n.includes("ticket") || n.includes("entrance")) return tBudget.tickets;
    if (n.includes("other")) {
      return {
        name: language === "th" ? "ค่าใช้จ่ายเพิ่มเติมอื่นๆ" : language === "zh" ? "其他额外费用" : "Other Expenses",
        details: language === "th" ? "ค่าใช้จ่ายเพิ่มเติมที่เพิ่มด้วยตนเอง เช่น ของฝาก ขนม หรือของใช้อื่นๆ" : language === "zh" ? "自定义增加的额外消费（如手信、小吃、个人消费等）。" : "Additional user-defined custom expenses (souvenirs, snacks, personal shopping, etc.)."
      };
    }
    return { name, details: "" };
  };

  const getCategoryKey = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("flight")) return "flights";
    if (n.includes("driver") || n.includes("van") || n.includes("transport")) return "transport";
    if (n.includes("hotel") || n.includes("accommodation")) return "hotels";
    if (n.includes("ticket") || n.includes("entrance")) return "tickets";
    return "other";
  };

  // Group custom expenses by category key
  const flightsCustomSum = customExpenses.filter((e) => e.category === "flights").reduce((sum, e) => sum + e.amountThb, 0);
  const transportCustomSum = customExpenses.filter((e) => e.category === "transport").reduce((sum, e) => sum + e.amountThb, 0);
  const hotelsCustomSum = customExpenses.filter((e) => e.category === "hotels").reduce((sum, e) => sum + e.amountThb, 0);
  const ticketsCustomSum = customExpenses.filter((e) => e.category === "tickets").reduce((sum, e) => sum + e.amountThb, 0);
  const otherCustomSum = customExpenses.filter((e) => e.category === "other").reduce((sum, e) => sum + e.amountThb, 0);

  // Re-calculate the dynamic distribution including custom expenses
  const dynamicBudgetData = [
    {
      name: "Outbound/Return Flights",
      amountThb: 19875 + flightsCustomSum,
      color: "#5EA8FF",
    },
    {
      name: "Private Van & Driver",
      amountThb: Math.round(48000 / groupSize) + transportCustomSum,
      color: "#E1A63B",
    },
    {
      name: "Luxury Hotels (9 Nights)",
      amountThb: 5850 + hotelsCustomSum,
      color: "#EC4899",
    },
    {
      name: "Entrance Fees & Tickets",
      amountThb: 1500 + ticketsCustomSum,
      color: "#10B981",
    },
  ];

  if (otherCustomSum > 0) {
    dynamicBudgetData.push({
      name: "Other Expenses",
      amountThb: otherCustomSum,
      color: "#8B5CF6",
    });
  }

  // Compute dynamic totals and percentages
  const dynamicTotal = dynamicBudgetData.reduce((sum, item) => sum + item.amountThb, 0);
  const finalBudgetData = dynamicBudgetData.map((entry) => ({
    ...entry,
    amountConverted: convertCost(entry.amountThb),
    percentage: dynamicTotal > 0 ? parseFloat(((entry.amountThb / dynamicTotal) * 100).toFixed(1)) : 0,
  }));

  const displayedIndex = activeIndex !== null ? activeIndex : selectedIndex;
  const activeBudget = displayedIndex !== null && displayedIndex < finalBudgetData.length ? finalBudgetData[displayedIndex] : null;
  const activeTrans = activeBudget ? getBudgetTranslation(activeBudget.name) : null;

  const handleAddExpense = (e: React.FormEvent, targetCategory?: "flights" | "transport" | "hotels" | "tickets" | "other") => {
    e.preventDefault();
    if (!expenseName.trim() || !expenseAmount.trim()) return;
    const amt = parseFloat(expenseAmount);
    if (isNaN(amt) || amt <= 0) return;

    const cat = targetCategory || expenseCategory;
    addCustomExpense(expenseName.trim(), amt, cat, expenseNote.trim() || undefined);

    // Reset form
    setExpenseName("");
    setExpenseAmount("");
    setExpenseNote("");
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 animate-fadeIn max-w-7xl mx-auto w-full text-gray-800">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-900/10 pb-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-gold-gradient tracking-tight">
            {t.budgetHeader}
          </h2>
          <p className="text-xs text-gray-700 font-semibold">
            {t.budgetDesc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-2 lg:mt-0">
          {/* Currency Switcher */}
          <div className="flex items-center gap-1 bg-brand-bg-primary/60 p-1 rounded-xl border border-gray-900/10 shadow-inner">
            {(["THB", "RMB", "USD"] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setPrimaryCurrency(curr)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-300 cursor-pointer ${
                  primaryCurrency === curr
                    ? "bg-brand-gold text-brand-bg-primary shadow scale-105"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 bg-brand-gold/15 border border-brand-gold/30 px-4 py-2 rounded-xl shadow-lg">
            <Coins className="w-5 h-5 text-brand-gold" />
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-brand-blue font-extrabold uppercase tracking-wider">
                {t.totalBudget}
              </span>
              <span className="text-xl lg:text-2xl font-extrabold text-brand-gold font-display leading-none tracking-tight">
                {formatCurrency(dynamicTotal)}
                <span className="text-[9px] block lg:inline lg:ml-1 font-bold text-gray-700">/ person</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-currency Splitter & Calculator Card */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-900/5 bg-brand-bg-primary/20 flex flex-col md:flex-row justify-between gap-6 shadow">
        {/* Inputs */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          <div className="flex items-center gap-2 border-b border-gray-900/10 pb-1">
            <Coins className="w-4 h-4 text-brand-blue" />
            <h4 className="text-xs font-extrabold text-brand-blue uppercase tracking-wider">
              {language === "th" ? "เครื่องคำนวณและหารค่าใช้จ่ายกลุ่ม" : language === "zh" ? "多币种计费与团队分摊" : "Multi-currency Splitter"}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Group Size slider */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-700 font-extrabold uppercase tracking-wider">
                {language === "th" ? "จำนวนผู้เดินทาง" : language === "zh" ? "出行人数" : "Travelers"}: {groupSize}
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                className="w-full h-1 bg-brand-gold/15 rounded-lg appearance-none cursor-pointer accent-brand-gold"
              />
            </div>

            {/* RMB Exchange Rate */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-700 font-bold uppercase tracking-wider">
                THB / 1 RMB
              </label>
              <input
                type="number"
                step="0.05"
                min="1"
                value={exchangeRateRmb}
                onChange={(e) => setExchangeRateRmb(parseFloat(e.target.value) || 0)}
                className="bg-brand-bg-secondary border border-brand-gold/30 rounded-lg text-xs py-1.5 px-2.5 text-gray-900 font-semibold focus:outline-none focus:border-brand-gold/45"
              />
            </div>

            {/* USD Exchange Rate */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-700 font-bold uppercase tracking-wider">
                THB / 1 USD
              </label>
              <input
                type="number"
                step="0.1"
                min="10"
                value={exchangeRateUsd}
                onChange={(e) => setExchangeRateUsd(parseFloat(e.target.value) || 0)}
                className="bg-brand-bg-secondary border border-brand-gold/30 rounded-lg text-xs py-1.5 px-2.5 text-gray-900 font-semibold focus:outline-none focus:border-brand-gold/45"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Cost Outputs */}
        <div className="flex-1 grid grid-cols-2 gap-4 w-full border-t md:border-t-0 md:border-l border-gray-900/10 pt-4 md:pt-0 md:pl-6">
          {/* Per Person column */}
          <div className="flex flex-col gap-2 bg-brand-bg-secondary/40 p-3 rounded-xl border border-gray-900/5 shadow-sm">
            <span className="text-[9px] text-brand-blue font-bold uppercase tracking-wider">
              {language === "th" ? "เฉลี่ยต่อคน" : language === "zh" ? "每人分摊" : "Per Traveler"}
            </span>
            <div className="flex flex-col gap-0.5 font-display">
              <div className="text-sm font-extrabold text-gray-900">
                {dynamicTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-[9px] text-gray-700 font-semibold font-sans">THB</span>
              </div>
              <div className="text-xs font-bold text-brand-gold mt-0.5">
                {(exchangeRateRmb > 0 ? (dynamicTotal / exchangeRateRmb) : 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-[9px] text-gray-700 font-semibold font-sans">RMB</span>
              </div>
              <div className="text-xs font-bold text-emerald-700 mt-0.5">
                {(exchangeRateUsd > 0 ? (dynamicTotal / exchangeRateUsd) : 0).toLocaleString(undefined, { maximumFractionDigits: 1 })} <span className="text-[9px] text-gray-700 font-semibold font-sans">USD</span>
              </div>
            </div>
          </div>

          {/* Group Total column */}
          <div className="flex flex-col gap-2 bg-brand-bg-secondary/40 p-3 rounded-xl border border-gray-900/5 shadow-sm">
            <span className="text-[9px] text-brand-gold font-bold uppercase tracking-wider">
              {language === "th" ? "ยอดรวมทั้งกลุ่ม" : language === "zh" ? "团队总额" : "Group Total"} ({groupSize} Pax)
            </span>
            <div className="flex flex-col gap-0.5 font-display">
              <div className="text-sm font-extrabold text-gray-900">
                {(dynamicTotal * groupSize).toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-[9px] text-gray-700 font-semibold font-sans">THB</span>
              </div>
              <div className="text-xs font-bold text-brand-gold mt-0.5">
                {(exchangeRateRmb > 0 ? ((dynamicTotal * groupSize) / exchangeRateRmb) : 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-[9px] text-gray-700 font-semibold font-sans">RMB</span>
              </div>
              <div className="text-xs font-bold text-emerald-700 mt-0.5">
                {(exchangeRateUsd > 0 ? ((dynamicTotal * groupSize) / exchangeRateUsd) : 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-[9px] text-gray-700 font-semibold font-sans">USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analysis Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Charts & Breakdown (Left) */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-xl border border-gray-900/5 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-gray-900/10 pb-3">
            <h3 className="font-display font-bold text-base text-brand-gold flex items-center gap-2">
              <Receipt className="w-5 h-5 text-brand-gold" />
              {language === "th" ? "สัดส่วนการแบ่งงบประมาณ" : language === "zh" ? "预算分配分布图" : "Expense Category Distribution"}
            </h3>
            <span className="text-xs text-gray-700 font-light">
              {language === "th" ? "ชี้หรือคลิกที่หมวดหมู่เพื่อล็อกรายละเอียด" : language === "zh" ? "悬停或点击类别以查看并锁定明细" : "Hover or click categories to lock details"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Pie Chart Representation */}
            <div className="h-64 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={finalBudgetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="amountConverted"
                    onMouseEnter={handlePieMouseEnter}
                    onMouseLeave={handlePieMouseLeave}
                    onClick={(_, index) => setSelectedIndex(selectedIndex === index ? null : index)}
                  >
                    {finalBudgetData.map((entry, index) => {
                      const isHighlighted = activeIndex !== null
                        ? activeIndex === index
                        : (selectedIndex !== null ? selectedIndex === index : true);
                      return (
                        <Cell
                           key={`cell-${index}`}
                           fill={entry.color}
                           opacity={isHighlighted ? 1 : 0.3}
                           className="transition-all duration-300 outline-none cursor-pointer"
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [formatCurrency(Number(value)), "Allocated"]}
                    contentStyle={{
                      background: "#FFFFFF",
                      border: "1px solid rgba(225, 166, 59, 0.2)",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "#1F2937",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Total indicator in center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[9px] text-gray-700 font-bold uppercase tracking-wider">
                  Total
                </span>
                <span className="text-lg font-extrabold text-brand-gold font-display mt-0.5 tracking-tight filter drop-shadow">
                  {formatCurrency(dynamicTotal)}
                </span>
              </div>
            </div>

            {/* List breakdown */}
            <div className="flex flex-col gap-2.5">
              {finalBudgetData.map((entry, idx) => {
                const trans = getBudgetTranslation(entry.name);
                const isActive = activeIndex === idx || selectedIndex === idx;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onClick={() => setSelectedIndex(selectedIndex === idx ? null : idx)}
                    className={`p-3 rounded-lg border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                      isActive
                        ? "bg-brand-bg-secondary/60 border-brand-gold/30 scale-[1.02] shadow-[0_0_10px_rgba(225,166,59,0.1)]"
                        : "bg-brand-bg-secondary/20 border-gray-900/5 hover:border-gray-900/15"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-xs text-gray-900 font-bold truncate max-w-[150px]">
                        {trans.name}
                      </span>
                    </div>
                    <div className="text-right flex flex-col justify-center font-display">
                      <span className="text-xs font-extrabold text-gray-900">
                        {formatCurrency(entry.amountThb)}
                      </span>
                      <span className="text-[9px] text-gray-700 font-medium">{entry.percentage}% of total</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Category Details (Right) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel-gold bg-brand-bg-secondary/45 p-6 rounded-xl border border-brand-gold/15 flex flex-col gap-4 min-h-[480px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl"></div>

            <h4 className="font-display font-bold text-base text-brand-gold flex items-center gap-2 border-b border-brand-gold/10 pb-3">
              <Scale className="w-5 h-5 text-brand-gold" />
              {language === "th" ? "รายละเอียดหมวดหมู่" : language === "zh" ? "预算类目详情" : "Category Breakdown"}
            </h4>

            {activeBudget && activeTrans ? (
              <div className="flex flex-col gap-3 animate-fadeIn flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: activeBudget.color }}
                  />
                  <span className="text-sm font-extrabold text-gray-900">
                    {activeTrans.name}
                  </span>
                </div>
                <div className="text-2xl font-bold text-brand-gold font-display my-1">
                  {formatCurrency(activeBudget.amountThb)}
                </div>
                <div className="text-xs text-brand-blue font-bold uppercase tracking-wider">
                  {activeBudget.percentage}% of package budget
                </div>
                <p className="text-xs text-gray-800 leading-relaxed font-semibold mt-2 bg-brand-bg-primary/50 p-3 rounded border border-gray-900/10 shadow-inner">
                  {activeTrans.details}
                </p>

                {/* Custom Expenses Scoped List */}
                <div className="mt-4 border-t border-gray-900/10 pt-4 flex flex-col gap-2 flex-1">
                  <h5 className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                    {language === "th" ? "รายการค่าใช้จ่ายส่วนตัวเพิ่มเติม" : language === "zh" ? "额外个人消费支出" : "Custom Sub-Expenses"}
                  </h5>
                  
                  {customExpenses.filter(e => e.category === getCategoryKey(activeBudget.name)).length > 0 ? (
                    <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                      {customExpenses
                        .filter(e => e.category === getCategoryKey(activeBudget.name))
                        .map(item => (
                          <div key={item.id} className="flex justify-between items-center bg-brand-bg-primary/40 border border-gray-900/10 px-2 py-1.5 rounded text-xs">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900">{item.name}</span>
                              {item.description && <span className="text-[9px] text-gray-700 font-semibold">{item.description}</span>}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-brand-gold text-[11px]">{formatCurrency(item.amountThb)}</span>
                              <button onClick={() => deleteCustomExpense(item.id)} className="text-red-400 hover:text-red-300 p-0.5 cursor-pointer">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-500 font-light italic py-2">
                      {language === "th" ? "ยังไม่มีค่าใช้จ่ายในหมวดหมู่นี้" : language === "zh" ? "当前类别暂无记录。" : "No custom expenses added yet."}
                    </p>
                  )}

                  {/* Contextual Form */}
                  <form onSubmit={(e) => handleAddExpense(e, getCategoryKey(activeBudget.name))} className="mt-auto flex flex-col gap-2 bg-brand-bg-primary/30 p-3 rounded-lg border border-brand-gold/15">
                    <span className="text-[9px] text-brand-gold font-bold uppercase tracking-wider block">
                      {language === "th" ? "+ เพิ่มค่าใช้จ่ายในหมวดหมู่นี้" : language === "zh" ? "+ 添加该类别支出" : "+ Add Contextual Expense"}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder={language === "th" ? "รายการ..." : language === "zh" ? "支出项..." : "Label..."}
                        value={expenseName}
                        onChange={(e) => setExpenseName(e.target.value)}
                        className="bg-brand-bg-secondary border border-brand-gold/25 rounded-lg text-xs py-1 px-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-brand-gold/45"
                        required
                      />
                      <input
                        type="number"
                        placeholder={language === "th" ? "จำนวนเงิน..." : language === "zh" ? "金额..." : "Cost..."}
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                        className="bg-brand-bg-secondary border border-brand-gold/25 rounded-lg text-xs py-1 px-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-brand-gold/45"
                        min="1"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={language === "th" ? "บันทึก..." : language === "zh" ? "备注..." : "Note..."}
                        value={expenseNote}
                        onChange={(e) => setExpenseNote(e.target.value)}
                        className="flex-1 bg-brand-bg-secondary border border-brand-gold/25 rounded-lg text-[10px] py-1 px-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-brand-gold/45"
                      />
                      <button type="submit" className="px-3 py-1 rounded bg-brand-gold hover:bg-brand-gold-hover text-brand-bg-primary text-[10px] font-extrabold transition-all cursor-pointer">
                        Add
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex flex-col flex-1 animate-fadeIn">
                <div className="flex flex-col items-center justify-center text-center py-4 text-gray-500 gap-2 border-b border-white/10">
                  <Coins className="w-7 h-7 text-gray-600 animate-bounce" />
                  <p className="text-xs font-light max-w-[220px] leading-normal text-gray-400">
                    {language === "th"
                      ? "เลือกแถบงบประมาณด้านซ้ายเพื่อกรอกรายจ่ายย่อย หรือเพิ่มรายการรวมได้ด้านล่าง"
                      : language === "zh"
                      ? "点击左侧类目以管理该类别明细，或使用下方表格添加新的开支项目。"
                      : "Click categories on the left to lock and edit sub-expenses, or use the form below to create new costs."}
                  </p>
                </div>

                {/* List of All Custom Expenses */}
                <div className="mt-4 flex flex-col gap-2 flex-1">
                  <h5 className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                    {language === "th" ? "รายการค่าใช้จ่ายเพิ่มเติมทั้งหมด" : language === "zh" ? "全部额外开销清单" : "All Custom Expenses"}
                  </h5>
                  
                  {customExpenses.length > 0 ? (
                    <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                      {customExpenses.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-brand-bg-primary/45 border border-brand-gold/15 px-2 py-1.5 rounded text-xs shadow-sm">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{item.name}</span>
                            <span className="text-[9px] text-brand-blue font-bold uppercase tracking-wider mt-0.5">{item.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-brand-gold text-[11px]">{formatCurrency(item.amountThb)}</span>
                            <button onClick={() => deleteCustomExpense(item.id)} className="text-red-400 hover:text-red-300 p-0.5 cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 font-semibold italic py-2">
                      {language === "th" ? "ยังไม่มีค่าใช้จ่ายบันทึกเพิ่มเติม" : language === "zh" ? "暂无添加的记录。" : "No custom expenses added yet."}
                    </p>
                  )}

                  {/* General Form */}
                  <form onSubmit={(e) => handleAddExpense(e)} className="mt-auto flex flex-col gap-2 bg-brand-bg-primary/30 p-3 rounded-lg border border-brand-gold/15">
                    <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider block">
                      {language === "th" ? "+ เพิ่มค่าใช้จ่ายทั่วไป" : language === "zh" ? "+ 新增一般性费用" : "+ Add General Expense"}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder={language === "th" ? "รายการ..." : language === "zh" ? "名称..." : "Expense..."}
                        value={expenseName}
                        onChange={(e) => setExpenseName(e.target.value)}
                        className="bg-brand-bg-secondary border border-brand-gold/25 rounded-lg text-xs py-1 px-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-brand-gold/45"
                        required
                      />
                      <input
                        type="number"
                        placeholder={language === "th" ? "จำนวนเงิน..." : language === "zh" ? "金额..." : "Cost..."}
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                        className="bg-brand-bg-secondary border border-brand-gold/25 rounded-lg text-xs py-1 px-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-brand-gold/45"
                        min="1"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={expenseCategory}
                        onChange={(e) => setExpenseCategory(e.target.value as any)}
                        className="bg-brand-bg-secondary border border-brand-gold/25 rounded-lg text-[10px] py-1 px-1.5 text-gray-900 focus:outline-none focus:border-brand-gold/45"
                      >
                        <option value="flights">Flights</option>
                        <option value="transport">Transport</option>
                        <option value="hotels">Hotels</option>
                        <option value="tickets">Tickets</option>
                        <option value="other">Other Expenses</option>
                      </select>
                      <input
                        type="text"
                        placeholder={language === "th" ? "บันทึก..." : language === "zh" ? "备注..." : "Note..."}
                        value={expenseNote}
                        onChange={(e) => setExpenseNote(e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg text-[10px] py-1 px-2 text-gray-800 font-semibold focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <button type="submit" className="w-full py-1.5 rounded-lg bg-brand-gold hover:bg-brand-gold-hover text-brand-bg-primary text-xs font-extrabold transition-all cursor-pointer">
                      Create Item
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
