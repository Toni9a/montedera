import { NextRequest, NextResponse } from "next/server";
import { applyAirbnbLocation, getAirbnbLocation } from "@/lib/airbnb";
import { getItinerary, saveItinerary } from "@/lib/data";

export async function GET() {
  const itinerary = await getItinerary();
  return NextResponse.json({ airbnb: getAirbnbLocation(itinerary) });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { name?: string; address?: string };
  const address = body.address?.trim();

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  try {
    const itinerary = await getItinerary();
    applyAirbnbLocation(itinerary, {
      name: body.name ?? "Airbnb",
      address,
    });
    await saveItinerary(itinerary);

    return NextResponse.json({ airbnb: getAirbnbLocation(itinerary) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Save failed" },
      { status: 500 }
    );
  }
}
