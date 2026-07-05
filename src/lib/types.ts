export type StopType =
  | "drive"
  | "coffee"
  | "food"
  | "activity"
  | "beach"
  | "stay"
  | "drinks";

export interface Alternative {
  name: string;
  mapsQuery: string;
  note?: string;
}

export interface Stop {
  name: string;
  type: StopType;
  time?: string;
  description?: string;
  mapsQuery: string;
  address?: string;
  phone?: string;
  instagram?: string;
  image?: string;
  alternatives?: Alternative[];
}

export interface DayPlan {
  id: string;
  date: string;
  label: string;
  title: string;
  notes?: string;
  stops: Stop[];
}

export interface AirbnbLocation {
  name: string;
  address: string;
  mapsQuery: string;
}

export interface Itinerary {
  tripTitle: string;
  subtitle: string;
  heroImage?: string;
  airbnb?: AirbnbLocation;
  days: DayPlan[];
}
