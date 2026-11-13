export type GeoHit = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
};

export type WeatherHour = {
  time: string;
  tempC: number;
  rh: number;
};

export type WeatherReport = {
  current: { time: string; tempC: number; rh: number };
  hours: WeatherHour[];
};

export function placeLabel(hit: Pick<GeoHit, "name" | "admin1" | "country">): string {
  return [hit.admin1, hit.country].filter(Boolean).join(", ");
}

export async function searchCities(name: string, lang: "es" | "en", signal: AbortSignal): Promise<GeoHit[]> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", name);
  url.searchParams.set("count", "6");
  url.searchParams.set("language", lang === "es" ? "es" : "en");
  url.searchParams.set("format", "json");
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("geocode");
  const data = (await response.json()) as { results?: GeoHit[] };
  return data.results ?? [];
}

export async function reversePlace(latitude: number, longitude: number, signal: AbortSignal): Promise<GeoHit | null> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/reverse");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("language", "es");
  url.searchParams.set("format", "json");
  const response = await fetch(url, { signal });
  if (!response.ok) return null;
  const data = (await response.json()) as { results?: GeoHit[] } | GeoHit;
  if ("results" in data && data.results?.[0]) return data.results[0];
  if ("name" in data && data.name) return data;
  return null;
}

export async function fetchWeather(latitude: number, longitude: number, signal: AbortSignal): Promise<WeatherReport> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", "temperature_2m,relative_humidity_2m");
  url.searchParams.set("hourly", "temperature_2m,relative_humidity_2m");
  url.searchParams.set("forecast_hours", "18");
  url.searchParams.set("timezone", "auto");
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("forecast");
  const data = (await response.json()) as {
    current?: { time: string; temperature_2m: number; relative_humidity_2m: number };
    hourly?: { time: string[]; temperature_2m: number[]; relative_humidity_2m: number[] };
  };
  if (!data.current || !data.hourly) throw new Error("forecast");
  const currentTime = data.current.time;
  const hours: WeatherHour[] = [];
  for (let index = 0; index < data.hourly.time.length; index += 1) {
    const time = data.hourly.time[index]!;
    if (time < currentTime) continue;
    hours.push({
      time,
      tempC: data.hourly.temperature_2m[index]!,
      rh: data.hourly.relative_humidity_2m[index]!,
    });
    if (hours.length === 12) break;
  }
  return {
    current: {
      time: currentTime,
      tempC: data.current.temperature_2m,
      rh: data.current.relative_humidity_2m,
    },
    hours,
  };
}
