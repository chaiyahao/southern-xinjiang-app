import { NextResponse } from "next/server";
import { contentService } from "@/services/contentService";
import type { ContentUpdateInput, VerificationStatus } from "@/types";
import { isSupabaseWriteConfigured, serverSupabase } from "@/utils/serverSupabaseClient";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Failed to load content detail.";
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const content = await contentService.getContentById(id);

    if (!content) {
      return NextResponse.json({ error: "Content not found." }, { status: 404 });
    }

    const [localizations, media, verificationLogs] = await Promise.all([
      contentService.getContentLocalizations(id),
      contentService.getContentMedia(id),
      contentService.getVerificationLogs(id),
    ]);

    return NextResponse.json({
      content: {
        ...content,
        localizations,
        media,
        verificationLogs,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    if (!isSupabaseWriteConfigured || !serverSupabase) {
      return NextResponse.json({ error: "Write mode is disabled. Configure SUPABASE_SERVICE_ROLE_KEY to enable admin mutations." }, { status: 503 });
    }

    const { id } = await context.params;
    const payload = (await request.json()) as ContentUpdateInput;

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (payload.status) updatePayload.status = payload.status;
    if (payload.verificationStatus) updatePayload.verification_status = payload.verificationStatus;
    if (typeof payload.freshnessHours === "number" && Number.isFinite(payload.freshnessHours)) updatePayload.freshness_hours = payload.freshnessHours;
    if (payload.verifiedBy !== undefined) updatePayload.verified_by = payload.verifiedBy || null;
    if (payload.summary !== undefined) updatePayload.summary = payload.summary || null;
    if (payload.detail !== undefined) updatePayload.detail = payload.detail || null;
    if (payload.sourceUrl !== undefined) updatePayload.source_url = payload.sourceUrl || null;
    if (payload.sourceLastCheckedAt !== undefined) updatePayload.source_last_checked_at = payload.sourceLastCheckedAt || null;
    if (payload.expiresAt !== undefined) updatePayload.expires_at = payload.expiresAt || null;

    if (payload.verificationStatus && ["verified", "official"].includes(payload.verificationStatus as VerificationStatus)) {
      updatePayload.verified_at = new Date().toISOString();
    }

    const { error } = await serverSupabase
      .from("travel_content")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      throw error;
    }

    const content = await contentService.getContentById(id);
    return NextResponse.json({ content });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}