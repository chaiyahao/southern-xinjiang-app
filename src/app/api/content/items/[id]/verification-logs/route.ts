import { NextResponse } from "next/server";
import type { VerificationLogCreateInput } from "@/types";
import { contentService } from "@/services/contentService";
import { isSupabaseWriteConfigured, serverSupabase } from "@/utils/serverSupabaseClient";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Failed to create verification log.";
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    if (!isSupabaseWriteConfigured || !serverSupabase) {
      return NextResponse.json({ error: "Write mode is disabled. Configure SUPABASE_SERVICE_ROLE_KEY to enable admin mutations." }, { status: 503 });
    }

    const { id } = await context.params;
    const payload = (await request.json()) as VerificationLogCreateInput;

    const checkedAt = payload.checkedAt || new Date().toISOString();
    const reviewer = payload.reviewer || null;

    const { error: insertError } = await serverSupabase
      .from("content_verification_logs")
      .insert({
        content_id: id,
        verification_status: payload.verificationStatus,
        reviewer,
        notes: payload.notes || null,
        checked_at: checkedAt,
        snapshot_url: payload.snapshotUrl || null,
        source_checksum: payload.sourceChecksum || null,
      });

    if (insertError) {
      throw insertError;
    }

    const { error: updateError } = await serverSupabase
      .from("travel_content")
      .update({
        verification_status: payload.verificationStatus,
        verified_by: reviewer,
        verified_at: checkedAt,
        source_last_checked_at: checkedAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      throw updateError;
    }

    const [content, verificationLogs] = await Promise.all([
      contentService.getContentById(id),
      contentService.getVerificationLogs(id),
    ]);

    return NextResponse.json({ content, verificationLogs });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}