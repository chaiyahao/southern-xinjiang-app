"use client";

import React from "react";
import { HOTELS_DATA } from "../data/travelData";
import { TRANSLATIONS_DATA } from "../data/translations";
import { useTravelStore } from "../store/useTravelStore";
import { Star, ShieldCheck, MapPin, Coffee, Wifi, Sparkles, Wind, ExternalLink } from "lucide-react";

export default function HotelsScreen() {
  const { language } = useTravelStore();

  const t = TRANSLATIONS_DATA[language].ui;
  const tHotels = TRANSLATIONS_DATA[language].hotels;

  const getHotelIcon = (id: string) => {
    switch (id) {
      case "wanda":
        return "🏰";
      case "torgrencia":
        return "⛺";
      case "huarui":
        return "🏔️";
      default:
        return "🏨";
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 animate-fadeIn max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-gold-gradient tracking-tight">
            {t.hotelsHeader}
          </h2>
          <p className="text-xs text-gray-400">
            {t.hotelsDesc}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-brand-gold/10 px-3 py-1.5 rounded-full border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Elite Selection</span>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {HOTELS_DATA.map((hotel) => {
          const trans = tHotels[hotel.id] || {
            name: hotel.name,
            description: hotel.description,
            location: hotel.location,
            amenities: hotel.amenities,
            highlights: hotel.highlights,
          };

          return (
            <div
              key={hotel.id}
              className="glass-panel hover:border-brand-gold/30 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 group"
            >
              {/* Visual Hotel Cover Image Banner */}
              <div className="h-48 relative overflow-hidden border-b border-white/5 group">
                <img
                  src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                  alt={trans.name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Dark luxury overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-bg-primary via-brand-bg-primary/50 to-black/25 z-0"></div>

                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <span className="text-3xl filter drop-shadow">{getHotelIcon(hotel.id)}</span>
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-bg-primary/80 border border-brand-gold/25 text-brand-gold font-bold text-xs shadow-md">
                      <Star className="w-3 h-3 fill-brand-gold text-brand-gold" />
                      {hotel.rating}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-blue bg-brand-blue/90 px-2.5 py-0.5 rounded shadow">
                      {hotel.daysStayed}
                    </span>
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-brand-gold transition-colors duration-300 truncate mt-1.5 filter drop-shadow">
                      {trans.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Description & Specs */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                    <span>{trans.location}</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-light line-clamp-3">
                    {trans.description}
                  </p>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1.5">
                  {trans.amenities.slice(0, 3).map((amenity, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] text-gray-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded flex items-center gap-1"
                    >
                      {amenity.toLowerCase().includes("wifi") && <Wifi className="w-2.5 h-2.5 text-brand-blue" />}
                      {amenity.toLowerCase().includes("oxygen") && <Wind className="w-2.5 h-2.5 text-emerald-400" />}
                      {amenity.toLowerCase().includes("dining") && <Coffee className="w-2.5 h-2.5 text-brand-gold" />}
                      {amenity}
                    </span>
                  ))}
                  {trans.amenities.length > 3 && (
                    <span className="text-[9px] text-gray-500 font-semibold px-2 py-0.5">
                      +{trans.amenities.length - 3} more
                    </span>
                  )}
                </div>

                {/* Highlights & Booking Link */}
                <div className="border-t border-white/5 pt-3 mt-1 flex flex-col gap-3">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-brand-gold">
                      Exclusive Benefit
                    </span>
                    <div className="flex items-start gap-1.5 text-[11px] text-gray-300 mt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="leading-tight font-light">{trans.highlights[0]}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {hotel.bookingUrl && (
                      <a
                        href={hotel.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-brand-gold/10 hover:bg-brand-gold text-brand-gold hover:text-brand-bg-primary text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border border-brand-gold/25 hover:border-transparent"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="truncate">{t.bookOnTrip}</span>
                      </a>
                    )}
                    {hotel.amapUrl && (
                      <a
                        href={hotel.amapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-brand-blue/10 hover:bg-brand-blue text-brand-blue hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border border-brand-blue/25 hover:border-transparent"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{language === "th" ? "แผนที่ Amap" : language === "zh" ? "高德地图" : "Amap Map"}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
