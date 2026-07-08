import { NextResponse } from "next/server";
import { contentService } from "@/services/contentService";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Failed to load content sources.";
}

export async function GET() {
  try {
    const sources = await contentService.getSources();
    return NextResponse.json({ sources, count: sources.length });
  } catch (error: unknown) {
    return NextResponse.json({ sources: [], count: 0, error: getErrorMessage(error) }, { status: 500 });
  }
}