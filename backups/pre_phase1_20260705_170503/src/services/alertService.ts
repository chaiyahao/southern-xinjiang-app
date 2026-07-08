export interface OfficialAlert {
  id: string;
  title: string;
  titleTh: string;
  titleEn: string;
  detail: string;
  detailTh: string;
  detailEn: string;
  publishedAt: string;
  sourceName: string;
  sourceUrl: string;
  category: "traffic" | "weather" | "road" | "tourism" | "other";
  severity: "critical" | "warning" | "caution";
}

const SOURCE_CONFIG = [
  {
    name: "Xinjiang Transport Department",
    url: "https://jtyst.xinjiang.gov.cn/xjjtysj/zwgg/zfxxgk_gknrz.shtml",
    category: "traffic" as const,
  },
  {
    name: "Xinjiang Transport Department",
    url: "https://jtyst.xinjiang.gov.cn/xjjtysj/jtyw/common_list.shtml",
    category: "road" as const,
  },
  {
    name: "China Meteorological Administration",
    url: "https://www.cma.gov.cn/",
    category: "weather" as const,
  },
];

const RECENT_ALERT_KEYWORDS = [
  "traffic",
  "transport",
  "road",
  "closure",
  "closed",
  "warning",
  "alert",
  "weather",
  "storm",
  "snow",
  "wind",
  "sand",
  "fog",
  "flood",
  "ice",
  "condition",
  "pass",
  "highway",
  "vehicle",
  "temporary",
  "repair",
  "construction",
  "restore",
  "route",
  "open",
  "closed",
  "限行",
  "封闭",
  "关闭",
  "施工",
  "天气",
  "气象",
  "预警",
  "暴雨",
  "暴雪",
  "沙尘",
  "风",
  "冰",
  "道路",
  "公路",
  "交通",
  "通行",
  "恢复",
  "高原",
  "事故",
  "安全生产",
  "举报",
];

function stripHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function readHtmlWithBestEffortCharset(response: Response): Promise<string> {
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const contentType = response.headers.get("content-type") || "";
  const headerCharset = /charset=([^;]+)/i.exec(contentType)?.[1]?.trim().toLowerCase();

  const utf8Decoded = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  const gbDecoded = new TextDecoder("gb18030", { fatal: false }).decode(bytes);

  const utf8Preview = utf8Decoded.slice(0, 4096);
  const metaCharset = /charset\s*=\s*['"]?([a-zA-Z0-9_-]+)/i.exec(utf8Preview)?.[1]?.trim().toLowerCase();
  const preferredCharset = metaCharset || headerCharset;

  if (preferredCharset && /gbk|gb2312|gb18030/.test(preferredCharset)) {
    return gbDecoded;
  }

  if (/jtyst\.xinjiang\.gov\.cn/i.test(response.url)) {
    return gbDecoded;
  }

  const countHan = (text: string) => (text.match(/[\u3400-\u9fff]/g) || []).length;
  const countMojibake = (text: string) => (text.match(/[æåäï¼ã]/g) || []).length;

  const utf8Score = countHan(utf8Decoded) - countMojibake(utf8Decoded) * 3;
  const gbScore = countHan(gbDecoded) - countMojibake(gbDecoded) * 3;

  return gbScore > utf8Score ? gbDecoded : utf8Decoded;
}

function cleanWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function normalizeUrl(href: string, baseUrl: string): string | null {
  if (!href) return null;
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("javascript:") || trimmed.startsWith("mailto:")) {
    return null;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  try {
    return new URL(trimmed, baseUrl).toString();
  } catch {
    return null;
  }
}

function parseDate(value: string): Date | null {
  const cleaned = value.replace(/\s+/g, " ").trim();
  const patterns = [
    /(\d{4})[-/年](\d{1,2})[-/月](\d{1,2})/,
    /(\d{4})[-/年](\d{1,2})月(\d{1,2})日?/,
    /(\d{4})[-/年](\d{1,2})[-/月](\d{1,2})日?/,
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match) {
      const [, year, month, day] = match;
      const parsed = new Date(Number(year), Number(month) - 1, Number(day));
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
  }

  return null;
}

function parsePublishedAt(text: string, href: string): Date | null {
  const combined = `${text} ${href}`;
  const fromText = parseDate(combined);
  if (fromText) return fromText;

  const fallback = /^(\d{4})(\d{2})(\d{2})/.exec(href);
  if (fallback) {
    const [, year, month, day] = fallback;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  return null;
}

function isLikelyAlert(text: string): boolean {
  const normalized = text.toLowerCase();
  return RECENT_ALERT_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function getSeverity(text: string): "critical" | "warning" | "caution" {
  const normalized = text.toLowerCase();
  if (/封闭|关闭|事故|塌方|泥石流|停运|停航|暴雪|暴雨|沙尘|大风|高寒|结冰|冰冻|雾|低能见度|险/.test(normalized)) {
    return "critical";
  }
  if (/施工|维修|限行|管制|减速|临时|成灾|预警|风力|雨|雪|冰/.test(normalized)) {
    return "warning";
  }
  return "caution";
}

function normalizeChineseNoticeTitle(title: string): string {
  const normalized = cleanWhitespace(title);
  return normalized
    .replace(/^关于(.+?)的公示$/, "$1公示")
    .replace(/^关于(.+?)的公告$/, "$1公告")
    .replace(/^关于(.+?)的通知$/, "$1通知")
    .replace(/^关于/, "")
    .trim();
}

function extractRouteName(text: string): string | null {
  const patterns = [
    /([A-Z]\d{2,4}[^，。；、]{0,20}(?:公路|路段|高速))/,
    /([^，。；、]{2,24}(?:公路|路段|道路|通道|古道|机场|景区|古城|大峡谷))/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return cleanWhitespace(match[1]);
    }
  }

  return null;
}

function extractArticleDetail(html: string, title: string): string | null {
  const titleAnchor = title.slice(0, Math.min(title.length, 18));
  const startIndex = titleAnchor ? html.indexOf(titleAnchor) : -1;
  const focusedHtml = startIndex >= 0 ? html.slice(startIndex, startIndex + 60000) : html.slice(0, 60000);

  const text = focusedHtml
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<\/?(p|div|section|article|h1|h2|h3|h4|li|ul|ol)[^>]*>/gi, "\n")
    .replace(/<tr[^>]*>/gi, "\n")
    .replace(/<\/?t[dh][^>]*>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n");

  const lines = stripHtml(text)
    .split(/\n+/)
    .map((line) => cleanWhitespace(line))
    .filter(Boolean)
    .filter((line) => line !== normalizeChineseNoticeTitle(title))
    .filter((line) => line !== title)
    .filter((line) => !/^(首页|新闻中心|政务公开|政务服务|政民互动|出行服务|当前位置|主办：|承办：|地址：|联系电话：|邮编：|ICP备案号|政府网站标识|浏览量：|浏览次数：|发布时间：|来源：|字体：|新疆维吾尔自治区交通运输厅|政府信息公开)$/.test(line))
    .filter((line) => !/^\d{4}年\d{1,2}月\d{1,2}日/.test(line))
    .filter((line) => line.length >= 14);

  const detail = cleanWhitespace(lines.slice(0, 4).join(" "));
  return detail.length >= 40 ? detail.slice(0, 520) : null;
}

function humanizeAlert(
  title: string,
  detail: string,
  severity: "critical" | "warning" | "caution"
) {
  const normalizedTitle = normalizeChineseNoticeTitle(title);
  const normalized = cleanWhitespace(`${normalizedTitle} ${detail}`);
  const routeName = extractRouteName(normalized);
  const hasSnow = /暴雪|降雪|积雪|结冰|冰冻/.test(normalized);
  const hasWind = /沙尘|大风|风沙/.test(normalized);
  const hasConstruction = /施工|维修|养护/.test(normalized);
  const hasClosure = /封闭|关闭|停运|停航/.test(normalized);
  const hasControl = /限行|管制/.test(normalized);
  const hasReopen = /恢复通行|恢复开放|恢复/.test(normalized);
  const hasReporting = /举报|热线|邮箱/.test(normalized);
  const hasMeeting = /会议|调度|警示/.test(normalized) && /安全生产/.test(normalized);

  if (hasReporting) {
    return {
      titleZh: normalizedTitle,
      titleTh: "ประกาศช่องทางแจ้งเหตุความปลอดภัยด้านขนส่งในซินเจียง",
      titleEn: "Official safety reporting channels published for Xinjiang transport",
      detailZh: detail,
      detailTh: "ประกาศทางการฉบับนี้รวบรวมสายด่วน หมายเลขโทรศัพท์ และอีเมลสำหรับแจ้งเหตุอันตรายหรือการกระทำผิดในภาคขนส่งทั่วซินเจียง โดยให้ดูรายชื่อพื้นที่และช่องทางติดต่อเต็มจากลิงก์ต้นทาง",
      detailEn: "This official notice publishes hotline numbers, phone contacts, and email channels for reporting transport safety hazards or violations across Xinjiang. Open the source link to review the full district-by-district contact list.",
    };
  }

  if (hasMeeting) {
    return {
      titleZh: normalizedTitle,
      titleTh: "หน่วยงานคมนาคมประชุมติดตามความปลอดภัยการขนส่ง",
      titleEn: "Transport authority held a transport safety coordination meeting",
      detailZh: detail,
      detailTh: "ประกาศนี้ระบุว่าหน่วยงานคมนาคมได้ประเมินความเสี่ยงล่าสุดในงานขนส่งทางถนน การเดินรถบนทางหลวง และโครงการก่อสร้าง พร้อมสั่งการให้เร่งตรวจสอบจุดเสี่ยงและควบคุมอันตรายตามฤดูกาล",
      detailEn: "The notice says the transport authority reviewed current safety risks across road transport, highway operations, and construction activity, and instructed departments to strengthen inspections and hazard controls for the current season.",
    };
  }

  if (hasReopen) {
    return {
      titleZh: normalizedTitle,
      titleTh: routeName ? `เส้นทาง ${routeName} กลับมาเปิดใช้งานแล้ว` : "เส้นทางที่เกี่ยวข้องกลับมาเปิดใช้งานแล้ว",
      titleEn: routeName ? `${routeName} has reopened` : "The affected route has reopened",
      detailZh: detail,
      detailTh: routeName ? `ประกาศทางการยืนยันว่าเส้นทาง ${routeName} กลับมาเปิดให้สัญจรได้อีกครั้งแล้ว กรุณาเปิดลิงก์ต้นทางเพื่อตรวจเงื่อนไขการใช้งานล่าสุด` : "ประกาศทางการยืนยันว่าเส้นทางที่ได้รับผลกระทบกลับมาเปิดให้สัญจรได้อีกครั้งแล้ว กรุณาตรวจเงื่อนไขล่าสุดจากลิงก์ต้นทาง",
      detailEn: routeName ? `The official notice confirms that ${routeName} has reopened to traffic. Open the source link to check the latest operating conditions.` : "The official notice confirms that the affected route has reopened to traffic. Open the source link to review the latest operating conditions.",
    };
  }

  if (hasClosure || hasControl || hasConstruction || hasSnow || hasWind) {
    const titleTh = hasClosure
      ? (routeName ? `ประกาศปิดเส้นทาง ${routeName} ชั่วคราว` : "ประกาศปิดเส้นทางชั่วคราว")
      : hasControl
      ? (routeName ? `ประกาศควบคุมการจราจรบน ${routeName}` : "ประกาศควบคุมการจราจร")
      : hasConstruction
      ? (routeName ? `มีงานซ่อมบำรุงบน ${routeName}` : "มีงานซ่อมบำรุงบนเส้นทาง")
      : hasSnow
      ? "คำเตือนหิมะหรือน้ำแข็งกระทบการเดินทาง"
      : "คำเตือนลมแรงหรือพายุทรายกระทบการเดินทาง";

    const titleEn = hasClosure
      ? (routeName ? `${routeName} temporarily closed` : "Route temporarily closed")
      : hasControl
      ? (routeName ? `Traffic controls in effect on ${routeName}` : "Traffic controls in effect")
      : hasConstruction
      ? (routeName ? `Maintenance or works in progress on ${routeName}` : "Maintenance or works in progress on the route")
      : hasSnow
      ? "Snow or ice may affect travel"
      : "Strong winds or dust may affect travel";

    const detailTh = hasClosure
      ? (routeName ? `ประกาศทางการระบุว่า ${routeName} ถูกปิดชั่วคราวเพื่อความปลอดภัย โปรดตรวจสอบเหตุผล เงื่อนไข และเวลาที่อาจกลับมาเปิดอีกครั้งจากลิงก์ต้นทาง` : "ประกาศทางการระบุว่ามีการปิดเส้นทางชั่วคราวเพื่อความปลอดภัย โปรดตรวจสอบรายละเอียดเพิ่มเติมจากลิงก์ต้นทาง")
      : hasControl
      ? (routeName ? `ประกาศทางการระบุว่ามีมาตรการควบคุมการจราจรบน ${routeName} โปรดตรวจสอบข้อจำกัด เวลาใช้งาน และคำแนะนำล่าสุดจากลิงก์ต้นทาง` : "ประกาศทางการระบุว่ามีมาตรการควบคุมการจราจร โปรดตรวจสอบข้อจำกัดล่าสุดจากลิงก์ต้นทาง")
      : hasConstruction
      ? (routeName ? `ประกาศทางการแจ้งว่ามีงานก่อสร้าง ซ่อมแซม หรือบำรุงรักษาบน ${routeName} ซึ่งอาจทำให้เวลาการเดินทางเปลี่ยนแปลง โปรดดูรายละเอียดจากลิงก์ต้นทาง` : "ประกาศทางการแจ้งว่ามีงานก่อสร้าง ซ่อมแซม หรือบำรุงรักษาบนเส้นทาง โปรดดูรายละเอียดจากลิงก์ต้นทาง")
      : hasSnow
      ? "ประกาศทางการแจ้งว่ามีหิมะ น้ำแข็ง หรือสภาพผิวทางลื่นซึ่งอาจกระทบการเดินทาง โปรดตรวจสอบข้อจำกัดล่าสุดจากลิงก์ต้นทาง"
      : "ประกาศทางการแจ้งว่ามีลมแรงหรือพายุทราย ซึ่งอาจกระทบทัศนวิสัยและความปลอดภัยในการเดินทาง โปรดติดตามรายละเอียดจากลิงก์ต้นทาง";

    const detailEn = hasClosure
      ? (routeName ? `The official notice says that ${routeName} is temporarily closed for safety. Open the source link for the stated reason, any restrictions, and the latest reopening conditions.` : "The official notice says that the affected route is temporarily closed for safety. Open the source link for the latest restrictions and reopening conditions.")
      : hasControl
      ? (routeName ? `The official notice says traffic controls are in effect on ${routeName}. Open the source link to review restrictions, operating hours, and the latest travel guidance.` : "The official notice says traffic controls are in effect. Open the source link to review the latest restrictions and travel guidance.")
      : hasConstruction
      ? (routeName ? `The official notice says construction, maintenance, or repair work is under way on ${routeName}, which may affect travel times. Open the source link for full details.` : "The official notice says construction, maintenance, or repair work is under way on the route. Open the source link for full details.")
      : hasSnow
      ? "The official notice warns that snow, ice, or slippery road conditions may affect travel. Open the source link to review the latest restrictions and safety guidance."
      : "The official notice warns that strong winds or dust may reduce visibility and affect travel safety. Open the source link to review the latest guidance.";

    return {
      titleZh: normalizedTitle,
      titleTh,
      titleEn,
      detailZh: detail,
      detailTh,
      detailEn,
    };
  }

  return {
    titleZh: normalizedTitle,
    titleTh: severity === "critical"
      ? "มีประกาศเร่งด่วนด้านความปลอดภัยในการเดินทาง"
      : "มีประกาศทางการใหม่เกี่ยวกับการเดินทางและความปลอดภัย",
    titleEn: severity === "critical"
      ? "Urgent official travel safety notice issued"
      : "New official travel and safety notice issued",
    detailZh: detail,
    detailTh: "ประกาศทางการฉบับนี้มีรายละเอียดจริงในเอกสารต้นทาง โปรดเปิดลิงก์ต้นทางเพื่ออ่านข้อกำหนดหรือข้อมูลล่าสุดทั้งหมด",
    detailEn: "This official notice includes additional details in the source document. Open the source link to review the full conditions and latest information.",
  };
}

function dedupeAlerts(alerts: OfficialAlert[]): OfficialAlert[] {
  const seen = new Set<string>();
  return alerts.filter((alert) => {
    if (seen.has(alert.sourceUrl)) {
      return false;
    }
    seen.add(alert.sourceUrl);
    return true;
  });
}

export async function getOfficialAlerts(): Promise<OfficialAlert[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  const results: OfficialAlert[] = [];

  for (const source of SOURCE_CONFIG) {
    try {
      const response = await fetch(source.url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "text/html,application/xhtml+xml",
        },
        next: { revalidate: 1800 },
      });

      if (!response.ok) continue;

      const html = await readHtmlWithBestEffortCharset(response);
      const anchorRegex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

      for (const match of html.matchAll(anchorRegex)) {
        const href = normalizeUrl(match[1], source.url);
        const text = stripHtml(match[2] || "");

        if (!href || !text) continue;
        if (text.length < 8) continue;
        if (!isLikelyAlert(text)) continue;

        const publishedAt = parsePublishedAt(text, href);
        if (!publishedAt || publishedAt < cutoff) continue;

        const severity = getSeverity(text.toLowerCase());
        if (severity === "caution" && !/限行|封闭|关闭|事故|施工|维修|雪|冰|沙尘|风|雨|暴|安全生产|举报/.test(text.toLowerCase())) {
          continue;
        }

        let detail = "";
        try {
          const detailResponse = await fetch(href, {
            headers: {
              "User-Agent": "Mozilla/5.0",
              Accept: "text/html,application/xhtml+xml",
            },
            next: { revalidate: 1800 },
          });

          if (detailResponse.ok) {
            detail = extractArticleDetail(await readHtmlWithBestEffortCharset(detailResponse), text) || "";
          }
        } catch {
          detail = "";
        }

        if (!detail) continue;

        const translated = humanizeAlert(text, detail, severity);

        results.push({
          id: `${source.name}-${href}`,
          title: translated.titleZh,
          titleTh: translated.titleTh,
          titleEn: translated.titleEn,
          detail: translated.detailZh,
          detailTh: translated.detailTh,
          detailEn: translated.detailEn,
          publishedAt: publishedAt.toISOString(),
          sourceName: source.name,
          sourceUrl: href,
          category: source.category,
          severity,
        });
      }
    } catch {
      // Ignore inaccessible sources and return only verified entries.
    }
  }

  return dedupeAlerts(results).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
