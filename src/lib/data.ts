import fs from "fs";
import path from "path";
import type { Itinerary } from "./types";

const DATA_PATH = path.join(process.cwd(), "src", "data", "itinerary.json");
const ITINERARY_KEY = "montedera:itinerary";

type KvResponse<T> = {
  result?: T;
  error?: string;
};

function kvConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;
  return { url, token };
}

function isVercelRuntime() {
  return Boolean(process.env.VERCEL);
}

function getLocalItinerary(): Itinerary {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Itinerary;
}

async function kvCommand<T>(command: string[]) {
  const config = kvConfig();
  if (!config) return null;

  const res = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`KV request failed with ${res.status}`);
  }

  const data = (await res.json()) as KvResponse<T>;
  if (data.error) {
    throw new Error(data.error);
  }

  return data.result ?? null;
}

export async function getItinerary(): Promise<Itinerary> {
  if (kvConfig()) {
    const stored = await kvCommand<string>(["GET", ITINERARY_KEY]);
    if (stored) return JSON.parse(stored) as Itinerary;
  }

  return getLocalItinerary();
}

export async function saveItinerary(data: Itinerary): Promise<void> {
  if (kvConfig()) {
    await kvCommand<string>(["SET", ITINERARY_KEY, JSON.stringify(data)]);
    return;
  }

  if (isVercelRuntime()) {
    throw new Error(
      "Persistent storage is not configured. Add KV_REST_API_URL and KV_REST_API_TOKEN in Vercel."
    );
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}
