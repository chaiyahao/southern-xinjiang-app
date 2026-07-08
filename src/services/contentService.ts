import { isSupabaseConfigured, supabase } from "../utils/supabaseClient";
import {
  LOCAL_CONTENT_SOURCES,
  LOCAL_CONTENT_VERIFICATION_LOGS,
  LOCAL_VERIFIED_CONTENT,
} from "../data/contentRegistry";
import {
  ContentSource,
  ContentVerificationLog,
  Language,
  TravelContentLocalization,
  TravelContentMedia,
  TravelContentRecord,
  TravelContentType,
} from "../types";

type TravelContentRow = {
  id: string;
  content_key: string;
  content_type: TravelContentType;
  region_code: string | null;
  slug: string;
  status: TravelContentRecord["status"];
  verification_status: TravelContentRecord["verificationStatus"];
  freshness_hours: number;
  source_id: string | null;
  source_url: string | null;
  source_published_at: string | null;
  source_last_checked_at: string | null;
  verified_at: string | null;
  verified_by: string | null;
  confidence_score: number | null;
  expires_at: string | null;
  canonical_title: string;
  summary: string | null;
  detail: string | null;
  metadata: Record<string, unknown> | null;
  source_name?: string | null;
  source_key?: string | null;
  base_url?: string | null;
  trust_level?: ContentSource["trustLevel"] | null;
};

const mapTravelContentRow = (row: TravelContentRow): TravelContentRecord => ({
  id: row.id,
  contentKey: row.content_key,
  contentType: row.content_type,
  regionCode: row.region_code ?? undefined,
  slug: row.slug,
  status: row.status,
  verificationStatus: row.verification_status,
  freshnessHours: row.freshness_hours,
  sourceId: row.source_id ?? undefined,
  sourceUrl: row.source_url ?? undefined,
  sourcePublishedAt: row.source_published_at ?? undefined,
  sourceLastCheckedAt: row.source_last_checked_at ?? undefined,
  verifiedAt: row.verified_at ?? undefined,
  verifiedBy: row.verified_by ?? undefined,
  confidenceScore: row.confidence_score ?? undefined,
  expiresAt: row.expires_at ?? undefined,
  canonicalTitle: row.canonical_title,
  summary: row.summary ?? undefined,
  detail: row.detail ?? undefined,
  metadata: row.metadata ?? {},
  source: row.source_key && row.source_name && row.base_url && row.trust_level
    ? {
        id: row.source_id || "",
        sourceKey: row.source_key,
        sourceName: row.source_name,
        sourceType: "unknown",
        baseUrl: row.base_url,
        defaultLanguage: "zh",
        trustLevel: row.trust_level,
        isActive: true,
      }
    : undefined,
});

const mapLocalizationRow = (row: {
  locale: Language;
  title: string;
  summary: string | null;
  detail: string | null;
  seo_title: string | null;
  seo_description: string | null;
}): TravelContentLocalization => ({
  locale: row.locale,
  title: row.title,
  summary: row.summary ?? undefined,
  detail: row.detail ?? undefined,
  seoTitle: row.seo_title ?? undefined,
  seoDescription: row.seo_description ?? undefined,
});

const mapMediaRow = (row: {
  id: string;
  content_id: string;
  media_type: TravelContentMedia["mediaType"];
  storage_path: string;
  alt_text: string | null;
  caption: string | null;
  source_url: string | null;
  is_verified: boolean;
  sort_order: number;
}): TravelContentMedia => ({
  id: row.id,
  contentId: row.content_id,
  mediaType: row.media_type,
  storagePath: row.storage_path,
  altText: row.alt_text ?? undefined,
  caption: row.caption ?? undefined,
  sourceUrl: row.source_url ?? undefined,
  isVerified: row.is_verified,
  sortOrder: row.sort_order,
});

const mapVerificationLogRow = (row: {
  id: string;
  content_id: string;
  verification_status: ContentVerificationLog["verificationStatus"];
  reviewer: string | null;
  notes: string | null;
  checked_at: string;
  snapshot_url: string | null;
  source_checksum: string | null;
}): ContentVerificationLog => ({
  id: row.id,
  contentId: row.content_id,
  verificationStatus: row.verification_status,
  reviewer: row.reviewer ?? undefined,
  notes: row.notes ?? undefined,
  checkedAt: row.checked_at,
  snapshotUrl: row.snapshot_url ?? undefined,
  sourceChecksum: row.source_checksum ?? undefined,
});

export const contentService = {
  async getSources(): Promise<ContentSource[]> {
    if (!isSupabaseConfigured || !supabase) {
      return LOCAL_CONTENT_SOURCES;
    }

    const { data, error } = await supabase
      .from("content_sources")
      .select("*")
      .eq("is_active", true)
      .order("source_name", { ascending: true });

    if (error) {
      console.error("Failed to fetch content sources:", error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      sourceKey: row.source_key,
      sourceName: row.source_name,
      sourceType: row.source_type,
      baseUrl: row.base_url,
      defaultLanguage: row.default_language,
      regionCode: row.region_code ?? undefined,
      trustLevel: row.trust_level,
      isActive: row.is_active,
      notes: row.notes ?? undefined,
      createdAt: row.created_at ?? undefined,
      updatedAt: row.updated_at ?? undefined,
    }));
  },

  async getAllContent(): Promise<TravelContentRecord[]> {
    if (!isSupabaseConfigured || !supabase) {
      return LOCAL_VERIFIED_CONTENT;
    }

    const { data, error } = await supabase
      .from("travel_content")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch travel content:", error);
      return [];
    }

    return (data || []).map((row) => mapTravelContentRow(row as TravelContentRow));
  },

  async getVerifiedContentByType(contentType: TravelContentType): Promise<TravelContentRecord[]> {
    if (!isSupabaseConfigured || !supabase) {
      return LOCAL_VERIFIED_CONTENT.filter(
        (item) => item.contentType === contentType && item.status === "published" && ["verified", "official"].includes(item.verificationStatus)
      );
    }

    const { data, error } = await supabase
      .from("published_verified_content")
      .select("*")
      .eq("content_type", contentType)
      .order("verified_at", { ascending: false });

    if (error) {
      console.error(`Failed to fetch verified ${contentType} content:`, error);
      return [];
    }

    return (data || []).map((row) => mapTravelContentRow(row as TravelContentRow));
  },

  async getContentById(contentId: string): Promise<TravelContentRecord | null> {
    if (!isSupabaseConfigured || !supabase) {
      return LOCAL_VERIFIED_CONTENT.find((item) => item.id === contentId) ?? null;
    }

    const { data, error } = await supabase
      .from("travel_content")
      .select("*")
      .eq("id", contentId)
      .maybeSingle();

    if (error) {
      console.error(`Failed to fetch content ${contentId}:`, error);
      return null;
    }

    return data ? mapTravelContentRow(data as TravelContentRow) : null;
  },

  async getContentLocalizations(contentId: string): Promise<Partial<Record<Language, TravelContentLocalization>>> {
    if (!isSupabaseConfigured || !supabase) {
      return LOCAL_VERIFIED_CONTENT.find((item) => item.id === contentId)?.localizations ?? {};
    }

    const { data, error } = await supabase
      .from("travel_content_localizations")
      .select("locale, title, summary, detail, seo_title, seo_description")
      .eq("content_id", contentId);

    if (error) {
      console.error(`Failed to fetch localizations for content ${contentId}:`, error);
      return {};
    }

    return (data || []).reduce<Partial<Record<Language, TravelContentLocalization>>>((acc, row) => {
      const localization = mapLocalizationRow(row as {
        locale: Language;
        title: string;
        summary: string | null;
        detail: string | null;
        seo_title: string | null;
        seo_description: string | null;
      });
      acc[localization.locale] = localization;
      return acc;
    }, {});
  },

  async getContentMedia(contentId: string): Promise<TravelContentMedia[]> {
    if (!isSupabaseConfigured || !supabase) {
      return LOCAL_VERIFIED_CONTENT.find((item) => item.id === contentId)?.media ?? [];
    }

    const { data, error } = await supabase
      .from("travel_content_media")
      .select("id, content_id, media_type, storage_path, alt_text, caption, source_url, is_verified, sort_order")
      .eq("content_id", contentId)
      .eq("is_verified", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error(`Failed to fetch media for content ${contentId}:`, error);
      return [];
    }

    return (data || []).map((row) => mapMediaRow(row as {
      id: string;
      content_id: string;
      media_type: TravelContentMedia["mediaType"];
      storage_path: string;
      alt_text: string | null;
      caption: string | null;
      source_url: string | null;
      is_verified: boolean;
      sort_order: number;
    }));
  },

  async getVerificationLogs(contentId: string): Promise<ContentVerificationLog[]> {
    if (!isSupabaseConfigured || !supabase) {
      return LOCAL_CONTENT_VERIFICATION_LOGS.filter((item) => item.contentId === contentId);
    }

    const { data, error } = await supabase
      .from("content_verification_logs")
      .select("id, content_id, verification_status, reviewer, notes, checked_at, snapshot_url, source_checksum")
      .eq("content_id", contentId)
      .order("checked_at", { ascending: false });

    if (error) {
      console.error(`Failed to fetch verification logs for content ${contentId}:`, error);
      return [];
    }

    return (data || []).map((row) => mapVerificationLogRow(row as {
      id: string;
      content_id: string;
      verification_status: ContentVerificationLog["verificationStatus"];
      reviewer: string | null;
      notes: string | null;
      checked_at: string;
      snapshot_url: string | null;
      source_checksum: string | null;
    }));
  },
};