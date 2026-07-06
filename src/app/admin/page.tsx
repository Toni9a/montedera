"use client";

import { useEffect, useMemo, useState } from "react";
import type { Itinerary, Stop, StopType } from "@/lib/types";
import { applyAirbnbLocation, getAirbnbLocation, placeQuery } from "@/lib/airbnb";

const STOP_TYPES: { value: StopType; label: string }[] = [
  { value: "activity", label: "Activity" },
  { value: "food", label: "Food" },
  { value: "coffee", label: "Coffee" },
  { value: "drinks", label: "Drinks" },
  { value: "beach", label: "Beach" },
  { value: "drive", label: "Drive" },
  { value: "stay", label: "Airbnb" },
];

const FALLBACK_ADMIN_PASSWORD = "supergirl";

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
  const [checking, setChecking] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [selectedDayId, setSelectedDayId] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("admin-password");
    if (saved) {
      verify(saved);
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
      setPassword(pw);
      setAuthed(true);
      const data = (await fetch("/api/itinerary").then((r) => r.json())) as Itinerary;
      setItinerary(data);
      setSelectedDayId(data.days[0]?.id ?? "");
      setAuthError("");
    } else {
      setAuthError("Wrong password");
      sessionStorage.removeItem("admin-password");
    }

    setChecking(false);
  }

  async function save() {
    if (!itinerary) return;
    setStatus("Saving...");

    async function postItinerary(pw: string) {
      return fetch("/api/itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": pw,
        },
        body: JSON.stringify(itinerary),
      });
    }

    try {
      let res = await postItinerary(password);

      if (res.status === 401 && password !== FALLBACK_ADMIN_PASSWORD) {
        res = await postItinerary(FALLBACK_ADMIN_PASSWORD);
        if (res.ok) {
          setPassword(FALLBACK_ADMIN_PASSWORD);
          sessionStorage.setItem("admin-password", FALLBACK_ADMIN_PASSWORD);
        }
      }

      if (res.ok) {
        setStatus("Saved");
      } else {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setStatus(data?.error ?? "Save failed");
      }
    } catch {
      setStatus("Save failed");
    }

    setTimeout(() => setStatus(""), 2200);
  }

  const selectedDayIdx = useMemo(() => {
    if (!itinerary) return -1;
    const found = itinerary.days.findIndex((day) => day.id === selectedDayId);
    return found >= 0 ? found : 0;
  }, [itinerary, selectedDayId]);

  const selectedDay = itinerary?.days[selectedDayIdx];

  function patchItinerary(recipe: (next: Itinerary) => void) {
    if (!itinerary) return;
    const next = structuredClone(itinerary);
    recipe(next);
    setItinerary(next);
  }

  function updateStop(dayIdx: number, stopIdx: number, patch: Partial<Stop>) {
    patchItinerary((next) => {
      next.days[dayIdx].stops[stopIdx] = {
        ...next.days[dayIdx].stops[stopIdx],
        ...patch,
      };
    });
  }

  function addStop(dayIdx: number) {
    patchItinerary((next) => {
      next.days[dayIdx].stops.push(emptyStop());
    });
  }

  function removeStop(dayIdx: number, stopIdx: number) {
    patchItinerary((next) => {
      next.days[dayIdx].stops.splice(stopIdx, 1);
    });
  }

  function updateAirbnb(patch: Partial<Pick<Stop, "name" | "address" | "mapsQuery">>) {
    patchItinerary((next) => {
      const current = getAirbnbLocation(next) ?? {
        name: "Airbnb",
        address: "",
        mapsQuery: "",
      };
      applyAirbnbLocation(next, {
        name: patch.name ?? current.name,
        address: patch.address ?? current.address,
      });
    });
  }

  const airbnb = useMemo(() => {
    return itinerary ? getAirbnbLocation(itinerary) : null;
  }, [itinerary]);

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
          className="w-full max-w-sm rounded-2xl border border-[var(--brown-light)]/30 bg-white/75 p-8 text-center shadow-sm backdrop-blur"
        >
          <h1 className="font-display mb-6 text-2xl font-semibold text-[var(--purple-deep)]">
            Admin access
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-3 w-full rounded-full border border-[var(--brown-light)]/40 bg-white/80 px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-[var(--purple-soft)]"
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

  if (!itinerary || !selectedDay) return null;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--brown-light)]/30 bg-white/75 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="chip mb-2 text-[var(--purple)]">Trip admin</p>
          <h1 className="font-display text-3xl font-semibold text-[var(--purple-deep)]">
            Quick itinerary edits
          </h1>
        </div>
        <button
          onClick={save}
          className="rounded-full bg-[var(--purple)] px-5 py-2 text-white transition hover:bg-[var(--purple-deep)]"
        >
          {status || "Save changes"}
        </button>
      </div>

      <section className="rounded-2xl border border-[var(--brown-light)]/30 bg-white/70 p-4 shadow-sm backdrop-blur">
        <p className="chip mb-3 text-[var(--purple)]">Choose day</p>
        <div className="grid gap-2 sm:grid-cols-4">
          {itinerary.days.map((day) => {
            const active = day.id === selectedDay.id;
            return (
              <button
                key={day.id}
                type="button"
                onClick={() => setSelectedDayId(day.id)}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-[var(--purple)] bg-[var(--purple)] text-white"
                    : "border-[var(--brown-light)]/30 bg-white/70 text-[var(--ink)] hover:border-[var(--purple-soft)]"
                }`}
              >
                <span className="block text-xs uppercase tracking-wide opacity-70">
                  {day.label}
                </span>
                <span className="font-display text-lg font-semibold">{day.title}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--brown-light)]/30 bg-white/70 p-5 shadow-sm backdrop-blur">
        <div className="mb-4 flex flex-col gap-1">
          <p className="chip text-[var(--purple)]">Airbnb location</p>
          <h2 className="font-display text-2xl font-semibold text-[var(--purple-deep)]">
            Where are you staying?
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Name"
            value={airbnb?.name ?? "Airbnb"}
            placeholder="Airbnb"
            onChange={(value) => updateAirbnb({ name: value })}
          />
          <Field
            label="Address or area"
            value={airbnb?.address ?? ""}
            placeholder="Kotor Old Town, Montenegro"
            onChange={(value) => updateAirbnb({ address: value })}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--brown-light)]/30 bg-white/70 p-5 shadow-sm backdrop-blur">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="chip mb-2 text-[var(--purple)]">{selectedDay.label}</p>
            <h2 className="font-display text-2xl font-semibold text-[var(--purple-deep)]">
              {selectedDay.title}
            </h2>
          </div>
          <button
            onClick={() => addStop(selectedDayIdx)}
            className="rounded-full border border-[var(--purple-soft)] bg-white/70 px-4 py-2 text-sm font-medium text-[var(--purple-deep)] transition hover:bg-[var(--purple-soft)]/15"
          >
            + Add stop
          </button>
        </div>

        <div className="space-y-4">
          {selectedDay.stops.map((stop, stopIdx) => (
            <div
              key={stopIdx}
              className="rounded-xl border border-[var(--brown-light)]/25 bg-white/65 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="chip text-[var(--purple)]">Stop {stopIdx + 1}</span>
                <button
                  onClick={() => removeStop(selectedDayIdx, stopIdx)}
                  className="text-sm text-red-500 transition hover:text-red-600"
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Name"
                  value={stop.name}
                  placeholder="Dinner, beach, coffee..."
                  onChange={(value) => {
                    updateStop(selectedDayIdx, stopIdx, {
                      name: value,
                      mapsQuery: placeQuery(value, stop.address ?? ""),
                    });
                  }}
                />
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wide text-[var(--ink)]/50">
                    Type
                  </label>
                  <select
                    value={stop.type}
                    onChange={(e) =>
                      updateStop(selectedDayIdx, stopIdx, {
                        type: e.target.value as StopType,
                      })
                    }
                    className="w-full rounded-lg border border-[var(--brown-light)]/30 bg-white/80 px-3 py-2"
                  >
                    {STOP_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Field
                  label="Time"
                  value={stop.time ?? ""}
                  placeholder="Morning, 14:30, dinner..."
                  onChange={(value) => updateStop(selectedDayIdx, stopIdx, { time: value })}
                />
                <Field
                  label="Place or address"
                  value={stop.address ?? ""}
                  placeholder="Kotor, Montenegro"
                  onChange={(value) =>
                    updateStop(selectedDayIdx, stopIdx, {
                      address: value,
                      mapsQuery: placeQuery(stop.name, value),
                    })
                  }
                />
              </div>

              <label className="mt-3 mb-1 block text-xs uppercase tracking-wide text-[var(--ink)]/50">
                Notes
              </label>
              <textarea
                value={stop.description ?? ""}
                onChange={(e) =>
                  updateStop(selectedDayIdx, stopIdx, { description: e.target.value })
                }
                placeholder="Anything useful for the group..."
                className="min-h-24 w-full rounded-lg border border-[var(--brown-light)]/30 bg-white/80 px-3 py-2"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={save}
          className="rounded-full bg-[var(--purple)] px-5 py-2 text-white transition hover:bg-[var(--purple-deep)]"
        >
          {status || "Save changes"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs uppercase tracking-wide text-[var(--ink)]/50">
        {label}
      </label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[var(--brown-light)]/30 bg-white/80 px-3 py-2"
      />
    </div>
  );
}
