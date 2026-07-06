import { redirect } from "next/navigation";
import { getItinerary } from "@/lib/data";

export const dynamic = "force-dynamic";

function todayInMontenegro(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Podgorica",
  }).format(new Date());
}

export default async function Home() {
  const itinerary = await getItinerary();
  const today = todayInMontenegro();
  const match = itinerary.days.find((d) => d.date === today);
  redirect(`/day/${(match ?? itinerary.days[0]).id}`);
}
