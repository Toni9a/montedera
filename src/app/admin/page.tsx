"use client";

import { useEffect, useState } from "react";
import type { Alternative, Itinerary, Stop, StopType } from "@/lib/types";

const STOP_TYPES: StopType[] = [
  "drive",
  "coffee",
  "food",
  "activity",
  "beach",
  "stay",
  "drinks",
];

function emptyStop(): Stop {
  return {
    name: "",
    type: "activity",
    time: "",
    description: "",
    mapsQuery: "",
    address: "",
    phone: "",
    instagram: "",
    image: "",
  };
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [checking, setChecking] = useState(true);

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const saved = sessionStorage.getItem("admin-password");
    if (saved) {
      setPassword(saved);
      verify(saved);
    } else {
      setChecking(false);
    }
  }, []);

  async function verify(pw: string) {
    setChecking(true);
    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      sessionStorage.setItem("admin-password", pw);
      setAuthed(true);
      const data = await fetch("/api/itinerary").then((r) => r.json());
      setItinerary(data);
    } else {
      setAuthError("Wrong password");
      sessionStorage.removeItem("admin-password");
    }
    setChecking(false);
  }

  async function save() {
    if (!itinerary) return;
    setStatus("Saving...");
    const res = await fetch("/api/itinerary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify(itinerary),
    });
    setStatus(res.ok ? "Saved ✓" : "Failed to save");
    setTimeout(() => setStatus(""), 2000);
  }

  function updateStop(dayIdx: number, stopIdx: number, patch: Partial<Stop>) {
    if (!itinerary) return;
    const next = structuredClone(itinerary);
    next.days[dayIdx].stops[stopIdx] = {
      ...next.days[dayIdx].stops[stopIdx],
      ...patch,
    };
    setItinerary(next);
  }

  function addStop(dayIdx: number) {
    if (!itinerary) return;
    const next = structuredClone(itinerary);
    next.days[dayIdx].stops.push(emptyStop());
    setItinerary(next);
  }

  function removeStop(dayIdx: number, stopIdx: number) {
    if (!itinerary) return;
    const next = structuredClone(itinerary);
    next.days[dayIdx].stops.splice(stopIdx, 1);
    setItinerary(next);
  }

  function addAlternative(dayIdx: number, stopIdx: number) {
    if (!itinerary) return;
    const next = structuredClone(itinerary);
    const stop = next.days[dayIdx].stops[stopIdx];
    stop.alternatives = [
      ...(stop.alternatives ?? []),
      { name: "", mapsQuery: "", note: "" },
    ];
    setItinerary(next);
  }

  function updateAlternative(
    dayIdx: number,
    stopIdx: number,
    altIdx: number,
    patch: Partial<Alternative>
  ) {
    if (!itinerary) return;
    const next = structuredClone(itinerary);
    const alts = next.days[dayIdx].stops[stopIdx].alternatives;
    if (!alts) return;
    alts[altIdx] = { ...alts[altIdx], ...patch };
    setItinerary(next);
  }

  function removeAlternative(dayIdx: number, stopIdx: number, altIdx: number) {
    if (!itinerary) return;
    const next = structuredClone(itinerary);
    const stop = next.days[dayIdx].stops[stopIdx];
    stop.alternatives = (stop.alternatives ?? []).filter((_, i) => i !== altIdx);
    setItinerary(next);
  }

  function updateDayMeta(
    dayIdx: number,
    patch: Partial<{ label: string; title: string; date: string; notes: string }>
  ) {
    if (!itinerary) return;
    const next = structuredClone(itinerary);
    next.days[dayIdx] = { ...next.days[dayIdx], ...patch };
    setItinerary(next);
  }

  function updateHeader(patch: Partial<{ tripTitle: string; subtitle: string; heroImage: string }>) {
    if (!itinerary) return;
    const next = structuredClone(itinerary);
    Object.assign(next, patch);
    setItinerary(next);
  }

  if (checking) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-[var(--ink)]/60">
        Checking...
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-24">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            verify(password);
          }}
          className="w-full max-w-sm rounded-2xl border border-[var(--brown-light)]/30 bg-white/70 p-8 text-center shadow-sm"
        >
          <h1 className="font-display mb-6 text-2xl font-semibold text-[var(--purple-deep)]">
            Admin access
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-3 w-full rounded-full border border-[var(--brown-light)]/40 px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-[var(--purple-soft)]"
          />
          {authError && <p className="mb-3 text-sm text-red-500">{authError}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-[var(--purple)] px-4 py-2 text-white transition hover:bg-[var(--purple-deep)]"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  if (!itinerary) return null;

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-5 py-10 sm:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold text-[var(--purple-deep)]">
          Edit itinerary
        </h1>
        <button
          onClick={save}
          className="rounded-full bg-[var(--purple)] px-5 py-2 text-white transition hover:bg-[var(--purple-deep)]"
        >
          Save {status}
        </button>
      </div>

      <div className="mb-10 space-y-2 rounded-2xl border border-[var(--brown-light)]/30 bg-white/60 p-5">
        <label className="block text-xs uppercase tracking-wide text-[var(--ink)]/50">
          Trip title
        </label>
        <input
          value={itinerary.tripTitle}
          onChange={(e) => updateHeader({ tripTitle: e.target.value })}
          className="w-full rounded-lg border border-[var(--brown-light)]/30 px-3 py-2"
        />
        <label className="block text-xs uppercase tracking-wide text-[var(--ink)]/50">
          Subtitle
        </label>
        <input
          value={itinerary.subtitle}
          onChange={(e) => updateHeader({ subtitle: e.target.value })}
          className="w-full rounded-lg border border-[var(--brown-light)]/30 px-3 py-2"
        />
        <label className="block text-xs uppercase tracking-wide text-[var(--ink)]/50">
          Hero image URL
        </label>
        <input
          value={itinerary.heroImage ?? ""}
          onChange={(e) => updateHeader({ heroImage: e.target.value })}
          className="w-full rounded-lg border border-[var(--brown-light)]/30 px-3 py-2"
        />
      </div>

      <div className="space-y-12">
        {itinerary.days.map((day, dayIdx) => (
          <div key={day.id}>
            <div className="mb-4 space-y-2 rounded-2xl border border-[var(--brown-light)]/30 bg-white/60 p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-[var(--ink)]/50">
                    Day label
                  </label>
                  <input
                    value={day.label}
                    onChange={(e) => updateDayMeta(dayIdx, { label: e.target.value })}
                    className="w-full rounded-lg border border-[var(--brown-light)]/30 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-[var(--ink)]/50">
                    Day title
                  </label>
                  <input
                    value={day.title}
                    onChange={(e) => updateDayMeta(dayIdx, { title: e.target.value })}
                    className="w-full rounded-lg border border-[var(--brown-light)]/30 px-3 py-2"
                  />
                </div>
              </div>
              <label className="block text-xs uppercase tracking-wide text-[var(--ink)]/50">
                Notes
              </label>
              <input
                value={day.notes ?? ""}
                onChange={(e) => updateDayMeta(dayIdx, { notes: e.target.value })}
                className="w-full rounded-lg border border-[var(--brown-light)]/30 px-3 py-2"
              />
            </div>

            <div className="space-y-4">
              {day.stops.map((stop, stopIdx) => (
                <div
                  key={stopIdx}
                  className="rounded-2xl border border-[var(--brown-light)]/30 bg-white/50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="chip text-[var(--purple)]">
                      Stop {stopIdx + 1}
                    </span>
                    <button
                      onClick={() => removeStop(dayIdx, stopIdx)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field
                      label="Name"
                      value={stop.name}
                      onChange={(v) => updateStop(dayIdx, stopIdx, { name: v })}
                    />
                    <div>
                      <label className="block text-xs uppercase tracking-wide text-[var(--ink)]/50">
                        Type
                      </label>
                      <select
                        value={stop.type}
                        onChange={(e) =>
                          updateStop(dayIdx, stopIdx, {
                            type: e.target.value as StopType,
                          })
                        }
                        className="w-full rounded-lg border border-[var(--brown-light)]/30 px-3 py-2"
                      >
                        {STOP_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Field
                      label="Time"
                      value={stop.time ?? ""}
                      onChange={(v) => updateStop(dayIdx, stopIdx, { time: v })}
                    />
                    <Field
                      label="Google Maps search query"
                      value={stop.mapsQuery}
                      onChange={(v) => updateStop(dayIdx, stopIdx, { mapsQuery: v })}
                    />
                    <Field
                      label="Address"
                      value={stop.address ?? ""}
                      onChange={(v) => updateStop(dayIdx, stopIdx, { address: v })}
                    />
                    <Field
                      label="Phone"
                      value={stop.phone ?? ""}
                      onChange={(v) => updateStop(dayIdx, stopIdx, { phone: v })}
                    />
                    <Field
                      label="Instagram (handle or URL)"
                      value={stop.instagram ?? ""}
                      onChange={(v) => updateStop(dayIdx, stopIdx, { instagram: v })}
                    />
                    <Field
                      label="Image URL"
                      value={stop.image ?? ""}
                      onChange={(v) => updateStop(dayIdx, stopIdx, { image: v })}
                    />
                  </div>
                  <label className="mt-3 block text-xs uppercase tracking-wide text-[var(--ink)]/50">
                    Description
                  </label>
                  <textarea
                    value={stop.description ?? ""}
                    onChange={(e) =>
                      updateStop(dayIdx, stopIdx, { description: e.target.value })
                    }
                    className="w-full rounded-lg border border-[var(--brown-light)]/30 px-3 py-2"
                    rows={2}
                  />

                  <div className="mt-4 border-t border-dashed border-[var(--brown-light)]/40 pt-3">
                    <p className="chip mb-2 text-[var(--brown)]">Alternatives</p>
                    <div className="space-y-2">
                      {(stop.alternatives ?? []).map((alt, altIdx) => (
                        <div
                          key={altIdx}
                          className="grid grid-cols-1 gap-2 rounded-lg bg-[var(--cream-alt)]/50 p-3 sm:grid-cols-3"
                        >
                          <input
                            value={alt.name}
                            onChange={(e) =>
                              updateAlternative(dayIdx, stopIdx, altIdx, {
                                name: e.target.value,
                              })
                            }
                            placeholder="Name"
                            className="rounded-lg border border-[var(--brown-light)]/30 px-2 py-1.5 text-sm"
                          />
                          <input
                            value={alt.mapsQuery}
                            onChange={(e) =>
                              updateAlternative(dayIdx, stopIdx, altIdx, {
                                mapsQuery: e.target.value,
                              })
                            }
                            placeholder="Maps search query"
                            className="rounded-lg border border-[var(--brown-light)]/30 px-2 py-1.5 text-sm"
                          />
                          <div className="flex gap-2">
                            <input
                              value={alt.note ?? ""}
                              onChange={(e) =>
                                updateAlternative(dayIdx, stopIdx, altIdx, {
                                  note: e.target.value,
                                })
                              }
                              placeholder="Note"
                              className="w-full rounded-lg border border-[var(--brown-light)]/30 px-2 py-1.5 text-sm"
                            />
                            <button
                              onClick={() => removeAlternative(dayIdx, stopIdx, altIdx)}
                              className="shrink-0 text-xs text-red-500 hover:underline"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => addAlternative(dayIdx, stopIdx)}
                      className="chip mt-2 rounded-full border border-[var(--purple-soft)] px-3 py-1 text-[var(--purple-deep)] hover:bg-[var(--purple-soft)]/15"
                    >
                      + Add alternative
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addStop(dayIdx)}
                className="chip rounded-full border border-[var(--purple-soft)] px-4 py-2 text-[var(--purple-deep)] hover:bg-[var(--purple-soft)]/15"
              >
                + Add stop
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-end">
        <button
          onClick={save}
          className="rounded-full bg-[var(--purple)] px-5 py-2 text-white transition hover:bg-[var(--purple-deep)]"
        >
          Save {status}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-[var(--ink)]/50">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[var(--brown-light)]/30 px-3 py-2"
      />
    </div>
  );
}
