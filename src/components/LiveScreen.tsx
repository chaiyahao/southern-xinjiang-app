"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Check,
  Clock,
  Compass,
  Copy,
  ExternalLink,
  Gauge,
  MapPin,
  MessageSquare,
  Pause,
  Play,
  Radio,
  Send,
  ShieldAlert,
  Sun,
  CornerUpLeft,
  Trash2,
  Info,
} from "lucide-react";
import { ITINERARY_DATA } from "../data/travelData";
import { useTravelStore } from "../store/useTravelStore";
import { isSupabaseConfigured, supabase } from "../utils/supabaseClient";
import { formatDisplayName, getParticipantColor, getParticipantById, PARTICIPANTS } from "../utils/travelers";
const REPLY_REGEX = /^\[REPLY_TO:([^:]+):([^:]+):([^\]]+)\]\s*([\s\S]*)$/;

declare global {
  interface Window {
    google?: any;
    initXinjiangGoogleMap?: () => void;
    L?: any;
  }
}

type Lang = "en" | "th" | "zh";
type TravelerLocation = { name: string; lat: number; lng: number; lastUpdated: string };
type ChatMessage = {
  id: string;
  sender: string;
  senderId?: string;
  text: string;
  timestamp: string;
  readBy?: string[];
  deliveredTo?: string[];
};

const CURRENT_TRAVELER_ID = "1";
const CURRENT_TRAVELER_NAME = "CHAIYA WIBOONSANTISUK";
const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const TEXT = {
  th: {
    title: "ข้อมูลนำทางและแจ้งเตือนความปลอดภัย",
    subtitle: "แชร์พิกัดจากอุปกรณ์แต่ละเครื่องแบบเรียลไทม์",
    startGps: "แชร์พิกัดจริงจากอุปกรณ์นี้",
    stopGps: "หยุดแชร์พิกัด",
    simulateOn: "หยุดจำลองตำแหน่ง",
    simulateOff: "จำลองตำแหน่งระหว่างทริป",
    gpsReady: "GPS จริงกำลังแชร์อยู่",
    gpsOff: "ยังไม่ได้แชร์ GPS จริง",
    cloudOn: "Realtime cloud เชื่อมต่อแล้ว",
    cloudOff: "โหมดเครื่องนี้เท่านั้น",
    copyGps: "คัดลอกพิกัด",
    copied: "คัดลอกแล้ว",
    sos: "แชร์พิกัดฉุกเฉิน",
    googleMap: "แผนที่พิกัดกลุ่ม",
    googleKeyMissing: "",
    chat: "แชทกลุ่ม",
    chatPlaceholder: "พิมพ์ข้อความถึงทุกคน...",
    speed: "ความเร็ว",
    eta: "เวลาถึงจุดหมาย",
    altitude: "ความสูง",
    weather: "อากาศ",
    routeStatus: "สถานะเส้นทางสำคัญ",
    alerts: "ประกาศและแจ้งเตือน",
    noAlerts: "ยังไม่มีประกาศฉุกเฉินเพิ่มเติม",
    source: "ที่มา",
    updated: "อัปเดต",
    open: "เปิดปกติ",
    watch: "เฝ้าระวัง",
    openInGoogle: "เปิดใน Google Maps",
  },
  en: {
    title: "Live Navigation & Safety Alerts",
    subtitle: "Realtime GPS sharing from each device.",
    startGps: "Share Real GPS From This Device",
    stopGps: "Stop GPS Sharing",
    simulateOn: "Stop Trip Simulation",
    simulateOff: "Simulate Trip Positions",
    gpsReady: "Real GPS is sharing",
    gpsOff: "Real GPS not shared",
    cloudOn: "Realtime cloud connected",
    cloudOff: "Local-device mode",
    copyGps: "Copy GPS",
    copied: "Copied",
    sos: "Emergency GPS Share",
    googleMap: "Group Location Map",
    googleKeyMissing: "",
    chat: "Group Chat",
    chatPlaceholder: "Message everyone...",
    speed: "Speed",
    eta: "ETA",
    altitude: "Altitude",
    weather: "Weather",
    routeStatus: "Critical Route Status",
    alerts: "Official Notices & Alerts",
    noAlerts: "No additional emergency notices",
    source: "Source",
    updated: "Updated",
    open: "OPEN",
    watch: "WATCH",
    openInGoogle: "Open in Google Maps",
  },
  zh: {
    title: "实时导航与安全提醒",
    subtitle: "实时共享每台设备的 GPS。",
    startGps: "共享本机真实 GPS",
    stopGps: "停止共享 GPS",
    simulateOn: "停止模拟位置",
    simulateOff: "模拟行程位置",
    gpsReady: "正在共享真实 GPS",
    gpsOff: "尚未共享真实 GPS",
    cloudOn: "Realtime cloud 已连接",
    cloudOff: "本机模式",
    copyGps: "复制坐标",
    copied: "已复制",
    sos: "紧急共享坐标",
    googleMap: "团队位置地图",
    googleKeyMissing: "",
    chat: "群聊",
    chatPlaceholder: "发送消息给所有人...",
    speed: "速度",
    eta: "预计到达",
    altitude: "海拔",
    weather: "天气",
    routeStatus: "重要道路状态",
    alerts: "官方通知与提醒",
    noAlerts: "暂无额外紧急通知",
    source: "来源",
    updated: "更新",
    open: "开放",
    watch: "注意",
    openInGoogle: "在 Google Maps 打开",
  },
};

function getText(language: Lang) {
  return TEXT[language] || TEXT.en;
}

function nowLabel() {
  return new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
}

function getTimestampMs(tStr: any): number {
  if (!tStr) return 0;
  const parsed = new Date(tStr).getTime();
  return isNaN(parsed) ? 0 : parsed;
}

function parseDriveMinutes(driveTime?: string) {
  if (!driveTime) return 120;
  const hourMatch = driveTime.match(/([\d.]+)\s*(?:hrs?|hours?)/i);
  const minuteMatch = driveTime.match(/([\d.]+)\s*(?:mins?|minutes?)/i);
  return Math.max(
    1,
    Math.round((hourMatch ? parseFloat(hourMatch[1]) * 60 : 0) + (minuteMatch ? parseFloat(minuteMatch[1]) : 0)) || 120
  );
}

function googleMapsLink(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

function googleIframeSrc(lat: number, lng: number) {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=12&output=embed`;
}

function googleStaticMapSrc(locations: Array<[string, TravelerLocation]>) {
  const markers = locations
    .slice(0, 10)
    .map(([id, loc]) => `markers=color:${id === CURRENT_TRAVELER_ID ? "gold" : "green"}%7Clabel:${encodeURIComponent(id)}%7C${loc.lat},${loc.lng}`)
    .join("&");
  const center = locations[0]?.[1] || { lat: 39.47, lng: 75.98 };
  return `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=9&size=1200x720&maptype=roadmap&${markers}&key=${GOOGLE_MAPS_KEY}`;
}

interface MessageBubbleProps {
  msg: ChatMessage;
  currentUserId: string;
  me: string;
  activeTab: string;
  onVisible: (msgId: string) => void;
  onShowReceipts: (msg: ChatMessage) => void;
  formatMsgTime: (timestamp: string) => string;
  setSelectedMessage: (msg: ChatMessage) => void;
  language: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  msg,
  currentUserId,
  me,
  activeTab,
  onVisible,
  onShowReceipts,
  formatMsgTime,
  setSelectedMessage,
  language,
}) => {
  const { visitorName } = useTravelStore();
  const isMe = useMemo(() => {
    if (!msg.sender) return false;
    const senderClean = msg.sender.toLowerCase().trim();
    const meClean = me.toLowerCase().trim();
    const visitorClean = (visitorName || "").toLowerCase().trim();
    
    return (
      senderClean === meClean ||
      senderClean === visitorClean ||
      senderClean.includes(meClean) ||
      (visitorClean && senderClean.includes(visitorClean)) ||
      meClean.includes(senderClean) ||
      (visitorClean && visitorClean.includes(senderClean)) ||
      (msg.senderId && msg.senderId === currentUserId)
    );
  }, [msg.sender, msg.senderId, me, visitorName, currentUserId]);
  
  const bubbleRef = useRef<HTMLDivElement>(null);
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isLongPressActiveRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    isLongPressActiveRef.current = false;
    
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    
    touchTimerRef.current = setTimeout(() => {
      isLongPressActiveRef.current = true;
      setSelectedMessage(msg);
      if (navigator.vibrate) {
        try { navigator.vibrate(55); } catch {}
      }
      touchTimerRef.current = null;
    }, 550);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
    if (isLongPressActiveRef.current) {
      e.preventDefault();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !touchTimerRef.current) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartRef.current.x);
    const dy = Math.abs(touch.clientY - touchStartRef.current.y);
    
    if (dx > 8 || dy > 8) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedMessage(msg);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isLongPressActiveRef.current) {
      e.preventDefault();
      return;
    }
    setSelectedMessage(msg);
  };

  useEffect(() => {
    if (!bubbleRef.current || isMe) return;
    const isReadByMe = msg.readBy && msg.readBy.includes(currentUserId);
    if (isReadByMe) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const isViewingChat = activeTab === "live" && typeof document !== "undefined" && document.hasFocus();
          if (isViewingChat) {
            onVisible(msg.id);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(bubbleRef.current);
    return () => observer.disconnect();
  }, [msg.id, msg.readBy, activeTab, isMe, currentUserId]);

  let statusText = "";
  if (isMe) {
    const readers = (msg.readBy || []).filter((id) => id !== currentUserId);
    const deliverees = (msg.deliveredTo || []).filter((id) => id !== currentUserId);
    if (readers.length > 0) {
      statusText = `Read by ${readers.length}`;
    } else if (deliverees.length > 0) {
      statusText = "Delivered";
    } else {
      statusText = "Sent";
    }
  }

  const match = msg.text.match(REPLY_REGEX);
  let replyBlock = null;
  let displayText = msg.text;

  if (match) {
    const replyId = match[1];
    const replySender = match[2];
    const replyText = match[3];
    displayText = match[4];

    replyBlock = (
      <div className="mb-1 border-l-2 pl-2 text-[9px] py-0.5 px-1.5 flex flex-col gap-0.5 rounded-lg border bg-sky-50/90 border-sky-200 text-sky-950">
        <span className="font-bold text-sky-900">{formatDisplayName(replySender, "nickname")}</span>
        <span className="truncate max-w-[150px] text-sky-800 font-medium">{replyText}</span>
      </div>
    );
  }

  const matchTraveler = PARTICIPANTS.find(
    (p) => p.nickname === msg.sender || p.fullName === msg.sender || p.id === msg.senderId
  );
  const avatarColor = matchTraveler ? matchTraveler.color : "#64748b";
  const avatarInitials = matchTraveler ? matchTraveler.nickname.slice(0, 2) : msg.sender.slice(0, 2);

  return (
    <div ref={bubbleRef} className={`flex items-start gap-2 max-w-[85%] text-[11px] my-1 ${isMe ? "self-end flex-row-reverse" : "self-start flex-row"}`}>
      {!isMe && (
        <div
          style={{ backgroundColor: avatarColor }}
          className="w-7 h-7 rounded-full flex items-center justify-center text-white font-extrabold text-[10px] uppercase shadow-sm shrink-0 select-none"
          title={formatDisplayName(msg.sender, "combined")}
        >
          {avatarInitials}
        </div>
      )}

      <div className="flex flex-col">
        {!isMe && (
          <div className="text-[9px] text-gray-500 font-bold mb-0.5 text-left">
            {formatDisplayName(msg.sender, "nickname")}
          </div>
        )}

        <div className={`flex items-end gap-1 ${isMe ? "justify-end flex-row" : "justify-start flex-row"}`}>
          <div
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onTouchCancel={handleTouchEnd}
            className={`rounded-2xl px-3 py-2 text-left break-words cursor-pointer select-none active:scale-[0.98] transition-all relative ${
              isMe
                ? "bg-brand-gold text-brand-bg-primary rounded-tr-none shadow-sm"
                : "bg-white border border-slate-200 text-gray-700 rounded-tl-none shadow-sm"
            }`}
            style={{ minWidth: "85px" }}
          >
            {replyBlock}
            <div className="pr-6 pb-2.5">{displayText}</div>
            <span className="absolute bottom-1 right-2 text-[7px] text-gray-400 font-bold leading-none select-none">
              {formatMsgTime(msg.timestamp)}
            </span>
          </div>
        </div>

        {isMe && statusText && (
          <div className="text-[7.5px] text-gray-400 font-extrabold mt-0.5 text-right select-none">
            {statusText.startsWith("Read by") ? (
              <button
                type="button"
                onClick={() => onShowReceipts(msg)}
                className="hover:underline font-black text-brand-blue"
              >
                {statusText}
              </button>
            ) : (
              <span>{statusText}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const globalDeletedMsgIds = new Set<string>();

export default function LiveScreen() {
  const {
    activeTab,
    activeDay,
    chatMessages,
    isSimulating,
    language,
    telemetry,
    toggleSimulation,
    travelerLocations,
    updateTelemetry,
    updateTravelerLocation,
    visitorName,
  } = useTravelStore();

  const t = getText(language);
  const activeItinerary = ITINERARY_DATA[activeDay - 1];
  const [chatInput, setChatInput] = useState("");
  const [copiedGps, setCopiedGps] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [isSharingGps, setIsSharingGps] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [aqi, setAqi] = useState(24);
  const [uvIndex, setUvIndex] = useState(8.2);
  const [leafletReady, setLeafletReady] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const leafletMarkersRef = useRef<Record<string, any>>({});

  const currentLocation = travelerLocations[CURRENT_TRAVELER_ID] || {
    name: CURRENT_TRAVELER_NAME,
    lat: activeItinerary?.coordinates?.[1] || 39.47,
    lng: activeItinerary?.coordinates?.[0] || 75.98,
    lastUpdated: nowLabel(),
  };

  const visibleTravelers = useMemo(() => {
    return Object.entries(travelerLocations).filter(([, loc]) => Number.isFinite(loc.lat) && Number.isFinite(loc.lng));
  }, [travelerLocations]);

  const progressPercent = Math.max(
    5,
    Math.min(98, ((parseDriveMinutes(activeItinerary?.driveTime) - telemetry.etaMinutes) / parseDriveMinutes(activeItinerary?.driveTime)) * 100)
  );

  const [toast, setToast] = useState<{ sender: string; text: string } | null>(null);
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [infoMessage, setInfoMessage] = useState<ChatMessage | null>(null);
  const [typingUsers, setTypingUsers] = useState<Array<{ userId: string; name: string }>>([]);
  const [messageDetailsModal, setMessageDetailsModal] = useState<any | null>(null);
  const seenMsgIdsRef = useRef<Set<string>>(new Set());
  const firstUnreadMessageIdRef = useRef<string | null>(null);
  const isNearBottomRef = useRef(true);
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingMsgIdsRef = useRef<Set<string>>(new Set());

  // Play synthetic audio notification
  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.error(e);
    }
  };

  const triggerPushNotification = (sender: string, text: string) => {
    try {
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification(`New message from ${sender}`, {
          body: text,
        });
      }
    } catch (e) {
      console.warn("Push notification permission or constructor error:", e);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleScroll = () => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    const nearBottom = scrollHeight - scrollTop - clientHeight < 50;
    isNearBottomRef.current = nearBottom;
    if (nearBottom) {
      setShowNewMessageButton(false);
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const currentUserId = useMemo(() => {
    if (!visitorName) return "1"; // Default to CHAIYA/Hao
    const query = visitorName.toLowerCase();
    const match = PARTICIPANTS.find(
      (p) =>
        p.id === visitorName ||
        query.includes(p.nickname.toLowerCase()) ||
        query.includes(p.fullName.toLowerCase()) ||
        p.nickname.toLowerCase().includes(query) ||
        p.fullName.toLowerCase().includes(query)
    );
    return match ? match.id : "1";
  }, [visitorName]);

  const me = useMemo(() => {
    const participant = PARTICIPANTS.find((p) => p.id === currentUserId);
    return participant ? participant.nickname : (visitorName || "Chaiya");
  }, [currentUserId, visitorName]);

  useEffect(() => {
    if (!chatRef.current) return;

    if (seenMsgIdsRef.current.size === 0) {
      const firstUnread = chatMessages.find(
        (msg) => msg.sender !== me && (!msg.readBy || !msg.readBy.includes(currentUserId))
      );
      if (firstUnread) {
        firstUnreadMessageIdRef.current = firstUnread.id;
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
      chatMessages.forEach((msg) => seenMsgIdsRef.current.add(msg.id));
      return;
    }

    const incoming = chatMessages.filter((msg) => !seenMsgIdsRef.current.has(msg.id));
    if (incoming.length > 0) {
      incoming.forEach((msg) => seenMsgIdsRef.current.add(msg.id));

      if (isNearBottomRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      } else {
        const hasOther = incoming.some((msg) => msg.sender !== me);
        if (hasOther) {
          setShowNewMessageButton(true);
        }
      }

      // Always play audio beep when a new message from someone else arrives
      const incomingFromOther = incoming.filter((msg) => msg.sender !== me && msg.sender !== "SYSTEM");
      if (incomingFromOther.length > 0) {
        playNotificationSound();

        // Visual notification (Toast & Push) only when not actively focusing/viewing the chat
        const isViewingChat = activeTab === "live" && typeof document !== "undefined" && document.hasFocus();
        if (!isViewingChat) {
          const lastMsg = incomingFromOther[incomingFromOther.length - 1];
          setToast({ sender: lastMsg.sender, text: lastMsg.text });
          triggerPushNotification(lastMsg.sender, lastMsg.text);
        }
      }

      // Handle incoming SOS messages from other users
      const incomingSos = incoming.filter((msg) => {
        const isSos = msg.text.startsWith("🚨 SOS Emergency Location");
        if (!isSos) return false;
        // Check if we are the sender
        const isFromMe = msg.text.includes(`From: ${(visitorName || CURRENT_TRAVELER_NAME).replace(/\s*\([^)]*\)/g, "").toUpperCase()}`);
        return !isFromMe;
      });

      if (incomingSos.length > 0) {
        playNotificationSound();
        const lastSos = incomingSos[incomingSos.length - 1];
        const matchFrom = lastSos.text.match(/From:\s*([^\n]+)/);
        const sosSenderName = matchFrom ? matchFrom[1].trim() : "Emergency";
        const matchTraveler = PARTICIPANTS.find(
          (p) => p.fullName.toUpperCase().includes(sosSenderName.toUpperCase()) || sosSenderName.toUpperCase().includes(p.fullName.toUpperCase())
        );
        const displayName = matchTraveler ? formatDisplayName(matchTraveler.id, "combined") : sosSenderName;
        const notifyTitle = `🚨 SOS Emergency Location from ${displayName}`;
        
        setToast({ sender: "SYSTEM", text: notifyTitle });
        triggerPushNotification(notifyTitle, "SOS Emergency Location");
      }
    }
  }, [chatMessages, me, activeTab, currentUserId, visitorName]);

  useEffect(() => {
    if (!currentUserId || currentUserId === "unknown" || !chatMessages.length) return;
    const undeliveredMsgIds = chatMessages
      .filter((msg) => msg.sender !== me && (!msg.deliveredTo || !msg.deliveredTo.includes(currentUserId)))
      .map((msg) => msg.id);

    if (undeliveredMsgIds.length > 0) {
      fetch("/api/live-chat/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          messageIds: undeliveredMsgIds,
          status: "delivered",
        }),
      }).catch(() => {});
    }
  }, [chatMessages, currentUserId, me]);


  const sortedMessages = useMemo(() => {
    return [...chatMessages].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [chatMessages]);

  const formatMsgTime = (timestampStr: string) => {
    try {
      const d = new Date(timestampStr);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    } catch {
      return "";
    }
  };

  const getDateDividerText = (timestampStr: string) => {
    try {
      const date = new Date(timestampStr);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return language === "th" ? "วันนี้" : "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        return language === "th" ? "เมื่อวาน" : "Yesterday";
      } else {
        return date.toLocaleDateString(language === "th" ? "th-TH" : "en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    } catch {
      return "";
    }
  };

  const handleMessageVisible = async (msgId: string) => {
    if (!currentUserId || currentUserId === "unknown") return;
    try {
      await fetch("/api/live-chat/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          messageIds: [msgId],
          status: "read",
        }),
      });
    } catch (e) {
      console.warn("Failed to mark message as read:", e);
    }
  };

  const reportTypingStatus = async (isTyping: boolean) => {
    if (!currentUserId || currentUserId === "unknown") return;
    try {
      await fetch("/api/live-chat/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          name: visitorName || CURRENT_TRAVELER_NAME,
          isTyping,
        }),
      });
    } catch {}
  };

  useEffect(() => {
    if (!isSimulating || isSharingGps) return;
    const interval = setInterval(() => {
      const [baseLng, baseLat] = activeItinerary?.coordinates || [75.98, 39.47];
      Object.keys(travelerLocations).forEach((id, index) => {
        const offset = (index - 2.5) * 0.003;
        updateTravelerLocation(id, baseLat + offset, baseLng + offset);
      });
      updateTelemetry((prev) => ({
        ...prev,
        speedKmh: Math.max(35, Math.min(110, prev.speedKmh + Math.floor(Math.random() * 7) - 3)),
        etaMinutes: Math.max(0, prev.etaMinutes - (Math.random() > 0.65 ? 1 : 0)),
      }));
      setAqi((prev) => Math.max(12, Math.min(65, prev + Math.floor(Math.random() * 3) - 1)));
      setUvIndex((prev) => Math.max(0, Math.min(12, Number((prev + Math.random() * 0.4 - 0.2).toFixed(1)))));
    }, 2000);
    return () => clearInterval(interval);
  }, [activeItinerary, isSharingGps, isSimulating, travelerLocations, updateTelemetry, updateTravelerLocation]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const client = supabase;

    const locationChannel = client
      .channel("traveler-locations-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "traveler_locations" }, (payload) => {
        const row = payload.new as { traveler_id?: string; lat?: number; lng?: number };
        if (row?.traveler_id && typeof row.lat === "number" && typeof row.lng === "number") {
          updateTravelerLocation(row.traveler_id, row.lat, row.lng);
        }
      })
      .subscribe();

    const chatChannel = client
      .channel("travel-chat-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "travel_chat_messages" }, (payload) => {
        if (payload.eventType === "INSERT") {
          const row = payload.new as { id: string; sender: string; text: string; created_at: string };
          const nextMessage: ChatMessage = {
            id: row.id,
            sender: row.sender,
            text: row.text,
            timestamp: row.created_at,
          };
          useTravelStore.setState((state) => {
            if (state.chatMessages.some((msg) => msg.id === nextMessage.id)) return state;
            const updated = [...state.chatMessages, nextMessage];
            if (typeof window !== "undefined") localStorage.setItem("chatMessages", JSON.stringify(updated));
            return { chatMessages: updated };
          });
        } else if (payload.eventType === "DELETE") {
          const row = payload.old as { id?: string };
          if (row?.id) {
            useTravelStore.setState((state) => {
              const updated = state.chatMessages.filter((msg) => msg.id !== row.id);
              if (typeof window !== "undefined") localStorage.setItem("chatMessages", JSON.stringify(updated));
              return { chatMessages: updated };
            });
          }
        }
      })
      .subscribe();

    client
      .from("traveler_locations")
      .select("traveler_id,name,lat,lng,updated_at")
      .then(({ data }) => {
        data?.forEach((row) => {
          if (typeof row.lat === "number" && typeof row.lng === "number") updateTravelerLocation(row.traveler_id, row.lat, row.lng);
        });
      });

    client
      .from("travel_chat_messages")
      .select("id,sender,text,created_at")
      .order("created_at", { ascending: true })
      .limit(100)
      .then(({ data }) => {
        if (!data?.length) return;
        useTravelStore.setState((state) => {
          const existing = new Set(state.chatMessages.map((msg) => msg.id));
          const merged = [
            ...state.chatMessages,
            ...data
              .filter((row) => !existing.has(row.id))
              .map((row) => ({ id: row.id, sender: row.sender, text: row.text, timestamp: row.created_at })),
          ];
          if (typeof window !== "undefined") localStorage.setItem("chatMessages", JSON.stringify(merged));
          return { chatMessages: merged };
        });
      });

    return () => {
      client.removeChannel(locationChannel);
      client.removeChannel(chatChannel);
    };
  }, [updateTravelerLocation]);

  useEffect(() => {
    let cancelled = false;

    const syncLiveState = async () => {
      let supabaseSuccess = false;
      try {
        if (isSupabaseConfigured && supabase) {
          // 1. Fetch from Supabase directly as a backup to Realtime subscriptions
          const [chatRes, locRes] = await Promise.all([
            supabase
              .from("travel_chat_messages")
              .select("id,sender,text,created_at")
              .order("created_at", { ascending: true })
              .limit(100),
            supabase
              .from("traveler_locations")
              .select("traveler_id,name,lat,lng,updated_at")
          ]);

          if (cancelled) return;

          if (chatRes.error || locRes.error) {
            throw new Error(chatRes.error?.message || locRes.error?.message || "Supabase query error");
          }

          const chatDataList = chatRes.data;
          const locDataList = locRes.data;

          if (chatDataList && Array.isArray(chatDataList)) {
            useTravelStore.setState((state) => {
              const msgMap = new Map<string, any>();
              state.chatMessages.forEach((msg) => msgMap.set(msg.id, msg));
              chatDataList.forEach((m: any) => {
                msgMap.set(m.id, {
                  id: m.id,
                  sender: m.sender,
                  text: m.text,
                  timestamp: m.created_at,
                });
              });
              const merged = Array.from(msgMap.values());
              const sorted = merged.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
              if (typeof window !== "undefined") localStorage.setItem("chatMessages", JSON.stringify(sorted));
              return { chatMessages: sorted };
            });
          }

          if (locDataList && Array.isArray(locDataList)) {
            locDataList.forEach((loc) => {
              if (loc.traveler_id && Number.isFinite(loc.lat) && Number.isFinite(loc.lng)) {
                updateTravelerLocation(loc.traveler_id, loc.lat, loc.lng);
              }
            });
          }
          supabaseSuccess = true;
        }
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to local APIs:", err);
      }

      // 2. Fallback to local APIs if Supabase fails or is disabled
      if (!supabaseSuccess) {
        try {
          const [chatResponse, locationResponse] = await Promise.all([
            fetch(`/api/live-chat?t=${Date.now()}`, { cache: "no-store" }),
            fetch(`/api/traveler-locations?t=${Date.now()}`, { cache: "no-store" }),
          ]);
          const chatData = await chatResponse.json();
          const locationData = await locationResponse.json();

          if (cancelled) return;

          if (Array.isArray(chatData.messages)) {
            // Clean up pending messages that have arrived on server
            chatData.messages.forEach((m: any) => {
              pendingMsgIdsRef.current.delete(m.id);
            });

            // Server-reported deleted IDs
            const deletedIds = Array.isArray(chatData.deletedIds) ? new Set(chatData.deletedIds) : new Set();

            if (Array.isArray(chatData.typing)) {
              setTypingUsers(chatData.typing);
            } else {
              setTypingUsers([]);
            }

            useTravelStore.setState((state) => {
              const msgMap = new Map<string, any>();
              
              // 1. Add all existing local/Zustand messages
              state.chatMessages.forEach((msg) => {
                msgMap.set(msg.id, msg);
              });

              // 2. Add/update messages from the server response, filtering out deleted ones
              chatData.messages.forEach((m: any) => {
                if (globalDeletedMsgIds.has(m.id) || deletedIds.has(m.id)) {
                  msgMap.delete(m.id);
                } else {
                  msgMap.set(m.id, {
                    id: m.id,
                    sender: m.sender,
                    senderId: m.senderId,
                    text: m.text,
                    timestamp: m.timestamp,
                    readBy: m.readBy || [],
                    deliveredTo: m.deliveredTo || [],
                  });
                }
              });

              // 3. Keep our local pending optimistic messages even if they aren't on the server yet
              // and filter out deleted messages
              globalDeletedMsgIds.forEach((id) => msgMap.delete(id));
              deletedIds.forEach((id: any) => msgMap.delete(id));

              const merged = Array.from(msgMap.values());
              
              // 4. Stable sort by timestamp (and fallback to ID comparison)
              const sorted = merged.sort((a, b) => {
                const tA = getTimestampMs(a.timestamp);
                const tB = getTimestampMs(b.timestamp);
                if (tA !== tB) return tA - tB;
                return a.id.localeCompare(b.id);
              });
              
              // Check if there is an actual change to prevent state thrashing
              const isSame = state.chatMessages.length === sorted.length && 
                             state.chatMessages.every((msg: any, idx) => {
                               const sameId = msg.id === sorted[idx].id;
                               const sameText = msg.text === sorted[idx].text;
                               const sameSender = msg.sender === sorted[idx].sender;
                               const t1 = getTimestampMs(msg.timestamp);
                               const t2 = getTimestampMs(sorted[idx].timestamp);
                               const sameReadCount = (msg.readBy || []).length === (sorted[idx].readBy || []).length;
                               const sameDeliveredCount = (msg.deliveredTo || []).length === (sorted[idx].deliveredTo || []).length;
                               return sameId && sameText && sameSender && t1 === t2 && sameReadCount && sameDeliveredCount;
                             });
              if (isSame) return state;
              
              if (typeof window !== "undefined") localStorage.setItem("chatMessages", JSON.stringify(sorted));
              return { chatMessages: sorted };
            });
          }

          if (Array.isArray(locationData.locations)) {
            locationData.locations.forEach((loc: {
              traveler_id: string;
              lat: number;
              lng: number;
              is_sharing_gps?: boolean;
              speed_kmh?: number;
              accuracy?: number;
              last_active_time?: number;
              online_since?: number;
              last_online?: number;
            }) => {
              if (loc.traveler_id && Number.isFinite(loc.lat) && Number.isFinite(loc.lng)) {
                updateTravelerLocation(loc.traveler_id, loc.lat, loc.lng, {
                  isSharingGps: loc.is_sharing_gps,
                  speedKmh: loc.speed_kmh,
                  accuracy: loc.accuracy,
                  lastActiveTime: loc.last_active_time,
                  onlineSince: loc.online_since,
                  lastOnline: loc.last_online,
                });
              }
            });
          }
        } catch (localErr) {
          console.warn("Local API sync failed:", localErr);
        }
      }
    };

    syncLiveState();
    const interval = setInterval(syncLiveState, 1500);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [updateTravelerLocation]);

  useEffect(() => {
    // Periodically report presence (Online) even if GPS sharing is stopped
    const presenceInterval = setInterval(async () => {
      if (!isSharingGps) {
        await publishLocation(CURRENT_TRAVELER_ID, {
          name: visitorName || CURRENT_TRAVELER_NAME,
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          lastUpdated: nowLabel(),
        }, {
          isSharingGps: false,
          lastActiveTime: Date.now(),
        });
      }
    }, 15000);

    return () => clearInterval(presenceInterval);
  }, [isSharingGps, visitorName, currentLocation.lat, currentLocation.lng]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).L) {
      setLeafletReady(true);
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => setLeafletReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!leafletReady || !googleMapRef.current || typeof window === "undefined") return;
    const L = (window as any).L;
    if (!L) return;

    const center = [currentLocation.lat, currentLocation.lng];

    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(googleMapRef.current).setView(center, 10);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(leafletMapRef.current);
    } else {
      leafletMapRef.current.setView(center);
    }

    const map = leafletMapRef.current;

    const getTravelerStatus = (tLoc: any) => {
      const now = Date.now();
      const lastActive = tLoc.lastActiveTime || 0;
      const isOffline = now - lastActive > 120000;
      if (isOffline) {
        return { label: "Offline", dotColor: "⚫" };
      }
      if (tLoc.isSharingGps) {
        return { label: "Online (GPS On)", dotColor: "🟢" };
      }
      return { label: "Online", dotColor: "🟢" };
    };

    visibleTravelers.forEach(([id, loc]) => {
      const pos: [number, number] = [loc.lat, loc.lng];
      const nickname = formatDisplayName(id, "nickname");
      const combinedName = formatDisplayName(id, "combined");
      const statusObj = getTravelerStatus(loc);

      const customIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `<div style="background-color: #0f172a; color: white; padding: 2px 6px; font-weight: bold; border-radius: 4px; font-size: 10px; border: 1px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3); white-space: nowrap; text-align: center;">${nickname}</div>`,
        iconAnchor: [15, 10]
      });

      let popupContent = `
        <div style="font-family: sans-serif; font-size: 11px; line-height: 1.4; min-width: 150px;">
          <b style="font-size: 12px; color: #0f172a">${combinedName}</b><br/>
          <b>สถานะ:</b> ${statusObj.dotColor} ${statusObj.label}<br/>
          <b>อัปเดตล่าสุด:</b> ${loc.lastUpdated || "Just now"}
      `;
      if (loc.speedKmh !== undefined && loc.speedKmh > 0) {
        popupContent += `<br/><b>ความเร็ว:</b> ${loc.speedKmh} km/h`;
      }
      if (loc.accuracy !== undefined) {
        popupContent += `<br/><b>ความถูกต้อง (GPS):</b> ±${loc.accuracy}m`;
      }
      popupContent += `</div>`;

      if (!leafletMarkersRef.current[id]) {
        leafletMarkersRef.current[id] = L.marker(pos, { icon: customIcon })
          .addTo(map)
          .bindPopup(popupContent);
      } else {
        leafletMarkersRef.current[id].setLatLng(pos);
        leafletMarkersRef.current[id].setIcon(customIcon);
        leafletMarkersRef.current[id].getPopup().setContent(popupContent);
      }
    });

    Object.keys(leafletMarkersRef.current).forEach((id) => {
      if (!visibleTravelers.some(([travelerId]) => travelerId === id)) {
        leafletMarkersRef.current[id].remove();
        delete leafletMarkersRef.current[id];
      }
    });
  }, [leafletReady, currentLocation.lat, currentLocation.lng, visibleTravelers]);

  async function publishLocation(
    id: string,
    loc: TravelerLocation,
    extra?: { isSharingGps?: boolean; speedKmh?: number; accuracy?: number; lastActiveTime?: number }
  ) {
    updateTravelerLocation(id, loc.lat, loc.lng, extra);
    
    let publishedOnSupabase = false;
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("traveler_locations").upsert(
          {
            traveler_id: id,
            name: loc.name,
            lat: loc.lat,
            lng: loc.lng,
            updated_at: new Date().toISOString(),
            is_sharing_gps: extra?.isSharingGps,
            speed_kmh: extra?.speedKmh,
            accuracy: extra?.accuracy,
            last_active_time: extra?.lastActiveTime || Date.now(),
          },
          { onConflict: "traveler_id" }
        );
        if (!error) {
          publishedOnSupabase = true;
        } else {
          console.warn("Supabase traveler_locations upsert failed, trying local API:", error);
        }
      } catch (err) {
        console.warn("Supabase traveler_locations upsert error, trying local API:", err);
      }
    }

    if (!publishedOnSupabase) {
      await fetch("/api/traveler-locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          traveler_id: id,
          name: loc.name,
          lat: loc.lat,
          lng: loc.lng,
          is_sharing_gps: extra?.isSharingGps,
          speed_kmh: extra?.speedKmh,
          accuracy: extra?.accuracy,
          last_active_time: extra?.lastActiveTime || Date.now(),
        }),
      }).catch(() => undefined);
    }
  }

  async function publishChatMessage(sender: string, text: string) {
    const message: ChatMessage = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      sender,
      senderId: currentUserId,
      text,
      timestamp: new Date().toISOString(),
      readBy: currentUserId ? [currentUserId] : [],
      deliveredTo: currentUserId ? [currentUserId] : [],
    };

    pendingMsgIdsRef.current.add(message.id);

    useTravelStore.setState((state) => {
      const updated = [...state.chatMessages, message];
      if (typeof window !== "undefined") localStorage.setItem("chatMessages", JSON.stringify(updated));
      return { chatMessages: updated };
    });

    let publishedOnSupabase = false;
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("travel_chat_messages").insert({
          id: message.id,
          sender: message.sender,
          text: message.text,
          created_at: message.timestamp,
        });
        if (!error) {
          publishedOnSupabase = true;
        } else {
          console.warn("Supabase travel_chat_messages insert failed, trying local API:", error);
        }
      } catch (err) {
        console.warn("Supabase travel_chat_messages insert error, trying local API:", err);
      }
    }

    if (!publishedOnSupabase) {
      await fetch("/api/live-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      }).catch(() => undefined);
    }
  }
  async function unsendChatMessage(id: string) {
    globalDeletedMsgIds.add(id);

    useTravelStore.setState((state) => {
      const updated = state.chatMessages.filter((msg) => msg.id !== id);
      if (typeof window !== "undefined") localStorage.setItem("chatMessages", JSON.stringify(updated));
      return { chatMessages: updated };
    });

    if (isSupabaseConfigured && supabase) {
      await supabase.from("travel_chat_messages").delete().eq("id", id);
    } else {
      await fetch(`/api/live-chat?id=${id}`, {
        method: "DELETE",
      }).catch(() => undefined);
    }
  }
  const lastPublishTimeRef = useRef<number>(0);
  const lastPublishedCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3; // meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  function startGpsSharing() {
    if (!navigator.geolocation) {
      setGpsError(language === "th" ? "เบราว์เซอร์นี้ไม่รองรับ GPS" : "Geolocation is not supported.");
      return;
    }
    setGpsError("");
    if (isSimulating) toggleSimulation();
    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setIsSharingGps(true);
        updateTelemetry((prev) => ({
          ...prev,
          lat,
          lng,
          speedKmh: position.coords.speed === null ? prev.speedKmh : Math.round(position.coords.speed * 3.6),
          currentAltitudeM: position.coords.altitude === null ? prev.currentAltitudeM : Math.round(position.coords.altitude),
          currentLocation: "Device GPS",
        }));

        const now = Date.now();
        let shouldPublish = false;

        if (!lastPublishedCoordsRef.current) {
          shouldPublish = true;
        } else {
          const dist = getDistanceMeters(
            lastPublishedCoordsRef.current.lat,
            lastPublishedCoordsRef.current.lng,
            lat,
            lng
          );
          const elapsed = now - lastPublishTimeRef.current;
          // Moving: distance > 5m and elapsed >= 5s
          // Stationary: distance <= 5m and elapsed >= 30s
          const isMoving = dist > 5;
          if (isMoving && elapsed >= 5000) {
            shouldPublish = true;
          } else if (!isMoving && elapsed >= 30000) {
            shouldPublish = true;
          }
        }

        if (shouldPublish) {
          lastPublishTimeRef.current = now;
          lastPublishedCoordsRef.current = { lat, lng };
          await publishLocation(CURRENT_TRAVELER_ID, {
            name: visitorName || CURRENT_TRAVELER_NAME,
            lat,
            lng,
            lastUpdated: nowLabel(),
          }, {
            isSharingGps: true,
            speedKmh: position.coords.speed === null ? undefined : Math.round(position.coords.speed * 3.6),
            accuracy: position.coords.accuracy === null ? undefined : Math.round(position.coords.accuracy),
            lastActiveTime: now,
          });
        }
      },
      (error) => {
        // Auto reconnect logic
        setTimeout(() => {
          if (watchId !== null) {
            stopGpsSharing();
            startGpsSharing();
          }
        }, 5000);

        setGpsError(
          error.code === error.PERMISSION_DENIED
            ? language === "th"
              ? "กรุณาอนุญาตการเข้าถึงตำแหน่งในเบราว์เซอร์"
              : "Please allow location permission in your browser."
            : language === "th"
              ? "ไม่สามารถอ่านพิกัดจากอุปกรณ์ได้ (กำลังพยายามเชื่อมต่อใหม่...)"
              : "Unable to read device location (reconnecting...)"
        );
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 }
    );
    setWatchId(id);
  }

  function stopGpsSharing() {
    if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    setWatchId(null);
    setIsSharingGps(false);
    lastPublishedCoordsRef.current = null;
  }

  useEffect(() => {
    // Automatically trigger GPS sharing when opening this page
    startGpsSharing();
  }, []);

  function gpsShareText() {
    return [
      `[${language === "th" ? "แชร์พิกัดกลุ่ม" : "Group GPS Share"}]`,
      `${language === "th" ? "ผู้แชร์" : "Traveler"}: ${visitorName || CURRENT_TRAVELER_NAME}`,
      `Lat: ${currentLocation.lat.toFixed(6)}, Lng: ${currentLocation.lng.toFixed(6)}`,
      `${language === "th" ? "ความสูง" : "Altitude"}: ${telemetry.currentAltitudeM} m`,
      `${language === "th" ? "เวลา" : "Time"}: ${nowLabel()}`,
      `Google Maps: ${googleMapsLink(currentLocation.lat, currentLocation.lng)}`,
    ].join("\n");
  }

  async function copyGpsText() {
    await navigator.clipboard.writeText(gpsShareText());
    setCopiedGps(true);
    setTimeout(() => setCopiedGps(false), 1800);
  }

  async function shareSos() {
    const confirmMsg = language === "th"
      ? "🚨 คุณต้องการส่งสัญญาณขอความช่วยเหลือฉุกเฉิน (SOS Emergency Location) ใช่หรือไม่?"
      : "🚨 Are you sure you want to send an SOS Emergency Location?";
    if (!window.confirm(confirmMsg)) return;

    const senderName = (visitorName || CURRENT_TRAVELER_NAME).replace(/\s*\([^)]*\)/g, "").toUpperCase().trim();
    
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const formattedTime = `${yyyy}-${mm}-${dd} ${hh}:${min}`;

    const latStr = currentLocation.lat.toFixed(6);
    const lngStr = currentLocation.lng.toFixed(6);

    const sosText = [
      "🚨 SOS Emergency Location",
      "",
      `From: ${senderName}`,
      "",
      `Time: ${formattedTime}`,
      "",
      `Coordinates: ${latStr}, ${lngStr}`,
      "",
      `Google Maps: https://www.google.com/maps?q=${latStr},${lngStr}`
    ].join("\n");

    await publishChatMessage("SYSTEM", sosText);
  }

  const routeStatuses = [
    {
      name: language === "th" ? "ทางหลวงคาราโกรัม G314 ช่วงปามีร์" : "Karakoram Highway G314 - Pamir Segment",
      status: t.open,
      detail: language === "th" ? "เดินทางได้ตามปกติ เฝ้าระวังลมแรงและอุณหภูมิต่ำช่วงเย็น" : "Open. Watch for wind and low evening temperatures.",
      source: "Xinjiang Transport",
      updated: "30 Jun 2026",
    },
    {
      name: language === "th" ? "ถนนพานหลงโบราณ" : "Panlong Ancient Road",
      status: t.open,
      detail: language === "th" ? "เปิดให้ผ่านได้ ควรขับช้าในช่วงโค้งหักศอก" : "Open. Drive slowly on hairpin sections.",
      source: "Tashkurgan Tourism",
      updated: "30 Jun 2026",
    },
    {
      name: language === "th" ? "ทางหลวงทะเลทรายทากลามากัน G315" : "Taklamakan Desert Highway G315",
      status: t.watch,
      detail: language === "th" ? "เฝ้าระวังฝุ่นทรายและทัศนวิสัยต่ำ" : "Watch for sand, dust, and low visibility.",
      source: "China Transport",
      updated: "30 Jun 2026",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn pb-10">
      <div className="glass-panel p-5 rounded-2xl border border-brand-gold/15 bg-white/70 flex flex-col gap-4 relative w-full">
        <div className="border-b border-gray-100 pb-3">
          <h3 className="font-display font-extrabold text-sm text-navy uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-gold" />
            {t.chat}
          </h3>
        </div>
        <div
          ref={chatRef}
          onScroll={handleScroll}
          className="h-[320px] overflow-y-auto flex flex-col gap-2 bg-slate-50 border border-slate-100 rounded-xl p-3 scroll-smooth"
        >
          {(() => {
            let lastRenderedDate = "";
            return sortedMessages.map((msg) => {
              const isSystem = msg.sender === "SYSTEM";
              
              const msgDateText = getDateDividerText(msg.timestamp);
              let dateDivider = null;
              if (msgDateText !== lastRenderedDate) {
                lastRenderedDate = msgDateText;
                dateDivider = (
                  <div key={`date-${msg.id}`} className="w-full flex items-center justify-center my-3 select-none">
                    <div className="h-[1px] bg-slate-200 flex-grow" />
                    <span className="mx-3 text-[9px] font-black text-gray-405 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/60 shadow-sm">
                      {msgDateText}
                    </span>
                    <div className="h-[1px] bg-slate-200 flex-grow" />
                  </div>
                );
              }

              const isFirstUnread = msg.id === firstUnreadMessageIdRef.current;
              const unreadDivider = isFirstUnread ? (
                <div key={`unread-${msg.id}`} className="w-full flex items-center justify-center my-3 select-none">
                  <div className="h-[1.5px] bg-red-300 flex-grow" />
                  <span className="mx-3 text-[9px] font-black text-red-500 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded-full border border-red-200 shadow-sm animate-pulse">
                    {language === "th" ? "ข้อความใหม่ด้านล่าง" : "Unread Messages Below"}
                  </span>
                  <div className="h-[1.5px] bg-red-300 flex-grow" />
                </div>
              ) : null;

              if (isSystem) {
                const isSos = msg.text.startsWith("🚨 SOS Emergency Location");
                let systemBlock = null;

                if (isSos) {
                  const lines = msg.text.split("\n");
                  const fromLine = lines.find(l => l.startsWith("From: ")) || "";
                  const timeLine = lines.find(l => l.startsWith("Time: ")) || "";
                  const coordLine = lines.find(l => l.startsWith("Coordinates: ")) || "";
                  const mapsLine = lines.find(l => l.startsWith("Google Maps: ")) || "";

                  const senderName = fromLine.replace("From: ", "").trim();
                  const time = timeLine.replace("Time: ", "").trim();
                  const coords = coordLine.replace("Coordinates: ", "").trim();
                  const mapsUrl = mapsLine.replace("Google Maps: ", "").trim();

                  const handleShareLocation = async () => {
                    const shareText = `🚨 SOS Emergency Location\nFrom: ${senderName}\nCoordinates: ${coords}\nLink: ${mapsUrl}`;
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: '🚨 SOS Emergency Location',
                          text: shareText,
                          url: mapsUrl
                        });
                      } catch (err) {
                        if (err instanceof Error && err.name !== 'AbortError') {
                          await copyToClipboard(shareText);
                        }
                      }
                    } else {
                      await copyToClipboard(shareText);
                    }
                  };

                  const copyToClipboard = async (text: string) => {
                    try {
                      await navigator.clipboard.writeText(text);
                      alert(language === "th" ? "คัดลอกข้อความแชร์ฉุกเฉินสำเร็จ!" : "SOS share details copied to clipboard!");
                    } catch {
                      alert(language === "th" ? "ไม่สามารถคัดลอกได้โดยอัตโนมัติ กรุณาคัดลอกด้วยตนเอง" : "Failed to copy automatically.");
                    }
                  };

                  systemBlock = (
                    <div key={msg.id} className="self-center w-full max-w-[90%] my-2">
                      <div className="rounded-2xl p-4 bg-red-50 text-red-800 border-2 border-red-200 font-bold text-xs text-left shadow-lg flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 text-red-650 text-[13px] font-extrabold uppercase tracking-wide">
                          <AlertTriangle className="w-5 h-5 animate-pulse text-red-600" />
                          <span>{language === "th" ? "แจ้งเตือนพิกัดฉุกเฉิน" : "SOS Emergency Location"}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-1 text-[11px] text-gray-700 bg-white/60 p-2.5 rounded-xl border border-red-100">
                          <div><span className="text-gray-400 font-bold">From:</span> <b className="text-gray-900 font-extrabold">{senderName}</b></div>
                          <div><span className="text-gray-400 font-bold">Time:</span> <b className="text-gray-900 font-extrabold">{time}</b></div>
                          <div><span className="text-gray-400 font-bold">Coordinates:</span> <code className="text-red-700 font-black">{coords}</code></div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-1.5">
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] text-center shadow-sm flex items-center justify-center gap-1 cursor-pointer transition-all"
                          >
                            {language === "th" ? "เปิดแผนที่" : "Open Map"}
                          </a>
                          <button
                            type="button"
                            onClick={handleShareLocation}
                            className="py-2 rounded-xl bg-white border border-red-200 hover:bg-red-50 text-red-700 font-extrabold text-[10px] shadow-sm flex items-center justify-center gap-1 cursor-pointer transition-all"
                          >
                            {language === "th" ? "แชร์ตำแหน่ง" : "Share Loc"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  const isExpenseAdded = msg.text.includes("บันทึกค่าใช้จ่ายใหม่") || msg.text.includes("Expense Added") || msg.text.includes("บิ๊กโบนัส") || msg.text.includes("Expense Saved");
                  const isSettlement = msg.text.includes("เคลียร์ยอดสำเร็จ") || msg.text.includes("Settlement Completed") || msg.text.includes("เคลียร์ยอด") || msg.text.includes("Settlement");
                  const isLiveShared = msg.text.includes("แชร์ตำแหน่ง") || msg.text.includes("Live Location") || msg.text.includes("Location Shared");
                  const isSafetyAlert = msg.text.includes("⚠️") || msg.text.includes("เตือนภัย") || msg.text.includes("Safety Alert");
                  const isAnnouncement = msg.text.includes("📢") || msg.text.includes("ประกาศ") || msg.text.includes("Announcement");

                  let systemStyleClass = "bg-slate-100 text-slate-700 border-slate-200";
                  let systemIcon = "📢";

                  if (isExpenseAdded) {
                    systemStyleClass = "bg-emerald-50 text-emerald-800 border-emerald-100";
                    systemIcon = "💰";
                  } else if (isSettlement) {
                    systemStyleClass = "bg-blue-50 text-blue-800 border-blue-100";
                    systemIcon = "✅";
                  } else if (isLiveShared) {
                    systemStyleClass = "bg-teal-50 text-teal-800 border-teal-100";
                    systemIcon = "📍";
                  } else if (isSafetyAlert) {
                    systemStyleClass = "bg-amber-50 text-amber-800 border-amber-100 animate-pulse";
                    systemIcon = "⚠️";
                  }

                  const hasLink = msg.text.includes("[EXPENSE_LINK]");
                  const linkMatch = msg.text.match(/\[EXPENSE_LINK:([^\]]+)\]/);
                  const hasTimestampLink = hasLink || linkMatch !== null;

                  let cleanText = msg.text.replace(/\[EXPENSE_LINK:[^\]]*\]/, "").trim();
                  cleanText = cleanText.replace("[EXPENSE_LINK]", "").trim();

                  systemBlock = (
                    <div key={msg.id} className="self-center text-center max-w-[90%] my-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (hasTimestampLink) {
                            const timestamp = linkMatch ? linkMatch[1] : null;
                            if (timestamp) {
                              useTravelStore.getState().setHighlightedLogTimestamp(timestamp);
                            }
                            useTravelStore.getState().setActiveTab("expense-split");
                          }
                        }}
                        className={`rounded-xl px-3.5 py-2 border font-bold text-[10px] text-left transition-all flex items-center gap-2 shadow-sm ${systemStyleClass} ${
                          hasTimestampLink ? "hover:scale-[1.01] cursor-pointer" : "cursor-default"
                        }`}
                      >
                        <span className="text-[12px]">{systemIcon}</span>
                        <div className="flex flex-col gap-0.5">
                          <span>{cleanText}</span>
                          {hasTimestampLink && (
                            <span className="text-brand-blue hover:underline font-extrabold text-[9px] mt-0.5">
                              {language === "th" ? "➔ ดูรายละเอียดที่บัญชีกลาง" : "➔ View Details in Shared Ledger"}
                            </span>
                          )}
                        </div>
                      </button>
                    </div>
                  );
                }

                return (
                  <React.Fragment key={msg.id}>
                    {dateDivider}
                    {unreadDivider}
                    {systemBlock}
                  </React.Fragment>
                );
              }

              return (
                <React.Fragment key={msg.id}>
                  {dateDivider}
                  {unreadDivider}
                  <MessageBubble
                    msg={msg}
                    currentUserId={currentUserId}
                    me={me}
                    activeTab={activeTab}
                    onVisible={handleMessageVisible}
                    onShowReceipts={setMessageDetailsModal}
                    formatMsgTime={formatMsgTime}
                    setSelectedMessage={setSelectedMessage}
                    language={language}
                  />
                </React.Fragment>
              );
            });
          })()}
        </div>

        {showNewMessageButton && (
          <button
            type="button"
            onClick={() => {
              if (chatRef.current) {
                chatRef.current.scrollTop = chatRef.current.scrollHeight;
              }
              setShowNewMessageButton(false);
            }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-bg-primary text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-bounce z-10"
          >
            New Messages ↓
          </button>
        )}

        {replyingTo && (
          <div className="flex items-center justify-between bg-brand-gold/10 border border-brand-gold/25 rounded-xl px-3 py-1.5 mb-2 text-[10px] animate-fadeIn">
            <div className="flex flex-col gap-0.5 text-gray-700">
              <div className="font-bold flex items-center gap-1">
                <CornerUpLeft className="w-3 h-3 text-brand-gold" />
                {language === "th" ? "กำลังตอบกลับ" : "Replying to"} {formatDisplayName(replyingTo.sender, "nickname")}
              </div>
              <div className="truncate max-w-[200px] text-gray-500 italic">
                "{replyingTo.text.replace(REPLY_REGEX, "$4")}"
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="text-gray-400 hover:text-gray-600 font-extrabold text-xs px-1.5 py-0.5 rounded"
            >
              ✕
            </button>
          </div>
        )}

        {(() => {
          const otherTypingUsers = typingUsers.filter(u => u.userId !== currentUserId);
          if (otherTypingUsers.length > 0) {
            const typingNames = otherTypingUsers.map(u => formatDisplayName(u.name, "nickname")).join(", ");
            const typingText = language === "th" ? `${typingNames} กำลังพิมพ์...` : `${typingNames} is typing...`;
            return (
              <div className="text-[9px] text-gray-500 font-extrabold flex items-center gap-1.5 px-1.5 py-0.5 select-none animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>{typingText}</span>
              </div>
            );
          }
          return null;
        })()}

        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (!chatInput.trim()) return;
            let textToSend = chatInput.trim();
            if (replyingTo) {
              const replyCleanText = replyingTo.text.replace(REPLY_REGEX, "$4").slice(0, 30).replace(/[:\]]/g, " ");
              textToSend = `[REPLY_TO:${replyingTo.id}:${replyingTo.sender}:${replyCleanText}] ${textToSend}`;
            }
            isTypingRef.current = false;
            reportTypingStatus(false);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            await publishChatMessage(visitorName || "Chaiya", textToSend);
            setChatInput("");
            setReplyingTo(null);
          }}
          className="flex gap-2"
        >
          <input
            value={chatInput}
            onChange={(event) => {
              setChatInput(event.target.value);
              if (!isTypingRef.current) {
                isTypingRef.current = true;
                reportTypingStatus(true);
              }
              if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
              typingTimeoutRef.current = setTimeout(() => {
                isTypingRef.current = false;
                reportTypingStatus(false);
              }, 2000);
            }}
            placeholder={t.chatPlaceholder}
            className="min-w-0 flex-1 bg-white border border-slate-200 rounded-xl text-xs px-3 py-2.5 focus:outline-none focus:border-brand-gold"
          />
          <button type="submit" className="p-2.5 rounded-xl bg-brand-gold text-brand-bg-primary">
            <Send className="w-4 h-4" />
          </button>
        </form>

        {selectedMessage && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn" onClick={() => setSelectedMessage(null)}>
            <div className="bg-white rounded-2xl p-4 w-[280px] max-w-[90%] shadow-2xl flex flex-col gap-2.5" onClick={(e) => e.stopPropagation()}>
              <div className="border-b border-gray-100 pb-2 mb-1">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {language === "th" ? "จัดการข้อความ" : "Message Options"}
                </div>
                <div className="text-xs text-gray-700 truncate font-semibold mt-1">
                  "{selectedMessage.text.replace(REPLY_REGEX, "$4")}"
                </div>
              </div>
              
              <button
                onClick={() => {
                  setReplyingTo(selectedMessage);
                  setSelectedMessage(null);
                }}
                className="w-full py-2.5 px-3 hover:bg-slate-50 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-2.5 transition-all text-left"
              >
                <CornerUpLeft className="w-4 h-4 text-brand-blue" />
                {language === "th" ? "ตอบกลับ (Reply)" : "Reply"}
              </button>

              {(selectedMessage.sender === (visitorName || "Chaiya") || 
               selectedMessage.sender.toLowerCase().includes((visitorName || "").toLowerCase()) ||
               (visitorName || "").toLowerCase().includes(selectedMessage.sender.toLowerCase()) ||
               selectedMessage.sender === "Chaiya" || selectedMessage.sender === "Arthur" || selectedMessage.sender === "Hao") && (
                <button
                  onClick={async () => {
                    await unsendChatMessage(selectedMessage.id);
                    setSelectedMessage(null);
                  }}
                  className="w-full py-2.5 px-3 hover:bg-red-50 hover:text-red-600 rounded-xl text-xs font-bold text-red-500 flex items-center gap-2.5 transition-all text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  {language === "th" ? "ยกเลิกการส่ง (Unsend)" : "Unsend"}
                </button>
              )}

              <button
                onClick={() => setSelectedMessage(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-gray-500 text-center transition-all mt-1"
              >
                {language === "th" ? "ยกเลิก" : "Cancel"}
              </button>
            </div>
          </div>
        )}

        {messageDetailsModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn" onClick={() => setMessageDetailsModal(null)}>
            <div className="bg-white rounded-2xl p-5 w-[320px] max-w-[90%] shadow-2xl flex flex-col gap-3 text-left text-xs text-gray-800" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="font-display font-extrabold text-sm text-navy uppercase tracking-wider">
                  {language === "th" ? "รายละเอียดข้อความ" : "Message Info"}
                </span>
                <button type="button" onClick={() => setMessageDetailsModal(null)} className="text-gray-400 hover:text-gray-600 font-extrabold text-sm p-1">✕</button>
              </div>

              <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-[11px] text-gray-600 truncate mb-1">
                "{messageDetailsModal.text.replace(REPLY_REGEX, "$4")}"
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <span className="font-extrabold text-gray-500 uppercase tracking-wide text-[9px] mt-0.5">Sent</span>
                  <span className="font-bold text-gray-900">{new Date(messageDetailsModal.timestamp).toLocaleString(language === "th" ? "th-TH" : "en-US", { hour12: false })}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-extrabold text-gray-500 uppercase tracking-wide text-[9px]">Delivered</span>
                  <div className="flex flex-wrap gap-1">
                    {PARTICIPANTS.filter(p => (messageDetailsModal.deliveredTo || []).includes(p.id)).map(p => (
                      <span key={p.id} className="bg-slate-100 border border-slate-200 text-slate-800 px-1.5 py-0.5 rounded-md font-bold text-[9px]">
                        {p.nickname}
                      </span>
                    ))}
                    {(!messageDetailsModal.deliveredTo || messageDetailsModal.deliveredTo.length === 0) && (
                      <span className="text-gray-400 italic">None</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-extrabold text-emerald-600 uppercase tracking-wide text-[9px]">Read</span>
                  <div className="flex flex-wrap gap-1">
                    {PARTICIPANTS.filter(p => (messageDetailsModal.readBy || []).includes(p.id)).map(p => (
                      <span key={p.id} className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-md font-bold text-[9px]">
                        {p.nickname}
                      </span>
                    ))}
                    {(!messageDetailsModal.readBy || messageDetailsModal.readBy.length === 0) && (
                      <span className="text-gray-400 italic">None</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-extrabold text-red-500 uppercase tracking-wide text-[9px]">Unread</span>
                  <div className="flex flex-wrap gap-1">
                    {PARTICIPANTS.filter(p => !(messageDetailsModal.readBy || []).includes(p.id)).map(p => (
                      <span key={p.id} className="bg-red-50/50 border border-red-150 text-red-700 px-1.5 py-0.5 rounded-md font-bold text-[9px]">
                        {p.nickname}
                      </span>
                    ))}
                    {PARTICIPANTS.filter(p => !(messageDetailsModal.readBy || []).includes(p.id)).length === 0 && (
                      <span className="text-gray-400 italic">None</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMessageDetailsModal(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-gray-500 text-center transition-all mt-2.5"
              >
                {language === "th" ? "ปิด" : "Close"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Traveler locations card list & controls (moved up to be after Group Chat box) */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200/60 bg-white/70 flex flex-col gap-4 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visibleTravelers.map(([id, loc]) => {
            const now = Date.now();
            const lastActive = loc.lastActiveTime || 0;
            const hasConnected = lastActive > 0;
            const isOffline = now - lastActive > 120000;

            const formatHHmm = (ts: number | undefined) => {
              if (!ts) return "";
              const date = new Date(ts);
              const hours = String(date.getHours()).padStart(2, "0");
              const minutes = String(date.getMinutes()).padStart(2, "0");
              return `${hours}:${minutes}`;
            };

            let statusLabel = "";
            let statusColor = "text-slate-500";
            let gpsLabel = "";

            if (hasConnected) {
              if (isOffline) {
                const lastOnlineTime = loc.lastOnline || lastActive;
                statusLabel = `Last online: ${formatHHmm(lastOnlineTime)}`;
                statusColor = "text-slate-500 font-medium";
              } else {
                const onlineSinceTime = loc.onlineSince || lastActive;
                statusLabel = `Online since: ${formatHHmm(onlineSinceTime)}`;
                statusColor = "text-emerald-600 font-bold";
                if (loc.isSharingGps) {
                  gpsLabel = "GPS On";
                }
              }
            }

            const nickname = formatDisplayName(id, "nickname");

            if (!hasConnected) {
              return (
                <div
                  key={id}
                  className="flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-sm"
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-gray-900 font-bold">{nickname}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={id}
                className="flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-sm"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-gray-900 font-bold">{nickname}</span>
                  <div className="flex items-center gap-1.5">
                    {gpsLabel && (
                      <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                        {gpsLabel}
                      </span>
                    )}
                    <span className={`text-[10px] ${statusColor}`}>{statusLabel}</span>
                  </div>
                </div>
                <div className="flex items-center justify-end text-[10px] text-gray-500 font-semibold mt-1">
                  {loc.lat && loc.lng && (
                    <a
                      href={googleMapsLink(loc.lat, loc.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-0.5 text-brand-blue font-bold hover:underline"
                    >
                      {t.openInGoogle}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={copyGpsText}
            className="py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-gray-700 flex items-center justify-center gap-2"
          >
            {copiedGps ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copiedGps ? t.copied : t.copyGps}
          </button>
          <button
            type="button"
            onClick={shareSos}
            className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            {t.sos}
          </button>
        </div>
      </div>

      {/* Map Panel containing only the Map itself */}
      <div className="glass-panel p-5 rounded-2xl border border-brand-gold/15 bg-white/70 flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 gap-3">
          <div>
            <h3 className="font-display font-extrabold text-sm text-navy uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-gold" />
              {t.googleMap}
            </h3>
            <p className="text-[10px] text-gray-500 font-bold mt-1">
              {isSupabaseConfigured ? t.cloudOn : t.cloudOff} • {isSharingGps ? t.gpsReady : t.gpsOff}
            </p>
          </div>
          <div className="text-right text-[10px] font-mono text-gray-600">
            <div>Lat {currentLocation.lat.toFixed(6)}</div>
            <div>Lng {currentLocation.lng.toFixed(6)}</div>
          </div>
        </div>

        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
          <div ref={googleMapRef} className="absolute inset-0" />
        </div>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/70">
        <h3 className="font-display font-extrabold text-sm text-navy uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
          <Radio className="w-5 h-5 text-brand-gold" />
          {t.routeStatus}
        </h3>
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
          {routeStatuses.map((route) => (
            <div key={route.name} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between gap-3">
                <span className="text-xs font-bold text-gray-900">{route.name}</span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded ${route.status === t.open ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {route.status}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 mt-1">{route.detail}</p>
              <div className="text-[10px] text-gray-500 mt-2 flex justify-between">
                <span>{t.source}: {route.source}</span>
                <span>{t.updated}: {route.updated}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-brand-gold/15 bg-white/70">
        <h3 className="font-display font-extrabold text-sm text-navy uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
          <Activity className="w-5 h-5 text-brand-gold" />
          {t.alerts}
        </h3>
        <div className="mt-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4" />
          {t.noAlerts}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 bg-slate-900/95 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex flex-col gap-1 border border-brand-gold/20 animate-slideIn z-50 max-w-sm backdrop-blur-md">
          <div className="font-bold text-brand-gold">ข้อความใหม่จาก {toast.sender}</div>
          <div className="text-gray-200 line-clamp-2 mt-0.5">{toast.text}</div>
          <button onClick={() => setToast(null)} className="text-[9px] text-gray-400 text-right mt-1 hover:text-white transition-colors">ปิด</button>
        </div>
      )}
    </div>
  );
}
