import type { Level } from "../data/apparentTempTable.ts";
import type { DogKind } from "./storage.ts";

export type Lang = "es" | "en";

export type DogOption = {
  id: Exclude<DogKind, "normal">;
  title: string;
  examples: string;
  tip: string;
};

/** Reference tips by dog type, shown only on the Razas tab. */
const dogs: Record<Lang, readonly DogOption[]> = {
  es: [
    { id: "brachy", title: "Hocico corto", examples: "Bulldog, pug, boxer, shih tzu.", tip: "Sufren más el calor: sé más prudente en días cálidos." },
    { id: "youngOld", title: "Cachorro o mayor", examples: "Se cansa y se enfría más fácil.", tip: "Se cansan antes: acortá el paseo." },
    { id: "heavy", title: "Pelo largo y denso", examples: "Husky, chow, san bernardo.", tip: "Con tanto pelo, el calor le pega más: buscá horas frescas." },
    { id: "smallShort", title: "Chico o pelo corto", examples: "Chihuahua, galgo, whippet.", tip: "Sienten más el frío y el piso: acortá si hace falta." },
  ],
  en: [
    { id: "brachy", title: "Short muzzle", examples: "Bulldog, pug, boxer, shih tzu.", tip: "They suffer more in the heat: be more careful on warm days." },
    { id: "youngOld", title: "Puppy or senior", examples: "Tires and chills more easily.", tip: "They tire sooner: shorten the walk." },
    { id: "heavy", title: "Thick coat", examples: "Husky, chow, Saint Bernard.", tip: "With a coat that thick, heat hits harder: pick cooler hours." },
    { id: "smallShort", title: "Small or short coat", examples: "Chihuahua, greyhound, whippet.", tip: "They feel the cold and the pavement more: shorten it if you need to." },
  ],
};

const shortLevel: Record<Lang, Record<Level, string>> = {
  es: { green: "Bien", yellow: "Ojo", red: "No" },
  en: { green: "OK", yellow: "Easy", red: "No" },
};

const ui = {
  es: {
    app: "Salimos?",
    langSwitch: "EN",
    langLabel: "Cambiar a inglés",
    themeToLight: "Usar tema claro",
    themeToDark: "Usar tema oscuro",
    cityLabel: "Ciudad",
    cityPlaceholder: "Buscá una ciudad",
    locate: "Usar mi ubicación",
    locateBusy: "Buscando…",
    searching: "Buscando…",
    noCities: "No encontramos esa ciudad.",
    searchError: "No pudimos buscar. Probá de nuevo.",
    geoDenied: "No llegó la ubicación. Buscá la ciudad.",
    geoMissing: "Este teléfono no comparte la ubicación.",
    reading: "Mirando el clima…",
    weatherError: "No pudimos leer el clima.",
    empty: "Buscá tu ciudad o usá tu ubicación.",
    save: "Guardar",
    remove: "Quitar",
    here: "Acá",
    air: "Temperatura del aire",
    humidity: "Humedad",
    feels: "Para tu perro",
    tabs: { now: "Ahora", dog: "Razas", sources: "Fuentes" },
    dogLead: "Algunos perros sienten más el calor o el frío.",
    paseo: "Paseo",
    ejercicio: "Ejercicio",
    sourcesLead: "Paseo y ejercicio no usan la misma regla. El texto de las tarjetas es nuestro.",
    sourcesNote: "No reemplaza a tu veterinario.",
    iconCredit: "Íconos de Font Awesome Free, CC BY 4.0.",
    groupWeather: "Clima",
    groupWalk: "Paseo",
    groupSport: "Ejercicio",
    bestNowGood: "Ahora es un buen momento.",
    bestNowEasy: "Si salís, que sea ahora y corto.",
    bestNowBad: "En estas horas no mejora.",
    bestLater: (time: string) => `Mejor a las ${time}.`,
  },
  en: {
    app: "Heading out?",
    langSwitch: "ES",
    langLabel: "Switch to Spanish",
    themeToLight: "Use light theme",
    themeToDark: "Use dark theme",
    cityLabel: "City",
    cityPlaceholder: "Search for a city",
    locate: "Use my location",
    locateBusy: "Locating…",
    searching: "Searching…",
    noCities: "No city matched.",
    searchError: "Search failed. Try again.",
    geoDenied: "Location didn’t come through. Search for the city.",
    geoMissing: "This phone can’t share location.",
    reading: "Checking the weather…",
    weatherError: "Couldn’t read the weather.",
    empty: "Search for your city or use your location.",
    save: "Save",
    remove: "Remove",
    here: "Here",
    air: "Air temperature",
    humidity: "Humidity",
    feels: "For your dog",
    tabs: { now: "Now", dog: "Dog", sources: "Sources" },
    dogLead: "Some dogs feel heat or cold more than others.",
    paseo: "Walk",
    ejercicio: "Exercise",
    sourcesLead: "Walks and exercise don’t use the same rule. The card text is ours.",
    sourcesNote: "This doesn’t replace your vet.",
    iconCredit: "Icons from Font Awesome Free, CC BY 4.0.",
    groupWeather: "Weather",
    groupWalk: "Walk",
    groupSport: "Exercise",
    bestNowGood: "Now is a good time.",
    bestNowEasy: "If you go, make it now and short.",
    bestNowBad: "It doesn’t get better in these hours.",
    bestLater: (time: string) => `Better at ${time}.`,
  },
} as const;

export type SourceItem = {
  name: string;
  href?: string;
  detail: string;
  group: "weather" | "walk" | "sport";
};

const sources: Record<Lang, readonly SourceItem[]> = {
  es: [
    {
      group: "weather",
      name: "Open-Meteo",
      href: "https://open-meteo.com/",
      detail: "Temperatura, humedad y pronóstico por hora para tu ubicación, de servicios meteorológicos nacionales. Datos con licencia CC BY 4.0.",
    },
    {
      group: "walk",
      name: "Tufts TACC",
      href: "https://vermonthumane.org/wp-content/uploads/2016/02/TACC.pdf",
      detail: "Escala de clima de Tufts para un perro mediano o grande, al °F más cercano de a 5. 1–2 bajo, 3 precaución, 4–5 alto.",
    },
    {
      group: "walk",
      name: "Dr Justine Lee",
      href: "https://drjustinelee.com/how-far-can-i-run-with-my-dog-dr-justine-lee/",
      detail: "°F + humedad > 150 sube al menos a precaución; > 180 sube a alto. Nos quedamos con el nivel más alto entre esto y Tufts.",
    },
    {
      group: "sport",
      name: "Australian mushing regulations",
      detail: "De 5 a 22 °C la tabla fija el nivel y la sensación. Arriba de 22 °C no baja de esa celda, y sube a alto si °F + humedad > 150 o desde 26,7 °C. Debajo de 5 °C, precaución; a −7 °C o menos, alto.",
    },
  ],
  en: [
    {
      group: "weather",
      name: "Open-Meteo",
      href: "https://open-meteo.com/",
      detail: "Temperature, humidity, and the hourly forecast for your location, from national weather services. Data under CC BY 4.0.",
    },
    {
      group: "walk",
      name: "Tufts TACC",
      href: "https://vermonthumane.org/wp-content/uploads/2016/02/TACC.pdf",
      detail: "Tufts weather scale for a medium or large dog, at the nearest 5 °F. 1–2 low, 3 caution, 4–5 high.",
    },
    {
      group: "walk",
      name: "Dr Justine Lee",
      href: "https://drjustinelee.com/how-far-can-i-run-with-my-dog-dr-justine-lee/",
      detail: "°F + humidity over 150 is at least caution; over 180 is high. We keep the higher of this and Tufts.",
    },
    {
      group: "sport",
      name: "Australian mushing regulations",
      detail: "From 5 to 22 °C the chart sets the level and feels-like value. Above 22 °C it cannot fall below that cell, and it rises to high if °F + humidity is over 150 or from 26.7 °C. Below 5 °C, caution; at −7 °C or below, high.",
    },
  ],
};

export function dogOptions(lang: Lang): readonly DogOption[] {
  return dogs[lang];
}

export function sourceItems(lang: Lang): readonly SourceItem[] {
  return sources[lang];
}

export function messages(lang: Lang) {
  return ui[lang];
}

export function shortLabel(lang: Lang, level: Level): string {
  return shortLevel[lang][level];
}

export function bestTimeLine(lang: Lang, nowLevel: Level, bestIsNow: boolean, bestTime: string): string {
  const text = ui[lang];
  if (!bestIsNow) return text.bestLater(bestTime);
  if (nowLevel === "green") return text.bestNowGood;
  if (nowLevel === "yellow") return text.bestNowEasy;
  return text.bestNowBad;
}

export function formatNumber(lang: Lang, value: number): string {
  return new Intl.NumberFormat(lang === "es" ? "es-AR" : "en-GB", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function hourLabel(time: string): string {
  return time.slice(11, 16);
}
