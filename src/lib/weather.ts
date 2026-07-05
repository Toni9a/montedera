const KOTOR_LAT = 42.42;
const KOTOR_LON = 18.77;

export interface DayWeather {
  maxTemp: number;
  minTemp: number;
  code: number;
}

const WEATHER_EMOJI: Record<number, string> = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌦️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  71: "🌨️",
  73: "🌨️",
  75: "🌨️",
  80: "🌦️",
  81: "🌧️",
  82: "🌧️",
  95: "⛈️",
  96: "⛈️",
  99: "⛈️",
};

export function weatherEmoji(code: number): string {
  return WEATHER_EMOJI[code] ?? "🌤️";
}

export async function getDayWeather(date: string): Promise<DayWeather | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${KOTOR_LAT}&longitude=${KOTOR_LON}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Europe%2FPodgorica&start_date=${date}&end_date=${date}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    const idx = data.daily?.time?.indexOf(date);
    if (idx === undefined || idx === -1) return null;
    return {
      maxTemp: Math.round(data.daily.temperature_2m_max[idx]),
      minTemp: Math.round(data.daily.temperature_2m_min[idx]),
      code: data.daily.weathercode[idx],
    };
  } catch {
    return null;
  }
}
