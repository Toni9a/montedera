import fs from "fs";
import path from "path";
import type { Itinerary } from "./types";

const DATA_PATH = path.join(process.cwd(), "src", "data", "itinerary.json");

export function getItinerary(): Itinerary {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Itinerary;
}

export function saveItinerary(data: Itinerary): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}
