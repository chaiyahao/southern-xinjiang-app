import { ItineraryDay, Hotel, FlightTicket, BudgetCategory } from "../types";

export const ITINERARY_DATA: ItineraryDay[] = [
  {
    day: 1,
    date: "29 Oct 2026",
    title: "Arrive in Kashgar",
    subtitle: "Gateway to Southern Xinjiang",
    startLocation: "Bangkok (BKK)",
    endLocation: "Kashgar (KHG)",
    distanceKm: 0,
    driveTime: "N/A",
    elevationGainM: 0,
    maxElevationM: 1290,
    description: "Travel from Bangkok Suvarnabhumi Airport. Transit in Chongqing Jiangbei Airport (CKG) during the afternoon (visit city or rest), then take your connecting flight to Kashgar. Check-in at JF Feng Hotel and explore the lively Kashgar Old Town night markets.",
    hotelName: "JF Feng Hotel",
    activities: [
      "Suvarnabhumi Airport departure BKK-CKG (00:30 - 05:00)",
      "Transit rest or rapid city tour in Chongqing (05:00 - 13:30)",
      "Chongqing departure to Kashgar CKG-KHG (13:30 - 18:55)",
      "Check-in at JF Feng Hotel",
      "Night exploration of historic Kashgar Old Town lanes"
    ],
    coordinates: [75.98, 39.47],
    routeCoordinates: [
      [75.98, 39.47]
    ],
    images: [
      {
        url: "/images/kashgar_old_town.jpg",
        label: "Kashgar Old Town Alleys",
        labelTh: "ตรอกซอกซอยบ้านดินเมืองโบราณคัชการ์",
        labelZh: "喀什古城街区小巷"
      },
      {
        url: "/images/kashgar_facade.jpg",
        label: "Kashgar Traditional Residential Facades",
        labelTh: "สถาปัตยกรรมดินเมืองโบราณคัชการ์",
        labelZh: "喀什传统西域风格民居"
      }
    ],
    weather: {
      tempRange: "5°C to 20°C",
      icon: "Sun",
      forecast: "Clear skies, cool evening breeze"
    }
  },
  {
    day: 2,
    date: "30 Oct 2026",
    title: "Pamir Route (Kashgar → Tashkurgan)",
    subtitle: "Ascending the Plateau",
    startLocation: "Kashgar",
    endLocation: "Tashkurgan",
    distanceKm: 300,
    driveTime: "6 hrs",
    elevationGainM: 1810,
    maxElevationM: 3600,
    description: "Travel from Kashgar and head south along the Karakoram Highway. Stop at the stunning white sand dunes of Baisha Lake. Move on to Karakul Lake (3,600m) to marvel at Muztagh Ata. Continue ascending to Tashkurgan Pamir Plateau.",
    hotelName: "Meet Torgrencia Tent Camp",
    activities: [
      "Drive along Karakoram Highway mountain pass",
      "Scenic stop at Baisha Lake (White Sand Lake)",
      "Stroll near the glacial waters of Karakul Lake",
      "Ascend and check-in at Meet Torgrencia Tent Camp"
    ],
    coordinates: [75.23, 37.77],
    routeCoordinates: [
      [75.98, 39.47],
      [75.75, 39.12],
      [75.45, 38.72],
      [75.05, 38.43], // Karakul Lake
      [75.12, 38.15],
      [75.23, 37.77]  // Tashkurgan
    ],
    images: [
      {
        url: "/images/karakul_lake.jpg",
        label: "Karakul Lake & Muztagh Ata Glacier Peak",
        labelTh: "ทะเลสาบคาราคูล และยอดเขาหิมะมุซทัคอาตา",
        labelZh: "阿克陶县卡拉库里湖与冰山之父慕士塔格峰"
      },
      {
        url: "/images/karakul_shore.jpg",
        label: "Karakul Lake Shoreline",
        labelTh: "ชายฝั่งทะเลสาบคาราคูลบนที่ราบสูงปามีร์",
        labelZh: "帕米尔高原卡拉库里湖畔"
      }
    ],
    weather: {
      tempRange: "-4°C to 9°C",
      icon: "Wind",
      forecast: "Cold and windy mountain weather"
    }
  },
  {
    day: 3,
    date: "31 Oct 2026",
    title: "Panlong Ancient Road",
    subtitle: "Over 600 Hairpin Turns",
    startLocation: "Tashkurgan",
    endLocation: "Tashkurgan",
    distanceKm: 240,
    driveTime: "5 hrs",
    elevationGainM: 1100,
    maxElevationM: 4200,
    description: "Embark on the legendary Panlong Ancient Road, famous for its 600+ curves. Tour the deep blue Bandir Blue Lake and view the unique Pamir Eye rock structure. Return to Tashkurgan for the night.",
    hotelName: "Meet Torgrencia Tent Camp",
    activities: [
      "Drive on Panlong Winding Pass (Panlong Ancient Road)",
      "Sightseeing stop at Bandir Blue Lake",
      "Stargazing and viewing the Pamir Eye geological landmark",
      "Return to glamping site in Tashkurgan"
    ],
    coordinates: [75.23, 37.77],
    routeCoordinates: [
      [75.23, 37.77],
      [75.25, 37.78],
      [75.21, 37.75],
      [75.23, 37.77]
    ],
    images: [
      {
        url: "/images/karakoram_highway.jpg",
        label: "Panlong Ancient Road Winding Hairpins",
        labelTh: "ทางโค้งถนนพันโค้งพานหลง บนที่ราบสูงปามีร์",
        labelZh: "喀什地区盘龙古道悬崖公路"
      },
      {
        url: "/images/karakul_lake.jpg",
        label: "Pamir Mountain Lakes",
        labelTh: "ทะเลสาบสีครามบนที่ราบสูงปามีร์",
        labelZh: "帕米尔高原高山湖水"
      }
    ],
    weather: {
      tempRange: "-4°C to 9°C",
      icon: "Sun",
      forecast: "Crisp plateau sunshine, freezing winds"
    }
  },
  {
    day: 4,
    date: "1 Nov 2026",
    title: "Muztagh Ata Glacier Park → Kashgar",
    subtitle: "Father of Ice Mountains",
    startLocation: "Tashkurgan",
    endLocation: "Kashgar",
    distanceKm: 360,
    driveTime: "6.5 hrs",
    elevationGainM: 0,
    maxElevationM: 3600,
    description: "Check out of Tashkurgan and visit Muztagh Ata Glacier Park to experience ancient glaciers up close. Drive back down the Karakoram Highway to Kashgar, checking in at the Lavande Hotel.",
    hotelName: "Lavande Hotel Kashgar",
    activities: [
      "Explore the frozen paths of Muztagh Ata Glacier Park",
      "Acclimatization walk around glacier bases",
      "Scenic mountain descent drive along KKH",
      "Arrive in Kashgar and check in at Lavande Hotel"
    ],
    coordinates: [75.98, 39.47],
    routeCoordinates: [
      [75.23, 37.77],
      [75.12, 38.15],
      [75.05, 38.43],
      [75.45, 38.72],
      [75.75, 39.12],
      [75.98, 39.47]
    ],
    images: [
      {
        url: "/images/karakul_lake.jpg",
        label: "Muztagh Ata Glacier Peak Close-up",
        labelTh: "เทือกเขาธารน้ำแข็งมุซทัคอาตาแบบใกล้ชิด",
        labelZh: "冰山之父慕士塔格峰冰川"
      },
      {
        url: "/images/karakoram_highway.jpg",
        label: "Karakoram Highway Mountain Road",
        labelTh: "ทางหลวงคาราโกรัมตัดผ่านหุบเขาสูง",
        labelZh: "穿越帕米尔群山的中巴公路"
      }
    ],
    weather: {
      tempRange: "5°C to 20°C",
      icon: "CloudSun",
      forecast: "Overcast skies, mild in Kashgar valley"
    }
  },
  {
    day: 5,
    date: "2 Nov 2026",
    title: "Zepu Golden Poplar (Kashgar → Yecheng)",
    subtitle: "Golden Forests of the Desert",
    startLocation: "Kashgar",
    endLocation: "Yecheng",
    distanceKm: 420,
    driveTime: "6 hrs",
    elevationGainM: 100,
    maxElevationM: 1400,
    description: "Head east to Yarkant County. Explore the vibrant Zepu Golden Poplar Forest along the Yarkand River. Continue the drive to Yecheng, checking in at the Vienna Hotel near the zero kilometer mark.",
    hotelName: "Vienna Hotel",
    activities: [
      "Drive to historical Yarkant County",
      "Hike inside Zepu Golden Poplar Forest",
      "Arrive at Yecheng (Start point of Xinjiang-Tibet Hwy G219)",
      "Check-in at Vienna Hotel Yecheng"
    ],
    coordinates: [77.24, 38.41],
    routeCoordinates: [
      [75.98, 39.47],
      [76.85, 38.85],
      [77.24, 38.41], // Yarkand
      [77.26, 37.89]  // Yecheng
    ],
    images: [
      {
        url: "/images/desert_poplars.jpg",
        label: "Desert Poplar Trees",
        labelTh: "ต้นหูหยางในฤดูใบไม้ร่วง ชายขอบทะเลทราย",
        labelZh: "塔克拉玛干沙漠边缘秋季胡杨树林"
      },
      {
        url: "/images/karakoram_highway.jpg",
        label: "Yecheng Desert Gateway Foothills",
        labelTh: "หุบเขาทางผ่านสู่ทางหลวงเย่เฉิง",
        labelZh: "叶城县新藏公路起点群山峡谷"
      }
    ],
    weather: {
      tempRange: "5°C to 20°C",
      icon: "Sun",
      forecast: "Clear and warm oasis weather"
    }
  },
  {
    day: 6,
    date: "3 Nov 2026",
    title: "Yotkan Ancient City (Yecheng → Hotan)",
    subtitle: "Ancient Kingdom of Khotan",
    startLocation: "Yecheng",
    endLocation: "Hotan",
    distanceKm: 390,
    driveTime: "5.5 hrs",
    elevationGainM: 100,
    maxElevationM: 1400,
    description: "Depart Yecheng and visit Xitiya Lost City. Tour the rebuilt Yotkan Ancient City and its museum to learn about Khotanese history. Continue to Hotan, checking in at the Xi'an Hotel near the Night Market.",
    hotelName: "Xi'an Hotel",
    activities: [
      "Visit Xitiya Lost City (Ancient Ruins)",
      "Explore Yotkan Ancient City museum & displays",
      "Drive to Hotan oasis center",
      "Check-in at Xi'an Hotel and explore Hotan Night Market"
    ],
    coordinates: [79.92, 37.11],
    routeCoordinates: [
      [77.26, 37.89],
      [78.55, 37.91],
      [79.92, 37.11]  // Hotan
    ],
    images: [
      {
        url: "/images/kashgar_facade.jpg",
        label: "Kashgaria Oasis Old Architecture",
        labelTh: "สถาปัตยกรรมดินโบราณย่านเมืองโอเอซิสซินเจียง",
        labelZh: "南疆绿洲传统土质老城民居"
      },
      {
        url: "/images/kashgar_old_town.jpg",
        label: "Ancient Silk Road Mud Ruins Style",
        labelTh: "ซากกำแพงเมืองดินเหนียวโบราณตามเส้นทางสายไหม",
        labelZh: "古丝绸之路泥土筑城城墙风格"
      }
    ],
    weather: {
      tempRange: "7°C to 22°C",
      icon: "Sun",
      forecast: "Warm afternoon sun, perfect night bazaar weather"
    }
  },
  {
    day: 7,
    date: "4 Nov 2026",
    title: "Taklamakan Desert Highway",
    subtitle: "Crossing the Sea of Death",
    startLocation: "Hotan",
    endLocation: "Aral (Aral)",
    distanceKm: 560,
    driveTime: "8 hrs",
    elevationGainM: 0,
    maxElevationM: 1100,
    description: "Embark on an 8-hour drive crossing the Taklamakan Desert Highway. Experience the endless, shifting orange sand dunes. Reach Aral (Alar) in the evening and check in at the Wanda Moments hotel.",
    hotelName: "Wanda Moments",
    activities: [
      "Start early for the Taklamakan Desert Highway crossing",
      "Desert highway photography and rest stop",
      "Witness sunset over desert dunes",
      "Arrive at Aral Tarim basin city and check-in at Wanda Moments"
    ],
    coordinates: [81.28, 40.54],
    routeCoordinates: [
      [79.92, 37.11],
      [80.35, 38.25],
      [80.85, 39.45],
      [81.28, 40.54]  // Aral
    ],
    images: [
      {
        url: "/images/taklamakan_desert.jpg",
        label: "Taklamakan Desert Endless Sand Dunes",
        labelTh: "เนินทรายสุดสายตาในทะเลทรายทากลามากาน",
        labelZh: "塔克拉玛干沙漠起伏沙丘"
      },
      {
        url: "/images/desert_poplars.jpg",
        label: "Desert Highway Poplars",
        labelTh: "ต้นปอปลาร์หูหยางทนแล้งตามแนวทะเลทราย",
        labelZh: "塔克拉玛干沙漠中坚韧的沙漠植物与沙丘"
      }
    ],
    weather: {
      tempRange: "3°C to 18°C",
      icon: "Wind",
      forecast: "Chilly desert wind, clear dry air"
    }
  },
  {
    day: 8,
    date: "5 Nov 2026",
    title: "Tomur Grand Canyon (Aral → Aksu)",
    subtitle: "Tianshan Red Gorge",
    startLocation: "Aral",
    endLocation: "Aksu",
    distanceKm: 270,
    driveTime: "4.5 hrs",
    elevationGainM: 400,
    maxElevationM: 1600,
    description: "Drive north-west from Aral. Explore the massive red clay walls of the Tomur Grand Canyon (Tianshan Canyon system). Drive to Aksu city and check-in at Aksu Huarui Hotel.",
    hotelName: "Aksu Huarui Hotel",
    activities: [
      "Drive to Tomur Grand Canyon national geopark",
      "Hike inside the red gorges of Tomur Canyon",
      "Scenic drive to Aksu center",
      "Check-in at Aksu Huarui Hotel (Night 1/2)"
    ],
    coordinates: [80.26, 41.17],
    routeCoordinates: [
      [81.28, 40.54],
      [80.85, 41.32], // Canyon diversion
      [80.26, 41.17]  // Aksu
    ],
    images: [
      {
        url: "/images/wensu_canyon.jpg",
        label: "Tianshan Tomur Canyon Red Cliffs in Wensu",
        labelTh: "ผาดินแดงขนาดใหญ่ในแกรนด์แคนยอนทอมูร์ อักซู",
        labelZh: "阿克苏温宿县天山托木尔大红峡谷谷底通道"
      },
      {
        url: "/images/wensu_canyon.jpg",
        label: "Red Rocky Canyon Valley Trail",
        labelTh: "ทางเดินเท้าใต้หุบเขาแกรนด์แคนยอนทอมูร์",
        labelZh: "托木尔峡谷红崖绝壁与徒步通道"
      }
    ],
    weather: {
      tempRange: "2°C to 18°C",
      icon: "Sun",
      forecast: "Bright afternoon sun, cool canyons"
    }
  },
  {
    day: 9,
    date: "6 Nov 2026",
    title: "Aksu Free Day",
    subtitle: "Exploring Aksu Culture",
    startLocation: "Aksu",
    endLocation: "Aksu",
    distanceKm: 0,
    driveTime: "N/A",
    elevationGainM: 0,
    maxElevationM: 1100,
    description: "Enjoy a free leisure day in Aksu. Stroll through the ancient streets of Aksu Old Street, sample local apples and Uyghur flatbread, shop for souvenirs, and prepare for your flight back home tomorrow.",
    hotelName: "Aksu Huarui Hotel",
    activities: [
      "Leisure walk around Aksu Old Street",
      "Local food tasting (lamb skewers, Aksu apples)",
      "Souvenir shopping at local bazaars",
      "Pre-departure packing and hotel rest"
    ],
    coordinates: [80.26, 41.17],
    routeCoordinates: [
      [80.26, 41.17]
    ],
    images: [
      {
        url: "/images/old_city_market.jpg",
        label: "Traditional Uyghur Souvenir Shop Bazaar",
        labelTh: "ร้านจำหน่ายเครื่องดนตรีและงานฝีมือในเขตเมืองเก่า",
        labelZh: "老街巴扎内的特色手工艺器乐店"
      },
      {
        url: "/images/kashgar_old_town.jpg",
        label: "Traditional Oasis City Street lanes",
        labelTh: "บ้านเรือนโบราณสไตล์เมืองโอเอซิสซินเจียงใต้",
        labelZh: "南疆老城区泥土筑民居巷弄"
      }
    ],
    weather: {
      tempRange: "2°C to 18°C",
      icon: "CloudSun",
      forecast: "Mild afternoon clouds"
    }
  },
  {
    day: 10,
    date: "7 Nov 2026",
    title: "Departure (Aksu → Bangkok)",
    subtitle: "Farewell Xinjiang Loop",
    startLocation: "Aksu (AKU)",
    endLocation: "Bangkok (BKK)",
    distanceKm: 20,
    driveTime: "30 mins",
    elevationGainM: 0,
    maxElevationM: 1100,
    description: "Transfer to Aksu Airport (AKU). Board your Hainan Airlines flight to Chongqing Jiangbei (CKG), layover for 3.35 hours, then catch your connecting flight to Bangkok (BKK). Arrive home in the evening.",
    hotelName: "Aksu Huarui Hotel",
    activities: [
      "Morning airport transfer to AKU",
      "Flight departure from Aksu to Chongqing AKU-CKG (12:40 - 16:55)",
      "Transit wait in Chongqing CKG (16:55 - 21:30)",
      "Connecting flight from Chongqing to Bangkok CKG-BKK (21:30 - 23:30)"
    ],
    coordinates: [80.26, 41.17],
    routeCoordinates: [
      [80.26, 41.17]
    ],
    images: [
      {
        url: "/images/flight_departure.jpg",
        label: "Flight departure back to Bangkok",
        labelTh: "เครื่องบินของสายการบินออกเดินทางสู่กรุงเทพฯ",
        labelZh: "飞回曼谷的联程客机航班"
      },
      {
        url: "/images/flight_arrival.jpg",
        label: "Aksu Airport departure terminal field",
        labelTh: "รันเวย์และบริเวณภายนอกสนามบินอักซู",
        labelZh: "阿克苏温宿机场客机停机坪"
      }
    ],
    weather: {
      tempRange: "2°C to 14°C",
      icon: "Sun",
      forecast: "Sunny and clear skies"
    }
  }
];

export const HOTELS_DATA: Hotel[] = [
  {
    id: "feng",
    name: "JF Feng Hotel",
    description: "Located near the Xiangfei Hometown (Panthuo Castle) in Kashgar. A modern boutique hotel close to the Kashgar Old Town International Food Street.",
    rating: 4.6,
    daysStayed: "Day 1 (29 Oct)",
    location: "Kashgar City",
    amenities: ["Free Wi-Fi", "Oxygen room features", "Close to food street", "Coffee lounge"],
    highlights: ["Located directly on the International Food Street", "Modern styling and rapid check-in"],
    imagePrompt: "JF Feng Hotel Kashgar facade lobby room view",
    imageUrl: "/images/Hotel/JF Feng Hotel.webp",
    amapUrl: "https://www.amap.com/search?query=%E5%AD%A3%E6%9E%AB%E5%9F%8E%E5%B8%82%E9%85%92%E5%BA%97%E5%96%85%E4%BB%80%E5%8F%A4%E5%9F%8E%E5%94%90%E5%9F%8E%E5%9B%BD%E9%99%85%E7%BE%8E%E9%A3%9F%E8%A1%97%E5%BA%97",
    bookingUrl: "https://www.trip.com/m/hotels/detail/?hotelId=117926960&cityId=109&isFromOrderDetailByClickHotel=1&checkIn=2026-10-29&checkOut=2026-10-30"
  },
  {
    id: "torgrencia",
    name: "Meet Torgrencia Tent Camp",
    description: "Luxury stargazing glamping site in Tashkurgan county. Fully equipped dome tents with heated beds and Pamir view terraces.",
    rating: 4.8,
    daysStayed: "Days 2, 3 (30 Oct - 1 Nov)",
    location: "Tashkurgan County",
    amenities: ["Geodesic dome tents", "Heated blankets", "Pamir stargazing deck", "Private campsite guide"],
    highlights: ["Located right in the scenic grassland of Tashkurgan", "Stunning sunrise views over Pamir peaks"],
    imagePrompt: "glamping dome tent stargazing Pamir mountains night sky",
    imageUrl: "/images/Hotel/Meet Torgrencia Tent Camp.webp",
    amapUrl: "https://www.amap.com/search?query=%E5%A1%94%E4%BB%80%E5%BA%93%E5%B0%94%E5%B9%B2%E9%81%87%E8%A7%81%E6%89%98%E6%A0%BC%E4%BC%A6%E5%A4%8F%E7%89%A7%E9%AB%98%E7%AC%9B%E6%98%9F%E7%A9%BA%E8%90%A5%E5%9C%B0",
    bookingUrl: "https://www.trip.com/m/hotels/detail/?hotelId=120853040&cityId=21067&isFromOrderDetailByClickHotel=1&checkIn=2026-10-30&checkOut=2026-11-01"
  },
  {
    id: "lavande",
    name: "Lavande Hotel Kashgar",
    description: "A Lavender-scented modern business hotel located in Kashgar Old Town, right near the Wanda Plaza complex.",
    rating: 4.5,
    daysStayed: "Day 4 (1 Nov)",
    location: "Kashgar Old Town",
    amenities: ["Lavender aroma suites", "Wanda Plaza access", "Smart home controls", "Airport shuttle service"],
    highlights: ["Situated close to Wanda Plaza for shopping and dining", "Relaxing scented rooms and premium bedding"],
    imagePrompt: "lavender scented business hotel boutique room",
    imageUrl: "/images/Hotel/Lavande Hotel Kashgar.webp",
    amapUrl: "https://www.amap.com/search?query=%E4%B8%BD%E6%9E%AB%E9%85%92%E5%BA%97%E5%96%85%E4%BB%80%E5%8F%A4%E5%9F%8E%E4%B8%87%E8%BE%BE%E5%B9%B5%E5%9C%BA%E5%BA%97",
    bookingUrl: "https://www.trip.com/m/hotels/detail/?hotelId=68203031&cityId=109&isFromOrderDetailByClickHotel=1&checkIn=2026-11-01&checkOut=2026-11-02"
  },
  {
    id: "vienna",
    name: "Vienna Hotel",
    description: "Premium classical-style hotel located at the zero-kilometer starting point in Yecheng, the gateway to the G219 highway.",
    rating: 4.5,
    daysStayed: "Day 5 (2 Nov)",
    location: "Yecheng Center",
    amenities: ["Soundproof rooms", "Large breakfast buffet", "Secure SUV parking", "24h desk service"],
    highlights: ["Perfect base for starting or ending mountain highway travels", "Highly comfortable standard bedding"],
    imagePrompt: "vienna style luxury classic hotel lobby bed",
    imageUrl: "/images/Hotel/Vienna Hotel.webp",
    amapUrl: "https://www.amap.com/search?query=%E7%BB%B4%E4%B9%9F%E7%BA%B3%E9%85%92%E5%BA%97%E5%8F%B6%E5%9F%8E%E9%9B%B6%E5%85%AC%E9%87%8C%E5%BA%97",
    bookingUrl: "https://www.trip.com/m/hotels/detail/?hotelId=106262751&cityId=21809&isFromOrderDetailByClickHotel=1&checkIn=2026-11-02&checkOut=2026-11-03"
  },
  {
    id: "xian",
    name: "Xi'an Hotel",
    description: "Contemporary-style boutique hotel situated right next to the famous Hetian Night Market museum in Yingbin road.",
    rating: 4.6,
    daysStayed: "Day 6 (3 Nov)",
    location: "Hotan Center",
    amenities: ["Modern aesthetic lobby", "Hetian Night Market access", "Soundproof rooms", "Coffee bar"],
    highlights: ["Right beside the Night Market museum", "Aroma-scented suites and smart panels"],
    imagePrompt: "modern design smart hotel room bed lighting",
    imageUrl: "/images/Hotel/Xi'an Hotel.webp",
    amapUrl: "https://www.amap.com/search?query=%E5%B8%8C%E5%B2%B8%E9%85%92%E5%BA%97%E5%92%8C%E7%94%B0%E5%A4%9C%E5%B8%82%E5%8D%9A%E7%89%A9%E9%A6%86%E5%BA%97",
    bookingUrl: "https://www.trip.com/m/hotels/detail/?hotelId=122900198&cityId=294&isFromOrderDetailByClickHotel=1&checkIn=2026-11-03&checkOut=2026-11-04"
  },
  {
    id: "wanda",
    name: "Wanda Moments Aral",
    description: "A premium business luxury hotel in Aral (Alar), situated close to Tarim University.",
    rating: 4.7,
    daysStayed: "Day 7 (4 Nov)",
    location: "Aral (Alar) City",
    amenities: ["VIP Lounge", "Tarim River view suites", "Modern gym", "Chinese/Western dining"],
    highlights: ["Luxury accommodations in the newly developed Tarim district", "Within walking distance to local shopping squares"],
    imagePrompt: "wanda moments luxury highrise city view hotel room",
    imageUrl: "/images/Hotel/Wanda Moments Aral.webp",
    amapUrl: "https://www.amap.com/search?query=%E9%98%BF%E6%8B%89%E5%B0%94%E4%B8%87%E8%BE%BE%E7%BE%8E%E5%8D%8E%E9%85%92%E5%BA%97%E5%A1%94%E9%87%8C%E6%9C%A8%E5%A4%A7%E5%AD%A6%E5%BA%97",
    bookingUrl: "https://www.trip.com/m/hotels/detail/?hotelId=127347324&cityId=20943&isFromOrderDetailByClickHotel=1&checkIn=2026-11-04&checkOut=2026-11-05"
  },
  {
    id: "huarui",
    name: "Aksu Huarui Hotel",
    description: "A high-end luxury business hotel in Aksu city, located in Jinlan Plaza. Features excellent facilities and large dining suites.",
    rating: 4.7,
    daysStayed: "Days 8, 9 (5 Nov - 7 Nov)",
    location: "Aksu Jinlan Plaza",
    amenities: ["Indoor heated pool", "Exec Club Lounge", "VIP dining banquet", "Airport shuttle service"],
    highlights: ["Best central location in Aksu for shopping and dining", "Premium service quality and oxygenated lobby spaces"],
    imagePrompt: "luxury grand business hotel lobby swimming pool lounge",
    imageUrl: "/images/Hotel/Aksu Huarui Hotel.webp",
    amapUrl: "https://www.amap.com/search?query=%E9%98%BF%E5%85%8B%E8%8B%8F%E5%8D%8E%E7%91%9E%E5%A4%A7%E9%85%92%E5%BA%97%E9%87%91%E5%85%B0%E5%B9%B5%E5%B9%B5%E5%BA%97",
    bookingUrl: "https://www.trip.com/m/hotels/detail/?hotelId=113000951&cityId=21379&isFromOrderDetailByClickHotel=1&checkIn=2026-11-05&checkOut=2026-11-07"
  }
];

export const FLIGHTS_DATA: FlightTicket[] = [
    {
        type: "Outbound",
        route: "Bangkok (BKK) → Kashgar (KHG)",
        totalDuration: "18h 25m",
        baggageLimit: "23kg Checked, 7kg Cabin",
        legs: [
            {
                flightNo: "CZ2362 / OQ2362",
                carrier: "Chongqing Airlines / China Southern",
                date: "29 Oct 2026",
                departureAirport: "Bangkok Suvarnabhumi (BKK)",
                departureTime: "00:30",
                arrivalAirport: "Chongqing Jiangbei (CKG)",
                arrivalTime: "05:00",
                duration: "5h 00m",
                aircraft: "Airbus A320"
            },
            {
                flightNo: "CZ2362 / OQ2362",
                carrier: "Chongqing Airlines / China Southern",
                date: "29 Oct 2026",
                departureAirport: "Chongqing Jiangbei (CKG)",
                departureTime: "13:30",
                arrivalAirport: "Kashgar Airport (KHG)",
                arrivalTime: "18:55",
                duration: "5h 30m",
                aircraft: "Airbus A320"
            }
        ]
    },
    {
        type: "Return",
        route: "Aksu (AKU) → Bangkok (BKK)",
        totalDuration: "10h 50m",
        baggageLimit: "23kg Checked, 7kg Cabin",
        legs: [
            {
                flightNo: "CZ2008",
                carrier: "China Southern",
                date: "7 Nov 2026",
                departureAirport: "Aksu Airport (AKU)",
                departureTime: "12:40",
                arrivalAirport: "Chongqing Jiangbei (CKG)",
                arrivalTime: "16:55",
                duration: "4h 15m",
                aircraft: "Boeing 737-800"
            },
            {
                flightNo: "CZ2008",
                carrier: "China Southern",
                date: "7 Nov 2026",
                departureAirport: "Chongqing Jiangbei (CKG)",
                departureTime: "21:30",
                arrivalAirport: "Bangkok Suvarnabhumi (BKK)",
                arrivalTime: "23:30",
                duration: "3h 00m",
                aircraft: "Boeing 737-800"
            }
        ]
    }
];

export const TELEMETRY_MOCK = {
    speedKmh: 75,
    currentAltitudeM: 3100,
    etaMinutes: 145,
    heading: "South-West",
    activeAlerts: [
        "High altitude caution on Pamir Highway segments",
        "Gobi wind warnings on Taklamakan Desert crossings"
    ],
    weatherTemp: -2,
    weatherCondition: "Windy Snow"
};

export const BUDGET_DATA = [
    {
        name: "Outbound/Return Flights",
        amountThb: 19875,
        percentage: 56.4,
        color: "#5EA8FF",
        details: "Round trip flights connecting Bangkok (BKK) and Xinjiang (Kashgar outbound, Aksu return) via Chongqing Jiangbei Airport (CKG)."
    },
    {
        name: "Private Van & Driver",
        amountThb: 8000,
        percentage: 22.7,
        color: "#E1A63B",
        details: "Private 7-seater luxury van rental + dedicated local driver for 8 days (1,200 RMB/day * 8 days = 9,600 RMB split among 6 passengers), including empty return day."
    },
    {
        name: "Luxury Hotels (9 Nights)",
        amountThb: 5850,
        percentage: 16.6,
        color: "#EC4899",
        details: "Shared double room rates for 9 nights in top-tier hotels and glamping camp (Total cost: 11,701 THB per room / 2 people sharing)."
    },
    {
        name: "Entrance Fees & Tickets",
        amountThb: 1500,
        percentage: 4.3,
        color: "#10B981",
        details: "Entrance tickets for Zepu Golden Poplar, Yotkan Ancient City, Muztagh Ata Glacier Park, Tomur Grand Canyon, and local guided passes."
    }
];

export const TOTAL_BUDGET = 35225; // THB per person
