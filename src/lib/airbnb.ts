import type { AirbnbLocation, Itinerary } from "./types";

const GENERIC_AIRBNB_QUERIES = new Set(["", "kotor, montenegro"]);

export function placeQuery(name: string, address: string) {
  return [name, address].filter(Boolean).join(", ");
}

export function getAirbnbLocation(itinerary: Itinerary): AirbnbLocation | null {
  if (itinerary.airbnb?.address) return itinerary.airbnb;

  const stay = itinerary.days
    .flatMap((day) => day.stops)
    .find((stop) => stop.type === "stay" && stop.address);

  if (!stay?.address) return null;

  return {
    name: stay.name || "Airbnb",
    address: stay.address,
    mapsQuery: stay.mapsQuery || placeQuery(stay.name || "Airbnb", stay.address),
  };
}

export function hasAirbnbMaps(stopMapsQuery: string | undefined, stopAddress: string | undefined) {
  if (stopAddress) return true;
  return !GENERIC_AIRBNB_QUERIES.has((stopMapsQuery ?? "").trim().toLowerCase());
}

export function applyAirbnbLocation(
  itinerary: Itinerary,
  location: Pick<AirbnbLocation, "name" | "address">
) {
  const name = location.name.trim() || "Airbnb";
  const address = location.address.trim();
  const mapsQuery = placeQuery(name, address);

  itinerary.airbnb = { name, address, mapsQuery };

  for (const day of itinerary.days) {
    for (const stop of day.stops) {
      if (stop.type !== "stay") continue;
      stop.name = name;
      stop.address = address;
      stop.mapsQuery = mapsQuery;
      stop.description = stop.description || "Home base for the trip.";
    }
  }
}
