"use client";

import { useState } from "react";
import type { AirbnbLocation, Stop } from "@/lib/types";
import { hasAirbnbMaps } from "@/lib/airbnb";
import {
  googleMapsUrl,
  googleMapsDirectionsUrl,
  telUrl,
  instagramUrl,
  stopTypeMeta,
} from "@/lib/links";
import { HouseIcon, MapPinIcon } from "./icons";

export default function StopCard({ stop }: { stop: Stop }) {
  const meta = stopTypeMeta[stop.type];
  const [imageFailed, setImageFailed] = useState(false);
  const [showAlts, setShowAlts] = useState(false);
  const [localAirbnb, setLocalAirbnb] = useState<AirbnbLocation | null>(null);
  const showImage = Boolean(stop.image) && !imageFailed;
  const hasAlts = Boolean(stop.alternatives?.length);
  const mapsQuery = localAirbnb?.mapsQuery ?? stop.mapsQuery;
  const address = localAirbnb?.address ?? stop.address;
  const airbnbNeedsLocation =
    stop.type === "stay" && !hasAirbnbMaps(mapsQuery, address);

  async function setAirbnbFromCard() {
    const nextAddress = window.prompt("Airbnb address or area in Kotor");
    if (!nextAddress?.trim()) return;

    const res = await fetch("/api/airbnb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Airbnb", address: nextAddress.trim() }),
    });

    if (!res.ok) return;

    const data = (await res.json()) as { airbnb: AirbnbLocation };
    setLocalAirbnb(data.airbnb);
    window.open(googleMapsUrl(data.airbnb.mapsQuery), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[var(--brown-light)]/30 bg-white/55 shadow-sm backdrop-blur-sm transition hover:shadow-md">
      {showImage ? (
        <div className="h-40 w-full overflow-hidden sm:h-48">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={stop.image}
            alt={stop.name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        </div>
      ) : (
        <div className="flex h-28 w-full items-center justify-center bg-gradient-to-br from-[var(--purple-soft)]/30 to-[var(--brown-light)]/30 text-3xl">
          {meta.emoji}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="chip rounded-full bg-[var(--purple-deep)]/10 px-2.5 py-1 text-[var(--purple-deep)]">
            {meta.emoji} {meta.label}
          </span>
          {stop.time && (
            <span className="chip text-[var(--brown)]">{stop.time}</span>
          )}
        </div>

        <h3 className="font-display text-lg font-semibold leading-snug text-[var(--ink)]">
          {stop.name}
        </h3>

        {stop.description && (
          <p className="text-sm leading-relaxed text-[var(--ink)]/70">
            {stop.description}
          </p>
        )}
        {address && (
          <p className="text-xs text-[var(--ink)]/50">{address}</p>
        )}

        <div className="mt-2 flex flex-wrap gap-2">
          {airbnbNeedsLocation ? (
            <button
              type="button"
              onClick={setAirbnbFromCard}
              className="chip inline-flex items-center gap-1 rounded-full bg-[var(--purple)] px-3 py-1.5 text-white transition hover:bg-[var(--purple-deep)]"
            >
              <HouseIcon className="h-4 w-4" />
              Set Airbnb
            </button>
          ) : (
            <>
              <a
                href={googleMapsUrl(mapsQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="chip inline-flex items-center gap-1 rounded-full bg-[var(--purple)] px-3 py-1.5 text-white transition hover:bg-[var(--purple-deep)]"
              >
                <MapPinIcon className="h-4 w-4" />
                Maps
              </a>
              <a
                href={googleMapsDirectionsUrl(mapsQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="chip inline-flex items-center gap-1 rounded-full border border-[var(--purple)] px-3 py-1.5 text-[var(--purple-deep)] transition hover:bg-[var(--purple)]/10"
              >
                Route
              </a>
            </>
          )}
          {stop.phone && (
            <a
              href={telUrl(stop.phone)}
              className="chip inline-flex items-center gap-1 rounded-full bg-[var(--brown)] px-3 py-1.5 text-white transition hover:bg-[var(--brown-deep)]"
            >
              📞 Call
            </a>
          )}
          {stop.instagram && (
            <a
              href={instagramUrl(stop.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className="chip inline-flex items-center gap-1 rounded-full border border-[var(--purple-soft)] px-3 py-1.5 text-[var(--purple-deep)] transition hover:bg-[var(--purple-soft)]/15"
            >
              📸 Instagram
            </a>
          )}
        </div>

        {hasAlts && (
          <div className="mt-2 border-t border-dashed border-[var(--brown-light)]/40 pt-2">
            <button
              onClick={() => setShowAlts((v) => !v)}
              className="chip inline-flex items-center gap-1 text-[var(--brown)] hover:text-[var(--brown-deep)]"
            >
              {showAlts ? "▲" : "▼"} Not feeling it?
            </button>
            {showAlts && (
              <ul className="mt-2 flex flex-col gap-2">
                {stop.alternatives!.map((alt, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-2 rounded-lg bg-[var(--cream-alt)]/60 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--ink)]">
                        {alt.name}
                      </p>
                      {alt.note && (
                        <p className="text-xs text-[var(--ink)]/50">{alt.note}</p>
                      )}
                    </div>
                    <a
                      href={googleMapsUrl(alt.mapsQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chip shrink-0 rounded-full bg-[var(--purple)] px-2.5 py-1 text-white hover:bg-[var(--purple-deep)]"
                    >
                      📍
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
