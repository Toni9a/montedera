"use client";

import { useState } from "react";
import type { AirbnbLocation } from "@/lib/types";
import { googleMapsUrl } from "@/lib/links";
import { HouseIcon, MapPinIcon } from "./icons";

export default function AirbnbQuickAction({
  initialAirbnb,
}: {
  initialAirbnb: AirbnbLocation | null;
}) {
  const [airbnb, setAirbnb] = useState(initialAirbnb);
  const [editing, setEditing] = useState(!initialAirbnb);
  const [address, setAddress] = useState(initialAirbnb?.address ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function saveAirbnb() {
    const trimmed = address.trim();
    if (!trimmed) {
      setError("Add the Airbnb address or area first.");
      return;
    }

    setSaving(true);
    setError("");
    const res = await fetch("/api/airbnb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Airbnb", address: trimmed }),
    });

    if (!res.ok) {
      setSaving(false);
      setError("Could not save it. Try again.");
      return;
    }

    const data = (await res.json()) as { airbnb: AirbnbLocation };
    setAirbnb(data.airbnb);
    setEditing(false);
    setSaving(false);
    window.open(googleMapsUrl(data.airbnb.mapsQuery), "_blank", "noopener,noreferrer");
  }

  if (airbnb && !editing) {
    return (
      <a
        href={googleMapsUrl(airbnb.mapsQuery)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[var(--purple-deep)] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[var(--purple)]"
      >
        <HouseIcon className="h-4 w-4" />
        Airbnb
      </a>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-[var(--brown-light)]/30 bg-white/75 p-4 shadow-sm backdrop-blur">
      <div className="mb-3 flex items-center gap-2 text-[var(--purple-deep)]">
        <HouseIcon className="h-5 w-5" />
        <p className="font-display text-lg font-semibold">Set the Airbnb</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address or area in Kotor"
          className="min-w-0 flex-1 rounded-full border border-[var(--brown-light)]/30 bg-white/85 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--purple-soft)]"
        />
        <button
          type="button"
          onClick={saveAirbnb}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--purple)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--purple-deep)]"
        >
          <MapPinIcon className="h-4 w-4" />
          {saving ? "Saving..." : "Save & open"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
