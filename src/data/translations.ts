import { ActiveTab } from "../types";

export interface TranslatedItineraryDay {
  title: string;
  subtitle: string;
  description: string;
  activities: string[];
  weatherForecast: string;
}

export interface TranslatedHotel {
  name: string;
  description: string;
  location: string;
  address: string;
  amenities: string[];
  highlights: string[];
}

export interface TranslatedBudgetCategory {
  name: string;
  details: string;
}

export interface Translations {
  ui: {
    title: string;
    subtitle: string;
    days: string;
    totalDistance: string;
    maxElevation: string;
    luxuryCost: string;
    activeDayPreview: string;
    viewItineraryBtn: string;
    routeSummary: string;
    interactiveMapBtn: string;
    altitudeWarningTitle: string;
    altitudeWarningDesc: string;
    hotelsHeader: string;
    hotelsDesc: string;
    bookOnTrip: string;
    budgetHeader: string;
    budgetDesc: string;
    totalBudget: string;
    flightHeader: string;
    flightDesc: string;
    flightDuration: string;
    flightAllowance: string;
    flightAlert: string;
    liveHeader: string;
    liveDesc: string;
    liveSpeed: string;
    liveAltitude: string;
    liveEta: string;
    liveWeather: string;
    liveAlerts: string;
    liveSimBtnActive: string;
    liveSimBtnInactive: string;
    supportHeader: string;
    supportDesc: string;
    supportCall: string;
    supportWechat: string;
    supportEmail: string;
    supportDuty: string;
    supportLangs: string;
    supportLiaison: string;
    supportLiaisonDesc: string;
    overview: string;
    itinerary: string;
    map: string;
    hotels: string;
    budget: string;
    flights: string;
    live: string;
    support: string;
    schedule: string;
    notesHeader: string;
    notesLabel: string;
    notesPlaceholder: string;
    notesSync: string;
  };
  itinerary: Record<number, TranslatedItineraryDay>;
  hotels: Record<string, TranslatedHotel>;
  budget: Record<string, TranslatedBudgetCategory>;
}

export const TRANSLATIONS_DATA: Record<"en" | "th" | "zh", Translations> = {
  en: {
    ui: {
      title: "SOUTHERN XINJIANG",
      subtitle: "Legendary Route • Best-Value Luxury",
      days: "10 Days",
      totalDistance: "Total Distance",
      maxElevation: "Max Elevation",
      luxuryCost: "Luxury Cost",
      activeDayPreview: "Active Day {day} Preview",
      viewItineraryBtn: "View Full Itinerary",
      routeSummary: "Route Summary & Segments",
      interactiveMapBtn: "Interactive Map",
      altitudeWarningTitle: "High Altitude Advisory",
      altitudeWarningDesc: "This segment crosses altitudes exceeding 3,000 meters. Rest frequently, avoid fast walking, and keep oxygen bottles ready. In-room oxygen is provided at the accommodation.",
      hotelsHeader: "Luxury Stays & Accommodations",
      hotelsDesc: "Selected high-end hotels, boutiques, and customized desert glamping sites for the Southern Xinjiang tour.",
      bookOnTrip: "Book on Trip.com",
      budgetHeader: "Travel Budget & Cost Split",
      budgetDesc: "Comprehensive breakdown of the all-inclusive package cost for the expedition.",
      totalBudget: "Total Package Cost",
      flightHeader: "Flights & Transit Details",
      flightDesc: "Outbound and return flight routes connecting Bangkok (BKK) and Southern Xinjiang airports via Chongqing (CKG).",
      flightDuration: "Total Duration",
      flightAllowance: "Allowance",
      flightAlert: "Thai passport holders are exempt from Chinese tourist visa for up to 30 days. Verify transfer terminal at CKG.",
      liveHeader: "Live Telemetry & Safety Status",
      liveDesc: "Real-time simulated tracking coordinates, speed telemetry, local mountain altitude, and road alerts.",
      liveSpeed: "Current Speed",
      liveAltitude: "Altitude Elevation",
      liveEta: "ETA to Lodge",
      liveWeather: "Lodge Weather",
      liveAlerts: "Active Safety & Road Alerts",
      liveSimBtnActive: "Pause Simulator",
      liveSimBtnInactive: "Activate Live Simulator",
      supportHeader: "Expedition Support Hub",
      supportDesc: "Dedicated concierge support available 24/7 during your journey through Southern Xinjiang.",
      supportCall: "Call Phone Hotline",
      supportWechat: "WeChat ID",
      supportEmail: "Send Email",
      supportDuty: "Active Duty Connection",
      supportLangs: "Languages spoken",
      supportLiaison: "Trip Guidelines & Emergency",
      supportLiaisonDesc: "In Pamir high passes, mobile network can drop. The crew carries active Beidou Satellite messengers. Your guide will assist with passport verification at all regional stops and highway checkpoints.",
      overview: "Overview",
      itinerary: "Itinerary",
      map: "Map",
      hotels: "Stays",
      budget: "Expenses",
      flights: "Flights",
      live: "Chat",
      support: "Support",
      schedule: "Schedule",
      notesHeader: "Travel Notes",
      notesLabel: "Personal Notepad (Persisted)",
      notesPlaceholder: "Type your notes, packing check, packing list, or local food recommendations for this day here...",
      notesSync: "Notes are synchronized locally and saved automatically under the active travel state.",
    },
    itinerary: {
      1: {
        title: "Arrive in Kashgar",
        subtitle: "Gateway to Southern Xinjiang",
        description: "Travel from Bangkok Suvarnabhumi Airport. Transit in Chongqing Jiangbei Airport (CKG) during the afternoon (visit city or rest), then take your connecting flight to Kashgar. Check-in at JF Feng Hotel and explore the lively Kashgar Old Town night markets.",
        activities: [
          "Suvarnabhumi Airport departure BKK-CKG (00:30 - 05:00)",
          "Transit rest or rapid city tour in Chongqing (05:00 - 13:30)",
          "Chongqing departure to Kashgar CKG-KHG (13:30 - 18:55)",
          "Check-in at JF Feng Hotel",
          "Night exploration of historic Kashgar Old Town lanes",
        ],
        weatherForecast: "Clear skies, cool evening breeze",
      },
      2: {
        title: "Pamir Route (Kashgar → Tashkurgan)",
        subtitle: "Ascending the Plateau",
        description: "Depart Kashgar and head south along the scenic Karakoram Highway. Stop at the stunning white sand dunes of Baisha Lake. Move on to Karakul Lake (3,600m) to marvel at Muztagh Ata. Continue ascending to Tashkurgan Pamir Plateau.",
        activities: [
          "Drive along Karakoram Highway mountain pass",
          "Scenic stop at Baisha Lake (White Sand Lake)",
          "Stroll near the glacial waters of Karakul Lake",
          "Ascend and check-in at Meet Torgrencia Tent Camp",
        ],
        weatherForecast: "Cold and windy mountain weather",
      },
      3: {
        title: "Panlong Ancient Road",
        subtitle: "Over 600 Hairpin Turns",
        description: "Embark on the legendary Panlong Ancient Road, famous for its 600+ curves. Tour the deep blue Bandir Blue Lake and view the unique Pamir Eye rock structure. Return to Tashkurgan for the night.",
        activities: [
          "Drive on Panlong Winding Pass (Panlong Ancient Road)",
          "Sightseeing stop at Bandir Blue Lake",
          "Stargazing and viewing the Pamir Eye geological landmark",
          "Return to glamping site in Tashkurgan",
        ],
        weatherForecast: "Crisp plateau sunshine, freezing winds",
      },
      4: {
        title: "Muztagh Ata Glacier Park → Kashgar",
        subtitle: "Father of Ice Mountains",
        description: "Check out of Tashkurgan and visit Muztagh Ata Glacier Park to experience ancient glaciers up close. Drive back down the Karakoram Highway to Kashgar, checking in at the Lavande Hotel.",
        activities: [
          "Explore the frozen paths of Muztagh Ata Glacier Park",
          "Acclimatization walk around glacier bases",
          "Scenic mountain descent drive along KKH",
          "Arrive in Kashgar and check in at Lavande Hotel",
        ],
        weatherForecast: "Overcast skies, mild in Kashgar valley",
      },
      5: {
        title: "Zepu Golden Poplar (Kashgar → Yecheng)",
        subtitle: "Golden Forests of the Desert",
        description: "Head east to Yarkant County. Explore the vibrant Zepu Golden Poplar Forest along the Yarkand River. Continue the drive to Yecheng, checking in at the Vienna Hotel near the zero kilometer mark.",
        activities: [
          "Drive to historical Yarkant County",
          "Hike inside Zepu Golden Poplar Forest",
          "Arrive at Yecheng (Start point of G219 highway)",
          "Check-in at Vienna Hotel Yecheng",
        ],
        weatherForecast: "Clear and warm oasis weather",
      },
      6: {
        title: "Yotkan Ancient City (Yecheng → Hotan)",
        subtitle: "Ancient Kingdom of Khotan",
        description: "Depart Yecheng and visit Xitiya Lost City. Tour the rebuilt Yotkan Ancient City and its museum to learn about Khotanese history. Continue to Hotan, checking in at the Xi'an Hotel near the Night Market.",
        activities: [
          "Visit Xitiya Lost City (Ancient Ruins)",
          "Explore Yotkan Ancient City museum & displays",
          "Drive to Hotan oasis center",
          "Check-in at Xi'an Hotel and explore Hotan Night Market",
        ],
        weatherForecast: "Warm afternoon sun, perfect night bazaar",
      },
      7: {
        title: "Taklamakan Desert Highway",
        subtitle: "Crossing the Sea of Death",
        description: "Embark on an 8-hour drive crossing the Taklamakan Desert Highway. Experience the endless, shifting orange sand dunes. Reach Aral (Alar) in the evening and check in at the Wanda Moments hotel.",
        activities: [
          "Start early for the Taklamakan Desert Highway crossing",
          "Desert highway photography and rest stop",
          "Witness sunset over desert dunes",
          "Arrive at Aral Tarim basin city and check-in at Wanda Moments",
        ],
        weatherForecast: "Chilly desert wind, clear dry air",
      },
      8: {
        title: "Tomur Grand Canyon (Aral → Aksu)",
        subtitle: "Tianshan Red Gorge",
        description: "Drive north-west from Aral. Explore the massive red clay walls of the Tomur Grand Canyon (Tianshan Canyon system). Drive to Aksu city and check-in at Aksu Huarui Hotel.",
        activities: [
          "Drive to Tomur Grand Canyon national geopark",
          "Hike inside the red gorges of Tomur Canyon",
          "Scenic drive to Aksu center",
          "Check-in at Aksu Huarui Hotel (Night 1/2)",
        ],
        weatherForecast: "Bright afternoon sun, cool canyons",
      },
      9: {
        title: "Aksu Free Day",
        subtitle: "Exploring Aksu Culture",
        description: "Enjoy a free leisure day in Aksu. Stroll through the ancient streets of Aksu Old Street, sample local apples and Uyghur flatbread, shop for souvenirs, and prepare for your flight back home tomorrow.",
        activities: [
          "Leisure walk around Aksu Old Street",
          "Local food tasting (lamb skewers, Aksu apples)",
          "Souvenir shopping at local bazaars",
          "Pre-departure packing and hotel rest",
        ],
        weatherForecast: "Mild afternoon clouds",
      },
      10: {
        title: "Departure (Aksu → Bangkok)",
        subtitle: "Farewell Xinjiang Loop",
        description: "Transfer to Aksu Airport (AKU). Board your China Southern Airlines flight to Chongqing Jiangbei (CKG), layover for 3.35 hours, then catch your connecting flight to Bangkok (BKK). Arrive home in the evening.",
        activities: [
          "Morning airport transfer to AKU",
          "Flight departure from Aksu to Chongqing AKU-CKG (12:40 - 16:55)",
          "Transit wait in Chongqing CKG (16:55 - 21:30)",
          "Connecting flight from Chongqing to Bangkok CKG-BKK (21:30 - 23:30)",
        ],
        weatherForecast: "Sunny and clear skies",
      },
    },
    hotels: {
      feng: {
        name: "JF Feng Hotel",
        description: "Located near the Xiangfei Hometown (Panthuo Castle) in Kashgar. A modern boutique hotel close to the Kashgar Old Town International Food Street.",
        location: "Kashgar City",
        address: "No. 288 Duolaitebage Road, Kashgar, Xinjiang, China",
        amenities: ["Free Wi-Fi", "Oxygen room features", "Close to food street", "Coffee lounge"],
        highlights: ["Located directly on the International Food Street", "Modern styling and rapid check-in"],
      },
      torgrencia: {
        name: "Meet Torgrencia Tent Camp",
        description: "Luxury stargazing glamping site in Tashkurgan county. Fully equipped dome tents with heated beds and Pamir view terraces.",
        location: "Tashkurgan County",
        address: "Grasslands area, Tahman Township, Tashkurgan, Xinjiang, China",
        amenities: ["Geodesic dome tents", "Heated blankets", "Pamir stargazing deck", "Private campsite guide"],
        highlights: ["Located right in the scenic grassland of Tashkurgan", "Stunning sunrise views over Pamir peaks"],
      },
      lavande: {
        name: "Lavande Hotel Kashgar",
        description: "A Lavender-scented modern business hotel located in Kashgar Old Town, right near the Wanda Plaza complex.",
        location: "Kashgar Old Town",
        address: "No. 55 Shiji Avenue, Kashgar, Xinjiang, China",
        amenities: ["Lavender aroma suites", "Wanda Plaza access", "Smart home controls", "Airport shuttle service"],
        highlights: ["Situated close to Wanda Plaza for shopping and dining", "Relaxing scented rooms and premium bedding"],
      },
      vienna: {
        name: "Vienna Hotel",
        description: "Premium classical-style hotel located at the zero-kilometer starting point in Yecheng, the gateway to the G219 highway.",
        location: "Yecheng Center",
        address: "Zero Kilometer Landmark, G219 Highway, Yecheng, Xinjiang, China",
        amenities: ["Soundproof rooms", "Large breakfast buffet", "Secure SUV parking", "24h desk service"],
        highlights: ["Perfect base for starting or ending mountain highway travels", "Highly comfortable standard bedding"],
      },
      xian: {
        name: "Xi'an Hotel",
        description: "Contemporary-style boutique hotel situated right next to the famous Hetian Night Market museum in Yingbin road.",
        location: "Hotan Center",
        address: "Near Yingbin Road Night Market, Hotan, Xinjiang, China",
        amenities: ["Modern aesthetic lobby", "Hetian Night Market access", "Soundproof rooms", "Coffee bar"],
        highlights: ["Right beside the Night Market museum", "Aroma-scented suites and smart panels"],
      },
      wanda: {
        name: "Wanda Moments Aral",
        description: "A premium business luxury hotel in Aral (Alar), situated close to Tarim University.",
        location: "Aral (Alar) City",
        address: "Intersection of Daxue Road & Tunken Avenue, Aral, Xinjiang, China",
        amenities: ["VIP Lounge", "Tarim River view suites", "Modern gym", "Chinese/Western dining"],
        highlights: ["Luxury accommodations in the newly developed Tarim district", "Within walking distance to local shopping squares"],
      },
      huarui: {
        name: "Aksu Huarui Hotel",
        description: "A high-end luxury business hotel in Aksu city, located in Jinlan Plaza. Features excellent facilities and large dining suites.",
        location: "Aksu Jinlan Plaza",
        address: "Core Area of Jinlan Plaza, Aksu, Xinjiang, China",
        amenities: ["Indoor heated pool", "Exec Club Lounge", "VIP dining banquet", "Airport shuttle service"],
        highlights: ["Best central location in Aksu for shopping and dining", "Premium service quality and oxygenated lobby spaces"],
      },
    },
    budget: {
      flights: {
        name: "Outbound/Return Flights",
        details: "Round trip flights connecting Bangkok (BKK) and Xinjiang (Kashgar outbound, Aksu return) via Chongqing Jiangbei Airport (CKG).",
      },
      transport: {
        name: "Private Van & Driver",
        details: "Private 7-seater luxury van rental + dedicated local driver for 8 days (1,200 RMB/day * 8 days = 9,600 RMB split among 6 passengers), including empty return day.",
      },
      hotels: {
        name: "Luxury Hotels (9 Nights)",
        details: "Shared double room rates for 9 nights in top-tier hotels and glamping camp (Total cost: 11,701 THB per room / 2 people sharing).",
      },
      tickets: {
        name: "Entrance Fees & Tickets",
        details: "Entrance tickets for Zepu Golden Poplar, Yotkan Ancient City, Muztagh Ata Glacier Park, Tomur Grand Canyon, and local guided passes.",
      },
    },
  },
  th: {
    ui: {
      title: "ซินเจียงใต้ (ประเทศจีน)",
      subtitle: "เส้นทางในตำนาน • เที่ยวหรูสุดคุ้ม",
      days: "10 วัน",
      totalDistance: "ระยะทางรวม",
      maxElevation: "ความสูงสูงสุด",
      luxuryCost: "ราคารวมแพ็กเกจ",
      activeDayPreview: "ตัวอย่างกิจกรรม วันที่ {day}",
      viewItineraryBtn: "ดูแผนการเดินทางทั้งหมด",
      routeSummary: "สรุปเส้นทางและระยะทางขับรถ",
      interactiveMapBtn: "แผนที่แบบโต้ตอบ",
      altitudeWarningTitle: "คำเตือนพื้นที่ระดับความสูงสูง",
      altitudeWarningDesc: "เส้นทางช่วงนี้ข้ามระดับความสูงเกิน 3,000 เมตร ควรพักผ่อนบ่อยๆ หลีกเลี่ยงการเดินเร็ว และเตรียมถังออกซิเจนให้พร้อม มีการจัดเตรียมออกซิเจนไว้ให้ในห้องพักของโรงแรม",
      hotelsHeader: "ที่พักยอดเยี่ยมตลอดทริป",
      hotelsDesc: "รายชื่อโรงแรมระดับพรีเมียม บูติกโฮเทล และแคมป์โดมกลางทะเลทรายที่ได้รับการคัดสรรมาเป็นพิเศษ",
      bookOnTrip: "ดูลิงก์จองบน Trip.com",
      budgetHeader: "งบประมาณและค่าใช้จ่าย",
      budgetDesc: "รายละเอียดการแบ่งสัดส่วนค่าใช้จ่ายทั้งหมดของแพ็กเกจนำเที่ยวต่อบุคคล",
      totalBudget: "ราคารวมแพ็กเกจต่อคน",
      flightHeader: "รายละเอียดเที่ยวบินและการต่อเครื่อง",
      flightDesc: "เที่ยวบินขาไปและขากลับ เชื่อมต่อกรุงเทพฯ (BKK) และซินเจียงใต้ ผ่านสนามบินฉงชิ่ง (CKG)",
      flightDuration: "เวลาเดินทางรวม",
      flightAllowance: "น้ำหนักกระเป๋า",
      flightAlert: "ผู้เดินทางสัญชาติไทยได้รับการยกเว้นวีซ่าเข้าประเทศจีนท่องเที่ยวได้ 30 วันโดยไม่ต้องขอวีซ่าล่วงหน้า โปรดตรวจสอบอาคารเปลี่ยนเครื่องที่ CKG",
      liveHeader: "ข้อมูลนำทางและแจ้งเตือนความปลอดภัย",
      liveDesc: "ข้อมูลพิกัด GPS จำลอง, ความเร็วรถ, ความสูงระดับน้ำทะเล และการแจ้งเตือนความปลอดภัยบนท้องถนน",
      liveSpeed: "ความเร็วปัจจุบัน",
      liveAltitude: "ระดับความสูง",
      liveEta: "เวลาถึงที่พักโดยประมาณ",
      liveWeather: "สภาพอากาศที่พัก",
      liveAlerts: "ข้อความแจ้งเตือนความปลอดภัย",
      liveSimBtnActive: "หยุดจำลองเส้นทาง",
      liveSimBtnInactive: "เริ่มจำลองเส้นทางแบบเรียลไทม์",
      supportHeader: "ศูนย์บริการช่วยเหลือนำเที่ยว",
      supportDesc: "บริการติดต่อช่วยเหลือประสานงานดูแลตลอด 24 ชั่วโมงในระหว่างการเดินทางซินเจียงใต้",
      supportCall: "โทรศัพท์",
      supportWechat: "วีแชท ID",
      supportEmail: "ส่งอีเมลติดต่อ",
      supportDuty: "สถานะการเชื่อมต่อ: พร้อมช่วยเหลือ",
      supportLangs: "ภาษาที่สื่อสารได้",
      supportLiaison: "ข้อแนะนำเดินทางและกรณีฉุกเฉิน",
      supportLiaisonDesc: "ในพื้นที่ช่องเขาปามีร์ที่สูง สัญญาณมือถืออาจขาดหาย ทีมงานมีอุปกรณ์ส่งข้อความผ่านดาวเทียมเป่ยโต่ว (Beidou) ตลอดเวลา ไกด์นำเที่ยวจะคอยช่วยเหลือตรวจเอกสารที่จุดตรวจทางหลวงทุกจุด",
      overview: "ภาพรวม",
      itinerary: "แผนเดินทาง",
      map: "แผนที่",
      hotels: "ที่พัก",
      budget: "บันทึกค่าใช้จ่าย",
      flights: "เที่ยวบิน",
      live: "แชท",
      support: "ช่วยเหลือ",
      schedule: "ตารางเวลา",
      notesHeader: "บันทึกเดินทาง",
      notesLabel: "สมุดบันทึกส่วนตัว (บันทึกอัตโนมัติ)",
      notesPlaceholder: "พิมพ์บันทึกย่อ สิ่งที่ต้องเตรียม หรือเมนูอาหารท้องถิ่นที่อยากลองในวันนี้ที่นี่...",
      notesSync: "บันทึกต่างๆ จะซิงก์ในระบบและบันทึกอัตโนมัติภายใต้ทริปปัจจุบันของคุณ",
    },
    itinerary: {
      1: {
        title: "เดินทางถึงคัชการ์",
        subtitle: "ประตูสู่ซินเจียงตอนใต้",
        description: "เดินทางจากสนามบินสุวรรณภูมิ รอต่อเครื่องที่สนามบินฉงชิ่งเจียงเป่ย์ในช่วงบ่าย (สามารถฝากกระเป๋าแล้วแวะเข้าเมืองเที่ยวหรือรับประทานอาหารได้) จากนั้นเดินทางถึงคัชการ์ในช่วงค่ำ เช็กอินที่โรงแรมเจเอฟเฟิง และเดินเล่นตลาดกลางคืนเมืองโบราณคัชการ์",
        activities: [
          "ออกเดินทางจากสนามบินสุวรรณภูมิ BKK-CKG (00:30 - 05:00)",
          "พักรอต่อเครื่องหรือแวะเที่ยวเมืองฉงชิ่งแบบรวดเร็ว (05:00 - 13:30)",
          "เดินทางออกจากฉงชิ่งสู่คัชการ์ CKG-KHG (13:30 - 18:55)",
          "เช็กอินเข้าพักที่โรงแรมเจเอฟเฟิง คัชการ์",
          "เดินเล่นชมสีสันเมืองโบราณคัชการ์ยามค่ำคืน",
        ],
        weatherForecast: "ท้องฟ้าแจ่มใส ลมเย็นในยามค่ำคืน",
      },
      2: {
        title: "เส้นทางปามีร์ (คัชการ์ → ทัชเคอร์กัน)",
        subtitle: "ไต่ระดับขึ้นสู่ที่ราบสูงปามีร์",
        description: "ออกเดินทางจากคัชการ์มุ่งหน้าลงใต้ตามทางหลวงคาราโกรัม แวะชมเนินทรายสีขาวและทะเลสาบไป๋ซาหู ถ่ายภาพทะเลสาบคาราคูล (3,600 ม.) ที่สะท้อนยอดเขาหิมะมุซทัคอาตา จากนั้นเดินทางต่อถึงเมืองทัชเคอร์กัน",
        activities: [
          "ขับรถเส้นทางวิวภูเขาสุดตระการตาทางหลวงคาราโกรัม",
          "แวะถ่ายภาพคู่เนินทรายขาว ทะเลสาบไป๋ซาหู",
          "เดินเล่นริมฝั่งน้ำใส ทะเลสาบคาราคูล",
          "ไต่ระดับขึ้นเช็กอินที่พัก Meet Torgrencia Tent Camp",
        ],
        weatherForecast: "หนาวเย็นและมีลมแรงบนภูเขา",
      },
      3: {
        title: "ถนนพันโค้งพานหลง",
        subtitle: "โค้งหักศอกกว่า 600 โค้ง",
        description: "พิชิตถนนพันโค้งพานหลง เส้นทางคดเคี้ยวเลื่องชื่อกว่า 600 โค้ง แวะชมทะเลสาบบันดีร์บลูน้ำสีน้ำเงินเข้ม และถ่ายรูปหินรูปดวงตาปามีร์ยักษ์ ก่อนเดินทางกลับมาพักที่ทัชเคอร์กัน",
        activities: [
          "ขับรถท้าทายโค้งถนนพานหลงบนเขา",
          "แวะชมทัศนียภาพที่สวยงามของทะเลสาบบันดีร์บลู",
          "ชมความมหัศจรรย์ทางธรณีวิทยาจุดชมวิวดวงตาปามีร์",
          "กลับเข้าพักผ่อนที่แคมป์ดาราศาสตร์ทัชเคอร์กัน",
        ],
        weatherForecast: "แสงแดดที่ราบสูง ลมหนาวพัดแรงจัด",
      },
      4: {
        title: "อุทยานธารน้ำแข็งมุซทัคอาตา → คัชการ์",
        subtitle: "ชมธารน้ำแข็งล้านปีใกล้ชิด",
        description: "เช็กเอาต์จากทัชเคอร์กัน แวะเที่ยวอุทยานธารน้ำแข็งมุซทัคอาตา สัมผัสธารน้ำแข็งโบราณอย่างใกล้ชิด จากนั้นขับรถลงจากที่ราบสูงกลับสู่เมืองคัชการ์ เช็กอินที่โรงแรมลาวานด์",
        activities: [
          "เดินเที่ยวชมธารน้ำแข็งโบราณที่อุทยานมุซทัคอาตา",
          "เดินชมวิวทิวทัศน์ธรรมชาติรอบๆ ธารน้ำแข็ง",
          "ขับรถลงเขาเส้นทางทางหลวงคาราโกรัมย้อนกลับ",
          "เดินทางถึงคัชการ์และเช็กอินที่โรงแรมลาวานด์ คัชการ์",
        ],
        weatherForecast: "มีเมฆบางส่วน อากาศอบอุ่นขึ้นในหุบเขาคัชการ์",
      },
      5: {
        title: "ป่าต้นปอปลาร์หูหยางเจ๋อผู่ (คัชการ์ → เย่เฉิง)",
        subtitle: "สีทองอร่ามของป่าโบราณริมฝั่งน้ำ",
        description: "เดินทางไปทางตะวันออกสู่ยาร์กัต ชมความงดงามของป่าต้นปอปลาร์สีทองหูหยางเจ๋อผู่ริมแม่น้ำยาร์กัต จากนั้นเดินทางต่อไปยังเมืองเย่เฉิง เช็กอินที่โรงแรมเวียนนาใกล้จุดเริ่มต้นทางหลวงประวัติศาสตร์ G219",
        activities: [
          "เดินทางสู่เมืองประวัติศาสตร์ยาร์กัต",
          "เดินป่าศึกษาธรรมชาติในป่าปอปลาร์ทองหูหยางเจ๋อผู่",
          "เดินทางถึงเย่เฉิง (จุดกิโลเมตรศูนย์ G219 ซินเจียง-ทิเบต)",
          "เช็กอินเข้าพักที่โรงแรมเวียนนา เย่เฉิง",
        ],
        weatherForecast: "อากาศอบอุ่นสบาย แดดจัดตลอดวัน",
      },
      6: {
        title: "เมืองโบราณโยตกัน (เย่เฉิง → โฮตััน)",
        subtitle: "ย้อนเวลาสู่อาณาจักรโฮตานโบราณ",
        description: "เดินทางออกจากเย่เฉิง แวะเที่ยวซากเมืองโบราณซีถีหยา ชมการจำลองเมืองและพิพิธภัณฑ์เมืองโบราณโยตกัน เพื่อเรียนรู้ประวัติศาสตร์เส้นทางสายไหมสายใต้ เดินทางต่อไปยังโฮตัน เช็กอินโรงแรมซีอานติดตลาดกลางคืนโฮตัน",
        activities: [
          "แวะชมร่องรอยประวัติศาสตร์ซากโบราณสถานซีถีหยา",
          "ชมการจัดแสดงและเมืองจำลองโยตกัน",
          "เดินทางสู่โอเอซิสเมืองโฮตัน",
          "เช็กอินโรงแรมซีอาน และลิ้มลองอาหารท้องถิ่นตลาดโฮตัน",
        ],
        weatherForecast: "แดดอุ่นช่วงกลางวัน อากาศเย็นสบายในยามค่ำคืน",
      },
      7: {
        title: "ทางหลวงทะเลทรายทากลามากาน",
        subtitle: "ข้ามทะเลทรายที่ใหญ่ที่สุดของจีน",
        description: "เดินทางยาวนานกว่า 8 ชั่วโมง ข้ามทางหลวงทะเลทรายทากลามากาน สัมผัสทิวทัศน์คลื่นเนินทรายสีส้มสุดลูกหูลูกตา เดินทางถึงเมืองอารัล (Alar) ในตอนเย็นและเช็กอินที่โรงแรมว่านด้าโมเมนต์ส",
        activities: [
          "ออกเดินทางแต่เช้าเพื่อข้ามทางหลวงทะเลทรายทากลามากาน",
          "แวะถ่ายภาพคลื่นทรายสีทองกลางทะเลทราย",
          "ชมพระอาทิตย์ตกดินเหนือสันทรายอันกว้างใหญ่",
          "เดินทางถึงเมืองอารัลและเช็กอินเข้าพักที่โรงแรมว่านด้าโมเมนต์ส",
        ],
        weatherForecast: "ลมทะเลทรายพัดแรง อากาศแห้งและเย็นลงรวดเร็ว",
      },
      8: {
        title: "แกรนด์แคนยอนเทียนซานทอมูร์ (อารัล → อักซู)",
        subtitle: "หน้าผาดินแดงธรรมชาติสุดยิ่งใหญ่",
        description: "เดินทางขึ้นทางเหนือจากอารัล แวะชมหุบเขาดินแดงแกรนด์แคนยอนทอมูร์ ซึ่งเป็นส่วนหนึ่งของระบบเทือกเขาเทียนซาน จากนั้นเดินทางต่อถึงเมืองอักซู เช็กอินที่โรงแรมอักซูฮวารุย",
        activities: [
          "เดินทางสู่จุดท่องเที่ยวอุทยานธรณีแกรนด์แคนยอนทอมูร์",
          "เดินเท้าศึกษาเส้นทางดินแดงในแคนยอนทอมูร์",
          "เดินทางเข้าสู่ใจกลางเมืองอักซู",
          "เช็กอินที่โรงแรมฮวารุย อักซู (คืนที่ 1/2)",
        ],
        weatherForecast: "แดดจัดในตอนบ่าย อากาศเย็นสบายในหุบเขา",
      },
      9: {
        title: "เที่ยวอิสระเมืองอักซู (Free Day)",
        subtitle: "สัมผัสวัฒนธรรมและพักผ่อน",
        description: "ใช้เวลาอิสระตามอัธยาศัยในเมืองอักซู เดินชมตึกรามบ้านช่องและสตรีทฟู้ดโบราณถนนคนเดินอักซู (Old Street) ชิมแอปเปิ้ลอักซูชื่อดัง แวะซื้อของฝาก และพักผ่อนเตรียมเดินทางกลับในวันพรุ่งนี้",
        activities: [
          "เดินเล่นพักผ่อนที่ย่านถนนโบราณอักซู (Old Street)",
          "ลองชิมอาหารท้องถิ่น เช่น แอปเปิ้ลอักซู และเนื้อแกะย่าง",
          "เลือกซื้อของฝากพื้นเมืองตามตลาดท้องถิ่น",
          "จัดกระเป๋าและพักผ่อนในโรงแรมอย่างผ่อนคลาย",
        ],
        weatherForecast: "มีเมฆบางส่วนในตอนบ่าย อากาศเย็นสบาย",
      },
      10: {
        title: "เดินทางกลับ (อักซู → กรุงเทพฯ)",
        subtitle: "อำลาทริปซินเจียงใต้ 10 วัน",
        description: "เดินทางสู่สนามบินอักซู (AKU) บินกับสายการบินไชน่าเซาเทิร์นแอร์ไลน์ไปยังฉงชิ่ง รอต่อเครื่องประมาณ 3.35 ชั่วโมง ก่อนต่อเที่ยวบินกลับกรุงเทพฯ (BKK) โดยสวัสดิภาพในช่วงค่ำพร้อมความทรงจำสุดประทับใจ",
        activities: [
          "เดินทางไปยังสนามบินอักซูในช่วงเช้า",
          "เดินทางจากสนามบินอักซูสู่ฉงชิ่ง AKU-CKG (12:40 - 16:55)",
          "รอต่อเครื่องที่สนามบินฉงชิ่ง (16:55 - 21:30)",
          "เดินทางกลับกรุงเทพฯ เที่ยวบิน CKG-BKK (21:30 - 23:30)",
        ],
        weatherForecast: "ท้องฟ้าโปร่ง แดดจัด",
      },
    },
    hotels: {
      feng: {
        name: "โรงแรมเจเอฟเฟิง",
        description: "ตั้งอยู่ใกล้กับบ้านเกิดเซียงเฟย (พานถัวเฉิง) ในเมืองคัชการ์ เป็นโรงแรมบูติกที่ทันสมัย ใกล้กับถนนคนเดินอาหารนานาชาติเมืองโบราณคัชการ์",
        location: "เมืองคัชการ์ ซินเจียง",
        address: "เลขที่ 288 ถนนตัวไหลเท่อปาเก๋อ, เมืองคัชการ์, ซินเจียง, ประเทศจีน",
        amenities: ["ฟรี Wi-Fi", "เครื่องผลิตออกซิเจนในห้องพัก", "ใกล้ถนนคนเดินอาหาร", "เลานจ์กาแฟ"],
        highlights: ["ตั้งอยู่ติดกับถนนคนเดินอาหารเมืองโบราณ", "การตกแต่งสไตล์โมเดิร์นทันสมัย เช็กอินรวดเร็ว"],
      },
      torgrencia: {
        name: "Meet Torgrencia Tent Camp",
        description: "แคมป์เต็นท์โดมดาราศาสตร์สุดหรูในอำเภอทัชเคอร์กัน เพียบพร้อมด้วยผ้าห่มอุ่น เตียงนุ่ม และระเบียงชมวิวสวรรค์ปามีร์ที่สวยงาม",
        location: "อำเภอทัชเคอร์กัน ซินเจียง",
        address: "ย่านทุ่งหญ้าเลี้ยงสัตว์ ตำบลทาหมาน, อำเภอทัชเคอร์กัน, ซินเจียง, ประเทศจีน",
        amenities: ["เต็นท์โดมสไตล์สแกนดิเนเวียน", "เตียงพร้อมฮีตเตอร์", "จุดดูดาวบนที่ราบสูง", "ไกด์ประจำแคมป์ช่วยเหลือ"],
        highlights: ["ตั้งอยู่ท่ามกลางทุ่งหญ้าเลี้ยงสัตว์และวิวเขาหิมะ", "ชมวิวพระอาทิตย์ขึ้นเหนือยอดเขาปามีร์อันน่าทึ่ง"],
      },
      lavande: {
        name: "โรงแรมลาวานด์ สาขา คัชการ์",
        description: "โรงแรมสไตล์ร่วมสมัย ตกแต่งด้วยกลิ่นอโรมาลาเวนเดอร์ผ่อนคลาย ตั้งอยู่เขตเมืองโบราณคัชการ์ ติดกับห้างว่านด้าพลาซ่า",
        location: "เมืองโบราณคัชการ์ ซินเจียง",
        address: "เลขที่ 55 ถนนชี่จี้ต้าเต้า, คัชการ์, ซินเจียง, ประเทศจีน",
        amenities: ["ห้องพักกลิ่นอโรมาลาเวนเดอร์", "เชื่อมต่อห้างว่านด้าพลาซ่า", "ปุ่มควบคุมห้องพัก", "รถรับส่งสนามบิน"],
        highlights: ["ใกล้กับว่านด้าพลาซ่า สะดวกสำหรับการช้อปปิ้งและรับประทานอาหาร", "ห้องพักสะอาดสะอ้าน เตียงหนานุ่มนอนสบาย"],
      },
      vienna: {
        name: "โรงแรมเวียนนา (เย่เฉิง)",
        description: "โรงแรมตกแต่งสไตล์คลาสสิกยุโรป ตั้งอยู่บริเวณกิโลเมตรศูนย์ จุดเริ่มต้นประวัติศาสตร์ทางหลวงซินเจียง-ทิเบต (G219) ในเมืองเย่เฉิง",
        location: "เมืองเย่เฉิง ซินเจียง",
        address: "บริเวณหลักกิโลเมตรที่ 0 ทางหลวงซินเจียง-ทิเบต, อำเภอเย่เฉิง, ซินเจียง, ประเทศจีน",
        amenities: ["ห้องพักเก็บเสียงยอดเยี่ยม", "บุฟเฟต์อาหารเช้าหลากหลาย", "ที่จอดรถ SUV ปลอดภัย", "แผนกต้อนรับ 24 ชั่วโมง"],
        highlights: ["ฐานที่พักที่สมบูรณ์แบบก่อนหรือหลังเดินทางข้ามภูเขาสูง G219", "เครื่องนอนคุณภาพสูง สะอาด นอนหลับสบาย"],
      },
      xian: {
        name: "โรงแรมซีอาน (โฮตัน)",
        description: "โรงแรมบูติกดีไซน์ทันสมัยน่ารัก ตั้งอยู่ติดกับพิพิธภัณฑ์ตลาดกลางคืนโฮตัน ย่านถนนอิ๋งปิน",
        location: "เมืองโฮตัน ซินเจียง",
        address: "ย่านถนนอิ๋งปิน ติดกับตลาดกลางคืนโฮตัน, เมืองโฮตัน, ซินเจียง, ประเทศจีน",
        amenities: ["ล็อบบี้ดีไซน์โมเดิร์น", "ทางเข้าติดตลาดกลางคืนโฮตัน", "ห้องเก็บเสียงเงียบสงบ", "บาร์กาแฟพรีเมียม"],
        highlights: ["เดินเพียงไม่กี่ก้าวถึงพิพิธภัณฑ์ตลาดกลางคืนโฮตัน", "ห้องสวีทกลิ่นหอมผ่อนคลายพร้อมสิ่งอำนวยความสะดวกครบครัน"],
      },
      wanda: {
        name: "Wanda Moments Aral",
        description: "โรงแรมหรูชั้นนำสำหรับนักเดินทางและนักธุรกิจในเมืองอารัล (Alar) ตั้งอยู่ใกล้กับมหาวิทยาลัยทาริม",
        location: "เมืองอารัล (Alar) ซินเจียง",
        address: "จุดตัดถนนจี้ซู่ต้าเต้า (มหาวิทยาลัย) และถนนถุนเขิ่น, เมืองอารัล, ซินเจียง, ประเทศจีน",
        amenities: ["ล็อบบี้เลานจ์ VIP", "ห้องพักวิวแม่น้ำทาริม", "ฟิตเนสออกกำลังกาย", "ห้องอาหารเช้านานาชาติ"],
        highlights: ["ที่พักที่ดีที่สุดในเขตเมืองใหม่ลุ่มน้ำทาริมอารัล", "ใกล้กับห้างและจัตุรัสการค้าของเมือง เดินทางสะดวก"],
      },
      huarui: {
        name: "โรงแรมฮวารุย อักซู",
        description: "โรงแรมธุรกิจขนาดใหญ่ระดับพรีเมียมในเมืองอักซู ตั้งอยู่ในทำเลทองย่านจัตุรัสจินลัน เพียบพร้อมด้วยห้องจัดเลี้ยงและเลานจ์หรูหรา",
        location: "จัตุรัสจินลัน เมืองอักซู",
        address: "บริเวณจัตุรัสจินลัน, เมืองอักซู, ซินเจียง, ประเทศจีน",
        amenities: ["สระว่ายน้ำในร่ม", "คลับเลานจ์ VIP สำหรับผู้เข้าพัก", "ห้องอาหารจีนระดับกูร์เมต์", "บริการรับส่งสนามบิน"],
        highlights: ["ทำเลที่ดีที่สุดในอักซู ใกล้แหล่งช้อปปิ้งและร้านอาหารหรู", "บริการที่ยอดเยี่ยม ล็อบบี้สูงโปร่งพร้อมอากาศอัดออกซิเจน"],
      },
    },
    budget: {
      flights: {
        name: "ตั๋วเครื่องบินไปกลับ",
        details: "เที่ยวบินไป-กลับระหว่าง กรุงเทพฯ (BKK) และซินเจียง (ขาไปลงคัชการ์ ขากลับขึ้นที่อักซู) ดำเนินการโดยสายการบินไชน่าเซาเทิร์นและฉงชิ่งแอร์ไลน์ ผ่านสนามบินฉงชิ่ง",
      },
      transport: {
        name: "รถตู้พรีเมียมพร้อมคนขับ",
        details: "ค่าเช่ารถตู้พรีเมียม 7 ที่นั่ง + คนขับรถท้องถิ่น 8 วัน (วันละ 1,200 RMB * 8 วัน = 9,600 RMB) หารเฉลี่ยกันในกลุ่มผู้เดินทาง 6 คน รวมค่าน้ำมัน ค่าทางด่วน และค่ารถขากลับเปล่า",
      },
      hotels: {
        name: "ที่พักหรูหรา (9 คืน)",
        details: "ค่าห้องพักสำหรับแชร์ห้องพักคู่จำนวน 9 คืนในโรงแรมและแคมป์เต็นท์ที่คัดสรรมาเป็นพิเศษ (ราคารวมเฉลี่ยห้องละ 11,701 THB หาร 2 คนตกคนละ 5,850 THB)",
      },
      tickets: {
        name: "ตั๋วเข้าชมและค่าผ่านทาง",
        details: "ค่าเข้าชมอุทยานป่าปอปลาร์หูหยางเจ๋อผู่, เมืองโบราณโยตกัน, อุทยานธารน้ำแข็งมุซทัคอาตา, แกรนด์แคนยอนทอมูร์ และสิทธิ์ผ่านทางพิเศษ",
      },
    },
  },
  zh: {
    ui: {
      title: "中国 • 南疆",
      subtitle: "传奇路线 • 超值奢华",
      days: "10 天",
      totalDistance: "总距离",
      maxElevation: "最大海拔",
      luxuryCost: "豪华包机价",
      activeDayPreview: "活动日程 第 {day} 天 预览",
      viewItineraryBtn: "查看完整行程表",
      routeSummary: "路线总结与驾驶路段",
      interactiveMapBtn: "交互式地图",
      altitudeWarningTitle: "高海拔安全提示",
      altitudeWarningDesc: "该路段海拔超过3,000米。请频繁休息，避免剧烈运动，并随时准备氧气瓶。酒店房间内提供供氧设备。",
      hotelsHeader: "豪华住宿名录",
      hotelsDesc: "为南疆之旅精选的高端酒店、精品民宿以及定制的沙漠星空营地。",
      bookOnTrip: "在 Trip.com 预订",
      budgetHeader: "旅程预算与费用分配",
      budgetDesc: "全面解析本次探险活动全包套餐的每人费用分配。",
      totalBudget: "每人总套餐费用",
      flightHeader: "航班与中转详情",
      flightDesc: "连接曼谷（BKK）与南疆机场的中转航班，经由重庆（CKG）中转。",
      flightDuration: "总飞行时间",
      flightAllowance: "行李额度",
      flightAlert: "请仔细核对航班中转航站楼及中国机场的过境签证规定。",
      liveHeader: "实时轨迹与安全状态",
      liveDesc: "实时模拟的GPS轨迹、车辆速度、当地海拔高度和道路安全警告。",
      liveSpeed: "当前时速",
      liveAltitude: "当前海拔",
      liveEta: "预计到达时间",
      liveWeather: "营地天气",
      liveAlerts: "道路安全预警",
      liveSimBtnActive: "暂停模拟",
      liveSimBtnInactive: "激活实时模拟",
      supportHeader: "探险旅行保障中心",
      supportDesc: "在您的南疆旅行期间，提供全天候24/7的专属礼宾保障支持。",
      supportCall: "拨打客服热线",
      supportWechat: "微信号 ID",
      supportEmail: "发送电子邮件",
      supportDuty: "在线保障连接中",
      supportLangs: "服务语言",
      supportLiaison: "出行指南与紧急救援",
      supportLiaisonDesc: "在帕米尔高原的高海拔山口，手机信号可能会中断。车队配备了北斗卫星通信终端。您的导游将在所有边防检查站协助您完成护照核验。",
      overview: "行程概览",
      itinerary: "日程表",
      map: "航线地图",
      hotels: "豪华住宿",
      budget: "费用预算",
      flights: "航班时刻",
      live: "聊天",
      support: "专属支持",
      schedule: "每日日程表",
      notesHeader: "旅途笔记",
      notesLabel: "个人备忘录（自动保存）",
      notesPlaceholder: "在此输入您今天的随笔、行李清单或当地美食推荐...",
      notesSync: "您的旅途笔记已保存在本地，并与您的行程同步更新。",
    },
    itinerary: {
      1: {
        title: "抵达喀什",
        subtitle: "南疆陆路口岸门户",
        description: "搭乘航班从曼谷出发，下午在重庆江bei机场（CKG）中转（可寄存行李后进城游览或休息），晚上抵达喀什。入住季枫城市酒店，晚上游览热闹的喀什古城夜市。",
        activities: [
          "曼谷素万那普机场起飞 BKK-CKG (00:30 - 05:00)",
          "重庆中转休息或重庆市内快速游览 (05:00 - 13:30)",
          "重庆起飞前往喀什 CKG-KHG (13:30 - 18:55)",
          "办理入住喀什季枫城市酒店",
          "夜游喀什古城手工作坊街及美食街",
        ],
        weatherForecast: "晴空万里，晚间气候凉爽",
      },
      2: {
        title: "帕米尔路线（喀什 → 塔什库尔干）",
        subtitle: "登上帕米尔高原",
        description: "从喀什出发，沿着著名的中巴友谊公路（喀喇昆仑公路）南下。途中在白沙湖畔洁白的沙丘旁停留拍照。随后抵达卡拉库里湖（海拔3,600米），欣赏冰山之父慕士塔格峰的倒影。继续前往塔什库尔干县入住。",
        activities: [
          "驰骋在喀喇昆仑公路高山山口路段",
          "在白沙湖（白沙山）风景区拍照留念",
          "漫步卡拉库里湖畔清澈的湖岸",
          "抵达并办理入住遇见托格伦夏牧高笛星空营地",
        ],
        weatherForecast: "高原山区寒冷且风力较大",
      },
      3: {
        title: "盘龙古道",
        subtitle: "今日走过所有的弯路，从此人生尽是坦途",
        description: "体验盘龙古道，这条拥有600多个S弯的高原公路。随后游览深蓝色的班迪尔蓝湖，欣赏神秘的帕米尔之眼地质奇观。晚上返回塔什库尔干星空营地入住。",
        activities: [
          "自驾盘龙古道体验悬崖峭壁的公路奇迹",
          "游览并拍摄班迪尔蓝湖的幽蓝湖水",
          "观赏神秘的帕米尔之眼奇特地貌",
          "返回塔什库尔干营地享受星空篝火",
        ],
        weatherForecast: "高原晴空万里，风力极强且严寒",
      },
      4: {
        title: "慕士塔格冰川公园 → 返回喀什",
        subtitle: "近距离观赏万年冰川",
        description: "告别塔什库尔干，前往慕士塔格冰川公园，近距离触摸古老冰川。随后沿着喀喇昆仑公路返回喀什，入住喀什丽枫酒店。",
        activities: [
          "徒步游览慕士塔格冰川公园冰川遗迹",
          "在冰川下进行高原徒步适应性锻炼",
          "沿着中巴友谊公路驱车下山返回喀什",
          "抵达喀什并办理入住丽枫酒店（喀什古城店）",
        ],
        weatherForecast: "喀什谷地多云转晴，气温回升",
      },
      5: {
        title: "泽普金胡杨林（喀什 → 叶城）",
        subtitle: "荒漠中的金色绿洲",
        description: "驱车向东前往莎车县。漫步位于叶尔羌河畔的泽普金胡杨林国家森林公园。随后前往叶城县，入住叶城零公里维也纳酒店。",
        activities: [
          "驱车前往历史名城莎车县",
          "徒步泽普金湖杨林，观赏金色胡杨与河流交织",
          "抵达叶城（新藏公路G219的起点零公里处）",
          "办理入住叶城维也纳酒店",
        ],
        weatherForecast: "绿洲天气晴朗，气温温和宜人",
      },
      6: {
        title: "约特干故城（叶城 → 和田）",
        subtitle: "重回古于阗国千年的繁华",
        description: "从叶城出发，游览锡提亚迷城遗址。随后参观重建的约特干故城及博物馆，了解古于阗国的历史。随后前往和田，入住邻近和田夜市的希岸酒店。",
        activities: [
          "参观锡提亚迷城遗址（历史古迹遗存）",
          "游览约特干故城遗址及历史文化博物馆",
          "驱车进入和田绿洲市中心",
          "入住希岸酒店，晚上打卡和田夜市体验烤蛋与酸奶",
        ],
        weatherForecast: "下午阳光充足，夜市气候宜人",
      },
      7: {
        title: "塔克拉玛干沙漠公路",
        subtitle: "穿越死亡之海",
        description: "今天开启8小时的穿越塔克拉玛干沙漠公路之旅。体验无边无际的橙色沙丘起伏。傍晚抵达阿拉尔市，入住阿拉尔万达美华酒店。",
        activities: [
          "清晨出发开启横穿塔克拉玛干沙漠的旅程",
          "在沙漠公路中心区拍摄沙海风景",
          "观赏沙漠深处壮丽的落日斜阳",
          "抵达阿拉尔塔里木盆地新城，办理入住万达美华酒店",
        ],
        weatherForecast: "沙漠凉风习习，气候干燥，夜间降温快",
      },
      8: {
        title: "托木尔大峡谷（阿拉尔 → 阿克苏）",
        subtitle: "天山红崖峡谷地质奇观",
        description: "从阿拉尔向西北进发。游览红褐色岩石耸立的温宿托木尔大峡谷（天山大峡谷群）。随后驱车前往阿克苏市，入住阿克苏华瑞大酒店。",
        activities: [
          "驱车前往温宿托木尔大峡谷国家地质公园",
          "在红崖耸立的托木尔峡谷通道中进行徒步",
          "驱车进入阿克苏市中心",
          "入住阿克苏华瑞大酒店（第1/2晚）",
        ],
        weatherForecast: "午后阳光明媚，峡谷内凉爽",
      },
      9: {
        title: "阿克苏自由一日游",
        subtitle: "体验阿克苏文化与购物",
        description: "在阿克苏享受悠闲的一天。漫步阿克苏古街，品尝当地甜美的阿克苏苹果、烤羊肉串和烤馕，购买南疆特色手工艺品，并整理行李准备明天返程。",
        activities: [
          "游览阿克苏老街，打卡百年建筑",
          "品尝南疆烤羊肉及著名的阿克苏冰糖心苹果",
          "在当地巴扎选购手工艺品作为纪念品",
          "在酒店整理行李和休整",
        ],
        weatherForecast: "下午多云，气候凉爽适宜出行",
      },
      10: {
        title: "返程（阿克苏 → 曼谷）",
        subtitle: "南疆大环线圆满结束",
        description: "前往阿克苏机场（AKU），搭乘中国南方航空航班前往重庆（CKG），在重庆中转约3.35小时，随后转机返回曼谷（BKK），带着满满的丝路回忆平安抵家。",
        activities: [
          "清晨乘车前往阿克苏机场办理登机",
          "阿克苏飞往重庆 AKU-CKG (12:40 - 16:55)",
          "在重庆江北国际机场中转停留 (16:55 - 21:30)",
          "重庆飞回曼谷素万那普 CKG-BKK (21:30 - 23:30)",
        ],
        weatherForecast: "晴，微风",
      },
    },
    hotels: {
      feng: {
        name: "季枫城市酒店",
        description: "位于喀什香妃故里（盘橐城）景区旁。精品设计风格，邻近喀什古城唐城国际美食街，出行与餐饮极其便利。",
        location: "中国新疆喀什市",
        address: "中国新疆喀什市多来特巴格路288号",
        amenities: ["免费Wi-Fi", "弥散式供氧房型", "邻近国际美食街", "自助咖啡吧"],
        highlights: ["位于唐城国际美食街旁，吃喝非常方便", "现代装修风格，服务敏捷"],
      },
      torgrencia: {
        name: "遇见托格伦夏星空营地",
        description: "位于塔什库尔干的高端野奢帐篷营地。配备有电热毯、厚羽绒被以及帕米尔雪山观景露台，是观星和赏雪的绝佳营地。",
        location: "中国新疆塔什库尔干县",
        address: "中国新疆塔什库尔干塔吉克自治县塔合曼乡草场",
        amenities: ["北欧风星空穹顶帐篷", "电热毯与地暖设备", "帕米尔观星台", "专属营地管家"],
        highlights: ["坐落在帕米尔雪山下的黄金草场上，风景极美", "清晨可在帐篷内直接观赏帕米尔日照金山景象"],
      },
      lavande: {
        name: "喀什丽枫酒店",
        description: "香薰主题精品商务酒店，位于喀什市古城核心区，紧邻万达广场，集购物与便利于一体。",
        location: "中国新疆喀什古城",
        address: "中国新疆喀什古城世纪大道55号",
        amenities: ["薰衣草香薰套房", "万达广场直通通道", "智能客控系统", "免费机场接送"],
        highlights: ["紧邻万达广场，购物和餐饮极其方便", "薰衣草香薰气息，缓解一天的路途疲惫"],
      },
      vienna: {
        name: "叶城维也纳酒店",
        description: "欧式经典设计风格，坐落在叶城新藏公路“零公里”起点处，自驾新藏线与G219必住的品质之选。",
        location: "中国新疆叶城县",
        address: "中国新疆叶城县新藏公路零公里地标旁",
        amenities: ["隔音客房", "大型中西式自助早餐厅", "封闭式自驾SUV车位", "24小时前台服务"],
        highlights: ["地理位置优越，新藏自驾首选的高品质酒店", "房间大床极为舒适，独立恒温卫浴"],
      },
      xian: {
        name: "希岸酒店（和田）",
        description: "位于迎宾路和田夜市博物馆旁的时尚轻奢精品酒店。极具设计感，地理位置十分便利。",
        location: "中国新疆和田市",
        address: "中国新疆和田市迎宾路口夜市旁",
        amenities: ["希岸轻奢调性大堂", "直达和田夜市后门", "深度睡眠静音客房", "精品吧"],
        highlights: ["距离和田夜市博物馆仅百米，随时可打卡夜市", "香氛香调主题客房，配备智能语音控制"],
      },
      wanda: {
        name: "阿拉尔万达美华酒店",
        description: "位于阿拉尔市大学路与屯垦大道交汇处",
        location: "中国新疆阿拉尔市",
        address: "中国新疆阿拉尔市大学路与屯垦大道交汇处",
        amenities: ["美华专属礼宾酒廊", "俯瞰塔里木大学视野客房", "健身房", "中西餐融合菜馆"],
        highlights: ["阿拉尔塔里木河绿洲新区高品质住宿选择", "步行范围内即可抵达周边商贸城与公园"],
      },
      huarui: {
        name: "阿克苏华瑞大酒店",
        description: "位于阿克苏市中心金兰广场的高端豪华商务酒店。设施完备，服务优良，是阿克苏市的地标性大酒店之一。",
        location: "中国新疆阿克苏市",
        address: "中国新疆阿克苏市金兰广场核心区",
        amenities: ["室内恒温泳池", "VIP贵宾行政酒廊", "华 equatorial 中餐厅", "24小时机场接机"],
        highlights: ["地处金兰广场核心，周边餐饮购物极其便利", "酒店设施高档豪华，大厅配有纯净新风系统"],
      },
    },
    budget: {
      flights: {
        name: "往返航班机票",
        details: "曼谷（BKK）往返新疆（喀什去、阿克苏回）经重庆（CKG）中转的联程机票费用（含税金与行李额）。",
      },
      transport: {
        name: "包车7座商务车与司机",
        details: "7座豪华商务车租赁费与8天当地司机服务费（1200元/天 * 8天 = 9600元，折合泰铢后由6名乘客均摊），包含过路费、油费及空返费。",
      },
      hotels: {
        name: "9晚豪华住宿",
        details: "包含9晚精选高品质酒店与野奢营地住宿的双人间均摊费用（单间房费总计 11,701 THB，双人入住每人均摊 5,850 THB）。",
      },
      tickets: {
        name: "景区门票与过路通关",
        details: "包含泽普金胡杨林、约特干故城、温宿大峡谷、慕士塔格冰川公园等景区的门票以及相关通关证件核验费。",
      },
    },
  },
};
