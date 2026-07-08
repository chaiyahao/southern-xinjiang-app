export interface Phrase {
  id: string;
  th: string;  // Thai translation
  en: string;  // English translation
  zh: string;  // Chinese (Simplified + Pinyin)
  uy: string;  // Uyghur (Arabic script + Latin + Thai phonetic)
  tg: string;  // Tajik/Sarikoli (Latin/Cyrillic + Thai phonetic)
}

export interface PhraseCategory {
  id: string;
  nameTh: string;
  nameEn: string;
  nameZh: string;
  iconName: string; // Lucide icon mapping
  phrases: Phrase[];
}

export const PHRASEBOOK_DATA: PhraseCategory[] = [
  {
    id: "survival",
    nameTh: "คำศัพท์เอาตัวรอดทั่วไป",
    nameEn: "General Survival",
    nameZh: "日常生存",
    iconName: "ShieldCheck",
    phrases: [
      {
        id: "s1",
        th: "สวัสดี (ทั่วไป)",
        en: "Hello (General)",
        zh: "你好 (Nǐ hǎo)",
        uy: "ياخشىمۇسىز (Yaxshimusiz) [ยัค-ชิ-มุ-สิซ]",
        tg: "Салом (Salom) [ซา-ลอม] / Аржанд (Arzhand) [อาร์-จันด์]"
      },
      {
        id: "s2",
        th: "สวัสดี (สุภาพ/ทางการ)",
        en: "Hello (Formal / Peace be upon you)",
        zh: "您好 (Nín hǎo)",
        uy: "ئەسسالامۇ ئەلەيكۇม (Essalamu eleykum) [เอส-ซา-ลา-มุ อะ-เล-คุม]",
        tg: "Ассалому алейкуม (Assalomu aleykum) [อัส-สะ-โล-มุ อะ-เล-คุม]"
      },
      {
        id: "s3",
        th: "ขอบคุณ",
        en: "Thank you",
        zh: "谢谢 (Xièxiè)",
        uy: "رەھمەت (Rahmat) [ระห์-มัต]",
        tg: "Ташаккур (Tashakkur) [ทา-ชัก-กูร์] / Раҳмат (Rahmat) [ระห์-มัต]"
      },
      {
        id: "s4",
        th: "ขอโทษ / เสียใจ",
        en: "Sorry / Excuse me",
        zh: "对不起 (Duìbuqǐ)",
        uy: "كەچۈرۈڭ (Kechürüng) [เคอ-ชู-รุง]",
        tg: "Бубахшед (Bubakhshed) [บุ-บัค-เชด]"
      },
      {
        id: "s5",
        th: "ยินดีที่ได้รู้จัก",
        en: "Nice to meet you",
        zh: "很高兴认识你 (Hěn gāoxìng rènshi nǐ)",
        uy: "تونۇشقانلىقىمىزدىن خۇشالمەن (Tonushqanliqimizdin khushalmen) [โท-นุช-คาน-ลิ-คิ-มิซ-ดิน คู-ชัล-เมน]",
        tg: "Аз вохӯриамон шодам (Az vokhuriamon shodam) [อัซ โว-คู-ริ-อา-มอน โช-ดัม]"
      },
      {
        id: "s6",
        th: "ใช่ / ตกลง",
        en: "Yes / OK",
        zh: "是的 / 好的 (Shì de / Hǎo de)",
        uy: "ھەئە (He'e) [แฮ-แฮ]",
        tg: "Бале / Майлаш (Bale / Maylash) [บา-เล / ไม-ลัช]"
      },
      {
        id: "s7",
        th: "ไม่ใช่ / ไม่ตกลง",
        en: "No",
        zh: "不是 / 不行 (Bú shì / Bù xíng)",
        uy: "ياق (Yaq) [ยัก]",
        tg: "Не (Ne) [เน]"
      },
      {
        id: "s8",
        th: "ฉันไม่เข้าใจ",
        en: "I don't understand",
        zh: "我听不懂 (Wǒ tīng bù dǒng)",
        uy: "چۈشەنمىدەم (Chüshenmidim) [ชู-เชิน-มิ-ดิม]",
        tg: "Ман нафаҳмидам (Man nafahmidam) [มัน นา-ฟะห์-มิ-ดัม]"
      },
      {
        id: "s9",
        th: "พูดภาษาอังกฤษได้ไหม?",
        en: "Do you speak English?",
        zh: "你会说英语吗? (Nǐ huì shuō Yīngyǔ ma?)",
        uy: "ئىنگلىزچە سۆزلىيەلەمسىز؟ (Inglizche sözliyelemsiz?) [อิง-กลิซ-เชอ เซิซ-ลิ-เย-เล็ม-สิซ]",
        tg: "Шумо англисӣ гап мезанед? (Shumo anglisi gap mezaned?) [ชู-โม อัง-กลิ-ซี กัป เม-ซา-เน็ด]"
      },
      {
        id: "s10",
        th: "ลาก่อน",
        en: "Goodbye",
        zh: "再见 (Zàijiàn)",
        uy: "خوش (Khosh) [คอช] / خوش چاغلار (Khosh chaghlar) [คอช ชัก-ลาร์]",
        tg: "Хайр (Khayr) [ไคร์] / Худо ҳофиз (Khudo hofiz) [คุ-โด โฮ-ฟิซ]"
      }
    ]
  },
  {
    id: "food",
    nameTh: "อาหารและการสั่งกิน",
    nameEn: "Food & Dining",
    nameZh: "餐馆饮食",
    iconName: "Utensils",
    phrases: [
      {
        id: "f1",
        th: "เก็บเงิน / เช็คบิลด้วย",
        en: "Bill, please",
        zh: "买单 (Mǎidān)",
        uy: "ھېساب (Hesab) [เฮ-ซับ]",
        tg: "Ҳисобро биёред (Hisobro biyored) [ฮิ-ซอบ-โร บิ-โย-เร็ด]"
      },
      {
        id: "f2",
        th: "น้ำเปล่า",
        en: "Water",
        zh: "水 (Shuǐ)",
        uy: "سۇ (Su) [ซู]",
        tg: "Об (Ob) [โอบ]"
      },
      {
        id: "f3",
        th: "ชาร้อน (ชาดำ/ชาเขียว)",
        en: "Hot tea (Black/Green)",
        zh: "热茶 (Rè chá)",
        uy: "قايناق چاي (Qaynaq chay) [ไค-นัก ชาย]",
        tg: "Чойи гарм (Choyi garm) [โช-ยิ การ์ม]"
      },
      {
        id: "f4",
        th: "ไม่ใส่ผักชี",
        en: "No cilantro / coriander",
        zh: "不要香菜 (Bú yào xiāngcài)",
        uy: "كاشنىچ سالماڭ (Kashnich salmang) [คัช-นิช ซัล-มัง]",
        tg: "Бе кашнич (Be kashnich) [เบ คัช-นิช]"
      },
      {
        id: "f5",
        th: "อร่อยมาก",
        en: "Very delicious",
        zh: "很好吃 (Hěn hǎo chī)",
        uy: "بەك تېتلىق (Bek tetliq) [เบก เทต-ลิก]",
        tg: "Хеле болаззат (Khele bolazzat) [เค-เล โบ-ลัซ-ซัต]"
      },
      {
        id: "f6",
        th: "เนื้อแกะเสียบไม้ย่าง (ชวน)",
        en: "Mutton Skewers (Chuan'r)",
        zh: "羊肉串 (Yángròuchuàn)",
        uy: "كۆۋاپ (Kewap) [เคอ-วาป]",
        tg: "Кабоби гӯшти гӯсфанд (Kabobi gusht) [คา-บอ-บิ กุช-ติ กุส-ฟันด์]"
      },
      {
        id: "f7",
        th: "ขนมปังนาน (อาหารหลักท้องถิ่น)",
        en: "Naan Bread",
        zh: "烤馕 (Kǎonáng)",
        uy: "نان (Nan) [นาน]",
        tg: "Нон (Non) [นอน]"
      },
      {
        id: "f8",
        th: "ไก่ผัดจานใหญ่ (ต้าพ่านจี)",
        en: "Big Plate Chicken (Dapanji)",
        zh: "大盘鸡 (Dàpánjī)",
        uy: "چوڭ تەخسە توخو قورۇمىسى (Chong tekhse tokho qorumisi) [ชอง เทค-เซ โท-โฮ โค-รู-มิ-ซิ]",
        tg: "Мурғи калон бо картошка (Murghi kalon) [มูร์-กิ คา-ลอน โบ คาร์-โตช-คา]"
      },
      {
        id: "f9",
        th: "ข้าวอบเนื้อแกะ (พลาฟ)",
        en: "Lamb Pilaf / Rice Polo",
        zh: "抓饭 (Zhuāfàn)",
        uy: "پولو (Polo) [โป-โล]",
        tg: "Палов (Palov) [ปา-ลอฟ] / Ош (Osh) [โอช]"
      },
      {
        id: "f10",
        th: "บะหมี่ดึงมือซินเจียง (ลากมัน)",
        en: "Lagman / Xinjiang Hand-pulled Noodles",
        zh: "拌面 (Bànmiàn)",
        uy: "لەڭمەن (Lengmen) [لەڭ-مەن] [เล็ง-เมน]",
        tg: "Лағмон (Laghmon) [ลัค-มอน]"
      }
    ]
  },
  {
    id: "directions",
    nameTh: "การถามทางและสถานที่",
    nameEn: "Directions & Places",
    nameZh: "询问方向",
    iconName: "Map",
    phrases: [
      {
        id: "d1",
        th: "ห้องน้ำอยู่ที่ไหน?",
        en: "Where is the toilet?",
        zh: "厕所在哪里? (Cèsuǒ zài nǎlǐ?)",
        uy: "ھاجەتخانا قەيەردە؟ (Hajetkhana qeyerde?) [ฮา-เจ็ต-คา-นา เคว-เยอร์-เด]",
        tg: "Ҳоҷатхона дар куҷост? (Hojatkhona dar kujost?) [โฮ-จัต-โค-นา ดาร์ คู-โจสต์]"
      },
      {
        id: "d2",
        th: "โรงแรมอยู่ที่ไหน?",
        en: "Where is the hotel?",
        zh: "酒店在哪里? (Jiǔdiàn zài nǎlǐ?)",
        uy: "مېھمانخانا قەيەردە؟ (Mehmankhana qeyerde?) [เมห์-มาน-คา-นา เคว-เยอร์-เด]",
        tg: "Меҳмонхона дар куҷост? (Mehmonkhona dar kujost?) [เมห์-มอน-โค-นา ดาร์ คู-โจสต์]"
      },
      {
        id: "d3",
        th: "สถานีรถไฟอยู่ที่ไหน?",
        en: "Where is the train station?",
        zh: "火车站在哪里? (Huǒchēzhàn zài nǎlǐ?)",
        uy: "پويىز ئىستانسىسى قەيەردە؟ (Poyiz istansisi qeyerde?) [โป-ยิซ อิส-ตัน-สิ-สิ เคว-เยอร์-เด]",
        tg: "Истгоҳи роҳи оҳан дар куҷост? (Istgohi rohi ohan) [อิสต์-โก-ฮิ โร-ฮิ โอ-ฮัน ดาร์ คู-โจสต์]"
      },
      {
        id: "d4",
        th: "สนามบินอยู่ที่ไหน?",
        en: "Where is the airport?",
        zh: "机场在哪里? (Jīchǎng zài nǎlǐ?)",
        uy: "ئايروپورت قەيەردە؟ (Ayroport qeyerde?) [ไอ-โร-ปอร์ต เคว-เยอร์-เด]",
        tg: "Фурудгоҳ дар куҷост? (Furudgoh dar kujost?) [ฟู-รุด-โกห์ ดาร์ คู-โจสต์]"
      },
      {
        id: "d5",
        th: "เลี้ยวซ้าย / เลี้ยวขวา",
        en: "Turn left / Turn right",
        zh: "左转 / 右转 (Zuǒ zhuǎn / Yòu zhuǎn)",
        uy: "سولغا بۇرۇلۇڭ / ئوڭغا بۇرۇلۇڭ (Solgha burulung / Onggha burulung) [โซล-กา บุ-รุ-ลุง / อง-กา บุ-รุ-ลุง]",
        tg: "Ба чап гардед / Ба рост гардед (Ba chap / Ba rost) [บา ชัป การ์-เด็ด / บา โรสต์ การ์-เด็ด]"
      },
      {
        id: "d6",
        th: "ตรงไป",
        en: "Go straight",
        zh: "直走 (Zhí zǒu)",
        uy: "تۈز مېڭىڭ (Tüz meñing) [ตุซ เมง-อิง]",
        tg: "Тӯғри равед (Tughri raved) [ตู-ริ รา-เว็ด]"
      },
      {
        id: "d7",
        th: "จอดตรงนี้",
        en: "Stop here",
        zh: "停在这里 (Tíng zài zhèlǐ)",
        uy: "شۇ يەردە توختاڭ (Shu yerde tokhtang) [ชู เยว์-เด โตะ-ตัง]",
        tg: "Дар ҳамин ҷо истед (Dar hamin jo isted) [ดาร์ ฮา-มิน โจ อิ-สเต็ด]"
      },
      {
        id: "d8",
        th: "ไกลไหม?",
        en: "Is it far?",
        zh: "远吗? (Yuǎn ma?)",
        uy: "يىراقمۇ؟ (Yiraqmu?) [ยิ-รัก-มุ]",
        tg: "Дур аст? (Dur ast?) [ดุร อัสต์]"
      },
      {
        id: "d9",
        th: "จุดตรวจความปลอดภัย / ด่านตรวจ",
        en: "Security Checkpoint",
        zh: "安检站 / 检查站 (Ānjiǎnzhàn / Jiǎncházhàn)",
        uy: "تەكشۈرۈش پونكىتى (Tekshürۈsh ponkiti) [เทค-ชู-รุช ปอน-กิ-ทิ]",
        tg: "Дидбонгоҳи амниятӣ (Didbongohi amniyati) [ดิด-บอน-โก-ฮิ อัม-นิ-ยา-ตี]"
      }
    ]
  },
  {
    id: "shopping",
    nameTh: "การซื้อของและการต่อราคา",
    nameEn: "Shopping & Money",
    nameZh: "购物买卖",
    iconName: "Coins",
    phrases: [
      {
        id: "p1",
        th: "ราคาเท่าไหร่?",
        en: "How much is this?",
        zh: "多少钱? (Duōshǎo qián?)",
        uy: "بۇ قانچە پۇل؟ (Bu qanche pul?) [บุ คัน-เชอ พูล]",
        tg: "Ин чанд пул аст? (In chand pul ast?) [อิน แชนด์ พูล อัสต์]"
      },
      {
        id: "p2",
        th: "แพงเกินไปแล้ว",
        en: "Too expensive",
        zh: "太贵了 (Tài guี่ le)",
        uy: "بەك قىممەت (Bek qimmet) [เบก คิม-เมต]",
        tg: "Хеле қиммат аст (Khele qimmat ast) [เค-เล คิม-มัต อัสต์]"
      },
      {
        id: "p3",
        th: "ลดราคาหน่อยได้ไหม?",
        en: "Can you make it cheaper?",
        zh: "便宜一点可以吗? (Piányi yīdiǎn kěyǐ ma?)",
        uy: "ئەرزانراق بېرىڭە؟ (Arzanraq beringe?) [อาร์-ซัน-รัก เบริง-เงอ]",
        tg: "Арзонтар намешавад? (Arzontar nameshavad?) [อาร์-ซอน-ตาร์ นา-เม-ชา-วัด]"
      },
      {
        id: "p4",
        th: "ต้องการซื้ออันนี้",
        en: "I want to buy this",
        zh: "我要买这个 (Wǒ yào mǎi zhè ge)",
        uy: "بۇنى ئالىمەن (Buni alimen) [บุ-หนิ อะ-ลิ-เมน]",
        tg: "Ман инро харидан мехоҳам (Man inro kharidan) [มัน อิน-โร คา-ริ-ดัน เม-โค-แฮม]"
      },
      {
        id: "p5",
        th: "สแกนจ่ายเงิน (วีแชท/อาลีเพย์)",
        en: "Scan to pay (WeChat/Alipay)",
        zh: "扫码支付 (Sǎomǎ zhīfù)",
        uy: "سكاننېرلاپ تۆلەش (Skanerlep tölesh) [สแกน-เนอร์-เล็ป โท-เลช]",
        tg: "Пардохт бо сканер (Pardokht bo skaner) [ปาร์-ดกต์ โบ สแกน-เนอร์]"
      },
      {
        id: "p6",
        th: "รับเงินสดไหม?",
        en: "Do you accept cash?",
        zh: "收现金吗? (Shōu xiànjīn ma?)",
        uy: "نەق پۇل قوبۇل قىلامسىز؟ (Neq pul qobul qilamsiz?) [เนค พูล โค-บุล คิ-ลัม-สิซ]",
        tg: "Пули нақд қабул мекунед? (Puli naqd qabul) [พู-ลิ นัคด์ คา-บูล เม-คุ-เน็ด]"
      },
      {
        id: "p7",
        th: "มีอันอื่นอีกไหม?",
        en: "Do you have another one?",
        zh: "有别的吗? (Yǒu bié de ma?)",
        uy: "باشقىسى بارمۇ؟ (Bashqisi barmu?) [บัช-คิ-สิ บาร์-มุ]",
        tg: "Дигараш ҳаст? (Digarash hast?) [ดิ-กา-รัช ฮัสต์]"
      },
      {
        id: "p8",
        th: "ขอใบเสร็จด้วย",
        en: "Receipt, please",
        zh: "发票 (Fāpiào)",
        uy: "تالون (Talon) [ทา-ลอน]",
        tg: "Квитанцияро биёред (Kvitansiyaro biyored) [กวิ-ตัน-ซิ-ยา-โร บิ-โย-เร็ด]"
      }
    ]
  },
  {
    id: "medical",
    nameTh: "การแพทย์และความปลอดภัย",
    nameEn: "Medical & Safety",
    nameZh: "医疗安全",
    iconName: "HeartPulse",
    phrases: [
      {
        id: "m1",
        th: "ช่วยด้วย! / ขอความช่วยเหลือ",
        en: "Help!",
        zh: "救命! / 帮帮我! (Jiùmìng! / Bāngbāng wǒ!)",
        uy: "ياردەم قىلىڭلار! (Yardem qilinglar!) [ยาร์-เด็ม คิ-ลิง-ลาร์]",
        tg: "Ёрдам диҳед! (Yordam dihed!) [ยอร์-ดัม ดิ-เฮ็ด]"
      },
      {
        id: "m2",
        th: "ฉันรู้สึกไม่สบาย / ป่วย",
        en: "I feel sick / unwell",
        zh: "我感觉不舒服 (Wǒ gǎnjué bù shūfu)",
        uy: "مەن بىئارام بولۇپ قالدىم (Men biaram bolup qaldim) [เมน บิ-อา-ราม โบ-ลุป คาล-ดิม]",
        tg: "Ман худро бад ҳис мекунам (Man khudro bad) [มัน คุด-โร บัด ฮิส เม-คุ-นาม]"
      },
      {
        id: "m3",
        th: "ปวดหัว / เวียนหัว",
        en: "Headache / Dizziness",
        zh: "头疼 / 头晕 (Tóuténg / Tóuyūn)",
        uy: "بېشىم ئاغرىۋاتىدۇ (Beshim aghriwatidu) [เบ-ชิม อัค-ริ-วา-ทิ-ดุ]",
        tg: "Сарам дард мекунад (Saram dard mekunad) [ซา-ราม ดาร์ด เม-คุ-เน็ด]"
      },
      {
        id: "m4",
        th: "ฉันหายใจไม่ออก / แน่นหน้าอก",
        en: "I cannot breathe / Chest tightness",
        zh: "我呼吸困难 (Wǒ hūxī kùnnán)",
        uy: "نەپەسلىنىشىم قىيىنلاشتى (Nepeslinishim qiyinlashti) [เน-เปส-ลิ-นิ-ชิม คิ-ยิน-ลัช-ทิ]",
        tg: "Нафасам танг шуд (Nafasam tang shud) [นา-ฟา-ซาม ทัง ชุด]"
      },
      {
        id: "m5",
        th: "ต้องการกระป๋องออกซิเจน",
        en: "Need an oxygen cylinder / bottle",
        zh: "我需要氧气罐 (Wǒ xūyào yǎngqìguàn)",
        uy: "ماڭا ئوكسىگېن بانكىسى كېرەك (Manga oksigen bankisi kerek) [มัง-อา อก-ซิ-เกน บัน-กิ-สิ เค-เรค]",
        tg: "Ба ман баллони кислород лозим аст (Ba man balloni) [บา มัน บัล-โล-นิ กิส-โล-รอด โล-ซิม อัสต์]"
      },
      {
        id: "m6",
        th: "โรงพยาบาลอยู่ที่ไหน?",
        en: "Where is the hospital?",
        zh: "医院在哪里? (Yīyuàn zài nǎlǐ?)",
        uy: "دوختۇرخانا قەيەردە؟ (Dokhturkhana qeyerde?) [ดก-ตูร์-คา-นา เคว-เยอร์-เด]",
        tg: "Беморхона дар куҷост? (Bemorkhona dar kujost?) [เบ-มอร์-โค-นา ดาร์ คู-โจสต์]"
      },
      {
        id: "m7",
        th: "ร้านขายยาอยู่ที่ไหน?",
        en: "Where is the pharmacy?",
        zh: "药店在哪里? (Yàodiàn zài nǎlǐ?)",
        uy: "دورىخانا قەيەردە؟ (Dorikhana qeyerde?) [โด-ริ-คา-นา เคว-เยอร์-เด]",
        tg: "Дорухона дар куҷост? (Dorukhona dar kujost?) [โด-รุ-โค-นา ดาร์ คู-โจสต์]"
      },
      {
        id: "m8",
        th: "ยาแก้แพ้ความสูง / ยาลดความดัน",
        en: "Altitude sickness medicine",
        zh: "红景天 / 高原安 (Hóngjǐngtiān / Gāoyuán'ān)",
        uy: "ئېگىزلىك كېسىلى دورىسى (Egizlik kesili dorisi) [เอ-กิซ-ลิค เค-สิ-ลิ โด-ริ-สิ]",
        tg: "Доруи бемории баландӣ (Dorui bemorii balandi) [โด-รุ-อิ เบ-โม-ริ-อิ บา-ลัน-ดี]"
      },
      {
        id: "m9",
        th: "โทรหาตำรวจ (110)",
        en: "Call the police (110)",
        zh: "报警 / 打电话给警察 (Bàojǐng / Dǎ diànhuà gěi jǐngchá)",
        uy: "ساقچىغا تېلېفون قىلىڭ (Saqchigha telefon qiling) [ซาค-ชิ-กา เท-เล-ฟอน คิ-ลิง]",
        tg: "Ба милитсия занг занед (Ba militsiya zang zaned) [บา มิ-ลิต-สิ-ยา แซง ซา-เน็ด]"
      }
    ]
  },
  {
    id: "tajik_special",
    nameTh: "ภาษาทาจิก (ซาริโกลี) พื้นบ้านปามีร์",
    nameEn: "Tajik & Pamir Local",
    nameZh: "塔吉克帕米尔常用语",
    iconName: "Compass",
    phrases: [
      {
        id: "t1",
        th: "ยินดีต้อนรับสู่ทัชกูรกัน (ปามีร์)",
        en: "Welcome to Tashkurgan / Pamir",
        zh: "欢迎来到塔什库尔干 / 帕米尔 (Huānyíng láidào Tǎshíkù'ěrgān)",
        uy: "تاشقورغانغا خۇش كەپسىز (Tashqorghangha khush kepsiz) [ตาช-คอร์-กาน-กา คูช เคพ-สิซ]",
        tg: "Ба Тошқӯрғон хуш омадед! (Ba Toshqurghon khush omaded) [บา ตอช-คูร์-กอน คุช โอ-มา-เด็ด]"
      },
      {
        id: "t2",
        th: "สบายดีไหม? (ถามสารทุกข์สุขดิบ)",
        en: "How are you doing?",
        zh: "你好吗? (Nǐ hǎo ma?)",
        uy: "ياخشى تۇردىڭىزمۇ؟ (Yakhshi turdingizmu?) [ยัค-ชิ ทุร์-ดิง-อิซ-มุ]",
        tg: "Шумо чӣ хел? (Shumo chi khel?) [ชู-โม ชี เคล]"
      },
      {
        id: "t3",
        th: "ฉันสบายดี",
        en: "I am fine",
        zh: "我很好 (Wǒ hěn hǎo)",
        uy: "مەن ياخشى (Men yakhshi) [เมน ยัค-ชิ]",
        tg: "Ман нағз (Man naghz) [มัน นัคซ์]"
      },
      {
        id: "t4",
        th: "สวยงามมาก (วิวทิวทัศน์/ผู้คน)",
        en: "Very beautiful",
        zh: "非常漂亮 (Fēicháng piàoliang)",
        uy: "بەك گۈزەل (Bek gözel) [เบก เกอ-เซล]",
        tg: "Хеле зебо (Khele zebo) [เค-เล เซ-โบ]"
      },
      {
        id: "t5",
        th: "แม่น้ำ / น้ำ",
        en: "Water / River",
        zh: "水 / 河 (Shuǐ / Hé)",
        uy: "سۇ / دەريا (Su / Derya) [ซู / แดร์-ยา]",
        tg: "Об / Дарё (Ob / Daryo) [โอบ / ดาร์-โย]"
      },
      {
        id: "t6",
        th: "ภูเขา / ธารน้ำแข็ง (มุซทัค)",
        en: "Mountain / Glacier",
        zh: "山 / 冰川 (Shān / Bīngchuān)",
        uy: "تاغ / مۇزتاغ (Tagh / Muztagh) [ทัก / มุซ-ทัก]",
        tg: "Кӯҳ / Пирях (Kuh / Piryakh) [คูห์ / พิ-แยก]"
      },
      {
        id: "t7",
        th: "ขอให้โชคดีในการเดินทาง",
        en: "Safe travels / Good luck",
        zh: "一路平安 (Yílù píng'ān)",
        uy: "سەپىرىڭىز بىخەتەر بولسۇน (Sepiringiz bikheter bolsun) [เซ-พิ-ริง-อิซ บิ-เค-เธอร์ โบล-ซุน]",
        tg: "Сафари бехатар! (Safari bekhatar!) [ซา-ฟา-ริ เบ-คา-ตาร์]"
      }
    ]
  },
  {
    id: "numbers",
    nameTh: "ตัวเลขและการนับจำนวน",
    nameEn: "Numbers & Counting",
    nameZh: "数字数量",
    iconName: "Binary",
    phrases: [
      {
        id: "n1",
        th: "1 (หนึ่ง) / 2 (สอง) / 3 (สาม)",
        en: "1 / 2 / 3",
        zh: "一 (yī) / 二 (èr) / 三 (sān)",
        uy: "بىر (Bir) / ئىككى (Ikki) / ئۈچ (Üch) [บีร์ / อิก-กิ / อุช]",
        tg: "Як (Yak) / Ду (Du) / Се (Se) [ยัก / ดุ / เซ]"
      },
      {
        id: "n2",
        th: "4 (สี่) / 5 (ห้า) / 6 (หก)",
        en: "4 / 5 / 6",
        zh: "四 (sì) / 五 (wǔ) / 六 (liù)",
        uy: "تۆت (Töt) / بەش (Besh) / ئالتە (Alte) [เติยต / เบช / อัล-เตอ]",
        tg: "Чор (Chor) / Панҷ (Panj) / Шаш (Shash) [ชอร์ / ปันจ์ / ชัช]"
      },
      {
        id: "n3",
        th: "7 (เจ็ด) / 8 (แปด) / 9 (เก้า) / 10 (สิบ)",
        en: "7 / 8 / 9 / 10",
        zh: "七 (qī) / 八 (bā) / 九 (jiǔ) / 十 (shí)",
        uy: "يەتتە (Yette) / سەككىز (Sekkiz) / توققۇز (Toqquz) / ئون (On) [เย็ต-เตอ / เซค-คิซ / ทก-คุซ / อน]",
        tg: "Ҳафт (Haft) / Ҳашт (Hasht) / Нӯҳ (Nuh) / Даҳ (Dah) [ฮัฟต์ / ฮัชต์ / นูห์ / ดาห์]"
      },
      {
        id: "n4",
        th: "100 (หนึ่งร้อย)",
        en: "100 (One Hundred)",
        zh: "一百 (Yībǎi)",
        uy: "يۈز (Yüz) [ยุซ]",
        tg: "Сад (Sad) [ซัด]"
      },
      {
        id: "n5",
        th: "1,000 (หนึ่งพัน)",
        en: "1,000 (One Thousand)",
        zh: "一千 (Yīqiān)",
        uy: "مىڭ (Ming) [มิง]",
        tg: "Ҳазор (Hazor) [ฮา-ซอร์]"
      }
    ]
  },
  {
    id: "time",
    nameTh: "เวลาและวันนัดหมาย",
    nameEn: "Time & Scheduling",
    nameZh: "时间日期",
    iconName: "Clock",
    phrases: [
      {
        id: "tm1",
        th: "กี่โมงแล้ว?",
        en: "What time is it?",
        zh: "几点了? (Jǐ diǎn le?)",
        uy: "سائەت قانچە بولدى؟ (Sa'et qanche boldi?) [ซา-แอต คัน-เชอ โบล-ดิ]",
        tg: "Соат чанд шуд? (Soat chand shud?) [โซ-อัด แชนด์ ชุด]"
      },
      {
        id: "tm2",
        th: "วันนี้ / พรุ่งนี้ / เมื่อวาน",
        en: "Today / Tomorrow / Yesterday",
        zh: "今天 / 明天 / 昨天 (Jīntiān / Míngtiān / Zuótiān)",
        uy: "بۈگۈن / ئەتە / تۈنۈگۈن (Bugün / Ete / Tünügün) [บุ-กุน / แอ-เตอ / ทุ-นุ-กุน]",
        tg: "Имрӯз / Пагоҳ / Дирӯз (Imruz / Pagoh / Diruz) [อิม-รูซ / ปา-โกห์ / ดิ-รูซ]"
      },
      {
        id: "tm3",
        th: "ตอนนี้ / เดี๋ยวนี้",
        en: "Now / Right now",
        zh: "现在 (Xiànzài)",
        uy: "ھازىر (Hazir) [ฮา-ซิร์]",
        tg: "Ҳозир (Hozir) [โฮ-ซิร]"
      },
      {
        id: "tm4",
        th: "กี่โมงล้อหมุนออกเดินทาง?",
        en: "What time do we depart?",
        zh: "我们几点出发? (Wǒmen jǐ diǎn chūfā?)",
        uy: "بىز سائەت قانچىدە يولغا چىقىمىز؟ (Biz sa'et qanchide yolgha chiqimiz?) [บิซ ซา-แอต คัน-ชิ-เด โยล์-กา ชิ-คิ-มิซ]",
        tg: "Мо соати чанд ҳаракат мекунем? (Mo soati chand harakat) [มอ โซ-อา-ทิ แชนด์ ฮา-รา-คัต เม-คุ-เน็ม]"
      },
      {
        id: "tm5",
        th: "ขอเวลานอนพักผ่อนหน่อย",
        en: "Need time to rest",
        zh: "我需要休息一下 (Wǒ xūyào xiūxi yīxià)",
        uy: "مەن ئازراق دەم ئېلىشىم كېرەك (Men azraq dem elishim kerek) [เมน อา-รัก เด็ม เอ-ลิ-ชิม เค-เรค]",
        tg: "Ба ман вақти истироҳат лозим (Ba man vaqti istirohat) [บา มัน วัก-ทิ อิส-ติ-โร-ฮัต โล-ซิม]"
      }
    ]
  }
];
