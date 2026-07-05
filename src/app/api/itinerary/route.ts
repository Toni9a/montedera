import { NextRequest, NextResponse } from "next/server";
import { getAdminPassword } from "@/lib/admin";
import { getItinerary, saveItinerary } from "@/lib/data";
import type { Itinerary } from "@/lib/types";

export async function GET() {
  const itinerary = getItinerary();
  return NextResponse.json(itinerary);
}

export async function POST(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (password !== getAdminPassword()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Itinerary;
  saveItinerary(body);
  return NextResponse.json({ ok: true });
}
