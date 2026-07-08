import { NextResponse } from "next/server";
import { contentService } from "@/services/contentService";
import { TravelContentType } from "@/types";

const CONTENT_TYPES: TravelContentType[] = ["alert", "attraction", "restaurant", "hotel", "route", "checkpoint", "document", "phrase", "city_guide"];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Failed to load content items.";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const verification = searchParams.get("verification");
    const status = searchParams.get("status");

    const items = type && CONTENT_TYPES.includes(type as TravelContentType)
      ? await contentService.getVerifiedContentByType(type as TravelContentType)
      : await contentService.getAllContent();

    const filtered = items.filter((item) => {
      if (verification && item.verificationStatus !== verification) return false;
      if (status && item.status !== status) return false;
      return true;
    });

    return NextResponse.json({ items: filtered, count: filtered.length });
  } catch (error: unknown) {
    return NextResponse.json({ items: [], count: 0, error: getErrorMessage(error) }, { status: 500 });
  }
}