import type { StopType } from "./types";

export function googleMapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function telUrl(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function instagramUrl(handle: string): string {
  if (handle.startsWith("http")) return handle;
  const clean = handle.replace(/^@/, "");
  return `https://instagram.com/${clean}`;
}

export function googleMapsDirectionsUrl(query: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}&travelmode=driving`;
}

export function groceryNearMeUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("grocery store near me")}`;
}

export const stopTypeMeta: Record<StopType, { label: string; emoji: string }> = {
  drive: { label: "On the road", emoji: "🚗" },
  coffee: { label: "Coffee", emoji: "☕" },
  food: { label: "Food", emoji: "🍽️" },
  activity: { label: "Activity", emoji: "✨" },
  beach: { label: "Beach", emoji: "🏖️" },
  stay: { label: "Airbnb", emoji: "🏡" },
  drinks: { label: "Drinks", emoji: "🍸" },
};
