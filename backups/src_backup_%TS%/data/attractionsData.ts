export interface Attraction {
  id: string;
  name: {
    en: string;
    th: string;
    zh: string;
  };
  isWaypoint?: boolean;
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
    coordinates: "39.4720° N, 75.9890° E",
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
    coordinates: "38.7410° N, 75.0560° E",
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
    coordinates: "38.4350° N, 75.0510° E",
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
    coordinates: "37.7810° N, 75.3850° E",
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
    id: "zepu_poplar",
    name: {
      en: "Zepu Golden Poplar Forest",
      th: "ป่าต้นปอปลาร์ทองเจ๋อผู่",
      zh: "泽普金胡杨景区"
    },
    location: {
      en: "Zepu County, Hotan Border",
      th: "อำเภอเจ๋อผู่, รอยต่อเมืองโฮตันและคาชการ์",
      zh: "泽普县亚斯墩林场 (叶尔羌河畔)"
    },
    coordinates: "38.1920° N, 77.2610° E",
    openHours: {
      en: "09:30 AM - 07:30 PM (Varies in autumn peak season)",
      th: "09:30 น. - 19:30 น. (ขยายเวลาเพิ่มขึ้นในช่วงฤดูใบไม้เปลี่ยนสี)",
      zh: "09:30 - 19:30 (秋季旺季根据客流延长)"
    },
    ticketPrice: {
      en: "40 RMB (Shuttle cart: 20 RMB)",
      th: "40 หยวน (ค่ารถรางนำชมภายในสวน 20 หยวน)",
      zh: "门票40元 (电瓶观光车票20元)"
    },
    bestTime: {
      en: "Late October to mid-November for golden autumn canopy",
      th: "ปลายเดือนตุลาคม ถึง กลางเดือนพฤศจิกายน ทั่วทั้งป่าจะกลายเป็นสีทองเหลืองอร่ามท้อนแสงแดดอบอุ่น",
      zh: "10月下旬至11月中旬，此时胡杨林漫山遍野金黄灿烂"
    },
    description: {
      en: "Located on the edge of the Yarkand River, this national forest park showcases ancient Euphrates Poplar trees. These hardy trees are legendary in China: 'Living for a thousand years without dying; standing for a thousand years after death without falling; remaining for a thousand years after falling without decaying.' The contrast of golden leaves against dry sands and cold river water is breathtaking.",
      th: "อุทยานป่าปอปลาร์โบราณเลียบชายฝั่งแม่น้ำเยาร์แคนด์ ต้นหูหยาง (Euphrates Poplar) ได้รับการขนานนามว่าเป็นอัศวินนักสู้ผู้หยิ่งผยองแห่งทะเลทรายด้วยปาฏิหาริย์ 3 ข้อ: 'มีชีวิตอยู่พันปีไม่มีตาย, ตายแล้วยืนต้นนิ่งไปอีกพันปีไม่ล้ม, ล้มลงนอนดินราบไปอีกพันปีไม่ผุพัง!' ในช่วงฤดูใบไม้ร่วง ใบของพวกมันจะพร้อมใจกันเปลี่ยนเป็นสีเหลืองทองระยิบระยับสะท้อนเงาผืนน้ำแม่น้ำเย็นเฉียบกลางทรายแล้ง",
      zh: "坐落在叶尔羌河冲积扇上的国家5A级森林公园。此地的胡杨林“生而一千年不死，死而一千年不倒，倒而一千年不朽”。金黄色的胡杨森林、奔流的河水与远处的荒漠天然融合，构成一幅极具冲击力的生命画卷。"
    },
    highlights: {
      en: [
        "Water Poplars: Rare sight of golden trees standing directly in river wetlands.",
        "The Longevity Tree: A massive 1,500-year-old Poplar king tree.",
        "Forest Railway: Romantic narrow-gauge scenic train running through the yellow leaves."
      ],
      th: [
        "ป่าหูหยางริมน้ำ: ภาพสะท้อนน้ำสีทองของป่าต้นหูหยางที่หายากยิ่งเนื่องจากตั้งอยู่ติดกับแม่น้ำชุ่มชื้น",
        "ราชาหูหยางพันปี: ต้นหูหยางยักษ์อายุขัยกว่า 1,500 ปีที่แผ่กิ่งก้านสาขาใหญ่โตบารมีสูง",
        "สะพานแขวนข้ามน้ำ: มุมเดินเท้ามุมสูงถ่ายภาพใบไม้เปลี่ยนสีคู่กับสายน้ำไหลเอื่อย"
      ],
      zh: [
        "水上胡杨：极具江南水乡神韵的金黄色森林与叶尔羌河交融的独特高原湿地景观。",
        "胡杨王大树：景区内树龄达一千五百多年的神树胡杨王，需数人合抱。",
        "落叶铁轨慢行：踏足铺满金色落叶的铁道，坐上森林小火车，体验欧式油画意境。"
      ]
    },
    localTips: {
      en: "Bring insect repellent. The water-adjacent forest has midges and mosquitoes even in late autumn afternoon sunlight.",
      th: "เนื่องจากป่าอยู่ใกล้แหล่งน้ำธรรมชาติ ในช่วงบ่ายแก่ๆ อาจมีแมลงหรือยุงป่าค่อนข้างเยอะ แนะนำให้ทายากันยุงติดตัวไปด้วยก่อนเดินลึกเข้าป่าโซนริเวอร์วอล์ค",
      zh: "因河畔水源充足，秋季午后部分林区可能有飞虫或林区蚊子，建议携带防蚊虫叮咬喷雾。"
    }
  },
  {
    id: "yotkan_ancient_city",
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
    coordinates: "37.1120° N, 79.8210° E",
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
    id: "taklamakan_highway",
    name: {
      en: "Taklamakan Desert Highway (G315 Route)",
      th: "ทางหลวงทะเลทรายทากลามากาน (เส้นทาง G315)",
      zh: "塔克拉玛干沙漠公路 (G315线)"
    },
    location: {
      en: "South Margin of Tarim Basin",
      th: "ขอบทางใต้ของแอ่งทาริม (เชื่อมโฮตันสู่อักซู)",
      zh: "塔里木盆地南缘 (和田至阿拉尔段)"
    },
    coordinates: "38.8500° N, 80.2500° E",
    openHours: {
      en: "Open 24 hours",
      th: "เปิด 24 ชั่วโมง",
      zh: "全天开放"
    },
    ticketPrice: {
      en: "Free (Highway toll charges apply dynamically)",
      th: "ฟรี (มีด่านเก็บค่าผ่านทางตามมาตรฐานทางหลวงจีน)",
      zh: "免费 (根据收费公路路段收取路费)"
    },
    bestTime: {
      en: "October to November, cool desert temperatures",
      th: "ตุลาคม ถึง พฤศจิกายน ทะเลทรายจะมีอากาศอุ่นกำลังดีและไม่ร้อนดั่งนรกในฤดูร้อน ทรายสีเหลืองสว่างตัดกับขอบฟ้าสีครามงดงามสะกดตา",
      zh: "10月至11月，沙漠气温舒适，公路沿线芦苇与红柳泛黄，景色辽阔"
    },
    description: {
      en: "Taklamakan, known as the 'Sea of Death', is the second largest shifting sand desert in the world. This highway is an engineering miracle cutting right through the dunes, guarded by shelterbelt forests fed by deep water pipes.",
      th: "ทากลามากาน ได้รับฉายาว่า 'ทะเลแห่งความตาย' เป็นทะเลทรายเนินทรายเคลื่อนที่ได้ที่ใหญ่ที่สุดเป็นอันดับสองของโลก คำแปลความหมายท้องถิ่นกล่าวไว้ว่า: 'เข้าไปแล้วจะไม่ได้ออกมาอีก!' ทางหลวง G315 คือปาฏิหาริย์แห่งวิศวกรรมฝ่าผืนทรายขนาดยักษ์ มีแนวเข็มขัดป่าสนและไม้พุ่มเตี้ยที่หยดน้ำด้วยท่อใต้ดินคอยกันกระแสเนินทรายทับถมถนนทางยาว",
      zh: "被称为“死亡之海”的塔克拉玛干沙漠，是世界第二大流动性沙漠。这条穿沙公路是人类征服自然的重大奇迹。道路两旁依靠水泵抽取地下咸水进行灌溉的绿色防护带，成功阻挡了流动沙丘。"
    },
    highlights: {
      en: [
        "Endless Sand Ocean: Driving through rolling sand hills stretching to the horizon.",
        "Green Protection Belt: Smart drip irrigation system stretching hundreds of kilometers.",
        "Desert Sunset: Sunset below the waves of pristine wind-swept sand."
      ],
      th: [
        "ทะเลทรายสุดสายตา: วิวภูเขาทรายลาดเอียงพับไปมารูปเกลียวคลื่นยาวเหยียดไร้จุดจบ",
        "เข็มขัดแนวป้องกันทรายสีเขียว: ระบบท่อน้ำหยดและการปลูกพืชทะเลทรายอัจฉริยะริมทางยาวหลายร้อยกิโลเมตร",
        "พระอาทิตย์ตกดินขอบฟ้าทะเลทราย: ดวงไฟสีส้มแดงกลมโตสาดแสงสะท้อนเกล็ดทรายสีทองเหลืองระยิบระยับ"
      ],
      zh: [
        "无垠沙海公路：体验驾车穿越在波澜壮阔、延绵到天边金色沙丘之中的震撼孤独感。",
        "防沙滴灌生态带：纵览延绵数百公里、依靠地下水滴灌支撑的公路沙漠绿墙。",
        "大漠落日圆：欣赏红日缓缓坠入起伏金沙曲线尽头的苍凉与壮美。"
      ]
    },
    localTips: {
      en: "Gas stations are far apart. Ensure your vehicle has a full tank before entering. Keep a stock of bottled water.",
      th: "ระยะทางระหว่างปั๊มน้ำมันห่างกันมาก ควรเช็คน้ำมันรถให้เต็มถังก่อนเดินทางข้ามช่วงทะเลทราย เตรียมน้ำดื่มขวดและขนมรองท้องไว้ให้พอ และห้ามเดินเท้าออกห่างจากขอบถนนทะเลทรายลึกเกินไปเพราะพายุลมอาจพัดกลบรอยเท้าทำให้หลงทางได้ง่าย",
      zh: "沙漠公路沿途加油站间隔较长，出发前请确保加满油箱。车上备足饮用水和零食，下车拍照请勿远离公路。"
    }
  },
  {
    id: "tomur_canyon",
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
    coordinates: "41.4580° N, 80.3210° E",
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
  }
];
