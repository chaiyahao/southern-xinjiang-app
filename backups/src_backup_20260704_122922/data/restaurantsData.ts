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
}

export const RESTAURANTS_DATA: Restaurant[] = [
  // ===================== KASHGAR =====================
  {
    id: "kashgar_orhancha_khan",
    name: {
      en: "Orda Khan (Centennial Tea House)",
      th: "โรงน้ำชาร้อยปี โอร์ดา คาน (Old Town)",
      zh: "百年老茶馆（古城）",
    },
    location: {
      en: "Kashgar Old Town, near Id Kah Mosque",
      th: "เมืองเก่าคัชการ์ ใกล้มัสยิดอิดคา",
      zh: "喀什古城，艾提尕尔清真寺旁",
    },
    region: "kashgar",
    cuisine: { en: "Uyghur Tea House & Snacks", th: "โรงน้ำชาและขนมอุยกูร์", zh: "维吾尔茶馆小食" },
    priceRange: { en: "₴ 20-50 RMB", th: "ถูก 20-50 หยวน", zh: "便宜 20-50元" },
    hours: { en: "09:00 - 22:00", th: "09:00 - 22:00 น.", zh: "09:00 - 22:00" },
    rating: 4.7,
    tags: {
      en: ["Most Famous", "Must-Visit", "Cultural"],
      th: ["โด่งดังที่สุด", "ต้องไป", "วัฒนธรรม"],
      zh: ["最出名", "必去", "文化"],
    },
    signature: {
      en: "Rose petal tea & freshly baked Nang bread",
      th: "ชากุหลาบและขนมปังนางร้อนสดใหม่",
      zh: "玫瑰花茶与现烤馕饼",
    },
    description: {
      en: "The legendary century-old tea house immortalized in travel documentaries. Sit on carpets, sip rose tea, and watch elderly Uyghur men play the rawap lute. The most atmospheric spot in all of Xinjiang.",
      th: "โรงน้ำชาร้อยปีตำนานที่ปรากฏในสารคดีท่องเที่ยวมาแล้วนับไม่ถ้วน นั่งบนพรมสวยงาม จิบชากุหลาบหอมกรุ่น ชมคุณตาอุยกูร์เล่นพิณระวับ (Rawap) เบาๆ เป็นมุมบรรยากาศคลาสสิกที่สุดของซินเจียง",
      zh: "被无数旅行纪录片收录的百年传奇老茶馆。盘腿坐在地毯上，品玫瑰花茶，聆听维吾尔长者弹奏热瓦普。新疆最具人文气息的角落。",
    },
    tip: {
      en: "Climb to the second-floor balcony for the best people-watching over the old town alleys.",
      th: "ขึ้นไปชั้น 2 ระเบียงนอกจะได้มุมชมวิถีชีวิตตรอกซอกซอยเมืองเก่าสวยที่สุด",
      zh: "建议坐二楼阳台，俯瞰老城街巷的最佳观景位。",
    },
  },
  {
    id: "kashgar_night_market",
    name: {
      en: "Kashgar International Grand Bazaar Food Street",
      th: "ถนนอาหารบะซ่าร์นานาชาติคัชการ์",
      zh: "喀什国际大巴扎美食街",
    },
    location: {
      en: "Kashgar Old Town Food Street",
      th: "ย่านอาหารเมืองเก่าคัชการ์",
      zh: "喀什古城美食街",
    },
    region: "kashgar",
    cuisine: { en: "Uyghur Street Food & BBQ", th: "สตรีทฟู้ดและบาร์บีคิวอุยกูร์", zh: "维吾尔街头烧烤" },
    priceRange: { en: "₴ 10-80 RMB", th: "ถูก 10-80 หยวน", zh: "便宜 10-80元" },
    hours: { en: "18:00 - 01:00", th: "18:00 - 01:00 น.", zh: "18:00 - 01:00" },
    rating: 4.8,
    tags: {
      en: ["Night Market", "Top Hit", "Street Food"],
      th: ["ตลาดกลางคืน", "ยอดฮิต", "สตรีทฟู้ด"],
      zh: ["夜市", "人气王", "街头小吃"],
    },
    signature: {
      en: "Lamb skewers (Kawaap) & baked stuffed Samsa",
      th: "เนื้อแกะไม้เสียบ (Kawaap) และพายสามซ่าสดใหม่",
      zh: "烤羊肉串与烤包子",
    },
    description: {
      en: "The beating heart of Kashgar's nightlife. Hundreds of stalls grilling lamb skewers, hand-pulled noodles, and giant naan. Live music, steam, and energy — the ultimate foodie experience.",
      th: "หัวใจของค่ำคืนคัชการ์ ร้านค้านับร้อยย่างไม้เสียบเนื้อแกะ ดึงเส้นบะหมี่มือ และอบนางร้อนขนาดยักษ์ เสียงดนตรีสด ไอน้ำ และพลังงานชีวิต — ประสบการณ์อาหารสุดยอด",
      zh: "喀什夜生活的灵魂所在。上百家摊位烤羊肉串、手工拉面、巨型馕饼。现场音乐、烟火气十足，美食家的终极体验。",
    },
    tip: {
      en: "Try the famous pomegranate juice pressed fresh on the spot — sweet and refreshing after spicy food.",
      th: "อย่าพลาดน้ำทับทิมคั้นสดๆ หน้าร้าน หวานชื่นใจหลังทานของเผ็ดร้อน",
      zh: "推荐现场鲜榨石榴汁，辛辣之后来一杯清甜解腻。",
    },
  },
  {
    id: "kashgar_dapanji",
    name: {
      en: "Tuanyijie Dapanji (Chicken Big Plate)",
      th: "ตวนอีเจี๋ย ต้าพ่านจี (ไก่ผัดจานใหญ่)",
      zh: "团结街大盘鸡",
    },
    location: {
      en: "Kashgar Downtown",
      th: "ตัวเมืองคัชการ์",
      zh: "喀什市区",
    },
    region: "kashgar",
    cuisine: { en: "Xinjiang Big Plate Chicken", th: "ไก่ผัดจานใหญ่สไตล์ซินเจียง", zh: "新疆大盘鸡" },
    priceRange: { en: "₴₴ 60-120 RMB", th: "ปานกลาง 60-120 หยวน", zh: "中等 60-120元" },
    hours: { en: "11:00 - 23:00", th: "11:00 - 23:00 น.", zh: "11:00 - 23:00" },
    rating: 4.6,
    tags: {
      en: ["Local Favorite", "Hearty", "Sharing"],
      th: ["คนท้องถิ่นชอบ", "อิ่มจัด", "ทานร่วมกัน"],
      zh: ["本地人爱", "分量足", "聚餐"],
    },
    signature: {
      en: "Dapanji — spicy chicken & potato stew with hand-pulled noodles",
      th: "ต้าพ่านจี — ไก่ผัดพริกสับกับมันฝรั่งตุ๋น เสิร์ฟพร้อมเส้นดึงมือ",
      zh: "大盘鸡——辣子鸡块炖土豆，配皮带面",
    },
    description: {
      en: "The iconic Xinjiang sharing dish: a mountain of chicken, potatoes, and peppers in rich sauce, crowned with wide hand-pulled noodles soaked up at the end. Order for 2-3 people minimum.",
      th: "เมนูตำนานประจำซินเจียงสำหรับทานร่วมกัน: เนื้อไก่ มันฝรั่ง และพริกเป็นภูเขาในซอสเข้มข้น ปิดท้ายด้วยเส้นกว้างดึงมือแช่ซอส สั่งขั้นต่ำ 2-3 คน",
      zh: "新疆经典聚餐菜：鸡块、土豆、辣椒炖成一大盘，最后下入宽面条吸饱汤汁。建议2-3人起点。",
    },
    tip: {
      en: "Ask for the noodles (kouda) to be added to the sauce at the end — that's the best part.",
      th: "อย่าลืมสั่งเส้น (kouda) ใส่ลงในซอสช่วงท้าย — นั่นคือไฮไลต์เด็ด",
      zh: "最后一定要加宽面条（皮带面）拌汤汁，那是精髓。",
    },
  },

  // ===================== PAMIR / TASHKURGAN =====================
  {
    id: "pamir_tashkurgan_yak",
    name: {
      en: "Tashkurgan Plateau Stone Pot Yak",
      th: "หม้อหินยักษ์ที่ราบสูงทาชคูร์กัน",
      zh: "塔县高原石锅牦牛",
    },
    location: {
      en: "Tashkurgan Town Center",
      th: "ตัวเมืองทาชคูร์กัน",
      zh: "塔什库尔干县城",
    },
    region: "pamir",
    cuisine: { en: "Tajik & Tibetan Plateau", th: "ทาจิกและที่ราบสูงทิเบต", zh: "塔吉克与高原菜" },
    priceRange: { en: "₴₴ 80-150 RMB", th: "ปานกลาง 80-150 หยวน", zh: "中等 80-150元" },
    hours: { en: "10:00 - 22:00", th: "10:00 - 22:00 น.", zh: "10:00 - 22:00" },
    rating: 4.5,
    tags: {
      en: ["High-Altitude", "Warm-Up", "Unique"],
      th: ["ที่สูง", "อุ่นร่างกาย", "แปลกใหม่"],
      zh: ["高原", "暖身", "特色"],
    },
    signature: {
      en: "Stone pot yak meat stew — rich and warming at 3,200m",
      th: "หม้อหินตุ๋นเนื้อจามรี — เข้มข้นอุ่นใจที่ระดับ 3,200 ม.",
      zh: "石锅牦牛肉——3200米高原暖身滋补",
    },
    description: {
      en: "At altitude you need warmth and iron. This stone pot slow-cooks yak meat with highland barley and root vegetables until melt-in-mouth tender. A local specialty that fights mountain fatigue.",
      th: "บนที่สูงคุณต้องการความอบอุ่นและธาตุเหล็ก หม้อหินตุ๋นเนื้อจามรีกับข้าวบาร์เลย์ที่สูงและผักรากจนนุ่มละลายในปาก เป็นเมนูพิเศษท้องถิ่นที่ช่วยต่อสู้ความเหนื่อยล้าภูเขา",
      zh: "在高原需要暖身和补铁。石锅慢炖牦牛肉配青稞与根茎类蔬菜，肉质酥烂入口即化。当地滋补特色，对抗高原疲劳。",
    },
    tip: {
      en: "Great after a cold Karakul Lake visit — order a pot to share and add extra highland barley.",
      th: "เหมาะหลังเยือนทะเลสาบคาราคูลที่หนาวเย็น สั่งหม้อหนึ่งแบ่งกันทานและเติมข้าวบาร์เลย์เพิ่ม",
      zh: "游览卡拉库里湖后驱寒首选，建议一锅分享并加青稞。",
    },
  },

  // ===================== HOTAN / YARKANT =====================
  {
    id: "hotan_night_market",
    name: {
      en: "Hotan Night Market (Hetian)",
      th: "ตลาดกลางคืนโฮตัน (เฮ่อเถียน)",
      zh: "和田夜市",
    },
    location: {
      en: "Hotan Renmin Road Night Market",
      th: "ถนนเหรินหมิน ตลาดกลางคืนโฮตัน",
      zh: "和田人民路夜市",
    },
    region: "hotan",
    cuisine: { en: "Hotan Regional Street Food", th: "สตรีทฟู้ดโฮตัน", zh: "和田街头小吃" },
    priceRange: { en: "₴ 10-60 RMB", th: "ถูก 10-60 หยวน", zh: "便宜 10-60元" },
    hours: { en: "19:00 - 02:00", th: "19:00 - 02:00 น.", zh: "19:00 - 02:00" },
    rating: 4.7,
    tags: {
      en: ["Legendary", "Night Market", "Must-Try"],
      th: ["ตำนาน", "ตลาดกลางคืน", "ต้องลอง"],
      zh: ["传奇", "夜市", "必试"],
    },
    signature: {
      en: "Roasted whole lamb & jade-water baked eggs",
      th: "แกะย่างทั้งตัวและไข่อบน้ำหยก",
      zh: "烤全羊与玉石水烤蛋",
    },
    description: {
      en: "One of China's most famous night markets. Roasted eggs baked in hot ash, giant skewered lamb, cold noodles, and yogurt. A 400-meter corridor of pure food paradise on the Silk Road.",
      th: "หนึ่งในตลาดกลางคืนที่โด่งดังที่สุดของจีน ไข่ย่างในเถ้าถ่านร้อน ไม้เสียบเนื้อแกะยักษ์ บะหมี่เย็น และโยเกิร์ต ทางเดินยาว 400 เมตรเต็มไปด้วยสรวงสวรรค์อาหารแห่งเส้นทางสายไหม",
      zh: "中国最著名夜市之一。炭灰烤蛋、巨型烤羊腿、凉皮、酸奶。一条400米的丝绸之路美食天堂长廊。",
    },
    tip: {
      en: "The baked eggs (kao jidan) cooked in hot sand/ash are a Hotan exclusive — don't miss them.",
      th: "ไข่อบในทราย/เถ้าร้อน (kao jidan) เป็นเอกลักษณ์เฉพาะโฮตัน — ห้ามพลาด",
      zh: "沙灰烤蛋是和田独有，一定要尝。",
    },
  },
  {
    id: "hotan_zepu_lamb",
    name: {
      en: "Zepu County Lamb Hotpot",
      th: "หม้อไฟเนื้อแกะอำเภอเจ๋อผู่",
      zh: "泽普县羊肉火锅",
    },
    location: {
      en: "Zepu County Town",
      th: "ตัวเมืองอำเภอเจ๋อผู่",
      zh: "泽普县城",
    },
    region: "hotan",
    cuisine: { en: "Xinjiang Hotpot", th: "หม้อไฟซินเจียง", zh: "新疆火锅" },
    priceRange: { en: "₴₴ 70-130 RMB", th: "ปานกลาง 70-130 หยวน", zh: "中等 70-130元" },
    hours: { en: "11:00 - 23:30", th: "11:00 - 23:30 น.", zh: "11:00 - 23:30" },
    rating: 4.4,
    tags: {
      en: ["Comfort", "Warm", "Pit-Stop"],
      th: ["สบายท้อง", "อบอุ่น", "พักทาน"],
      zh: ["舒适", "暖胃", "途中"],
    },
    signature: {
      en: "Clear-broth lamb hotpot with hand-sliced meat",
      th: "หม้อไฟเนื้อแกะน้ำใส เนื้อหั่นมือ",
      zh: "清汤羊肉涮锅，手切鲜羊肉",
    },
    description: {
      en: "After the Golden Poplar Forest walk, this cozy hotpot hits the spot. Tender local lamb cooked table-side in clear broth, dipped in sesame sauce. Perfect autumn evening comfort food.",
      th: "หลังเดินชมป่าปอปลาร์ทอง หม้อไฟอบอุ่นนี้ตอบโจทย์ เนื้อแกะท้องถิ่นนุ่มๆ ต้มสดๆ บนโต๊ะในน้ำซุปใส จิ้มซอสงา อาหารคลายเหนื่อยยามเย็นฤดูใบไม้ร่วงที่สมบูรณ์แบบ",
      zh: "游览金胡杨林后，这家温馨火锅正合时宜。本地鲜嫩羊肉清汤涮煮，蘸麻酱。秋日傍晚的完美慰藉美食。",
    },
    tip: {
      en: "The poplar-forest area has limited dining — this is the most reliable sit-down meal nearby.",
      th: "บริเวณป่าปอปลาร์มีร้านอาหารจำกัด — นี่คือมื้อนั่งทานที่พึ่งพาได้มากที่สุดใกล้ๆ",
      zh: "胡杨林景区餐饮有限，这是附近最靠谱的堂食选择。",
    },
  },

  // ===================== AKSU =====================
  {
    id: "aksu_apple_pilaf",
    name: {
      en: "Aksu Apple Orchard Pilaf House",
      th: "ร้านข้าวหมกไก่สวนแอปเปิ้ลอักซู",
      zh: "阿克苏苹果园手抓饭店",
    },
    location: {
      en: "Aksu City Center",
      th: "ตัวเมืองอักซู",
      zh: "阿克苏市区",
    },
    region: "aksu",
    cuisine: { en: "Uyghur Polo Pilaf", th: "ข้าวหมกโปโลอุยกูร์", zh: "维吾尔抓饭" },
    priceRange: { en: "₴ 25-50 RMB", th: "ถูก 25-50 หยวน", zh: "便宜 25-50元" },
    hours: { en: "10:00 - 21:00", th: "10:00 - 21:00 น.", zh: "10:00 - 21:00" },
    rating: 4.5,
    tags: {
      en: ["Signature Dish", "Quick", "Cheap Eats"],
      th: ["เมนูเด็ด", "เร็ว", "ราคาประหยัด"],
      zh: ["招牌", "快捷", "平价"],
    },
    signature: {
      en: "Lamb pilaf (Polo) with caramelized carrots & raisins",
      th: "ข้าวหมกแกะ (Polo) แคร์รอตหวานและลูกเกด",
      zh: "羊肉抓饭配胡萝卜与葡萄干",
    },
    description: {
      en: "Aksu is famous for apples and polo. This no-frills house serves giant platters of golden pilaf where each grain is separate, studded with tender lamb, sweet carrots, and plump raisins.",
      th: "อักซูขึ้นชื่อเรื่องแอปเปิ้ลและโปโล ร้านเรียบง่ายนี้เสิร์ฟจานใหญ่ข้าวหมกสีทองที่เมล็ดแยกกันโรยเนื้อแกะนุ่ม แคร์รอตหวาน และลูกเกดอวบ",
      zh: "阿克苏以苹果和抓饭闻名。这家朴实小店盛上金黄抓饭大餐，米粒分明，铺满嫩羊肉、甜胡萝卜和饱满葡萄干。",
    },
    tip: {
      en: "Pair with a cold Aksu apple juice — the region's fruit is famously sweet.",
      th: "จับคู่กับน้ำแอปเปิ้ลอักซูเย็นๆ — ผลไม้ภาคนี้ขึ้นชื่อเรื่องความหวาน",
      zh: "配一杯冰镇阿克苏苹果汁，本地水果甜度闻名。",
    },
  },
  {
    id: "aksu_old_street_bbq",
    name: {
      en: "Aksu Old Street BBQ Corner",
      th: "มุมบาร์บีคิวถนนเก่าอักซู",
      zh: "阿克苏老街烧烤摊",
    },
    location: {
      en: "Aksu Old Street (Laojie)",
      th: "ถนนเก่าอักซู (Laojie)",
      zh: "阿克苏老街",
    },
    region: "aksu",
    cuisine: { en: "Xinjiang BBQ & Noodles", th: "บาร์บีคิวและบะหมี่ซินเจียง", zh: "新疆烧烤面食" },
    priceRange: { en: "₴ 15-60 RMB", th: "ถูก 15-60 หยวน", zh: "便宜 15-60元" },
    hours: { en: "17:00 - 00:00", th: "17:00 - 00:00 น.", zh: "17:00 - 00:00" },
    rating: 4.4,
    tags: {
      en: ["Local Vibe", "Evening", "Casual"],
      th: ["บรรยากาศท้องถิ่น", "ยามเย็น", "สบายๆ"],
      zh: ["本地氛围", "傍晚", "随意"],
    },
    signature: {
      en: "Cumin-dusted lamb skewers & Laghman noodles",
      th: "ไม้เสียบเนื้อแกะโรยยี่หร่าและบะหมี่ลากหม่าน",
      zh: "孜然羊肉串与拉条子",
    },
    description: {
      en: "Wander Aksu's old lanes in the evening and you'll find rows of charcoal grills. The smell of cumin and lamb fills the air. Pull up a stool, order skewers by the dozen, and a bowl of chewy laghman noodles.",
      th: "เดินเล่นย่านเก่าอักซูยามเย็นจะเจอแถวเตาถ่านย่าง กลิ่นยี่หร่าและเนื้อแกะลอยตลบ ดึงเก้าอี้นั่ง สั่งไม้เสียบเป็นโหล และชามบะหมี่ลากหม่านเหนียวนุ่ม",
      zh: "傍晚漫步阿克苏老巷，成排炭火烤炉，孜然与羊肉香气四溢。拉张凳子，按打点羊肉串，再来一碗筋道拉条子。",
    },
    tip: {
      en: "Point and order — most stalls have no English menu. 'Yāng ròu chuàn' = lamb skewers.",
      th: "ชี้และสั่งได้เลย — ร้านส่วนใหญ่ไม่มีเมนูภาษาอังกฤษ 'Yāng ròu chuàn' = ไม้เสียบเนื้อแกะ",
      zh: "直接比划点单即可，多数摊位无英文菜单。“羊肉串”即lamb skewers。",
    },
  },
];
