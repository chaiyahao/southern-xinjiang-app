"use client";

import React from "react";
import Sidebar from "../components/Sidebar";
import { useTravelStore } from "../store/useTravelStore";
import { Printer, X, FileText, CheckCircle2 } from "lucide-react";
import { ITINERARY_DATA, HOTELS_DATA, FLIGHTS_DATA } from "../data/travelData";

// Screens
import OverviewScreen from "../components/OverviewScreen";
import ItineraryScreen from "../components/ItineraryScreen";
import MapScreen from "../components/MapScreen";
import HotelsScreen from "../components/HotelsScreen";
import BudgetScreen from "../components/BudgetScreen";
import FlightsScreen from "../components/FlightsScreen";
import LiveScreen from "../components/LiveScreen";
import SupportScreen from "../components/SupportScreen";

export default function Home() {
  const { activeTab, loadPersistedData, notes, customExpenses } = useTravelStore();

  const [showPrintModal, setShowPrintModal] = React.useState(false);
  const [printSections, setPrintSections] = React.useState({
    cover: true,
    itinerary: true,
    hotels: true,
    flights: true,
    budget: true,
    notes: true,
  });

  React.useEffect(() => {
    loadPersistedData();
  }, [loadPersistedData]);

  // Dynamic budget calculations for PDF print matching Custom Expense modifications
  const flightsCustomSum = customExpenses.filter((e) => e.category === "flights").reduce((sum, e) => sum + e.amountThb, 0);
  const transportCustomSum = customExpenses.filter((e) => e.category === "transport").reduce((sum, e) => sum + e.amountThb, 0);
  const hotelsCustomSum = customExpenses.filter((e) => e.category === "hotels").reduce((sum, e) => sum + e.amountThb, 0);
  const ticketsCustomSum = customExpenses.filter((e) => e.category === "tickets").reduce((sum, e) => sum + e.amountThb, 0);
  const otherCustomSum = customExpenses.filter((e) => e.category === "other").reduce((sum, e) => sum + e.amountThb, 0);

  const dynamicBudgetData = [
    { name: "Outbound/Return Flights", amountThb: 19875 + flightsCustomSum, color: "#5EA8FF" },
    { name: "Private Van & Driver", amountThb: 8000 + transportCustomSum, color: "#E1A63B" },
    { name: "Luxury Hotels (9 Nights)", amountThb: 5850 + hotelsCustomSum, color: "#EC4899" },
    { name: "Entrance Fees & Tickets", amountThb: 1500 + ticketsCustomSum, color: "#10B981" },
  ];

  if (otherCustomSum > 0) {
    dynamicBudgetData.push({ name: "Other Expenses", amountThb: otherCustomSum, color: "#8B5CF6" });
  }

  const dynamicTotal = dynamicBudgetData.reduce((sum, item) => sum + item.amountThb, 0);
  const printBudgetData = dynamicBudgetData.map((entry) => ({
    ...entry,
    percentage: dynamicTotal > 0 ? parseFloat(((entry.amountThb / dynamicTotal) * 100).toFixed(1)) : 0,
  }));

  const handlePrint = () => {
    setShowPrintModal(false);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewScreen />;
      case "itinerary":
        return <ItineraryScreen />;
      case "map":
        return <MapScreen />;
      case "hotels":
        return <HotelsScreen />;
      case "budget":
        return <BudgetScreen />;
      case "flights":
        return <FlightsScreen />;
      case "live":
        return <LiveScreen />;
      case "support":
        return <SupportScreen />;
      default:
        return <OverviewScreen />;
    }
  };

  const toggleSection = (section: keyof typeof printSections) => {
    setPrintSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-brand-bg-primary text-gray-100 font-sans antialiased relative overflow-x-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-brand-blue/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-20 w-[450px] h-[450px] rounded-full bg-brand-gold/5 blur-3xl pointer-events-none"></div>

      {/* Shared Layout: Navigation Sidebar */}
      <div className="no-print lg:flex">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto max-h-screen relative z-10 no-print">
        {/* Global Dashboard Header */}
        <header className="p-4 lg:p-6 border-b border-brand-gold/10 bg-brand-bg-secondary/25 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-ping"></span>
            <span className="text-xs font-bold text-brand-gold tracking-widest uppercase">
              Expedition Console
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <button
              onClick={() => setShowPrintModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-brand-gold hover:bg-brand-gold-hover text-brand-bg-primary font-bold text-xs shadow-md transition-all duration-300 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Travel Guide (PDF)</span>
            </button>
            <span className="font-semibold text-gray-300">Route Status:</span>
            <span className="px-2 py-0.5 rounded bg-brand-gold/10 border border-brand-gold/20 text-brand-gold font-bold">
              VIP Package Active
            </span>
          </div>
        </header>

        {/* Dynamic Panel Content */}
        <div className="flex-1 w-full relative">
          {renderActiveScreen()}
        </div>
      </main>

      {/* Print Settings Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 no-print animate-fadeIn">
          <div className="bg-brand-bg-secondary border border-brand-gold/20 rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-5 relative overflow-hidden animate-scaleUp">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl"></div>

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-base text-brand-gold flex items-center gap-2">
                <Printer className="w-5 h-5" />
                Customize Travel Guide PDF
              </h3>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-gray-400 hover:text-gray-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-400">
              Select which sections to include in the exported travel booklet. Your customized budgets and personal notes will sync automatically.
            </p>

            <div className="flex flex-col gap-3 py-1">
              {(Object.keys(printSections) as Array<keyof typeof printSections>).map((section) => {
                const label = 
                  section === "cover" ? "Title & Cover Page" :
                  section === "itinerary" ? "10-Day Detailed Itinerary" :
                  section === "hotels" ? "Accommodations & Bookings" :
                  section === "flights" ? "Flight Transit Schedule" :
                  section === "budget" ? "Dynamic Cost Breakdown" : "Personal Travel Notes";
                
                return (
                  <button
                    key={section}
                    onClick={() => toggleSection(section)}
                    className="flex items-center justify-between p-3 rounded-lg bg-brand-bg-primary/50 border border-white/5 hover:border-brand-gold/25 transition-all text-xs font-semibold cursor-pointer group text-left"
                  >
                    <span className="text-gray-300 group-hover:text-gray-100">{label}</span>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      printSections[section] 
                        ? "bg-brand-gold border-brand-gold text-brand-bg-primary" 
                        : "border-white/15 text-transparent"
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-lg p-3 text-[10px] text-brand-gold leading-normal">
              💡 **Tip:** For the best visual results, ensure that **"Background graphics"** is enabled in your browser's print options sheet before saving.
            </div>

            <button
              onClick={handlePrint}
              className="w-full py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-bg-primary text-xs font-extrabold transition-all cursor-pointer shadow-lg tracking-wider"
            >
              Generate & Print PDF
            </button>
          </div>
        </div>
      )}

      {/* PRINT-ONLY BROCHURE LAYOUT */}
      <div className="print-only hidden p-8 max-w-4xl mx-auto text-black font-sans">
        {/* Title Cover Page */}
        {printSections.cover && (
          <div className="text-center border-b-4 border-double border-gray-800 pb-8 mb-8 print-break-after">
            <h1 className="text-4xl font-extrabold tracking-tight uppercase mb-2">Southern Xinjiang Expedition</h1>
            <p className="text-lg font-semibold text-gray-600 mb-6">10-Day Legendary Silk Road & High-Altitude Loop</p>
            <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto text-left text-sm border-t border-gray-300 pt-6">
              <div>
                <p><strong>Expedition Coordinator:</strong> Arthur Xie</p>
                <p><strong>Contact Email:</strong> <span className="underline">chaiyahao@gmail.com</span></p>
                <p><strong>Hotline:</strong> +66 (0) 88-005-5888</p>
              </div>
              <div className="text-right">
                <p><strong>Total Route Distance:</strong> 2,540 km</p>
                <p><strong>VIP Route Status:</strong> Active & Confirmed</p>
                <p><strong>Total Package Cost:</strong> {dynamicTotal.toLocaleString()} THB / person</p>
              </div>
            </div>
          </div>
        )}

        {/* Itinerary Details */}
        {printSections.itinerary && (
          <div className="mb-8 print-break-after">
            <h2 className="text-2xl font-bold border-b-2 border-gray-800 pb-2 mb-4 uppercase">I. Detailed Daily Itinerary</h2>
            <div className="space-y-6">
              {ITINERARY_DATA.map((day) => (
                <div key={day.day} className="print-avoid-break border-b border-gray-200 pb-4">
                  <h3 className="text-base font-bold text-gray-900">
                    Day {day.day} ({day.date}): {day.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold mb-1">
                    Route: {day.startLocation} → {day.endLocation} | Distance: {day.distanceKm} km | Drive Time: {day.driveTime}
                  </p>
                  <p className="text-xs text-gray-700 leading-relaxed mb-2">{day.description}</p>
                  <div className="pl-4 border-l-2 border-gray-300">
                    <span className="text-[10px] uppercase font-bold text-gray-600 tracking-wider">Scheduled Activities:</span>
                    <ul className="list-disc pl-4 text-xs text-gray-600 mt-1">
                      {day.activities.map((act, aIdx) => (
                        <li key={aIdx}>{act}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Dynamic travel notes inclusion */}
                  {printSections.notes && notes[day.day] && (
                    <div className="mt-2.5 pl-4 py-2 border-l-2 border-amber-500 bg-amber-50 rounded">
                      <span className="text-[9px] uppercase font-bold text-amber-800 tracking-wider">My Travel Notes:</span>
                      <p className="text-xs text-gray-700 italic mt-0.5 whitespace-pre-wrap">{notes[day.day]}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hotels Booking Info */}
        {printSections.hotels && (
          <div className="mb-8 print-break-after">
            <h2 className="text-2xl font-bold border-b-2 border-gray-800 pb-2 mb-4 uppercase">II. Accommodation Bookings</h2>
            <div className="space-y-4">
              {HOTELS_DATA.map((hotel) => (
                <div key={hotel.id} className="print-avoid-break border border-gray-300 p-3 rounded">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-gray-900">{hotel.name}</h3>
                    <span className="text-xs text-gray-600 font-semibold">{hotel.daysStayed}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium mb-1.5">{hotel.location} | Rating: {hotel.rating} ⭐</p>
                  <p className="text-xs text-gray-700 leading-relaxed mb-2">{hotel.description}</p>
                  <p className="text-[10px] text-gray-600 font-mono">
                    <strong>Booking Reference URL:</strong> {hotel.bookingUrl}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flight Bookings */}
        {printSections.flights && (
          <div className="mb-8 print-break-after">
            <h2 className="text-2xl font-bold border-b-2 border-gray-800 pb-2 mb-4 uppercase">III. Flight Transit Tickets</h2>
            <div className="space-y-4">
              {FLIGHTS_DATA.map((ticket, tIdx) => (
                <div key={tIdx} className="print-avoid-break border border-gray-300 p-3 rounded">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                    <span className="text-sm font-bold uppercase">{ticket.type} Journey: {ticket.route}</span>
                    <span className="text-xs font-semibold text-gray-600">Duration: {ticket.totalDuration}</span>
                  </div>
                  <div className="space-y-3">
                    {ticket.legs.map((leg, lIdx) => (
                      <div key={lIdx} className="text-xs text-gray-700">
                        <div className="font-bold text-gray-900">
                          {leg.flightNo} - {leg.carrier} ({leg.aircraft})
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 mt-1">
                          <div><strong>Departure:</strong> {leg.departureAirport} at {leg.departureTime} ({leg.date})</div>
                          <div><strong>Arrival:</strong> {leg.arrivalAirport} at {leg.arrivalTime} ({leg.date})</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budget Summary */}
        {printSections.budget && (
          <div className="print-avoid-break">
            <h2 className="text-2xl font-bold border-b-2 border-gray-800 pb-2 mb-4 uppercase">IV. Financial & Budget Breakdown</h2>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-gray-300 font-bold">
                  <th className="py-2">Category Description</th>
                  <th className="py-2 text-right">Amount (THB)</th>
                  <th className="py-2 text-right">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {printBudgetData.map((entry, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="py-2 font-medium">{entry.name}</td>
                    <td className="py-2 text-right font-semibold">{entry.amountThb.toLocaleString()} THB</td>
                    <td className="py-2 text-right text-gray-600">{entry.percentage}%</td>
                  </tr>
                ))}
                <tr className="font-bold text-sm border-t-2 border-gray-800">
                  <td className="py-3">Total Expenses (with Custom Additions)</td>
                  <td className="py-3 text-right">{dynamicTotal.toLocaleString()} THB</td>
                  <td className="py-3 text-right">100%</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[10px] text-gray-500 mt-4 text-center">
              Generated by Southern Xinjiang VIP Expedition Console. Map and telemetry synchronization provided by Beidou-3 Satellite Network.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
