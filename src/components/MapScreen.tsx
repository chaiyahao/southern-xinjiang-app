"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTravelStore } from "../store/useTravelStore";
import { TRANSLATIONS_DATA } from "../data/translations";
import { ITINERARY_DATA } from "../data/travelData";
import { MapPin, Navigation, Compass, AlertCircle, Eye, EyeOff, Mountain } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function MapScreen() {
  const { activeDay, setActiveDay, language, travelerLocations } = useTravelStore();
  const [showSatellite, setShowSatellite] = useState(false);
  const [mapMode, setMapMode] = useState<"vector" | "3d_terrain" | "real_map">("vector");

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [zoom3D, setZoom3D] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotX, setRotX] = useState(0.5); // Rotation angles
  const [rotY, setRotY] = useState(0.6);
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });

  const t = TRANSLATIONS_DATA[language].ui;
  const tItinerary = TRANSLATIONS_DATA[language].itinerary;

  // Group itinerary into distinct geographical stops/segments
  const segments = [
    { from: "Kashgar", to: "Tashkurgan", dist: "300 km", time: "6 hrs", day: 2, route: "Karakoram Highway (KKH)" },
    { from: "Tashkurgan", to: "Tashkurgan", dist: "240 km", time: "5 hrs", day: 3, route: "Panlong Ancient Road loop" },
    { from: "Tashkurgan", to: "Kashgar", dist: "360 km", time: "6.5 hrs", day: 4, route: "Muztagh Ata Glacier descent" },
    { from: "Kashgar", to: "Yecheng", dist: "420 km", time: "6 hrs", day: 5, route: "Zepu Golden Poplar path" },
    { from: "Yecheng", to: "Hotan", dist: "390 km", time: "5.5 hrs", day: 6, route: "Yotkan Ancient City path" },
    { from: "Hotan", to: "Aral", dist: "560 km", time: "8 hrs", day: 7, route: "Taklamakan Desert Highway crossing" },
    { from: "Aral", to: "Aksu", dist: "270 km", time: "4.5 hrs", day: 8, route: "Tomur Grand Canyon path" },
  ];

  // SVG dimensions & mapping coordinates to pixel space
  // Southern Xinjiang coordinates roughly: Longitude [74.5, 83.5], Latitude [37.0, 42.5]
  const mapPoints = [
    { id: 1, name: "Kashgar", coords: [75.98, 39.47], labelPos: "left", days: [1, 4] },
    { id: 2, name: "Karakul Lake", coords: [75.05, 38.43], labelPos: "left", days: [2] },
    { id: 3, name: "Tashkurgan", coords: [75.23, 37.77], labelPos: "bottom", days: [2, 3] },
    { id: 4, name: "Yecheng", coords: [77.26, 37.89], labelPos: "bottom", days: [5] },
    { id: 5, name: "Hotan", coords: [79.92, 37.11], labelPos: "bottom", days: [6] },
    { id: 6, name: "Aral", coords: [81.28, 40.54], labelPos: "right", days: [7] },
    { id: 7, name: "Aksu", coords: [80.26, 41.17], labelPos: "top", days: [8, 9, 10] },
  ];

  const distanceLabels = [
    { from: [75.98, 39.47], to: [75.05, 38.43], text: "196 km", offsetX: -22, offsetY: -5 }, // Kashgar - Karakul
    { from: [75.05, 38.43], to: [75.23, 37.77], text: "104 km", offsetX: -22, offsetY: 0 },  // Karakul - Tashkurgan
    { from: [75.98, 39.47], to: [77.26, 37.89], text: "250 km", offsetX: 22, offsetY: -8 },  // Kashgar - Yecheng
    { from: [77.26, 37.89], to: [79.92, 37.11], text: "290 km", offsetX: 0, offsetY: 12 },   // Yecheng - Hotan
    { from: [79.92, 37.11], to: [81.28, 40.54], text: "560 km", offsetX: 16, offsetY: 0 },   // Hotan - Aral (Desert Highway)
    { from: [81.28, 40.54], to: [80.26, 41.17], text: "120 km", offsetX: -22, offsetY: -8 }, // Aral - Aksu
  ];

  const minLng = 74.2;
  const maxLng = 83.8;
  const minLat = 36.8;
  const maxLat = 42.8;

  const project = (lng: number, lat: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 600;
    const y = 400 - ((lat - minLat) / (maxLat - minLat)) * 400;
    return { x, y };
  };

  // Build the route coordinates line path string
  const getRoutePath = () => {
    let path = "";
    const sequence = [
      [75.98, 39.47], // Kashgar
      [75.05, 38.43], // Karakul
      [75.23, 37.77], // Tashkurgan
      [75.23, 37.77], // Panlong Road
      [75.98, 39.47], // Back to Kashgar
      [77.26, 37.89], // Yecheng
      [79.92, 37.11], // Hotan
      [81.28, 40.54], // Aral
      [80.26, 41.17]  // Aksu
    ];

    sequence.forEach((c, idx) => {
      const { x, y } = project(c[0], c[1]);
      if (idx === 0) path += `M ${x} ${y}`;
      else path += ` L ${x} ${y}`;
    });
    return path;
  };

  const getLocalizedPlace = (name: string) => {
    if (language === "th") {
      if (name.includes("Kashgar")) return "คัชการ์";
      if (name.includes("Tashkurgan")) return "ทัชเคอร์กัน";
      if (name.includes("Hotan")) return "โฮตัน";
      if (name.includes("Yecheng")) return "เย่เฉิง";
      if (name.includes("Aral") || name.includes("Desert")) return "อารัล (Alar)";
      if (name.includes("Aksu")) return "อักซู";
      if (name.includes("Karakul")) return "ทะเลสาบคาราคูล";
    } else if (language === "zh") {
      if (name.includes("Kashgar")) return "喀什";
      if (name.includes("Tashkurgan")) return "塔什库尔干";
      if (name.includes("Hotan")) return "和田";
      if (name.includes("Yecheng")) return "叶城";
      if (name.includes("Aral") || name.includes("Desert")) return "阿拉尔";
      if (name.includes("Aksu")) return "阿克苏";
      if (name.includes("Karakul")) return "卡拉库里湖";
    }
    return name;
  };

  // Coordinates and details for 3D terrain scanner
  const terrainNodes = [
    { name: "Kashgar", alt: 1290, fromCoords: [75.98, 39.47], x: -0.6, y: -0.1, z: 0.1, isHighlighted: [1, 4].includes(activeDay) },
    { name: "Karakul Lake", alt: 3600, fromCoords: [75.05, 38.43], x: -0.7, y: 0.35, z: -0.2, isHighlighted: [2].includes(activeDay) },
    { name: "Tashkurgan", alt: 3090, fromCoords: [75.23, 37.77], x: -0.65, y: 0.25, z: -0.5, isHighlighted: [2, 3].includes(activeDay) },
    { name: "Yecheng", alt: 1370, fromCoords: [77.26, 37.89], x: -0.2, y: -0.08, z: -0.4, isHighlighted: [5].includes(activeDay) },
    { name: "Hotan", alt: 1380, fromCoords: [79.92, 37.11], x: 0.2, y: -0.07, z: -0.6, isHighlighted: [6].includes(activeDay) },
    { name: "Aral", alt: 1010, fromCoords: [81.28, 40.54], x: 0.5, y: -0.15, z: 0.3, isHighlighted: [7].includes(activeDay) },
    { name: "Aksu", alt: 1220, fromCoords: [80.26, 41.17], x: 0.35, y: -0.1, z: 0.5, isHighlighted: [8, 9, 10].includes(activeDay) }
  ];

  // 3D Canvas Projection loop
  useEffect(() => {
    if (mapMode !== "3d_terrain" || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let localRotX = rotX;
    let localRotY = rotY;

    // Generate terrain grid heights
    const gridCols = 15;
    const gridRows = 15;
    const gridPoints: {x: number, y: number, z: number}[] = [];
    
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        // Normalised coords -1 to +1
        const x = (c / (gridCols - 1)) * 2 - 1;
        const z = (r / (gridRows - 1)) * 2 - 1;
        
        // Mathematical topography modeling:
        // High Pamir mountains on left, flat desert basin on right, high Tianshan in back
        let y = -0.15; // baseline
        // 1. Pamir mountains (left-front segment)
        const distToPamir = Math.sqrt(Math.pow(x + 0.6, 2) + Math.pow(z + 0.3, 2));
        y += Math.exp(-distToPamir * 3) * 0.45 * Math.sin(distToPamir * 15 - Math.PI/2);
        
        // 2. Muztagh Ata Peak
        const distToPeak = Math.sqrt(Math.pow(x + 0.7, 2) + Math.pow(z + 0.2, 2));
        y += Math.exp(-distToPeak * 6) * 0.6;
        
        // 3. Tianshan Mountains (back segment, large z)
        if (z > 0.3) {
          y += Math.sin(x * 6) * 0.15 * Math.sin((z - 0.3) * Math.PI);
        }

        gridPoints.push({ x, y, z });
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Auto rotate slowly if not dragging
      if (!isDragging.current) {
        localRotY += 0.003;
      }

      // Projection values
      const cosX = Math.cos(localRotX);
      const sinX = Math.sin(localRotX);
      const cosY = Math.cos(localRotY);
      const sinY = Math.sin(localRotY);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const scale = 220 * zoom3D; // 3D Scale multiplied by zoom
      const fov = 3.0;   // Perspective depth

      const project3D = (pt: {x: number, y: number, z: number}) => {
        // Rotate around Y axis
        const x1 = pt.x * cosY - pt.z * sinY;
        const z1 = pt.x * sinY + pt.z * cosY;
        
        // Rotate around X axis
        const y2 = pt.y * cosX - z1 * sinX;
        const z2 = pt.y * sinX + z1 * cosX;
        
        // Add distance camera view
        const depth = z2 + fov;
        const screenX = cx + (x1 * scale) / depth;
        const screenY = cy - (y2 * scale) / depth; // Y is inverted in canvas
        
        return { x: screenX, y: screenY, visible: depth > 0 };
      };

      // Draw Grid Mesh (Horizontal lines)
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "rgba(94, 168, 255, 0.12)";
      for (let r = 0; r < gridRows; r++) {
        ctx.beginPath();
        for (let c = 0; c < gridCols; c++) {
          const pt = gridPoints[r * gridCols + c];
          const proj = project3D(pt);
          if (c === 0) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.stroke();
      }

      // Draw Grid Mesh (Vertical lines)
      for (let c = 0; c < gridCols; c++) {
        ctx.beginPath();
        for (let r = 0; r < gridRows; r++) {
          const pt = gridPoints[r * gridCols + c];
          const proj = project3D(pt);
          if (r === 0) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.stroke();
      }

      // Draw Travel route connections in 3D
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#e1a63b";
      terrainNodes.forEach((node, idx) => {
        const proj = project3D(node);
        if (idx === 0) ctx.moveTo(proj.x, proj.y);
        else ctx.lineTo(proj.x, proj.y);
      });
      ctx.stroke();

      // Draw City Nodes
      terrainNodes.forEach((node) => {
        const proj = project3D(node);
        if (!proj.visible) return;

        // Draw node circle
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, node.isHighlighted ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = node.isHighlighted ? "#e1a63b" : "#0b2241";
        ctx.strokeStyle = node.isHighlighted ? "#ffffff" : "#5ea8ff";
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        // Draw glowing pulsing effect if highlighted
        if (node.isHighlighted) {
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, 10 + Math.sin(Date.now() / 150) * 3, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(225, 166, 59, 0.4)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw localized name tag
        ctx.fillStyle = node.isHighlighted ? "#e1a63b" : "#a1a1aa";
        ctx.font = node.isHighlighted ? "bold 10px sans-serif" : "9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(getLocalizedPlace(node.name), proj.x, proj.y - 12);
        
        // If highlighted, display altitude stats card
        if (node.isHighlighted) {
          ctx.fillStyle = "rgba(7, 20, 36, 0.85)";
          ctx.strokeStyle = "#e1a63b";
          ctx.lineWidth = 0.5;
          ctx.fillRect(proj.x - 45, proj.y + 10, 90, 16);
          ctx.strokeRect(proj.x - 45, proj.y + 10, 90, 16);
          
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 8px monospace";
          ctx.textAlign = "center";
          ctx.fillText(`ALT: ${node.alt}m`, proj.x, proj.y + 21);
        }
      });

      // HUD Compass & rotation info
      ctx.fillStyle = "rgba(94, 168, 255, 0.4)";
      ctx.font = "8px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`3D SONAR RESOLUTION: 15x15 MESH`, 12, canvas.height - 24);
      ctx.fillText(`RADAR ROT: X=${localRotX.toFixed(2)} Y=${localRotY.toFixed(2)}`, 12, canvas.height - 12);

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [mapMode, rotX, rotY, activeDay]);

  const handleMapMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMapMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y
    });
  };

  const handleMapMouseUp = () => {
    setIsPanning(false);
  };

  const handleMapTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsPanning(true);
    const touch = e.touches[0];
    setPanStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
  };

  const handleMapTouchMove = (e: React.TouchEvent) => {
    if (!isPanning || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPan({
      x: touch.clientX - panStart.x,
      y: touch.clientY - panStart.y
    });
  };

  const handleMapTouchEnd = () => {
    setIsPanning(false);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    prevMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - prevMouse.current.x;
    const deltaY = e.clientY - prevMouse.current.y;
    
    // adjust rotation angles
    setRotY((prev) => prev + deltaX * 0.007);
    setRotX((prev) => Math.max(-Math.PI/3, Math.min(Math.PI/3, prev + deltaY * 0.007)));
    
    prevMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length !== 1) return;
    isDragging.current = true;
    const touch = e.touches[0];
    prevMouse.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - prevMouse.current.x;
    const deltaY = touch.clientY - prevMouse.current.y;
    
    setRotY((prev) => prev + deltaX * 0.007);
    setRotX((prev) => Math.max(-Math.PI/3, Math.min(Math.PI/3, prev + deltaY * 0.007)));
    
    prevMouse.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 animate-fadeIn max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-gold-gradient tracking-tight">
            {t.map}
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            {language === "th"
              ? "แผนที่นำทางซินเจียงตอนใต้แบบโต้ตอบ 2 มิติ หรือผังความชัน 3 มิติ (3D Terrain)"
              : language === "zh"
              ? "交互式南疆环线地图路线展示与三维海拔透视图。"
              : "Interactive visualization of the Southern Xinjiang Legendary Loop with 3D Topography."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex bg-brand-bg-secondary p-0.5 rounded border border-gray-300 text-[10px] font-bold uppercase tracking-wider shadow-sm">
            <button
              onClick={() => {
                setMapMode("vector");
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                mapMode === "vector"
                  ? "bg-brand-gold text-brand-bg-primary font-extrabold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              2D Route Map
            </button>
            <button
              onClick={() => setMapMode("3d_terrain")}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                mapMode === "3d_terrain"
                  ? "bg-brand-gold text-brand-bg-primary font-extrabold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              3D Terrain View
            </button>
            <button
              onClick={() => {
                setMapMode("real_map");
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                mapMode === "real_map"
                  ? "bg-brand-gold text-brand-bg-primary font-extrabold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Real Satellite Map
            </button>
          </div>

          {mapMode === "vector" && (
            <button
              onClick={() => setShowSatellite(!showSatellite)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-brand-bg-secondary border border-brand-gold/30 text-brand-gold text-xs font-bold hover:bg-brand-gold hover:text-brand-bg-primary transition-all duration-300 cursor-pointer"
            >
              {showSatellite ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showSatellite ? "Hide Terrain Grid" : "Show Terrain Grid"}
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Map & Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Canvas (Left) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="glass-panel p-4 rounded-xl border border-white/10 bg-brand-bg-secondary/25 relative overflow-hidden flex flex-col gap-4">
            
            {/* Floating Zoom Controls */}
            <div className="absolute top-6 left-6 z-30 flex flex-col gap-1.5 shadow-md">
              <button
                onClick={() => {
                  if (mapMode === "3d_terrain") setZoom3D((z) => Math.min(2.5, z + 0.15));
                  else setZoom((z) => Math.min(4, z + 0.2));
                }}
                className="w-8 h-8 rounded-lg bg-slate-900/90 border border-brand-gold/30 hover:border-brand-gold text-brand-gold flex items-center justify-center font-bold text-lg cursor-pointer transition-all hover:scale-105"
                title="Zoom In"
              >
                +
              </button>
              <button
                onClick={() => {
                  if (mapMode === "3d_terrain") setZoom3D((z) => Math.max(0.5, z - 0.15));
                  else setZoom((z) => Math.max(0.8, z - 0.2));
                }}
                className="w-8 h-8 rounded-lg bg-slate-900/90 border border-brand-gold/30 hover:border-brand-gold text-brand-gold flex items-center justify-center font-bold text-lg cursor-pointer transition-all hover:scale-105"
                title="Zoom Out"
              >
                -
              </button>
              <button
                onClick={() => {
                  if (mapMode === "3d_terrain") {
                    setZoom3D(1);
                    setRotX(0.5);
                    setRotY(0.6);
                  } else {
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                  }
                }}
                className="w-8 h-8 rounded-lg bg-slate-900/90 border border-brand-gold/30 hover:border-brand-gold text-brand-gold flex items-center justify-center text-xs font-bold cursor-pointer transition-all hover:scale-105"
                title="Reset View"
              >
                ⟲
              </button>
            </div>

            {mapMode === "real_map" ? (
              /* Real Satellite Map — Google Maps with full trip route highlighted */
              <div className="w-full rounded-lg relative overflow-hidden border border-white/10 bg-slate-950 shadow-inner">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent("Kashgar to Tashkurgan to Hotan to Aksu, Xinjiang")}&z=6&output=embed`}
                  className="w-full border-none"
                  style={{ height: "440px" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Southern Xinjiang Trip Route — Live Satellite"
                  allowFullScreen
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur border border-brand-gold/30 px-2.5 py-1 rounded text-[10px] text-gray-800 font-bold flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-brand-gold" />
                  {language === "th" ? "แผนที่ดาวเทียมสด · เส้นทางทริปซินเจียงใต้" : language === "zh" ? "实时卫星图 · 南疆环线路线" : "Live Satellite · Southern Xinjiang Route"}
                </div>
                <a
                  href="https://www.google.com/maps/dir/Kashgar/Tashkurgan/Hotan/Aksu/@38.5,79.0,6z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-3 right-3 bg-brand-gold/95 text-white px-2.5 py-1 rounded text-[10px] font-bold hover:bg-brand-gold transition-colors flex items-center gap-1"
                >
                  {language === "th" ? "เปิดเส้นทาง ↗" : language === "zh" ? "打开路线 ↗" : "Open Route ↗"}
                </a>
              </div>
            ) : mapMode === "3d_terrain" ? (
              /* 3D Terrain Interactive Canvas */
              <div className="w-full aspect-[3/2] rounded-lg relative overflow-hidden border border-white/10 bg-slate-950 shadow-inner flex items-center justify-center cursor-grab active:cursor-grabbing">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="w-full h-full"
                />
                <div className="absolute top-4 right-4 bg-slate-900/90 border border-brand-gold/30 px-3 py-1.5 rounded text-[10px] text-brand-gold font-bold">
                  🖱️ Drag on Map to Rotate 3D Topography
                </div>
              </div>
            ) : (
              /* 2D Vector/Satellite Map Area */
              <div
                className={`w-full aspect-[3/2] rounded-lg relative overflow-hidden transition-all duration-500 border border-white/10 cursor-grab active:cursor-grabbing ${
                  showSatellite
                    ? "bg-slate-950/90 shadow-inner"
                    : "bg-slate-900/60 shadow-inner"
                }`}
                onMouseDown={handleMapMouseDown}
                onMouseMove={handleMapMouseMove}
                onMouseUp={handleMapMouseUp}
                onMouseLeave={handleMapMouseUp}
                onTouchStart={handleMapTouchStart}
                onTouchMove={handleMapTouchMove}
                onTouchEnd={handleMapTouchEnd}
              >
                {/* Satellite/Terrain Grid Effect */}
                {showSatellite ? (
                  <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#5ea8ff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                ) : (
                  <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#e1a63b_1px,transparent_1px)] [background-size:24px_24px]"></div>
                )}

                {/* Decorative Compass Rose */}
                <div className="absolute bottom-6 right-6 opacity-20 flex flex-col items-center pointer-events-none text-brand-gold">
                  <Compass className="w-12 h-12 animate-spin-slow" />
                  <span className="text-[10px] uppercase font-bold tracking-widest mt-1">PAMIR</span>
                </div>

                {/* Vector SVG Route Map */}
                <svg 
                  className="w-full h-full p-6 select-none" 
                  viewBox="0 0 600 400" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ 
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, 
                    transformOrigin: "center", 
                    transition: isPanning ? "none" : "transform 0.1s ease-out" 
                  }}
                >
                  {/* Defs for gradients & filters */}
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E1A63B" />
                      <stop offset="50%" stopColor="#5EA8FF" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Draw Regional Border / Grid Lines */}
                  <line x1="20" y1="20" x2="20" y2="380" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
                  <line x1="580" y1="20" x2="580" y2="380" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
                  <line x1="20" y1="20" x2="580" y2="20" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
                  <line x1="20" y1="380" x2="580" y2="380" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />

                  {/* Tarim Desert Area Text */}
                  <text x="350" y="240" fill="rgba(225,166,59,0.04)" fontSize="20" fontWeight="bold" fontFamily="sans-serif" letterSpacing="6" textAnchor="middle">
                    {language === "zh" ? "塔克拉玛干沙漠" : "TAKLAMAKAN DESERT"}
                  </text>
                  
                  {/* Tianshan Mountains Range Line */}
                  <text x="300" y="70" fill="rgba(94,168,255,0.04)" fontSize="20" fontWeight="bold" fontFamily="sans-serif" letterSpacing="6" textAnchor="middle">
                    {language === "zh" ? "天山山脉" : "TIANSHAN MOUNTAINS"}
                  </text>

                  {/* Draw Route Line Path */}
                  <path
                    d={getRoutePath()}
                    fill="none"
                    stroke="url(#routeGradient)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    opacity="0.85"
                  />

                  {/* Distance Badge Labels */}
                  {distanceLabels.map((lbl, idx) => {
                    const p1 = project(lbl.from[0], lbl.from[1]);
                    const p2 = project(lbl.to[0], lbl.to[1]);
                    const midX = (p1.x + p2.x) / 2;
                    const midY = (p1.y + p2.y) / 2;

                    return (
                      <g key={idx}>
                        <rect 
                          x={midX + lbl.offsetX - 17} 
                          y={midY + lbl.offsetY - 6.5} 
                          width="34" 
                          height="13" 
                          rx="3.5" 
                          fill="#071424" 
                          stroke="#e1a63b" 
                          strokeWidth="0.75" 
                          opacity="0.9"
                        />
                        <text 
                          x={midX + lbl.offsetX} 
                          y={midY + lbl.offsetY + 3} 
                          fill="#e1a63b" 
                          fontSize="7.5" 
                          fontWeight="extrabold" 
                          fontFamily="sans-serif" 
                          textAnchor="middle"
                        >
                          {lbl.text}
                        </text>
                      </g>
                    );
                  })}

                  {/* Draw Animated Glow Points for Segment Links */}
                  {mapPoints.map((point) => {
                    const { x, y } = project(point.coords[0], point.coords[1]);
                    const isHighlighted = point.days.includes(activeDay);

                    return (
                      <g key={point.id} className="cursor-pointer" onClick={() => {
                        if (point.days.length > 0) {
                          setActiveDay(point.days[0]);
                        }
                      }}>
                        {/* Pulsing ring around highlighted location */}
                        {isHighlighted && (
                          <circle
                            cx={x}
                            cy={y}
                            r="10"
                            fill="none"
                            stroke="#E1A63B"
                            strokeWidth="1.5"
                            opacity="0.8"
                            className="animate-pulse"
                          />
                        )}
                        
                        {/* Main Location Node */}
                        <circle
                          cx={x}
                          cy={y}
                          r={isHighlighted ? "6" : "4.5"}
                          fill={isHighlighted ? "#E1A63B" : "#0B2241"}
                          stroke={isHighlighted ? "#FFFFFF" : "#5EA8FF"}
                          strokeWidth="1.5"
                          className="transition-all duration-300 hover:r-7"
                        />

                        {/* Location Text Label */}
                        <text
                          x={x}
                          y={point.labelPos === "top" ? y - 10 : point.labelPos === "bottom" ? y + 15 : y + 4}
                          dx={point.labelPos === "left" ? -10 : point.labelPos === "right" ? 10 : 0}
                          textAnchor={point.labelPos === "left" ? "end" : point.labelPos === "right" ? "start" : "middle"}
                          fill={isHighlighted ? "#E1A63B" : "#A1A1AA"}
                          fontSize={isHighlighted ? "11" : "9.5"}
                          fontWeight={isHighlighted ? "bold" : "normal"}
                          fontFamily="sans-serif"
                        >
                          {getLocalizedPlace(point.name)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Live traveler radar markers */}
                  {Object.entries(travelerLocations)
                    .filter(([id, loc]) => id !== "6" && id !== "5" && !loc.name.includes("NATTARIKA") && !loc.name.includes("NAKARED"))
                    .map(([id, loc]) => {
                    const { x, y } = project(loc.lng, loc.lat);
                    const label = loc.name.split(" ")[0] || loc.name;

                    return (
                      <g key={id} className="pointer-events-none">
                        <circle
                          cx={x}
                          cy={y}
                          r="11"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="1.5"
                          opacity="0.55"
                          className="animate-ping"
                        />
                        <circle
                          cx={x}
                          cy={y}
                          r="4.5"
                          fill="#10B981"
                          stroke="#ECFDF5"
                          strokeWidth="1.5"
                          filter="url(#glow)"
                        />
                        <rect
                          x={x + 7}
                          y={y - 16}
                          width={Math.max(38, label.length * 6 + 12)}
                          height="14"
                          rx="4"
                          fill="#06281B"
                          stroke="#10B981"
                          strokeWidth="0.75"
                          opacity="0.92"
                        />
                        <text
                          x={x + 13}
                          y={y - 6}
                          fill="#D1FAE5"
                          fontSize="8"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}

            {/* Map status info */}
            <div className="flex items-center gap-2 text-xs text-gray-700 bg-brand-bg-primary/50 py-2 px-3 rounded border border-brand-gold/15">
              <AlertCircle className="w-4 h-4 text-brand-blue flex-shrink-0" />
              <span>
                {language === "th"
                  ? "แผนที่แบบโต้ตอบ 3D Terrain เป็นระบบจำลองความต่างระดับความสูง (Altitude Profile) ลากนิ้ว/เมาส์เพื่อหมุนได้ 360 องศา"
                  : "To configure live Mapbox rendering, set your public token inside the environment configurations (`.env.local` as `NEXT_PUBLIC_MAPBOX_TOKEN`). The dashboard has reverted to vector flight routing."}
              </span>
            </div>

            {/* Elevation Profile AreaChart */}
            <div className="glass-panel p-5 rounded-xl border border-brand-gold/15 bg-brand-bg-primary/10 flex flex-col gap-3 shadow mt-1">
              <div className="flex items-center gap-2 border-b border-gray-900/10 pb-2">
                <Mountain className="w-4 h-4 text-brand-gold" />
                <h4 className="text-[10px] font-extrabold text-gray-900 uppercase tracking-wider">
                  {language === "th" ? "แผนภูมิระดับความสูงภูมิประเทศ (Elevation Profile Chart)" : language === "zh" ? "路线地形海拔剖面图" : "Topographic Elevation Profile (Meters)"}
                </h4>
              </div>

              <div className="w-full h-36 text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { day: 1, name: language === "th" ? "คัชการ์" : language === "zh" ? "喀什" : "Kashgar", alt: 1290 },
                      { day: 2, name: language === "th" ? "ทะเลสาบไป๋ซา" : language === "zh" ? "白沙湖" : "Baisha Lk", alt: 3300 },
                      { day: 2, name: language === "th" ? "คาราคูล" : language === "zh" ? "卡拉库里" : "Karakul Lk", alt: 3600 },
                      { day: 3, name: language === "th" ? "ทัชเคอร์กัน" : language === "zh" ? "塔县" : "Tashkurgan", alt: 3090 },
                      { day: 3, name: language === "th" ? "โค้งพานหลง" : language === "zh" ? "盘龙古道" : "Panlong Rd", alt: 4200 },
                      { day: 4, name: language === "th" ? "มุซทัคอาตา" : language === "zh" ? "慕士塔格" : "Muztagh Peak", alt: 4300 },
                      { day: 4, name: language === "th" ? "คัชการ์" : language === "zh" ? "喀什" : "Kashgar", alt: 1290 },
                      { day: 5, name: language === "th" ? "เย่เฉิง" : language === "zh" ? "叶城" : "Yecheng", alt: 1370 },
                      { day: 6, name: language === "th" ? "โฮตัน" : language === "zh" ? "和田" : "Hotan", alt: 1380 },
                      { day: 7, name: language === "th" ? "ทางหลวงทราย" : language === "zh" ? "沙漠公路" : "Desert Hwy", alt: 1100 },
                      { day: 7, name: language === "th" ? "อารัล" : language === "zh" ? "阿拉尔" : "Aral", alt: 1010 },
                      { day: 8, name: language === "th" ? "ทอมูร์แคนยอน" : language === "zh" ? "大峡谷" : "Tomur Cyn", alt: 1600 },
                      { day: 9, name: language === "th" ? "อักซู" : language === "zh" ? "阿克สุ" : "Aksu", alt: 1220 }
                    ]}
                    margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#b5892c" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#b5892c" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#475569" 
                      fontSize={8}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={8}
                      domain={[500, 4800]}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid rgba(181, 137, 44, 0.2)",
                        borderRadius: "8px",
                        color: "#1e293b",
                        fontSize: "10px",
                        padding: "5px 8px"
                      }}
                      formatter={(value: any) => [`${value} m`, "Altitude"]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="alt" 
                      stroke="#b5892c" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#elevationGrad)" 
                    />
                    {/* Active day reference line indicator */}
                    {[
                      { day: 1, name: language === "th" ? "คัชการ์" : language === "zh" ? "喀什" : "Kashgar" },
                      { day: 2, name: language === "th" ? "คาราคูล" : language === "zh" ? "卡拉库里" : "Karakul Lk" },
                      { day: 3, name: language === "th" ? "โค้งพานหลง" : language === "zh" ? "盘龙古道" : "Panlong Rd" },
                      { day: 4, name: language === "th" ? "มุซทัคอาตา" : language === "zh" ? "慕士塔格" : "Muztagh Peak" },
                      { day: 5, name: language === "th" ? "เย่เฉิง" : language === "zh" ? "叶城" : "Yecheng" },
                      { day: 6, name: language === "th" ? "โฮตัน" : language === "zh" ? "和田" : "Hotan" },
                      { day: 7, name: language === "th" ? "อารัล" : language === "zh" ? "阿拉尔" : "Aral" },
                      { day: 8, name: language === "th" ? "ทอมูร์แคนยอน" : language === "zh" ? "大峡谷" : "Tomur Cyn" },
                      { day: 9, name: language === "th" ? "อักซู" : language === "zh" ? "阿克苏" : "Aksu" },
                      { day: 10, name: language === "th" ? "อักซู" : language === "zh" ? "阿克苏" : "Aksu" }
                    ].map((pt, i) => {
                      if (pt.day === activeDay) {
                        return (
                          <ReferenceLine
                            key={i}
                            x={pt.name}
                            stroke="#0284c7"
                            strokeDasharray="2 2"
                            strokeWidth={1.5}
                            label={{ 
                              value: `${language === "th" ? "วันที่" : language === "zh" ? "第" : "Day"} ${activeDay}${language === "zh" ? "天" : ""}`, 
                              position: "top", 
                              fill: "#0284c7", 
                              fontSize: 8, 
                              fontWeight: "bold" 
                            }}
                          />
                        );
                      }
                      return null;
                    })}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Route Segments Details (Right) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col gap-4 flex-1">
            <h3 className="font-display font-bold text-base text-brand-gold flex items-center gap-2 border-b border-white/10 pb-3">
              <Navigation className="w-5 h-5 text-brand-gold" />
              {language === "th" ? "รายละเอียดเส้นทางรายวัน" : language === "zh" ? "每日行车路段明细" : "Route Segments & ETA"}
            </h3>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {segments.map((seg, idx) => {
                const dayTrans = tItinerary[seg.day];
                const isActive = activeDay === seg.day;

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveDay(seg.day)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 flex flex-col gap-1.5 ${
                      isActive
                        ? "bg-brand-gold/10 border-brand-gold/30 text-brand-gold shadow-[0_0_10px_rgba(225,166,59,0.1)]"
                        : "bg-brand-bg-secondary/60 border-gray-900/10 hover:bg-brand-bg-secondary/80 hover:border-gray-900/20"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-extrabold tracking-wider text-brand-blue">
                        {language === "th" ? "ช่วงเดินทางที่" : language === "zh" ? "路段" : "Segment"} {idx + 1}
                      </span>
                      <span className="text-[9px] text-gray-600 font-extrabold">
                        {language === "th" ? "วันที่" : language === "zh" ? "第" : "Day"} {seg.day}{language === "zh" ? "天" : ""}
                      </span>
                    </div>

                    <div className="text-xs font-extrabold text-gray-900">
                      {getLocalizedPlace(seg.from)} → {getLocalizedPlace(seg.to)}
                    </div>

                    <div className="text-[10px] text-gray-700 font-medium italic">
                      {dayTrans.subtitle}
                    </div>

                    <div className="flex justify-between items-center text-[10px] mt-1 pt-1.5 border-t border-gray-900/10 text-gray-700">
                      <span className="flex items-center gap-1 font-semibold">
                        <MapPin className="w-3 h-3 text-brand-gold" />
                        {seg.dist}
                      </span>
                      <span className="font-bold text-gray-800">
                        ETA: ~{seg.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
