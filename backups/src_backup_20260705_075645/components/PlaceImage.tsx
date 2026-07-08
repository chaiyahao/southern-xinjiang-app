"use client";

import React, { useState, useEffect } from "react";
import { Image as ImageIcon } from "lucide-react";

interface PlaceImageProps {
  /** Wikipedia article title to fetch image from (English works best) */
  wikiTitle: string;
  alt: string;
  className?: string;
}

/**
 * PlaceImage — fetches a free-license thumbnail from Wikipedia/Wikimedia Commons
 * via the REST summary API. No image generation; falls back gracefully if no image.
 *
 * Note: Wikipedia/Wikimedia images are CC-licensed and legal to display with attribution.
 */
export default function PlaceImage({ wikiTitle, alt, className = "" }: PlaceImageProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    setSrc(null);

    // Use Wikipedia REST API to get the lead image thumbnail
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`, {
      headers: { Accept: "application/json" },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        const thumb = data?.thumbnail?.source || data?.originalimage?.source;
        if (thumb) {
          setSrc(thumb);
        } else {
          setFailed(true);
        }
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setFailed(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [wikiTitle]);

  if (loading) {
    return (
      <div className={`bg-slate-100 flex items-center justify-center animate-pulse ${className}`}>
        <ImageIcon className="w-6 h-6 text-slate-300" />
      </div>
    );
  }

  if (failed || !src) {
    return (
      <div className={`bg-gradient-to-br from-brand-gold/10 to-brand-blue/10 flex items-center justify-center ${className}`}>
        <div className="text-center px-2">
          <ImageIcon className="w-6 h-6 text-brand-gold/40 mx-auto mb-1" />
          <span className="text-[8px] text-gray-400 font-medium line-clamp-2 px-1">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
      {/* Wikimedia attribution overlay */}
      <a
        href={`https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-0 right-0 bg-black/40 text-white text-[7px] px-1 py-0.5 hover:bg-black/60 transition-colors"
        title="Image: Wikipedia (CC)"
      >
        © Wiki
      </a>
    </div>
  );
}
