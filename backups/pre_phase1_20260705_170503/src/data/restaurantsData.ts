export interface Restaurant {
  id: string;
  name: { en: string; th: string; zh: string };
  location: { en: string; th: string; zh: string };
  region: "kashgar" | "pamir" | "hotan" | "aksu";
  cuisine: { en: string; th: string; zh: string };
  priceRange: { en: string; th: string; zh: string };
  hours: { en: string; th: string; zh: string };
  rating: number;
  tags: { en: string[]; th: string[]; zh: string[] };
  signature: { en: string; th: string; zh: string };
  description: { en: string; th: string; zh: string };
  tip: { en: string; th: string; zh: string };
  awards?: { en: string; th: string; zh: string };
  amap?: string;
  wikiTitle?: string;
  imageUrl?: string;
}

export const RESTAURANTS_DATA: Restaurant[] = [
  {
    id: "kashgar_night_market",
    name: {
      en: "Kashgar International Grand Bazaar Food Street",
      th: "ถนนอาหารบะซาร์นานาชาติคัชการ์",
      zh: "喀什国际大巴扎美食街",
    },
    location: {
      en: "Aizirete Road, Kashgar",
      th: "ถนนไอจือเร่อเท่อ เมืองคัชการ์",
      zh: "喀什市艾孜热特路",
    },
    region: "kashgar",
    cuisine: { en: "Uyghur Street Food & BBQ", th: "สตรีทฟู้ดและบาร์บีคิวอุยกูร์", zh: "维吾尔街头小吃与烧烤" },
    priceRange: { en: "₴ 10-80 RMB", th: "10-80 หยวน", zh: "10-80元" },
    hours: { en: "18:00 - 01:00", th: "18:00 - 01:00 น.", zh: "18:00 - 01:00" },
    rating: 4.8,
    tags: {
      en: ["Verified on Amap", "Night Market", "Street Food"],
      th: ["ยืนยันบน Amap", "ตลาดกลางคืน", "สตรีทฟู้ด"],
      zh: ["高德可查", "夜市", "街头小吃"],
    },
    signature: {
      en: "Lamb skewers, naan, and fresh pomegranate juice",
      th: "เนื้อแกะย่างไม้ นาน และน้ำทับทิมคั้นสด",
      zh: "烤羊肉串、馕和鲜榨石榴汁",
    },
    description: {
      en: "This food street is map-verifiable on Amap and remains one of the clearest anchor points for eating in Kashgar at night.",
      th: "ย่านนี้ตรวจสอบตำแหน่งได้บน Amap และเป็นหนึ่งในจุดกินตอนกลางคืนที่ยืนยันพิกัดได้ชัดที่สุดในคัชการ์",
      zh: "该美食街可在高德地图核验，是喀什夜间觅食最清晰、最稳定的地图锚点之一。",
    },
    tip: {
      en: "Use the market entrance as your meeting point before splitting up to explore different stalls.",
      th: "ใช้ทางเข้าตลาดเป็นจุดนัดพบก่อนแยกกันเดินเลือกร้าน",
      zh: "建议先以市场入口作为会合点，再分头逛摊。",
    },
    amap: "喀什市艾孜热特路国际大巴扎美食街",
  },
  {
    id: "kashgar_naan_alley",
    name: {
      en: "Kashgar Old Town Naan Culture Plaza",
      th: "ลานวัฒนธรรมนาน เมืองเก่าคัชการ์",
      zh: "喀什古城馕文化广场",
    },
    location: {
      en: "Kashgar Old Town",
      th: "เมืองเก่าคัชการ์",
      zh: "喀什古城",
    },
    region: "kashgar",
    cuisine: { en: "Uyghur Naan Bread", th: "ขนมปังนานอุยกูร์", zh: "维吾尔烤馕" },
    priceRange: { en: "₴ 5-20 RMB", th: "5-20 หยวน", zh: "5-20元" },
    hours: { en: "06:00 - 22:00", th: "06:00 - 22:00 น.", zh: "06:00 - 22:00" },
    rating: 4.7,
    tags: {
      en: ["Verified on Amap", "Iconic", "Bakery Area"],
      th: ["ยืนยันบน Amap", "ไอคอนิก", "โซนเบเกอรี่"],
      zh: ["高德可查", "经典", "烤馕区"],
    },
    signature: {
      en: "Fresh naan from clay ovens",
      th: "นานอบสดจากเตาดิน",
      zh: "馕坑现烤热馕",
    },
    description: {
      en: "This plaza is a reliable map anchor for travelers looking for traditional naan-making in Kashgar Old Town.",
      th: "ลานแห่งนี้เป็นจุดอ้างอิงบนแผนที่ที่เชื่อถือได้สำหรับคนที่ต้องการตามหานานแบบดั้งเดิมในเมืองเก่าคัชการ์",
      zh: "该广场是寻找喀什古城传统打馕体验时较可靠的地图定位点。",
    },
    tip: {
      en: "Go early for the highest oven turnover and the freshest bread.",
      th: "ไปช่วงเช้าจะได้รอบอบที่สดที่สุด",
      zh: "建议早上前往，出炉频率更高，馕也更新鲜。",
    },
    amap: "喀什古城馕文化广场",
  },
  {
    id: "kashgar_east_gate_dining",
    name: {
      en: "Kashgar Old Town East Gate Dining Area",
      th: "โซนอาหารประตูตะวันออก เมืองเก่าคัชการ์",
      zh: "喀什古城东门餐饮区",
    },
    location: {
      en: "Kashgar Old Town East Gate",
      th: "ประตูตะวันออก เมืองเก่าคัชการ์",
      zh: "喀什古城东门",
    },
    region: "kashgar",
    cuisine: { en: "Uyghur Mixed Dining", th: "อาหารอุยกูร์หลากหลาย", zh: "维吾尔综合餐饮" },
    priceRange: { en: "₴₴ 25-120 RMB", th: "25-120 หยวน", zh: "25-120元" },
    hours: { en: "10:00 - 23:00", th: "10:00 - 23:00 น.", zh: "10:00 - 23:00" },
    rating: 4.5,
    tags: {
      en: ["Verified on Amap", "Landmark", "Multiple Options"],
      th: ["ยืนยันบน Amap", "แลนด์มาร์ก", "มีหลายร้าน"],
      zh: ["高德可查", "地标", "选择多"],
    },
    signature: {
      en: "Pilaf, kebabs, and tea houses around the East Gate",
      th: "ข้าวหมก เคบับ และโรงน้ำชารอบประตูตะวันออก",
      zh: "东门周边抓饭、烤肉与茶馆",
    },
    description: {
      en: "The East Gate itself is clearly searchable on Amap, making this a safer dining waypoint than specific restaurant names that could not be independently confirmed.",
      th: "ตัวประตูตะวันออกค้นหาเจอบน Amap ชัดเจน จึงปลอดภัยกว่าการอ้างชื่อร้านเฉพาะที่ยังยืนยันแยกไม่ได้",
      zh: "东门本身在高德上可明确检索，因此比无法独立核验的单店名称更适合作为稳妥的餐饮会合点。",
    },
    tip: {
      en: "Use the East Gate as the destination, then pick a busy restaurant frontage after you arrive.",
      th: "ตั้งหมุดที่ประตูตะวันออกก่อน แล้วค่อยเลือกร้านที่คนแน่นเมื่อไปถึง",
      zh: "先导航到东门，抵达后再挑人流稳定的门店更稳妥。",
    },
    amap: "喀什古城东门",
  },
  {
    id: "hotan_night_market",
    name: {
      en: "Hotan Night Market",
      th: "ตลาดกลางคืนโฮตัน",
      zh: "和田夜市",
    },
    location: {
      en: "Hongda International Grand Bazaar, Hotan",
      th: "หงต๋าอินเตอร์เนชันแนลแกรนด์บะซาร์ โฮตัน",
      zh: "和田市宏达国际大巴扎",
    },
    region: "hotan",
    cuisine: { en: "Hotan Regional Street Food", th: "สตรีทฟู้ดโฮตัน", zh: "和田街头小吃" },
    priceRange: { en: "₴ 10-60 RMB", th: "10-60 หยวน", zh: "10-60元" },
    hours: { en: "19:00 - 02:00", th: "19:00 - 02:00 น.", zh: "19:00 - 02:00" },
    rating: 4.7,
    tags: {
      en: ["Verified on Amap", "Night Market", "Must-Try"],
      th: ["ยืนยันบน Amap", "ตลาดกลางคืน", "ต้องลอง"],
      zh: ["高德可查", "夜市", "必试"],
    },
    signature: {
      en: "Roasted eggs, lamb skewers, and local yogurt",
      th: "ไข่อบ เครื่อย่างเนื้อแกะ และโยเกิร์ตท้องถิ่น",
      zh: "烤蛋、羊肉串与本地酸奶",
    },
    description: {
      en: "The Hongda Grand Bazaar anchor point is verifiable on Amap and is a stronger map reference than individual stalls inside the market.",
      th: "จุดอ้างอิง Hongda Grand Bazaar ตรวจสอบได้บน Amap และเป็นหมุดที่น่าเชื่อถือกว่าการระบุแผงร้านย่อยภายในตลาด",
      zh: "宏达国际大巴扎这一锚点可在高德核验，比市场内无法独立确认的小摊更适合作为地图定位。",
    },
    tip: {
      en: "Treat the bazaar as the destination, then explore the food corridor on foot after arriving.",
      th: "ให้ตั้งหมุดที่บะซาร์ก่อน แล้วค่อยเดินเลือกซุ้มอาหารด้านใน",
      zh: "先把大巴扎设为导航终点，到了再步行逛美食走廊。",
    },
    amap: "和田市宏达国际大巴扎",
  },
];
