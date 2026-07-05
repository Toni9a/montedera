import type { DayPlan } from "@/lib/types";
import StopCard from "./StopCard";

export default function DayTimeline({ day, index }: { day: DayPlan; index: number }) {
  return (
    <section>
      <div className="mb-6 flex items-baseline gap-3">
        <span className="font-display text-4xl font-bold text-[var(--brown-light)]/60">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <p className="chip text-[var(--purple)]">{day.label}</p>
          <h1 className="font-display text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
            {day.title}
          </h1>
        </div>
      </div>

      {day.notes && (
        <p className="mb-4 text-sm italic text-[var(--ink)]/60">{day.notes}</p>
      )}

      <div className="mx-auto flex max-w-xl flex-col">
        {day.stops.map((stop, i) => (
          <div key={i} className="flex flex-col">
            <StopCard stop={stop} />
            {i < day.stops.length - 1 && (
              <div className="flex flex-col items-center py-1.5 text-[var(--purple-soft)]">
                <div className="h-4 w-px bg-[var(--brown-light)]/50" />
                <span className="text-lg leading-none">↓</span>
                <div className="h-4 w-px bg-[var(--brown-light)]/50" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
