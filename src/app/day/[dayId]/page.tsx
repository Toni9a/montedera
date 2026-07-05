import Link from "next/link";
import { notFound } from "next/navigation";
import { getItinerary } from "@/lib/data";
import { getDayWeather } from "@/lib/weather";
import DayNav from "@/components/DayNav";
import DayTimeline from "@/components/DayTimeline";
import { HouseIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function DayPage({
  params,
}: {
  params: Promise<{ dayId: string }>;
}) {
  const { dayId } = await params;
  const itinerary = getItinerary();
  const index = itinerary.days.findIndex((d) => d.id === dayId);

  if (index === -1) notFound();

  const day = itinerary.days[index];
  const prevDay = itinerary.days[index - 1];
  const nextDay = itinerary.days[index + 1];
  const weather = await getDayWeather(day.date);

  return (
    <div className="flex flex-1 flex-col">
      <DayNav days={itinerary.days} weather={weather} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8">
        <div className="mb-5 flex justify-end">
          <Link
            href="/trip"
            aria-label="Go home"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--brown-light)]/30 bg-white/85 text-[var(--purple-deep)] shadow-sm transition hover:bg-white"
          >
            <HouseIcon className="h-5 w-5" />
          </Link>
        </div>

        <DayTimeline day={day} index={index} />

        <div className="mt-12 flex items-center justify-between gap-3">
          {prevDay ? (
            <Link
              href={`/day/${prevDay.id}`}
              className="chip rounded-full border border-[var(--purple-soft)]/50 bg-white/85 px-4 py-2 text-[var(--purple-deep)] shadow-sm hover:bg-white"
            >
              ← {prevDay.label}
            </Link>
          ) : (
            <span />
          )}
          {nextDay ? (
            <Link
              href={`/day/${nextDay.id}`}
              className="chip rounded-full bg-[var(--purple-deep)] px-4 py-2 text-white hover:bg-[var(--purple)]"
            >
              {nextDay.label} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </main>
    </div>
  );
}
