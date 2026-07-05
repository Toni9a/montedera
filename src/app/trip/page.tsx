import Link from "next/link";
import AirbnbQuickAction from "@/components/AirbnbQuickAction";
import { getAirbnbLocation } from "@/lib/airbnb";
import { getItinerary } from "@/lib/data";
import { groceryNearMeUrl } from "@/lib/links";

export const dynamic = "force-dynamic";

export default function TripOverview() {
  const itinerary = getItinerary();
  const airbnb = getAirbnbLocation(itinerary);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={itinerary.heroImage}
            alt="Kotor Bay, Montenegro"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--purple-deep)]/70 via-[var(--purple-deep)]/50 to-[var(--cream)]" />
        </div>
        <div className="relative flex min-h-[70vh] flex-col items-center justify-end gap-4 px-6 pb-14 pt-24 text-center sm:min-h-[60vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon.png"
            alt="Girls trip logo"
            className="mb-1 h-24 w-24 rounded-full border border-white/70 bg-white/90 object-cover p-1 shadow-lg sm:h-28 sm:w-28"
          />
          <p className="chip text-[var(--gold)]">Girls Trip</p>
          <h1 className="font-display text-4xl font-bold text-white drop-shadow-sm sm:text-6xl">
            Dera &amp; Friends
          </h1>
          <p className="font-display text-xl italic text-white/90 sm:text-2xl">
            {itinerary.subtitle}
          </p>
          <div className="divider-flourish mt-2 w-48 text-white/80">✿</div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-5 py-12 sm:px-8">
        <AirbnbQuickAction initialAirbnb={airbnb} />

        <p className="chip text-center text-[var(--purple)]">Choose a day</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {itinerary.days.map((day, i) => (
            <Link
              key={day.id}
              href={`/day/${day.id}`}
              className="group flex items-center gap-4 rounded-2xl border border-[var(--brown-light)]/30 bg-white/70 p-4 shadow-sm transition hover:shadow-md"
            >
              <span className="font-display text-3xl font-bold text-[var(--brown-light)]/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="chip text-[var(--purple)]">{day.label}</p>
                <h2 className="font-display text-xl font-semibold text-[var(--ink)] group-hover:text-[var(--purple-deep)]">
                  {day.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>

        <a
          href={groceryNearMeUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="chip mt-2 inline-flex items-center justify-center gap-2 self-center rounded-full bg-[var(--brown)] px-4 py-2 text-white hover:bg-[var(--brown-deep)]"
        >
          🛒 Grocery near me
        </a>
      </main>

      <footer className="relative border-t border-[var(--brown-light)]/30 bg-white/50 px-6 py-6 text-center">
        <Link
          href="/admin"
          className="inline-block text-xs text-[var(--ink)]/30 hover:text-[var(--ink)]/60"
        >
          admin
        </Link>
      </footer>
    </div>
  );
}
