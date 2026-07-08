export interface Attraction {
  id: string;
  name: {
    en: string;
    th: string;
    zh: string;
  };
  isWaypoint?: boolean;
  wikiTitle?: string;
  imageUrl?: string;
  location: {
    en: string;
    th: string;
    zh: string;
  };
  coordinates: string;
  openHours: {
    en: string;
    th: string;
    zh: string;
  };
  ticketPrice: {
    en: string;
    th: string;
    zh: string;
  };
  bestTime: {
    en: string;
    th: string;
    zh: string;
  };
  description: {
    en: string;
    th: string;
    zh: string;
  };
  highlights: {
    en: string[];
    th: string[];
    zh: string[];
  };
  localTips: {
    en: string;
    th: string;
    zh: string;
  };
}

export const ATTRACTIONS_DATA: Attraction[] = [
  {
    id: "kashgar_old_town",
    wikiTitle: "Kashgar",
    imageUrl: "/images/kashgar_old_town.jpg",
    name: {
      en: "Kashgar Old Town",
      th: "เมืองโบราณคัชการ์",
      zh: "喀什古城"
    },
    location: {
      en: "Kashgar City Center",
      th: "ใจกลางเมืองคัชการ์",
      zh: "喀什市中心"
    },
    coordinates: "39.4704° N, 75.9898° E",
    openHours: {
      en: "Open 24 hours (Opening ceremony at 10:30 AM daily)",
      th: "เปิด 24 ชั่วโมง (มีพิธีเปิดประตูปราสาทต้อนรับเวลา 10:30 น. ทุกวัน)",
      zh: "全天开放 (每日上午10:30举行开城仪式)"
    },
    ticketPrice: {
      en: "Free entrance (Some specific courtyards charge 30-50 RMB)",
      th: "เข้าชมฟรี (บ้านโบราณเฉพาะจุดหรือชมการแสดงพิเศษ 30-50 หยวน)",
      zh: "门票免费 (部分特色民居及演出需单独购票约30-50元)"
    },
    bestTime: {
      en: "May to November, especially late afternoon to night",
      th: "พฤษภาคม ถึง พฤศจิกายน โดยเฉพาะช่วงบ่ายแก่ๆ ถึงยามค่ำคืน",
      zh: "5月至11月，特别是午后至夜间"
    },
    description: {
      en: "Over 2,000 years of living history, this is the largest mud-brick architectural complex in the world. Walking through its maze-like alleys feels like stepping onto the pages of 'One Thousand and One Nights'. It remains the vibrant, beating heart of Uyghur culture, filled with copper workshops, tea houses, and laughing children.",
      th: "ประวัติศาสตร์ที่มีชีวิตกว่า 2,000 ปี ที่นี่คือชุมชนสถาปัตยกรรมดินเหนียวโบราณที่ยังคงมีคนอยู่อาศัยที่ใหญ่ที่สุดในโลก การเดินลัดเลาะในตรอกซอกซอยที่เหมือนเขาวงกตจะทำให้คุณรู้สึกเหมือนหลุดเข้าไปในโลกอาหรับราตรี คลาคล่ำไปด้วยช่างทำเครื่องทองเหลือง โรงน้ำชาโบราณร้อยปี และวิถีชีวิตดั้งเดิมของชาวอุยกูร์ที่อบอุ่นและมีชีวิตชีวา",
      zh: "拥有两千多年历史的“活着的古城”，是世界上规模最大的生土建筑群。漫步在纵横交错、犹如迷宫般的老街上，仿佛置身于《一千零一夜》的神话世界。这里依旧保留着手工作坊、百年茶馆与热闹的巴扎，展示着维吾尔族最原汁原味的生活图景。"
    },
    highlights: {
      en: [
        "Century-old Tea House: Try local rose tea and watch elderly Uyghurs play traditional music.",
        "Castle Opening Ceremony: Vibrant Uyghur dance and historical reenactment at the main East Gate.",
        "Overlooking the City: Beautiful sand-colored clay architecture against the modern city backdrop."
      ],
      th: [
        "โรงน้ำชาร้อยปี: นั่งจิบชาสมุนไพร กุหลาบซินเจียง และฟังคุณตาอุยกูร์เล่นดนตรีพื้นเมืองสดๆ",
        "พิธีเปิดประตูปราสาท: การต้อนรับแบบโบราณด้วยระบำพื้นบ้านอันทรงพลังที่ประตูตะวันออก",
        "ตรอกเขาวงกตดินเหนียว: ถ่ายภาพแนวคอนเทนต์มุมสวยชิคคู่กับประตูไม้แกะสลักศิลปะเอเชียกลาง"
      ],
      zh: [
        "百年老茶馆：点一壶玫瑰花茶，静静聆听维吾尔族长者现场弹唱的琴声。",
        "东门开城仪式：每天上午精彩呈现的歌舞与历史重现，热烈迎接入城游客。",
        "彩色迷宫小巷：红砖与土墙交织的欧式异域风情小巷，随手一拍便是时尚大片。"
      ]
    },
    localTips: {
      en: "Look at the hexagonal tiles on the street. Hexagonal tiles mean the path leads out; square tiles mean a dead end! Never get lost.",
      th: "เคล็ดลับไม่หลงทาง: สังเกตแผ่นหินปูพื้น! หากปูด้วยหินหกเหลี่ยมแสดงว่าเป็นทางผ่านที่เดินทะลุได้ หากปูด้วยหินสี่เหลี่ยมแสดงว่าเป็นทางตัน!",
      zh: "小街防迷路指南：看脚下！铺设六角砖的路代表是通的，铺设四角形（方形）砖的路则是死胡同！"
    }
  },
  {
    id: "baisha_lake",
    wikiTitle: "Baisha Lake (Xinjiang)",
    name: {
      en: "Baisha Lake & White Sand Dunes",
      th: "ทะเลสาบและเนินทรายขาวไป่ซา",
      zh: "白沙湖与白沙山"
    },
    location: {
      en: "Karakoram Highway, Akto County",
      th: "ริมทางหลวงคาราโกรัม, อำเภออาเค่อเถา",
      zh: "喀喇昆仑公路旁，阿克陶县"
    },
    coordinates: "38.6643° N, 74.9489° E",
    openHours: {
      en: "08:30 AM - 07:30 PM",
      th: "08:30 น. - 19:30 น.",
      zh: "08:30 - 19:30"
    },
    ticketPrice: {
      en: "40 RMB (Includes shuttle bus and viewing platforms)",
      th: "40 หยวน (รวมรถรับส่งภายในและจุดชมวิวริมทะเลสาบ)",
      zh: "门票40元 (含景区区间车及观景台体验)"
    },
    bestTime: {
      en: "July to October, early morning or late afternoon for reflections",
      th: "กรกฎาคม ถึง ตุลาคม ช่วงเช้าหรือบ่ายแก่ๆ ลมสงบผืนน้ำจะนิ่งสงบเป็นกระจก",
      zh: "7月至10月，晴天无风的早晨或傍晚最为镜面"
    },
    description: {
      en: "Situated at 3,300 meters above sea level, Baisha Lake is a dazzling turquoise gem surrounded by massive, snow-white sand dunes. Winds over thousands of years have carried fine dust from the Pamir valleys, blowing them against the mountains to form this contrast of smooth desert dunes bordering mirror-like mountain waters.",
      th: "ตั้งอยู่เหนือระดับน้ำทะเล 3,300 เมตร ทะเลสาบไป่ซาคืออัญมณีสีเทอร์ควอยซ์สว่างไสวที่โอบล้อมด้วยเนินทรายทอประกายสีขาวราวกับหิมะ ลมพายุที่พัดผ่านหุบเขาแม่น้ำปามีร์นับพันปีได้หอบทรายละเอียดยิบมาตกสะสมตามไหล่เขา ก่อเกิดทัศนียภาพทะเลขั้วตรงข้ามระหว่างผืนน้ำสีฟ้าครามและเนินทรายสีเงินยวด",
      zh: "海拔约3300米的高原明珠。纯净乳白色的细沙由于强风吹拂积聚成连绵起伏的沙山，环抱一汪翡翠绿般的湖水。银沙与碧波交相辉映，在不同光线和风力下会呈现出梦幻的神奇色彩变幻。"
    },
    highlights: {
      en: [
        "Mirror Reflection: The white sand mountains reflecting perfectly on the crystal blue surface.",
        "Contrast photography: Striking visual contrast of white sands, turquoise waters, and distant snow peaks.",
        "Karakoram Milestone: First major lake stop on the high-altitude route."
      ],
      th: [
        "ภาพสะท้อนน้ำกระจก: เนินทรายสีขาวสะท้อนผืนน้ำกว้างขวางเป็นกระจกเงาสองมิติ",
        "มุมคู่ตรงข้ามธรรมชาติ: ความงามขัดแย้งแบบสุดขั้วระหว่างภูเขาทรายแล้งน้ำและอ่างเก็บน้ำสีฟ้าคราม",
        "ทางหลวงในฝัน: โค้งถนนที่สวยที่สุดริมหน้าผาเมื่อโผล่พ้นภูเขามาเจอผืนน้ำไป่ซา"
      ],
      zh: [
        "倒影景观：白沙山在如镜面般宁静的蓝色湖水中形成完美对称反射。",
        "沙水相依：近处白沙如雪，远处雪山矗立，中间一抹孔雀蓝的惊艳对比。",
        "中巴公路风光：驱车越过山坳时，碧水沙山豁然开朗的壮丽美景。"
      ]
    },
    localTips: {
      en: "This spot is windy and cold even in summer. Keep your windbreaker handy and wear bright colors like orange or red for stunning photos.",
      th: "จุดนี้ลมแรงและอากาศค่อนข้างเย็นจัดตลอดปี ควรเตรียมเสื้อกันลมติดตัว และใส่ชุดสีสดใส เช่น แดง ส้ม หรือเหลือง จะถ่ายรูปขึ้นตัดกับโทนทรายขาวและน้ำสีฟ้าได้อย่างน่าทึ่ง",
      zh: "由于山口效应此地常年风大且气温偏低，建议备好防风保暖外套。穿着大红、亮黄或橙色衣物拍照效果最佳。"
    }
  },
  {
    id: "karakul_lake",
    wikiTitle: "Karakul Lake",
    imageUrl: "/images/karakul_lake.jpg",
    name: {
      en: "Karakul Lake & Muztagh Ata Glacier",
      th: "ทะเลสาบคาราคูลและยอดเขาน้ำแข็งมุซทัคอาตา",
      zh: "卡拉库勒湖与慕士塔格峰"
    },
    location: {
      en: "Karakoram Highway, Akto County (altitude 3,600m)",
      th: "ริมทางหลวงคาราโกรัม, อำเภออาเค่อเถา (ระดับความสูง 3,600 ม.)",
      zh: "阿克陶县喀喇昆仑公路旁 (海拔约3600米)"
    },
    coordinates: "38.2761° N, 75.1159° E",
    openHours: {
      en: "09:00 AM - 08:00 PM",
      th: "09:00 น. - 20:00 น.",
      zh: "09:00 - 20:00"
    },
    ticketPrice: {
      en: "50 RMB",
      th: "50 หยวน",
      zh: "门票50元"
    },
    bestTime: {
      en: "September to November, sunset reveals golden glacier colors",
      th: "กันยายน ถึง พฤศจิกายน ท้องฟ้าจะโปร่ง ลมสงบ และช่วงพระอาทิตย์ตกจะส่องแสงสีทองส้มจับขอบธารน้ำแข็งมุซทัคอาตา",
      zh: "9月至11月，秋季晴空万里，傍晚可见夕阳金山反射在雪山上"
    },
    description: {
      en: "Karakul, meaning 'Black Lake', changes colors from light green to deep purple depending on the sun. It lies directly at the base of Muztagh Ata (7,546m), the legendary 'Father of Ice Mountains'. The reflections of this giant dome of snow on the high alpine water surface is one of the most sacred mountain views in all of Asia.",
      th: "คาราคูล มีความหมายว่า 'ทะเลสาบดำ' เนื่องจากน้ำลึกและสะท้อนสีเมฆเป็นโทนม่วงอมดำเข้ม แต่ในวันฟ้าใสจะเปลี่ยนเป็นเขียวมรกต ทะเลสาบตั้งสงบอยู่ใต้ตีนเขายักษ์มุซทัคอาตา (ความสูง 7,546 เมตร) เจ้าของฉายา 'บิดาแห่งขุนเขาน้ำแข็ง' ยามน้ำนิ่งยอดเขาทรงโดมหิมะจะสะท้อนเงาลงบนผืนน้ำสีเข้มอย่างสง่างามและน่าเกรงขาม",
      zh: "柯尔克孜语意为“黑湖”。湖水深邃，水色随天光阴晴在翠绿、湛蓝与深黛色间变幻。它依偎在被称为“冰山之父”的慕士塔格峰（海拔7546米）脚下，雪山倒映在清澈的高原湖泊中，圣洁静谧。"
    },
    highlights: {
      en: [
        "Father of Ice Mountains: Standing close to Muztagh Ata glacier dome.",
        "Color Changing Water: Watching the lake shift shades under passing clouds.",
        "Kirghiz Culture: Traditional yurts and horses grazing on the alpine grasslands nearby."
      ],
      th: [
        "วิวสัญลักษณ์ซินเจียง: การชมธารน้ำแข็งกลมโดมขนาดยักษ์ของมุซทัคอาตาที่ตั้งตระหง่านอยู่เบื้องหลังทะเลสาบ",
        "วัฒนธรรมคีร์กีซ: ค่ายกระโจมสีขาว (Yurt) และฝูงม้า ฝูงจามรีเล็มหญ้าริมทะเลสาบ",
        "ทางเดินริมผืนน้ำ: สะพานไม้ทอดยาวเลียบแนวชายฝั่งเพื่อหามุมถ่ายรูปสะท้อนน้ำที่สมบูรณ์แบบ"
      ],
      zh: [
        "圣山倒影：近距离瞻仰慕士塔格峰壮丽的冰川覆雪穹顶，并在湖中拍下巍峨倒影。",
        "变色魔湖：体验湖水在阳光、云影交织下由湖绿转为深黑的神秘光影艺术。",
        "高原牧歌：周边点缀着柯尔克孜族的白色毡房与悠闲吃草的马匹和牦牛。"
      ]
    },
    localTips: {
      en: "At 3,600m elevation, physical activities should be kept slow. Avoid running, keep warm to prevent AMS (Acute Mountain Sickness), and rent a horse for a lakeside stroll.",
      th: "ที่ระดับความสูง 3,600 เมตร อากาศค่อนข้างเบาบางและอุณหภูมิต่ำ ห้ามวิ่งหรือออกแรงฉับพลันเพื่อป้องกันอาการแพ้ที่ราบสูง (AMS) ควรเดินช้าๆ และแนะนำให้เช่าม้าขี่เลียบชายฝั่งหาพิกัดชิคๆ ถ่ายรูปคู่กับจามรีขาว",
      zh: "此处海拔约3600米，切忌剧烈奔跑。注意头部防风防寒，避免高原反应（AMS）。可以尝试租骑马匹或与高原白牦牛拍照留念。"
    }
  },
  {
    id: "panlong_road",
    wikiTitle: "Panlong Road (Tashkurgan)",
    imageUrl: "/images/Panlong Ancient Road.jpeg",
    name: {
      en: "Panlong Winding Road (Wacha Pass)",
      th: "ถนนมังกรเลื้อยพานหลง (ถนนพันโค้ง)",
      zh: "盘龙古道 (瓦恰公路)"
    },
    location: {
      en: "Tashkurgan Tajik County, Pamirs",
      th: "อำเภอปกครองตนเองทาชคูร์กัน, ที่ราบสูงปามีร์",
      zh: "塔什库尔干塔吉克自治县瓦恰乡"
    },
    coordinates: "37.6392° N, 75.5935° E",
    openHours: {
      en: "Open 24 hours (Closed during heavy snow or ice road conditions)",
      th: "เปิด 24 ชั่วโมง (อาจปิดชั่วคราวหากมีหิมะตกหนักหรือเกิดน้ำแข็งเกาะผิวถนน)",
      zh: "全天开放 (冬季降雪结冰路况下可能临时管制)"
    },
    ticketPrice: {
      en: "Free (Requires local driver/vehicle permits)",
      th: "ฟรี (รถยนต์ส่วนบุคคลไม่รวมค่าผ่านทางพื้นที่ และจำเป็นต้องใช้คนขับที่มีทักษะชำนาญสูง)",
      zh: "免费 (需遵守当地边境通行证及车型准入规定)"
    },
    bestTime: {
      en: "May to October, late morning to midday for overhead sun and curve visibility",
      th: "พฤษภาคม ถึง ตุลาคม ช่วงเวลา 11:00 - 15:00 น. แสงแดดจะส่องตรงหัวทำให้มองเห็นเส้นโค้งถนนมังกรเลื้อยตัดกับหุบเขาสีเข้มได้ชัดเจนที่สุด",
      zh: "5月至10月，上午11点至下午3点日光直射，俯瞰道路曲线最明晰"
    },
    description: {
      en: "A masterpiece of rural engineering winding like a giant dragon down the black mountains of the Pamir Plateau. With over 600 hairpin curves in just 30 kilometers, this road drops more than 1,000 meters in altitude. Its slogan: 'Today you have driven all the winding bends; from now on, your life path will be straight and smooth.'",
      th: "อภิมหาผลงานวิศวกรรมทางหลวงที่เลื้อยคดเคี้ยวราวกับมังกรยักษ์ลงมาจากเทือกเขาคุนหลุนแห่งที่ราบสูงปามีร์ ด้วยจำนวนโค้งหักศอกกว่า 600 โค้งตลอดระยะทางลาดชันเพียง 30 กิโลเมตร ทำระดับความชันดิ่งลงกว่า 1,000 เมตร พร้อมคำขวัญสุดประทับใจที่ใครมาก็ต้องถ่ายรูปคู่: 'วันนี้เดินทางผ่านพ้นพันโค้งคดเคี้ยวแล้ว นับจากนี้ไปหนทางชีวิตของคุณจะราบรื่นและเป็นเส้นตรง'",
      zh: "南疆最炙手可热的“网红公路”。整条古道全长约30公里，海拔跨度从3000米骤降到4100米，拥有惊人的600多个弯道（大部分为180度U型黑发卡弯）。其著名标语：“今日走过了人生所有的弯路，从此人生尽是坦途”。"
    },
    highlights: {
      en: [
        "600 Hairpin Bends: Pure engineering wonder dropping over steep valley walls.",
        "Overlook Viewpoint: The famous plateau overlook capturing the endless ribbon of asphalt.",
        "The Slogan Board: Taking a group picture with the iconic roadside motivational sign."
      ],
      th: [
        "600 กว่าโค้งปิ่นปักผม: เส้นโค้งหักศอกที่พับไปพับมาตัดกับเทือกเขาสีดำเข้มแห้งแล้งชวนอะดรีนาลีนหลั่ง",
        "จุดชมวิวหุบเขาพานหลง: จุดจอดรถด้านบนสุดที่สามารถเดินขึ้นไปบันทึกภาพมุมกว้างเห็นถนนม้วนเป็นขดเชือก",
        "ป้ายสโลแกนนำโชค: จุดเช็คอินถ่ายภาพป้ายคำขวัญขากลับเพื่อเป็นเคล็ดมงคลชีวิต"
      ],
      zh: [
        "天路六百弯：由大盘龙、小盘龙组成的惊险U形公路群，如游龙盘旋山脊之上。",
        "龙首观景台：登顶木栈道，俯瞰宛如黑色巨龙铺展在土黄色荒山上的无死角大片。",
        "网红路牌打卡：与矗立在古道尽头的“人生坦途”励志标语牌合影留念。"
      ]
    },
    localTips: {
      en: "Large tour buses cannot go up due to sharp bends. Vehicles are strictly limited to vans or 4WD SUVs. Drive slow, use engine braking (low gears) to prevent brake overheating during descent.",
      th: "โค้งแคบและชันจัด รถทัวร์ขนาดใหญ่ไม่สามารถผ่านได้ จำกัดเฉพาะรถตู้พรีเมียมขนาดเล็กหรือ SUV เท่านั้น คนขับต้องขับช้าๆ และห้ามเหยียบเบรกแช่ตลอดทางลาดลง ให้ใช้เกียร์ต่ำ (Engine Brake) ช่วยสลับเพื่อความปลอดภัย",
      zh: "大客车由于轴距长无法通行，仅限中小型商务车及越野SUV通行。下山陡峭，司机请务必挂低速挡利用发动机制动，避免刹车片过热失效。"
    }
  },
  {
    id: "yotkan_ancient_city",
    wikiTitle: "Yotkan",
    name: {
      en: "Yotkan Ancient City",
      th: "เมืองโบราณโยตกัน",
      zh: "约特干故城"
    },
    location: {
      en: "Hotan County (10km from city center)",
      th: "อำเภอโฮตัน (ห่างจากตัวเมืองประมาณ 10 กม.)",
      zh: "和田县巴格其镇"
    },
    coordinates: "",
    openHours: {
      en: "10:30 AM - 11:30 PM (Night theatrical show starts around 08:30 PM)",
      th: "10:30 น. - 23:30 น. (การแสดงละครเพลงประวัติศาสตร์ยามค่ำเริ่มเวลา 20:30 น.)",
      zh: "10:30 - 23:30 (大型沉浸式夜间演艺从晚上20:30开启)"
    },
    ticketPrice: {
      en: "268 RMB (Includes access to all plays and night light show)",
      th: "268 หยวน (บัตรผ่านประตูรวมชมการแสดงย้อนประวัติศาสตร์อาณาจักรโฮตันยามค่ำคืน)",
      zh: "门票268元 (含景区通票入城费以及全晚大型沉浸式实景演艺演出)"
    },
    bestTime: {
      en: "Late evening (07:00 PM onwards) to experience the night lights",
      th: "ช่วงเย็นย่ำ (19:00 น. เป็นต้นไป) เพื่อสัมผัสแสงไฟส่องสว่างและการแสดงเต้นรำย้อนยุคบนท้องถนนโบราณ",
      zh: "傍晚19:00后入园最佳，灯光渐次亮起，夜间演出从20:30分步步精彩"
    },
    description: {
      en: "A stunning historical reconstruction of the ancient Buddhist Kingdom of Khotan (Yotkan). Built in classical clay and white plaster style with magnificent gold accents, this theme town brings history back to life. Actors in ancient robes stroll the streets, performing market scenes and large-scale projection mapping plays.",
      th: "ฉากจำลองประวัติศาสตร์สุดยิ่งใหญ่อลังการของราชอาณาจักรโฮตันโบราณ (Khotan) ศิลปะสิ่งปลูกสร้างสไตล์ดินเหนียวผสมปูนปั้นสีขาวขอบทองงดงามวิจิตร เมืองแห่งนี้เหมือนไทม์แมชชีนพาย้อนยุคด้วยการแสดงแบบสมจริง (Immersive) ตลอดคืน โดยเหล่านักแสดงจะสวมชุดย้อนยุคออกมาเดินเตร่ปะปนกับนักท่องเที่ยว ทำหน้าที่ค้าขาย ขายผ้าไหม และร่ายรำรอบกองไฟตัดกับแสงสีตระการตา",
      zh: "依照西域古国“于阗古国”遗址复原修建的生土城堡建筑群。整个城区采用纯白与赤黄泥土抹面，重现汉唐时期的异域王城风貌。夜晚开启沉浸式演艺模式，街区化作天然舞台，全方位光影声效带你一日越千年。"
    },
    highlights: {
      en: [
        "Immersive Theatrical Street Walk: Live performances happening in random alleys.",
        "Khotan Jade bazaar: Traditional replica market showing off regional carpets and famous white jade.",
        "Grand Night Light Show: Stunning golden projections mapping the fortress walls."
      ],
      th: [
        "การแสดงละครแบบสมจริง (Immersive): นักแสดงจะล้อมรอบตัวเราเต้นรำและพูดคุยเสมือนเราเป็นส่วนหนึ่งของชาวเมืองโฮตันโบราณ",
        "สถาปัตยกรรมสีขาวขอบทอง: ลานกลางแจ้งขนาดใหญ่และหอคอยปราสาทถ่ายรูปแล้วโดดเด่นไม่ซ้ำใคร",
        "ตลาดโบราณโฮตัน: บูธจัดแสดงหยกขาวโฮตัน ผ้าไหมเนื้อดี และเครื่องปั้นดินเผาประดิษฐ์จากมือ"
      ],
      zh: [
        "万方乐奏：街头巷尾随时发生的沉浸式剧情表演，西域舞姬翩翩起舞近在咫尺。",
        "白色于阗王宫：气势恢宏的汉唐风生土宫殿城堡，拍照极具西域宫廷王公贵气。",
        "夜戏游园会：巨幅裸眼3D墙体投影秀，水幕歌舞，绚丽烟火与歌舞盛宴交织。"
      ]
    },
    localTips: {
      en: "Rent a traditional Uyghur robe at the entrance. It costs around 80-150 RMB and makes you blend perfectly into the historic atmosphere.",
      th: "เคล็ดลับเพิ่มความสนุก: แนะนำให้เช่าชุดย้อนยุคสไตล์อุยกูร์หรือชุดเอเชียกลางที่หน้าร้านเช่าบริเวณหน้าประตูปราสาท (ราคาประมาณ 80-150 หยวน) จะทำให้คุณเดินถ่ายภาพได้อย่างกลมกลืนเป็นส่วนหนึ่งของประวัติศาสตร์พันปี",
      zh: "景区门口提供古装租售（西域胡风或飞天华服约80-150元），换装入城漫步更具代入感，拍照秒出异域大片。"
    }
  },
  {
    id: "zepu_golden_poplar_forest",
    wikiTitle: "Zepu County",
    name: {
      en: "Zepu Golden Poplar Forest",
      th: "ป่าต้นปอปลาร์ทองเจ๋อผู่",
      zh: "泽普金胡杨景区"
    },
    location: {
      en: "Zepu County, Kashgar Prefecture",
      th: "อำเภอเจ๋อผู่ มณฑลคัชการ์",
      zh: "喀什地区泽普县"
    },
    coordinates: "38.4260° N, 77.2700° E",
    openHours: {
      en: "08:30 AM - 06:30 PM",
      th: "08:30 - 18:30 น.",
      zh: "08:30 - 18:30"
    },
    ticketPrice: {
      en: "40 RMB",
      th: "40 หยวน",
      zh: "门票40元"
    },
    bestTime: {
      en: "October to November, golden poplar season",
      th: "ตุลาคมถึงพฤศจิกายน ฤดูปอปลาร์สีทอง",
      zh: "10月至11月，金胡杨季节"
    },
    description: {
      en: "A scenic forest of golden poplar trees along the Tarim Basin fringe, especially striking in autumn when the leaves turn luminous gold.",
      th: "ป่าต้นปอปลาร์ทองริมชายแอ่งทาริมที่สวยงามมาก โดยเฉพาะช่วงฤดูใบไม้ร่วงเมื่อใบไม้เปลี่ยนเป็นสีทองสดใส",
      zh: "位于塔里木盆地边缘的金胡杨林，秋季叶色转为金黄，景致十分醒目。"
    },
    highlights: {
      en: ["Autumn golden forest", "Quiet riverside walks", "Classic Xinjiang poplar scenery"],
      th: ["ป่าฤดูใบไม้ร่วงสีทอง", "เดินชมริมน้ำอย่างเงียบๆ", "ทิวทัศน์ปอปลาร์ซินเจียงคลาสสิก"],
      zh: ["秋日金色林海", "静谧河畔散步", "典型新疆胡杨风景"]
    },
    localTips: {
      en: "Visit in late afternoon for warm light and fewer crowds.",
      th: "แนะนำไปช่วงบ่ายแก่ๆ จะได้แสงอุ่นและคนไม่หนาแน่นมาก",
      zh: "建议傍晚前往，光线柔和且游客较少。"
    }
  },
  {
    id: "tomur_canyon",
    wikiTitle: "Tomur Peak",
    imageUrl: "/images/wensu_canyon.jpg",
    name: {
      en: "Tomur Grand Canyon",
      th: "แกรนด์แคนยอนทอมูร์แห่งเวิ่นซู่",
      zh: "温宿大峡谷 (托木尔大峡谷)"
    },
    location: {
      en: "Wensu County, Aksu Prefecture",
      th: "อำเภอเวิ่นซู่, เขตปกครองอักซู (ตีนเทือกเขาเทียนซาน)",
      zh: "阿克苏地区温宿县"
    },
    coordinates: "41.2280° N, 80.2560° E",
    openHours: {
      en: "10:00 AM - 07:00 PM",
      th: "10:00 น. - 19:00 น.",
      zh: "10:00 - 19:00"
    },
    ticketPrice: {
      en: "40 RMB (Shuttle bus: 60 RMB. Self-drive SUV permit: 100 RMB/vehicle)",
      th: "40 หยวน (ค่ารถนำทัวร์ขาลุย 60 หยวน. ค่าใบอนุญาตนำรถขับเคลื่อน 4 ล้อส่วนตัวขับเข้าแคนยอน 100 หยวน/คัน)",
      zh: "门票40元 (区间大巴车票60元；自驾SUV进谷费100元/车)"
    },
    bestTime: {
      en: "June to October, early afternoon when sun hits the canyon floor",
      th: "มิถุนายน ถึง ตุลาคม ช่วงบ่ายตรง แสงแดดจะสาดทำมุมพอดี ส่องผนังแคนยอนหินทรายสีแดงสดส่องประกายสว่างไสวเหมือนเมืองโบราณ",
      zh: "6月至10月，午后阳光直射谷底，红色砂岩岩壁色泽最为饱满红艳"
    },
    description: {
      en: "Known as the 'King of Canyons', Tomur is a geological park carved out of the Tianshan mountain range by flood waters over millions of years. Its towering red rock formations look like giant castles, monuments, and palaces.",
      th: "ได้รับขนานนามว่าเป็น 'ราชาแห่งแกรนด์แคนยอน' ผนังหินผาสีแดงเพลิงแกะสลักลวดลายสวยงามด้วยฝีมือกัดเซาะของน้ำป่าและลมนับล้านปีใต้ตีนเขาหิมะเทียนซาน หินรูปทรงเสาสูงดูคล้ายกับพระราชวังโบราณ หุบเขาเขาวงกตธรรมชาติขนาดยักษ์ที่เผยความอัศจรรย์ทางธรณีวิทยาที่ยิ่งใหญ่และน่าทึ่งที่สุดของจีนตะวันตก",
      zh: "被誉为新疆“峡谷之王”。这片大自然鬼斧神工雕琢出来的红褐色巨型峡谷，曾是通往天山南北的驿路通道。岩壁呈现出红、黄、灰等多色条带，造型如城堡、巨兽和林立古塔，是天山世界自然遗产核心区。"
    },
    highlights: {
      en: [
        "Valley No. 1: The most dramatic section with vertical walls rising 200m.",
        "Self-Drive Safari: Driving a 4WD SUV directly on the gravel riverbed between narrow canyons.",
        "Wind-Eroded Pillars: Spectacular natural soil towers shaped like temple spires."
      ],
      th: [
        "หุบเขาที่ 1 (Valley No.1): จุดไฮไลต์สุดตระการตาที่ผนังหินทรายสีแดงชันดิ่งชี้ฟ้าสูงกว่า 200 เมตรบีบแคบเข้าหากัน",
        "ซาฟารีออฟโรด: การนั่งรถจี๊ปลุยไปตามก้นแม่น้ำกรวดทรายแห้งขรุขระฝ่าหุบเขาแคบ",
        "เสาดินสัญลักษณ์: กลุ่มเสาดินตะกอนที่ถูกลมพัดเป็นรูปเกลียวแปลกตาคล้ายพระปรางค์โบราณ"
      ],
      zh: [
        "一号谷深度游：最壮观的主大峡谷路段，双侧红褐色绝壁直插云霄。",
        "自驾河谷穿越：开越野车行驶在天然的乱石河床上，激荡飞沙，狂野感十足。",
        "万山朝王观景台：俯瞰千座红色山峦如同朝拜王者般环抱起伏的震撼全景。"
      ]
    },
    localTips: {
      en: "Wear comfortable hiking boots as the floor is covered in loose pebbles. Bring protective headwear or sunglasses to shield from dust.",
      th: "ควรสวมรองเท้าเดินป่าหรือรองเท้าผ้าใบหุ้มส้นที่พื้นยึดเกาะดีเนื่องจากทางเดินส่วนใหญ่เป็นกรวดทรายละเอียดและเศษหินก้นแม่น้ำแห้ง และควรพกผ้าบัฟหรือแว่นกันลมเพื่อป้องกันฝุ่นทรายละเอียดปลิวเข้าตา",
      zh: "谷底全为细沙砾石河滩，务必穿着防沙鞋。山谷内紫外线强且偶有沙尘，建议戴好墨镜与遮阳帽。"
    }
  },
  // ===== MINOR WAYPOINT STOPS (along the route, shown subtly) =====
  {
    id: "wp_id_kah_mosque",
    wikiTitle: "Id Kah Mosque",
    isWaypoint: true,
    name: {
      en: "Id Kah Mosque",
      th: "มัสยิดอิดคา",
      zh: "艾提尕尔清真寺"
    },
    location: {
      en: "Kashgar City Center",
      th: "ใจกลางเมืองคัชการ์",
      zh: "喀什市中心"
    },
    coordinates: "",
    openHours: {
      en: "09:00 - 20:00 (Non-Muslims limited to courtyard)",
      th: "09:00 - 20:00 น. (ผู้ไม่ใช่มุสลิมเข้าชมได้เฉพาะลานกว้าง)",
      zh: "09:00 - 20:00 (非穆斯林仅限庭院参观)"
    },
    ticketPrice: {
      en: "45 RMB (courtyard access)",
      th: "45 หยวน (เข้าชมลานกว้าง)",
      zh: "门票45元（庭院参观）"
    },
    bestTime: {
      en: "Morning for peaceful courtyard views",
      th: "ช่วงเช้าเพื่อชมบรรยากาศสงบของลานกว้าง",
      zh: "上午庭院清静，光线柔和"
    },
    description: {
      en: "China's largest mosque (1442). Yellow-tiled facade and peaceful courtyard — a quick stop next to the Old Town.",
      th: "มัสยิดที่ใหญ่ที่สุดในจีน (สร้าง 1442) สถาปัตยกรรมกระเบื้องสีเหลืองและลานกว้างสงบ — แวะง่ายใกล้เมืองเก่า",
      zh: "中国最大的清真寺（始建于1442年）。黄色瓷砖外墙与宁静庭院，紧邻古城。"
    },
    highlights: {
      en: ["Largest mosque in China", "Classic Islamic-Chinese architecture"],
      th: ["มัสยิดที่ใหญ่ที่สุดในจีน", "สถาปัตยกรรมอิสลาม-จีนคลาสสิก"],
      zh: ["中国最大清真寺", "伊斯兰与中国建筑融合"]
    },
    localTips: {
      en: "Dress modestly (cover shoulders/knees). Avoid prayer times.",
      th: "แต่งตัวสุภาพ (คลุมไหล่/เข่า) หลีกเลี่ยงช่วงเวลาละหมาด",
      zh: "着装端庄，避开礼拜时间。"
    }
  },
  {
    id: "wp_stone_fortress",
    wikiTitle: "Stone City (Tashkurgan)",
    isWaypoint: true,
    name: {
      en: "Tashkurgan Stone Fortress Ruins",
      th: "ซากปราสาทหินทาชคูร์กัน",
      zh: "塔什库尔干石头城遗址"
    },
    location: {
      en: "Tashkurgan Town",
      th: "ตัวเมืองทาชคูร์กัน",
      zh: "塔什库尔干县城"
    },
    coordinates: "37.7828° N, 75.2338° E",
    openHours: {
      en: "08:30 - 20:00",
      th: "08:30 - 20:00 น.",
      zh: "08:30 - 20:00"
    },
    ticketPrice: {
      en: "40 RMB",
      th: "40 หยวน",
      zh: "门票40元"
    },
    bestTime: {
      en: "Sunset — golden light on ruins & grassland",
      th: "พระอาทิตย์ตก — แสงทองตกกระทบซากปราสาทและทุ่งหญ้า",
      zh: "日落时分，金光洒落遗址与草场"
    },
    description: {
      en: "1,400-year-old stone citadel overlooking the golden Taxkorgan grassland. The best sunset panorama in town.",
      th: "ปราสาทหินอายุ 1,400 ปี ที่มองลงสู่ทุ่งหญ้าทองทัชคูร์กัน วิวพระอาทิตย์ตกที่สวยที่สุดในเมือง",
      zh: "拥有1400年历史的石头城堡，俯瞰金色塔县草场，镇上最佳日落观景地。"
    },
    highlights: {
      en: ["Ancient Silk Road citadel", "360° grassland sunset view"],
      th: ["ปราสาทโบราณเส้นทางสายไหม", "วิวพระอาทิตย์ตกทุ่งหญ้า 360°"],
      zh: ["丝绸之路古城堡", "360°草场日落全景"]
    },
    localTips: {
      en: "Walk the wooden boardwalk around the ruins — it's the classic postcard shot of Tashkurgan.",
      th: "เดินบนทางเดินไม้รอบซากปราสาท — เป็นมุมโปสการ์ดคลาสสิกของทาชคูร์กัน",
      zh: "沿木栈道环绕遗址，是塔县经典明信片角度。"
    }
  },
  {
    id: "wp_pamir_eye",
    wikiTitle: "Pamir Mountains",
    isWaypoint: true,
    name: {
      en: "Pamir Eye (Geological Landmark)",
      th: "ดวงตาปามีร์ (สถานที่ทางธรณีวิทยา)",
      zh: "帕米尔之眼"
    },
    location: {
      en: "Muji Township, Akto County, Kizilsu",
      th: "อำเภอมูจิ อำเภออาเค่อเถา คีซิลซู",
      zh: "克孜勒苏柯尔克孜自治州阿克陶县木吉乡"
    },
    coordinates: "38.9970° N, 74.5100° E",
    openHours: {
      en: "24 hours (weather permitting)",
      th: "24 ชั่วโมง (ขึ้นกับสภาพอากาศ)",
      zh: "全天（视天气而定）"
    },
    ticketPrice: {
      en: "Free",
      th: "ฟรี",
      zh: "免费"
    },
    bestTime: {
      en: "Midday, overhead light reveals the 'eye'",
      th: "เที่ยงวัน แสงตกกระทบด้านบนเผย 'ดวงตา'",
      zh: "正午顶光最显'眼睛'轮廓"
    },
    description: {
      en: "A natural concentric mineral ring in the rock that looks like a giant eye staring from the cliff — a quirky photo stop on the Panlong loop.",
      th: "วงแหวนแร่ธรรมชาติบนหน้าผาที่ดูเหมือนดวงตายักษ์จ้องมอง — จุดถ่ายภาพแปลกตาบนเส้นทางพานหลง",
      zh: "崖壁上天然同心矿物环，形似巨眼凝视，盘龙环线上的趣味打卡点。"
    },
    highlights: {
      en: ["Rare geological oddity", "Unique social-media photo"],
      th: ["ปรากฏการณ์ทางธรณีวิทยาหายาก", "มุมถ่ายภาพโซเชียลไม่ซ้ำใคร"],
      zh: ["罕见地质奇观", "独特网红打卡照"]
    },
    localTips: {
      en: "Easily missed — ask your driver to point it out on the Panlong loop.",
      th: "ดูง่ายตกหล่น — ขอให้คนขับชี้ให้ดูบนเส้นทางพานหลง",
      zh: "容易错过，请司机在盘龙环线上指认。"
    }
  },
  {
    id: "wp_yarkant_khan",
    wikiTitle: "Yarkant Khanate",
    isWaypoint: true,
    name: {
      en: "Yarkant Khan Mausoleum",
      th: "สุสานข่านยาร์คานด์",
      zh: "莎车叶尔羌汗国王陵"
    },
    location: {
      en: "Yarkant (Shache) County",
      th: "อำเภอยาร์คานด์ (ซาเช๋อ)",
      zh: "莎车县"
    },
    coordinates: "38.4020° N, 77.2400° E",
    openHours: {
      en: "09:30 - 19:00",
      th: "09:30 - 19:00 น.",
      zh: "09:30 - 19:00"
    },
    ticketPrice: {
      en: "30 RMB",
      th: "30 หยวน",
      zh: "门票30元"
    },
    bestTime: {
      en: "Morning, fewer crowds",
      th: "ช่วงเช้า คนน้อยกว่า",
      zh: "上午人少"
    },
    description: {
      en: "Mausoleum of the Yarkent Khanate kings (1514-1705). Stunning blue-and-green tile domes — a worthwhile detour between Kashgar and Yecheng.",
      th: "สุสานของกษัตริย์ราชวงศ์ยาร์คานด์ (1514-1705) โดมกระเบื้องสีฟ้า-เขียวงดงาม — คุ้มแวะระหว่างคัชการ์และเย่เฉิง",
      zh: "叶尔羌汗国王陵（1514-1705）。蓝绿瓷砖穹顶精美，喀什至叶城途中值得顺访。"
    },
    highlights: {
      en: ["Royal Islamic mausoleum", "Vivid blue-tile domes"],
      th: ["สุสานหลวงอิสลาม", "โดมกระเบื้องสีฟ้าสดใส"],
      zh: ["伊斯兰王陵", "鲜艳蓝瓷穹顶"]
    },
    localTips: {
      en: "Pair with a Yarkant old-town walk and local kebab lunch.",
      th: "จับคู่กับการเดินชมย่านเก่ายาร์คานด์และมื้อเที่ยงเคบับ",
      zh: "可搭配莎车老城漫步与烤肉午餐。"
    }
  },
  {
    id: "wp_xitiya",
    wikiTitle: "Yarkant County",
    imageUrl: "/images/Xitiya Lost City.avif",
    isWaypoint: true,
    name: {
      en: "Xitiya Lost City (Ancient Ruins)",
      th: "เมืองสาบสูญสีทิยา (ซากโบราณ)",
      zh: "锡提亚迷城遗址"
    },
    location: {
      en: "Yecheng County, en route to Hotan",
      th: "อำเภอเย่เฉิง ระหว่างทางไปโฮตัน",
      zh: "叶城县（赴和田途中）"
    },
    coordinates: "37.8712° N, 77.3720° E",
    openHours: {
      en: "10:00 - 19:00",
      th: "10:00 - 19:00 น.",
      zh: "10:00 - 19:00"
    },
    ticketPrice: {
      en: "30 RMB",
      th: "30 หยวน",
      zh: "门票30元"
    },
    bestTime: {
      en: "Late afternoon, soft desert light",
      th: "บ่ายแก่ๆ แสงทะเลทรายนุ่มนวล",
      zh: "傍晚沙漠柔光最佳"
    },
    description: {
      en: "Atmospheric mud-brick ruins of a vanished Silk Road city. Earth-toned walls against the desert — evocative and uncrowded.",
      th: "ซากอิฐดินของเมืองสาบสูญบนเส้นทางสายไหม กำแพงสีดินตัดกับทะเลทราย — ดึงดูดและไม่แออัด",
      zh: "消失的丝路古城泥土遗址，土色城墙映衬大漠，沧桑感强且游客稀少。"
    },
    highlights: {
      en: ["Intact mud-brick city walls", "Silk Road mystery vibe"],
      th: ["กำแพงเมืองอิฐดินที่สมบูรณ์", "บรรยากาศลึกลับเส้นทางสายไหม"],
      zh: ["完整土城墙", "丝路神秘氛围"]
    },
    localTips: {
      en: "Bring water — minimal shade. Great for atmospheric photography.",
      th: "พกน้ำ — ร่มเงาน้อย เหมาะกับการถ่ายภาพบรรยากาศ",
      zh: "带水，遮荫少，适合氛围摄影。"
    }
  },
  {
    id: "wp_desert_poplar_belt",
    wikiTitle: "Tarim Basin",
    imageUrl: "/images/desert_poplars.jpg",
    isWaypoint: true,
    name: {
      en: "Tarim Desert Poplar Shelterbelt",
      th: "แนวป้องกันปอปลาร์ทะเลทรายทาริม",
      zh: "塔里木沙漠胡杨防护林"
    },
    location: {
      en: "Taklamakan Desert Highway, mid-route",
      th: "ทางหลวงทะเลทรายทากลามากาน กลางทาง",
      zh: "塔克拉玛干沙漠公路中段"
    },
    coordinates: "40.9170° N, 84.2500° E",
    openHours: {
      en: "Roadside, 24h",
      th: "ริมถนน เปิด 24 ชม.",
      zh: "路旁，全天"
    },
    ticketPrice: {
      en: "Free (rest stop)",
      th: "ฟรี (จุดพัก)",
      zh: "免费（休息点）"
    },
    bestTime: {
      en: "October — poplars turn gold",
      th: "ตุลาคม — ปอปลาร์เปลี่ยนเป็นสีทอง",
      zh: "10月胡杨金黄"
    },
    description: {
      en: "The green lifeline holding back the dunes — drip-irrigated poplars stretching hundreds of km. A essential rest/photo stop mid-desert.",
      th: "แนวสีเขียวที่คุ้มครองกันเนินทราย — ปอปลาร์รดน้ำหยดยาวหลายร้อยกม. จุดพัก/ถ่ายภาพกลางทะเลทรายที่ขาดไม่ได้",
      zh: "阻挡沙丘的绿色生命线——滴灌胡杨绵延数百公里，沙漠中段必停休息与拍照点。"
    },
    highlights: {
      en: ["Engineering marvel shelterbelt", "Rest stop with facilities"],
      th: ["แนวป้องกันมหัศจรรย์ทางวิศวกรรม", "จุดพักพร้อมสิ่งอำนวยความสะดวก"],
      zh: ["工程奇迹防护林", "有设施的休息点"]
    },
    localTips: {
      en: "One of the few toilet/fuel stops on the 560 km crossing — don't skip it.",
      th: "หนึ่งในจุดห้องน้ำ/น้ำมันไม่กี่จุดบนเส้นทาง 560 กม. — ห้ามพลาด",
      zh: "560公里穿越段少有的厕所/加油点，不可错过。"
    }
  },
  {
    id: "wp_wensu_apple_valley",
    wikiTitle: "Aksu Prefecture",
    isWaypoint: true,
    name: {
      en: "Wensu Apple Valley (Shenmu Park)",
      th: "หุบเขาแอปเปิ้ลเวิ่นซู่ (สวนเสินหมู่)",
      zh: "温宿神木园苹果谷"
    },
    location: {
      en: "Wensu County, near Tomur Canyon",
      th: "อำเภอเวิ่นซู่ ใกล้แคนยอนทอมูร์",
      zh: "温宿县，托木尔峡谷附近"
    },
    coordinates: "41.2211° N, 80.1870° E",
    openHours: {
      en: "09:00 - 19:00",
      th: "09:00 - 19:00 น.",
      zh: "09:00 - 19:00"
    },
    ticketPrice: {
      en: "30 RMB",
      th: "30 หยวน",
      zh: "门票30元"
    },
    bestTime: {
      en: "October — apple harvest season",
      th: "ตุลาคม — ฤดูเก็บเกี่ยวแอปเปิ้ล",
      zh: "10月苹果丰收季"
    },
    description: {
      en: "Ancient gnarled trees (some 1,000+ years) and a working apple orchard. A peaceful contrast before/after the dramatic Tomur Canyon.",
      th: "ต้นไม้โบราณบิดเบี้ยว (บางต้นอายุ 1,000+ ปี) และสวนแอปเปิ้ลที่ยังดำเนินอยู่ ความสงบที่ตัดกับแกรนด์แคนยอนทอมูร์",
      zh: "千年古树群与苹果果园，与壮美的托木尔峡谷形成宁静对比。"
    },
    highlights: {
      en: ["1,000-year-old sacred trees", "Fresh Aksu apples in autumn"],
      th: ["ต้นไม้ศักดิ์สิทธิ์อายุ 1,000 ปี", "แอปเปิ้ลอักซูสดในฤดูใบไม้ร่วง"],
      zh: ["千年神木", "秋季新鲜阿克苏苹果"]
    },
    localTips: {
      en: "Buy fresh-picked apples from the orchard stalls — cheapest in all of Xinjiang.",
      th: "ซื้อแอปเปิ้ลสดที่เก็บใหม่จากร้านในสวน — ถูกที่สุดในซินเจียง",
      zh: "果园摊位买现摘苹果，全疆最便宜。"
    }
  }
];
