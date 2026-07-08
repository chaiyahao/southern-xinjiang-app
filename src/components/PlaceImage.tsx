"use client";

import React, { useState } from "react";

interface PlaceImageProps {
  wikiTitle?: string;
  imageUrl?: string;
  alt: string;
  className?: string;
}

export default function PlaceImage({ wikiTitle, imageUrl, alt, className = "" }: PlaceImageProps) {
  const [failed, setFailed] = useState(false);

  void wikiTitle;

  if (failed || !imageUrl) {
    return null;
  }

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
