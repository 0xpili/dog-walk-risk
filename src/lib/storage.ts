export type SavedPlace = {
  id: string;
  name: string;
  detail: string;
  latitude: number;
  longitude: number;
};

const PLACES = "salimos.places";
const LAST = "salimos.last";
const LANG = "salimos.lang";
const THEME = "salimos.theme";

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function loadPlaces(): SavedPlace[] {
  const places = readJson<SavedPlace[]>(PLACES);
  return Array.isArray(places) ? places : [];
}

export function savePlaces(places: SavedPlace[]): void {
  localStorage.setItem(PLACES, JSON.stringify(places));
}

export function loadLastPlace(): SavedPlace | null {
  return readJson<SavedPlace>(LAST);
}

export function saveLastPlace(place: SavedPlace): void {
  localStorage.setItem(LAST, JSON.stringify(place));
}

export function loadLang(): "es" | "en" {
  return localStorage.getItem(LANG) === "en" ? "en" : "es";
}

export function saveLang(lang: "es" | "en"): void {
  localStorage.setItem(LANG, lang);
}

export function loadTheme(): "light" | "dark" {
  const stored = localStorage.getItem(THEME);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function saveTheme(theme: "light" | "dark"): void {
  localStorage.setItem(THEME, theme);
}
