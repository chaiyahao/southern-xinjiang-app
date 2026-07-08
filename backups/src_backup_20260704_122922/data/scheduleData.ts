export interface ScheduleItem {
  time: string;
  activity: {
    en: string;
    th: string;
    zh: string;
  };
  duration?: {
    en: string;
    th: string;
    zh: string;
  };
  type: "travel" | "stay" | "transit" | "flight" | "food" | "hotel";
}

export interface DaySchedule {
  day: number;
  date: string;
  route: {
    en: string;
    th: string;
    zh: string;
  };
  hotel: string;
  items: ScheduleItem[];
}

export const SCHEDULE_DATA: DaySchedule[] = [
  {
    day: 1,
    date: "29 Oct 2026",
    route: { en: "Bangkok → Kashgar", th: "กรุงเทพฯ → คัชการ์", zh: "曼谷 → 喀什" },
    hotel: "JF Feng Hotel",
    items: [
      {
        time: "00:30",
        activity: { en: "Depart Bangkok (BKK)", th: "ออกเดินทางจากกรุงเทพฯ (BKK)", zh: "曼谷素万那普机场起飞 (BKK)" },
        type: "flight"
      },
      {
        time: "05:00",
        activity: { en: "Arrive Chongqing (CKG)", th: "เดินทางถึงสนามบินฉงชิ่ง (CKG)", zh: "抵达重庆江北机场 (CKG)" },
        type: "transit"
      },
      {
        time: "05:00 - 13:30",
        activity: {
          en: "Transit / Optional Chongqing city walk",
          th: "พักรอต่อเครื่อง / ท่องเที่ยวชมเมืองฉงชิ่งตามอัธยาศัย",
          zh: "中转休息 / 可选择进行重庆市区一日游观光"
        },
        duration: { en: "Stay: 8.5h", th: "ใช้เวลา: 8.5 ชม.", zh: "停留: 8.5小时" },
        type: "travel"
      },
      {
        time: "13:30",
        activity: { en: "Flight to Kashgar", th: "เที่ยวบินออกเดินทางสู่คัชการ์", zh: "搭乘国内航班飞往喀什" },
        type: "flight"
      },
      {
        time: "18:55",
        activity: { en: "Arrive Kashgar (KHG)", th: "เดินทางถึงสนามบินคัชการ์ (KHG)", zh: "抵达喀什徕宁机场 (KHG)" },
        type: "transit"
      },
      {
        time: "19:00 - 20:00",
        activity: { en: "Airport → Hotel transfer", th: "บริการรถตู้รับส่งจากสนามบินสู่โรงแรม", zh: "专车送往：机场 → 酒店" },
        duration: { en: "Drive: 1h", th: "เวลาขับรถ: 1 ชม.", zh: "车程: 1小时" },
        type: "travel"
      },
      {
        time: "20:00",
        activity: { en: "Check-in at Hotel", th: "เช็คอินเข้าที่พักโรงแรม", zh: "办理酒店入住手续" },
        duration: { en: "Stay: 30m", th: "ใช้เวลา: 30 นาที", zh: "用时: 30分钟" },
        type: "hotel"
      },
      {
        time: "20:30 - 22:30",
        activity: {
          en: "Kashgar Old Town Night Walk + Dinner",
          th: "เดินเล่นยามค่ำคืนในเมืองโบราณคัชการ์ + อาหารค่ำ",
          zh: "夜游喀什古城手工作坊街与美食街 + 享用风味晚餐"
        },
        duration: { en: "Stay: 2h", th: "ใช้เวลา: 2 ชม.", zh: "用时: 2小时" },
        type: "stay"
      }
    ]
  },
  {
    day: 2,
    date: "30 Oct 2026",
    route: { en: "Kashgar → Tashkurgan", th: "คัชการ์ → ทาชคูร์กัน", zh: "喀什 → 塔县" },
    hotel: "Meet Torgrencia Tent Camp",
    items: [
      {
        time: "07:30",
        activity: { en: "Breakfast", th: "รับประทานอาหารเช้า", zh: "享用早餐" },
        duration: { en: "Stay: 1h", th: "ใช้เวลา: 1 ชม.", zh: "用时: 1小时" },
        type: "food"
      },
      {
        time: "08:30",
        activity: { en: "Go to Kashgar Ancient City", th: "เดินทางสู่ทางเข้าเมืองโบราณคัชการ์", zh: "前往喀什古城景区" },
        duration: { en: "Drive: 45m", th: "เวลาขับรถ: 45 นาที", zh: "车程: 45分钟" },
        type: "travel"
      },
      {
        time: "09:15",
        activity: { en: "Explore Old Town streets", th: "เดินเที่ยวชมวิถีชีวิตภายในเมืองโบราณ", zh: "漫步喀什古城老街区" },
        duration: { en: "Stay: 1h 5m", th: "ใช้เวลา: 1 ชม. 5 นาที", zh: "停留: 1小时5分钟" },
        type: "stay"
      },
      {
        time: "10:30",
        activity: { en: "Kashgar Ancient City Opening Ceremony", th: "ชมพิธีเปิดประตูเมืองโบราณคัชการ์สุดอลังการ", zh: "观看喀什古城盛大开城仪式" },
        duration: { en: "Stay: 30m", th: "ใช้เวลา: 30 นาที", zh: "停留: 30分钟" },
        type: "stay"
      },
      {
        time: "11:30",
        activity: { en: "Start Road Trip", th: "ขึ้นรถตู้ส่วนตัวเริ่มออกเดินทางโรดทริป", zh: "登上商务车，自驾之旅正式出发" },
        type: "transit"
      },
      {
        time: "11:30 - 14:00",
        activity: { en: "Drive to Baisha Lake (KKH)", th: "ขับรถมุ่งหน้าสู่ทะเลสาบไป๋ซาหู (ตามทางหลวงคาราโกรัม)", zh: "驱车前往白沙湖 (沿喀喇昆仑公路)" },
        duration: { en: "Drive: 2.5h", th: "เวลาขับรถ: 2.5 ชม.", zh: "车程: 2.5小时" },
        type: "travel"
      },
      {
        time: "14:00",
        activity: { en: "Baisha Lake sightseeing", th: "แวะถ่ายภาพชมความงามของเนินทรายขาวและทะเลสาบไป๋ซาหู", zh: "游览白沙湖（白沙山）风景区拍照留念" },
        duration: { en: "Stay: 45 - 60m", th: "ใช้เวลา: 45 - 60 นาที", zh: "停留: 45-60分钟" },
        type: "stay"
      },
      {
        time: "15:00 - 16:00",
        activity: { en: "Drive to Karakul Lake", th: "ออกเดินทางต่อไปยังทะเลสาบคาราคูล", zh: "继续驱车前往卡拉库里湖" },
        duration: { en: "Drive: 1h", th: "เวลาขับรถ: 1 ชม.", zh: "车程: 1小时" },
        type: "travel"
      },
      {
        time: "16:00",
        activity: { en: "Karakul Lake (Muztagh Ata reflection)", th: "ชมทะเลสาบคาราคูลและเงาสะท้อนยอดเขาหิมะมุซทัคอาตา", zh: "游览卡拉库里湖，赏雪山之父慕士塔格峰倒影" },
        duration: { en: "Stay: 1 - 1.25h", th: "ใช้เวลา: 1 - 1.25 ชม.", zh: "停留: 1-1.25小时" },
        type: "stay"
      },
      {
        time: "17:15 - 19:15",
        activity: { en: "Drive through mountain pass", th: "ขับรถไต่ระดับความสูงบนเส้นทางภูเขาต่อ", zh: "继续驶过高原高山山口路段" },
        duration: { en: "Drive: 2h", th: "เวลาขับรถ: 2 ชม.", zh: "车程: 2小时" },
        type: "travel"
      },
      {
        time: "19:15",
        activity: { en: "Tahman Wetland valley view", th: "แวะถ่ายภาพจุดชมวิวพื้นที่ชุ่มน้ำทาหมาน", zh: "在塔合曼湿地观景台停留观光" },
        duration: { en: "Stay: 10 - 15m", th: "ใช้เวลา: 10 - 15 นาที", zh: "停留: 10-15分钟" },
        type: "stay"
      },
      {
        time: "20:00",
        activity: { en: "Check-in at Camp", th: "เช็คอินเข้าที่พักแคมป์เต็นท์ดูดาวสุดหรู", zh: "抵达并办理遇见托格伦夏星空营地入住" },
        type: "hotel"
      }
    ]
  },
  {
    day: 3,
    date: "31 Oct 2026",
    route: { en: "Tashkurgan Loop", th: "วงรอบทาชคูร์กัน", zh: "塔县环线" },
    hotel: "Meet Torgrencia Tent Camp",
    items: [
      {
        time: "08:00",
        activity: { en: "Breakfast", th: "รับประทานอาหารเช้าที่แคมป์", zh: "营地享用早餐" },
        duration: { en: "Stay: 1h", th: "ใช้เวลา: 1 ชม.", zh: "用时: 1小时" },
        type: "food"
      },
      {
        time: "09:00 - 10:00",
        activity: { en: "Drive to Panlong Road", th: "ออกเดินทางสู่จุดเริ่มทางหลวงพานหลง", zh: "驱车前往盘龙古道入口" },
        duration: { en: "Drive: 1h", th: "เวลาขับรถ: 1 ชม.", zh: "车程: 1小时" },
        type: "travel"
      },
      {
        time: "10:00",
        activity: { en: "Panlong Ancient Road (600+ curves)", th: "ขับรถพิชิตความเสียว 600 โค้ง บนถนนพานหลง", zh: "自驾征服拥有600多个弯道的盘龙古道天险" },
        duration: { en: "Stay: 1 - 1.5h", th: "ใช้เวลา: 1 - 1.5 ชม.", zh: "停留: 1-1.5小时" },
        type: "stay"
      },
      {
        time: "11:30 - 12:30",
        activity: { en: "Drive to restaurant area", th: "เดินทางต่อไปยังเขตร้านอาหารเพื่อรับประทานอาหาร", zh: "驱车行驶前往餐馆聚集区" },
        duration: { en: "Drive: 1h", th: "เวลาขับรถ: 1 ชม.", zh: "车程: 1小时" },
        type: "travel"
      },
      {
        time: "12:30",
        activity: { en: "Lunch", th: "รับประทานอาหารกลางวันพื้นเมือง", zh: "享用西域特色午餐" },
        duration: { en: "Stay: 1h", th: "ใช้เวลา: 1 ชม.", zh: "用时: 1小时" },
        type: "food"
      },
      {
        time: "14:00",
        activity: { en: "Bandir Blue Lake sightseeing", th: "ชมความงามทะเลสาบน้ำสีมรกตบันดีร์บลู", zh: "来到班迪尔蓝湖观赏深邃湛蓝的湖面" },
        duration: { en: "Stay: 45 - 60m", th: "ใช้เวลา: 45 - 60 นาที", zh: "停留: 45-60分钟" },
        type: "stay"
      },
      {
        time: "15:15 - 15:45",
        activity: { en: "Drive to Pamir Eye view", th: "เดินทางต่อไปยังจุดชมวิวดวงตาแห่งปามีร์", zh: "驱车前往“帕米尔之眼”观景点" },
        duration: { en: "Drive: 30m", th: "เวลาขับรถ: 30 นาที", zh: "车程: 30分钟" },
        type: "travel"
      },
      {
        time: "15:45",
        activity: { en: "Pamir Eye geological landmark", th: "ชมความงามทางธรณีวิทยาจุดชมวิวดวงตาปามีร์", zh: "打卡神奇地貌——帕米尔之眼并拍照" },
        duration: { en: "Stay: 45 - 75m", th: "ใช้เวลา: 45 - 75 นาที", zh: "停留: 45-75分钟" },
        type: "stay"
      },
      {
        time: "17:00 - 18:30",
        activity: { en: "Return to Hotel Camp", th: "เดินทางกลับที่พักเต็นท์แคมป์", zh: "驱车返回塔县星空营地" },
        duration: { en: "Drive: 1.5h", th: "เวลาขับรถ: 1.5 ชม.", zh: "车程: 1.5小时" },
        type: "travel"
      }
    ]
  },
  {
    day: 4,
    date: "1 Nov 2026",
    route: { en: "Tashkurgan → Kashgar", th: "ทาชคูร์กัน → คัชการ์", zh: "塔县 → 喀什" },
    hotel: "Lavande Hotel Kashgar",
    items: [
      {
        time: "07:30",
        activity: { en: "Breakfast / Checkout", th: "รับประทานอาหารเช้าและทำการเช็คเอาท์", zh: "享用早餐并办理营地退房" },
        duration: { en: "Stay: 1h", th: "ใช้เวลา: 1 ชม.", zh: "用时: 1小时" },
        type: "food"
      },
      {
        time: "08:30 - 11:00",
        activity: { en: "Drive to Glacier Park base", th: "ออกเดินทางสู่ทางเข้าอุทยานธารน้ำแข็งมุซทัคอาตา", zh: "驱车前往慕士塔格冰川公园入口" },
        duration: { en: "Drive: 2.5h", th: "เวลาขับรถ: 2.5 ชม.", zh: "车程: 2.5小时" },
        type: "travel"
      },
      {
        time: "11:00",
        activity: { en: "Board Glacier Shuttle", th: "ต่อรถบัสรับส่งของอุทยานขึ้นสู่ธารน้ำแข็ง", zh: "换乘景区环保防寒摆渡车上山" },
        duration: { en: "Stay: 30 - 45m", th: "ใช้เวลา: 30 - 45 นาที", zh: "用时: 30-45分钟" },
        type: "travel"
      },
      {
        time: "11:45",
        activity: { en: "Muztagh Ata Glacier Park tour", th: "สัมผัสความยิ่งใหญ่ ธารน้ำแข็งเก่าแก่ มุซทัคอาตา", zh: "进入冰川世界，触摸万年冰川实景并观光" },
        duration: { en: "Stay: 2 - 3h", th: "ใช้เวลา: 2 - 3 ชม.", zh: "停留: 2-3小时" },
        type: "stay"
      },
      {
        time: "14:00",
        activity: { en: "Lunch", th: "รับประทานอาหารกลางวัน", zh: "享用高能午餐" },
        duration: { en: "Stay: 1h", th: "ใช้เวลา: 1 ชม.", zh: "用时: 1小时" },
        type: "food"
      },
      {
        time: "15:00 - 18:00",
        activity: { en: "Return drive to Kashgar", th: "ขับรถเดินทางขากลับลงจากที่ราบสูงสู่เมืองคัชการ์", zh: "驱车沿国道山路下山，返回喀什市区" },
        duration: { en: "Drive: 3h", th: "เวลาขับรถ: 3 ชม.", zh: "车程: 3小时" },
        type: "travel"
      },
      {
        time: "19:00",
        activity: { en: "Check-in at Hotel", th: "เช็คอินเข้าที่พักโรงแรมลาวานด์ คัชการ์", zh: "办理喀什丽枫酒店入住" },
        type: "hotel"
      }
    ]
  },
  {
    day: 5,
    date: "2 Nov 2026",
    route: { en: "Kashgar → Yecheng", th: "คัชการ์ → เย่เฉิง", zh: "喀什 → 叶城" },
    hotel: "Vienna Hotel",
    items: [
      {
        time: "08:00",
        activity: { en: "Breakfast", th: "รับประทานอาหารเช้าที่โรงแรม", zh: "酒店享用早餐" },
        duration: { en: "Stay: 1h", th: "ใช้เวลา: 1 ชม.", zh: "用时: 1小时" },
        type: "food"
      },
      {
        time: "09:00 - 12:00",
        activity: { en: "Drive to Yarkand (Shache)", th: "ขับรถมุ่งหน้าไปทางตะวันออกสู่ยาร์กัต (ซาเชอ)", zh: "驱车南下前往历史名城莎车县" },
        duration: { en: "Drive: 3h", th: "เวลาขับรถ: 3 ชม.", zh: "车程: 3小时" },
        type: "travel"
      },
      {
        time: "12:00",
        activity: { en: "Yarkand historical stops", th: "แวะเที่ยวชมสถาปัตยกรรมและพระราชวังโบราณยาร์กัต", zh: "游览叶尔羌汗国阿曼尼沙汗王陵等古迹" },
        duration: { en: "Stay: 45 - 60m", th: "ใช้เวลา: 45 - 60 นาที", zh: "停留: 45-60分钟" },
        type: "stay"
      },
      {
        time: "13:00",
        activity: { en: "Lunch", th: "รับประทานอาหารกลางวันสไตล์ท้องถิ่น", zh: "享用莎车特色羊肉烤馕午餐" },
        duration: { en: "Stay: 1h", th: "ใช้เวลา: 1 ชม.", zh: "用时: 1小时" },
        type: "food"
      },
      {
        time: "14:00 - 15:30",
        activity: { en: "Drive to Zepu Golden Poplar Forest", th: "เดินทางต่อไปยังอุทยานป่าปอปลาร์หูหยางเจ๋อผู่", zh: "驱车前往泽普金胡杨林国家森林公园" },
        duration: { en: "Drive: 1.5h", th: "เวลาขับรถ: 1.5 ชม.", zh: "车程: 1.5小时" },
        type: "travel"
      },
      {
        time: "15:30",
        activity: { en: "Zepu Golden Poplar Forest walk", th: "เดินชมต้นปอปลาร์ทองโบราณริมน้ำเจ๋อผู่", zh: "步行于金胡杨森林步道，观赏秋日金色胡杨" },
        duration: { en: "Stay: 1.5 - 2h", th: "ใช้เวลา: 1.5 - 2 ชม.", zh: "停留: 1.5-2小时" },
        type: "stay"
      },
      {
        time: "17:30 - 19:00",
        activity: { en: "Drive to Yecheng Hotel", th: "เดินทางต่อสู่ที่พักเมืองเย่เฉิง (จุดกิโลเมตรศูนย์)", zh: "驱车前往叶城县，办理维也纳酒店入住" },
        duration: { en: "Drive: 1.5h", th: "เวลาขับรถ: 1.5 ชม.", zh: "车程: 1.5小时" },
        type: "travel"
      }
    ]
  },
  {
    day: 6,
    date: "3 Nov 2026",
    route: { en: "Yecheng → Hotan", th: "เย่เฉิง → โฮตัน", zh: "叶城 → 和田" },
    hotel: "Xi'an Hotel",
    items: [
      {
        time: "08:00",
        activity: { en: "Breakfast", th: "รับประทานอาหารเช้า", zh: "享用早餐" },
        duration: { en: "Stay: 1h", th: "ใช้เวลา: 1 ชม.", zh: "用时: 1小时" },
        type: "food"
      },
      {
        time: "09:00 - 10:00",
        activity: { en: "Drive to Xitiya Lost City", th: "ออกเดินทางสู่ซากเมืองโบราณซีถีหยา", zh: "驱车前往神秘古迹——锡提亚迷城" },
        duration: { en: "Drive: 1h", th: "เวลาขับรถ: 1 ชม.", zh: "车程: 1小时" },
        type: "travel"
      },
      {
        time: "10:00",
        activity: { en: "Xitiya Lost City ruins", th: "สำรวจซากโบราณคดีร่องรอยอาณาจักรทราย Xitiya", zh: "游览锡提亚古城遗址，寻访沙漠失落文明" },
        duration: { en: "Stay: 45 - 60m", th: "ใช้เวลา: 45 - 60 นาที", zh: "停留: 45-60分钟" },
        type: "stay"
      },
      {
        time: "11:00 - 13:00",
        activity: { en: "Drive to Hotan outskirts", th: "เดินทางต่อมุ่งหน้าสู่เขตเมืองโฮตัน", zh: "驱车行驶前往和田市区" },
        duration: { en: "Drive: 2h", th: "เวลาขับรถ: 2 ชม.", zh: "车程: 2小时" },
        type: "travel"
      },
      {
        time: "13:00",
        activity: { en: "Lunch", th: "รับประทานอาหารกลางวัน", zh: "享用中途午餐" },
        duration: { en: "Stay: 1h", th: "ใช้เวลา: 1 ชม.", zh: "用时: 1小时" },
        type: "food"
      },
      {
        time: "14:00",
        activity: { en: "Yotkan Ancient City theatrical tour", th: "เข้าชมการจำลองละครประวัติศาสตร์เมืองโบราณโยตกัน", zh: "漫步约特干故国景区，游览沉浸式古街演艺" },
        duration: { en: "Stay: 1.5 - 2h", th: "ใช้เวลา: 1.5 - 2 ชม.", zh: "停留: 1.5-2小时" },
        type: "stay"
      },
      {
        time: "18:00",
        activity: { en: "Hotan Night Market street food", th: "เดินตลาดโต้รุ่งชิมอาหารขึ้นชื่อ ตลาดกลางคืนโฮตัน", zh: "逛和田夜市，品尝烤蛋、酸奶、烤肉串等美食" },
        duration: { en: "Stay: 1 - 1.5h", th: "ใช้เวลา: 1 - 1.5 ชม.", zh: "停留: 1-1.5小时" },
        type: "stay"
      }
    ]
  },
  {
    day: 7,
    date: "4 Nov 2026",
    route: { en: "Hotan → Aral", th: "โฮตัน → อารัล", zh: "和田 → 阿拉尔" },
    hotel: "Wanda Moments Aral",
    items: [
      {
        time: "08:00",
        activity: { en: "Breakfast", th: "รับประทานอาหารเช้าและจัดกระเป๋าเตรียมออกเดินทาง", zh: "享用早餐并备车出发" },
        duration: { en: "Stay: 1h", th: "ใช้เวลา: 1 ชม.", zh: "用时: 1小时" },
        type: "food"
      },
      {
        time: "09:00",
        activity: { en: "Start Taklamakan Desert Highway drive", th: "ออกเดินทางข้ามอภิมหาทางหลวงทะเลทรายทากลามากาน", zh: "出发越野，驶入塔克拉玛干沙漠公路" },
        type: "travel"
      },
      {
        time: "12:00",
        activity: { en: "Photo Stop #1 (Desert dunes)", th: "จุดจอดรถถ่ายรูปกลางเนินทรายรูปคลื่นจุดที่ 1", zh: "沙漠腹地摄影停靠点 #1，拍摄沙海美景" },
        duration: { en: "Stay: 15 - 20m", th: "ใช้เวลา: 15 - 20 นาที", zh: "停留: 15-20分钟" },
        type: "stay"
      },
      {
        time: "13:00",
        activity: { en: "Lunch at roadside station", th: "แวะทานอาหารกลางวันง่ายๆ ที่จุดบริการทางหลวง", zh: "在沙漠公路服务站享用简餐午餐" },
        duration: { en: "Stay: 45m", th: "ใช้เวลา: 45 นาที", zh: "用时: 45分钟" },
        type: "food"
      },
      {
        time: "15:30",
        activity: { en: "Photo Stop #2 (Sunset dunes view)", th: "จุดจอดรถถ่ายรูปแสงพระอาทิตย์ส่องเนินทรายจุดที่ 2", zh: "沙漠公路摄影点 #2，观赏夕阳大漠" },
        duration: { en: "Stay: 20 - 30m", th: "ใช้เวลา: 20 - 30 นาที", zh: "停留: 20-30分钟" },
        type: "stay"
      },
      {
        time: "18:00",
        activity: { en: "Arrive Aral oasis & Check-in", th: "เดินทางถึงอารัลริมแม่น้ำทาริม เช็คอินโรงแรมว่านด้า", zh: "抵达沙漠绿洲城市阿拉尔，入住万达美华酒店" },
        type: "transit"
      }
    ]
  },
  {
    day: 8,
    date: "5 Nov 2026",
    route: { en: "Aral → Aksu", th: "อารัล → อัคซู", zh: "阿拉尔 → 阿克苏" },
    hotel: "Aksu Huarui Hotel",
    items: [
      {
        time: "07:30",
        activity: { en: "Breakfast", th: "รับประทานอาหารเช้าที่โรงแรม", zh: "酒店享用早餐" },
        duration: { en: "Stay: 1h", th: "ใช้เวลา: 1 ชม.", zh: "用时: 1小时" },
        type: "food"
      },
      {
        time: "08:30 - 11:30",
        activity: { en: "Drive to Tomur Canyon entrance", th: "ขับรถมุ่งหน้าไปยังอุทยานแกรนด์แคนยอนทอมูร์", zh: "驱车出发往天山温宿大峡谷" },
        duration: { en: "Drive: 3h", th: "เวลาขับรถ: 3 ชม.", zh: "车程: 3小时" },
        type: "travel"
      },
      {
        time: "11:30",
        activity: { en: "Tomur Grand Canyon gorge trek", th: "เดินศึกษาซอกผาดินแดงอันน่าอัศจรรย์ ทอมูร์แคนยอน", zh: "徒步深入壮丽的红崖托木尔大峡谷通道" },
        duration: { en: "Stay: 2 - 3h", th: "ใช้เวลา: 2 - 3 ชม.", zh: "停留: 2-3小时" },
        type: "stay"
      },
      {
        time: "14:30",
        activity: { en: "Lunch", th: "รับประทานอาหารกลางวันเนื้อแกะท้องถิ่น", zh: "享用温宿特色风味午餐" },
        duration: { en: "Stay: 1h", th: "ใช้เวลา: 1 ชม.", zh: "用时: 1小时" },
        type: "food"
      },
      {
        time: "15:30 - 18:00",
        activity: { en: "Drive to Aksu City center", th: "เดินทางต่อสู่ใจกลางเมืองอักซูเพื่อพักผ่อน", zh: "驱车前往阿克苏市中心" },
        duration: { en: "Drive: 2.5h", th: "เวลาขับรถ: 2.5 ชม.", zh: "车程: 2.5小时" },
        type: "travel"
      },
      {
        time: "18:00",
        activity: { en: "Arrive Aksu & Check-in", th: "เดินทางถึงอักซู เช็คอินโรงแรมหรูแกรนด์ฮวารุย", zh: "抵达阿克苏市区，办理华瑞大酒店入住" },
        type: "transit"
      }
    ]
  },
  {
    day: 9,
    date: "6 Nov 2026",
    route: { en: "Aksu Free Day", th: "วันพักผ่อนอิสระที่อักซู", zh: "阿克苏自由日" },
    hotel: "Aksu Huarui Hotel",
    items: [
      {
        time: "09:00",
        activity: { en: "Breakfast", th: "รับประทานอาหารเช้าพักผ่อนสบายๆ", zh: "悠闲地在酒店享用早餐" },
        duration: { en: "Stay: 1h", th: "ใช้เวลา: 1 ชม.", zh: "用时: 1小时" },
        type: "food"
      },
      {
        time: "10:30",
        activity: { en: "Aksu Old Street City Walk", th: "เดินเล่นผ่อนคลายในตึกย่านเมืองเก่าอักซู", zh: "漫步阿克苏老街，品尝冰糖心苹果" },
        duration: { en: "Stay: 1 - 1.5h", th: "ใช้เวลา: 1 - 1.5 ชม.", zh: "停留: 1-1.5小时" },
        type: "stay"
      },
      {
        time: "13:00",
        activity: { en: "Lunch", th: "รับประทานอาหารกลางวันตำรับอุยกูร์", zh: "享用特色大盘鸡特色中餐" },
        duration: { en: "Stay: 1h", th: "ใช้เวลา: 1 ชม.", zh: "用时: 1小时" },
        type: "food"
      },
      {
        time: "14:30",
        activity: { en: "Shopping for dates / Spa / Cafe relaxation", th: "ช้อปปิ้งอินทผลัมของฝาก / สปานวดเท้า / นั่งชิลคาเฟ่", zh: "大巴扎购买特产干果 / 足疗SPA / 咖啡馆小憩" },
        duration: { en: "Stay: 2 - 3h", th: "ใช้เวลา: 2 - 3 ชม.", zh: "停留: 2-3小时" },
        type: "stay"
      },
      {
        time: "Evening",
        activity: { en: "Free Time & Packing luggage", th: "จัดกระเป๋าและพักผ่อนตามอัธยาศัยในช่วงเย็น", zh: "整理行装，晚间于市区自由安排" },
        type: "stay"
      }
    ]
  },
  {
    day: 10,
    date: "7 Nov 2026",
    route: { en: "Aksu → Bangkok", th: "อักซู → กรุงเทพฯ", zh: "阿克苏 → 曼谷" },
    hotel: "N/A",
    items: [
      {
        time: "08:00",
        activity: { en: "Breakfast", th: "รับประทานอาหารเช้าที่โรงแรม", zh: "享用早餐" },
        duration: { en: "Stay: 1h", th: "ใช้เวลา: 1 ชม.", zh: "用时: 1小时" },
        type: "food"
      },
      {
        time: "10:00",
        activity: { en: "Airport Transfer drive", th: "เดินทางสู่สนามบินอักซู温宿 (AKU)", zh: "专车前往阿克苏温宿机场 (AKU)" },
        duration: { en: "Drive: 1h", th: "เวลาขับรถ: 1 ชม.", zh: "车程: 1小时" },
        type: "travel"
      },
      {
        time: "12:40",
        activity: { en: "Flight Depart Aksu to Chongqing", th: "ขึ้นเครื่องขากลับ เที่ยวบินออกเดินทางสู่ฉงชิ่ง", zh: "国内段航班起飞：阿克苏飞往重庆" },
        type: "flight"
      },
      {
        time: "16:55 - 21:30",
        activity: { en: "Transit at Chongqing Airport", th: "แวะรอเปลี่ยนเครื่องที่สนามบินฉงชิ่ง (CKG)", zh: "重庆江北国际机场过境中转" },
        type: "transit"
      },
      {
        time: "23:30",
        activity: { en: "Arrive Bangkok Suvarnabhumi safely", th: "เดินทางถึงกรุงเทพฯ (BKK) โดยสวัสดิภาพ", zh: "航班降落曼谷素万那普国际机场，安全抵家" },
        type: "flight"
      }
    ]
  }
];
