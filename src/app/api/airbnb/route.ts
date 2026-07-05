import { NextRequest, NextResponse } from "next/server";
import { applyAirbnbLocation, getAirbnbLocation } from "@/lib/airbnb";
import { getItinerary, saveItinerary } from "@/lib/data";

export async function GET() {
  const itinerary = getItinerary();
  return NextResponse.json({ airbnb: getAirbnbLocation(itinerary) });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { name?: string; address?: string };
  const address = body.address?.trim();

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  const itinerary = getItinerary();
  applyAirbnbLocation(itinerary, {
    name: body.name ?? "Airbnb",
    address,
  });
  saveItinerary(itinerary);

  return NextResponse.json({ airbnb: getAirbnbLocation(itinerary) });
}
