"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DayPlan } from "@/lib/types";
import type { DayWeather } from "@/lib/weather";
import { weatherEmoji } from "@/lib/weather";
import { groceryNearMeUrl } from "@/lib/links";
import PhrasesPanel from "./PhrasesPanel";
import CurrencyConverter from "./CurrencyConverter";

export default function DayNav({
  days,
  weather,
}: {
  days: DayPlan[];
  weather?: DayWeather | null;
}) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-20 border-b border-[var(--brown-light)]/30 bg-[var(--cream)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 pt-3 sm:px-8">
        <Link
          href="/trip"
          className="chip shrink-0 rounded-full border border-[var(--brown-light)]/40 px-3 py-1.5 text-[var(--ink)]/60 hover:bg-white"
        >
          ✿ Trip
        </Link>

        <div className="flex shrink-0 gap-2">
          {days.map((day, i) => {
            const href = `/day/${day.id}`;
            const active = pathname === href;
            return (
              <Link
                key={day.id}
                href={href}
                className={`chip shrink-0 rounded-full px-3.5 py-1.5 transition ${
                  active
                    ? "bg-[var(--purple-deep)] text-white"
                    : "border border-[var(--purple-soft)]/50 text-[var(--purple-deep)] hover:bg-white"
                }`}
              >
                Day {i + 1}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flower-strip" />

      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3 sm:px-8">
        <a
          href={groceryNearMeUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="chip inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--brown)] px-3.5 py-1.5 text-white hover:bg-[var(--brown-deep)]"
        >
          🛒 Grocery near me
        </a>

        <PhrasesPanel />
        <CurrencyConverter />

        {weather && (
          <span className="chip inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--brown-light)]/40 px-3 py-1.5 text-[var(--ink)]/70">
            {weatherEmoji(weather.code)} {weather.minTemp}°–{weather.maxTemp}°C
          </span>
        )}

        <Link
          href="/admin"
          className="chip ml-auto shrink-0 text-[var(--ink)]/30 hover:text-[var(--ink)]/60"
        >
          admin
        </Link>
      </div>
    </div>
  );
}
