import type { Level } from "../data/apparentTempTable.ts";
import type { RiskResult } from "./risk.ts";

export type Lang = "es" | "en";

const copy = {
  es: {
    title: "¿Salimos?",
    tagline: "Si conviene un paseo largo o entrenar, ahora.",
    langSwitch: "EN",
    langLabel: "Cambiar a inglés",
    themeLight: "Claro",
    themeDark: "Oscuro",
    themeToLight: "Usar tema claro",
    themeToDark: "Usar tema oscuro",
    cityLabel: "Ciudad",
    cityPlaceholder: "Buenos Aires, Córdoba, Mendoza…",
    locate: "Mi ubicación",
    locateBusy: "Buscando…",
    searching: "Buscando ciudades…",
    noCities: "No encontramos esa ciudad. Probá con el nombre y el país.",
    searchError: "No pudimos buscar. Probá de nuevo en un rato.",
    geoDenied: "El navegador no nos dio la ubicación. Buscá la ciudad a mano.",
    geoMissing: "Este navegador no comparte la ubicación.",
    reading: "Leyendo el clima…",
    weatherError: "No pudimos leer el clima. Probá de nuevo en un rato.",
    empty: "Todavía no hay un lugar. Buscá una ciudad o usá tu ubicación.",
    save: "Guardar lugar",
    saved: "Lugares",
    remove: "Quitar",
    here: "Acá",
    levels: { green: "Bajo", yellow: "Precaución", red: "Alto riesgo" },
    apparent: "temperatura aparente",
    air: "Aire",
    humidity: "Humedad",
    rounded: (temp: string, rh: string) => `Para la tabla usamos ${temp} °C y ${rh}% de humedad.`,
    forecast: "Próximas horas",
    guideTitle: "Según el perro",
    heatTitle: "Calor: hocico corto y pelo denso",
    coldTitle: "Frío: chicos, pelo corto y flacos",
    heatBreeds:
      "Braquicéfalos: bulldog francés, bulldog inglés, pug, boxer, boston terrier, shih tzu, pekinés, cavalier. Pelo denso: husky, malamute, chow chow, samoyedo, akita, terranova, san bernardo.",
    heatSteps: [
      "Salí temprano o a la noche, no al mediodía.",
      "Llevá agua y ofrecésela seguido.",
      "Si el piso te quema la mano, le quema las patas.",
      "Si ronca o tiene el hocico corto, bajá mucho más la exigencia.",
      "Pará ante jadeo violento, tambaleo o encías muy rojas.",
      "Nunca lo dejes en el auto.",
    ],
    coldBreeds:
      "Chicos y de pelo corto o fino: chihuahua, galgo, whippet, pinscher, yorkshire, lebrel italiano, dálmata, weimaraner. También cachorros, perros mayores y los que están flacos.",
    coldSteps: [
      "Que se mueva: el frío quieto enfría más.",
      "Un abrigo ayuda al pelo corto, al chico y al mayor, si lo tolera.",
      "Secale las patas y la panza al volver.",
      "Revisá las almohadillas y sacale el hielo de entre los dedos.",
      "No lo dejes atado afuera.",
    ],
    infoTitle: "De dónde sale",
    advice: {
      heatGreen: "Podés hacer el paseo largo o el entrenamiento. Llevá agua y buscá sombra si el sol pega.",
      heatYellow: "Acortá la salida y bajá la intensidad. Pará si jadea de más, buscá sombra y ofrecé agua.",
      heatRed: "No lo hagas correr ni lo dejes en el auto. Una salida corta para que haga sus necesidades, a la sombra y con agua.",
      coldVulnerable:
        "Entre 0 y 4 °C, precaución sobre todo si es chico, de pelo corto, flaco o mayor. Un perro sano de doble capa suele bancarse una vuelta corta.",
      coldAll: "Bajo cero: precaución para todos. Acortá, fijate las patas y no lo dejes quieto afuera.",
      coldRed: "Riesgo alto de hipotermia. Salí lo mínimo, con abrigo si lo tolera, y volvé enseguida.",
    },
    notes: {
      aboveTable:
        "Por encima de 22 °C el riesgo no baja: se toma el nivel de la tabla a 22 °C para esta humedad y se sube si la guía internacional es más estricta.",
      belowTable: "Por debajo de 5 °C la tabla de calor no aplica. Esto es la guía de frío.",
    },
  },
  en: {
    title: "Heading out?",
    tagline: "Whether a long walk or a training session is wise, right now.",
    langSwitch: "ES",
    langLabel: "Switch to Spanish",
    themeLight: "Light",
    themeDark: "Dark",
    themeToLight: "Use light theme",
    themeToDark: "Use dark theme",
    cityLabel: "City",
    cityPlaceholder: "Buenos Aires, Córdoba, Mendoza…",
    locate: "My location",
    locateBusy: "Locating…",
    searching: "Searching cities…",
    noCities: "No city matched. Try the name and the country.",
    searchError: "Search failed. Try again in a moment.",
    geoDenied: "The browser did not share your location. Search for the city instead.",
    geoMissing: "This browser cannot share your location.",
    reading: "Reading the weather…",
    weatherError: "We could not read the weather. Try again in a moment.",
    empty: "No place yet. Search for a city or use your location.",
    save: "Save place",
    saved: "Places",
    remove: "Remove",
    here: "Here",
    levels: { green: "Low", yellow: "Caution", red: "High risk" },
    apparent: "apparent temperature",
    air: "Air",
    humidity: "Humidity",
    rounded: (temp: string, rh: string) => `The chart uses ${temp} °C and ${rh}% humidity.`,
    forecast: "Next hours",
    guideTitle: "It depends on the dog",
    heatTitle: "Heat: short muzzles and heavy coats",
    coldTitle: "Cold: small, short-coated, thin dogs",
    heatBreeds:
      "Brachycephalic: French bulldog, English bulldog, pug, boxer, Boston terrier, shih tzu, Pekingese, cavalier. Heavy coats: husky, malamute, chow chow, samoyed, akita, Newfoundland, Saint Bernard.",
    heatSteps: [
      "Go early or after dark, not at midday.",
      "Carry water and offer it often.",
      "If the pavement burns your hand, it burns their paws.",
      "If they snore or have a short muzzle, lower the effort a lot more.",
      "Stop for violent panting, wobbling, or brick-red gums.",
      "Never leave them in a car.",
    ],
    coldBreeds:
      "Small, short-coated or thin: chihuahua, greyhound, whippet, miniature pinscher, Yorkshire terrier, Italian greyhound, dalmatian, weimaraner. Also puppies, seniors, and underweight dogs.",
    coldSteps: [
      "Keep them moving. Standing still cools them faster.",
      "A coat helps a short coat, a small dog, or a senior, if they tolerate it.",
      "Dry paws and belly when you get home.",
      "Check pads and clear ice from between the toes.",
      "Do not leave them tied up outside.",
    ],
    infoTitle: "Where this comes from",
    advice: {
      heatGreen: "A long walk or a training session is reasonable. Bring water and use shade if the sun is strong.",
      heatYellow: "Shorten the outing and ease the pace. Stop if panting gets heavy, find shade, and offer water.",
      heatRed: "Do not make them run, and never leave them in a car. A short toilet break in the shade, with water, is enough.",
      coldVulnerable:
        "From 0 to 4 °C, take care if the dog is small, short-coated, thin, or old. A healthy double coat often manages a short loop.",
      coldAll: "Below freezing: caution for every dog. Keep it short, check the paws, and do not leave them standing outside.",
      coldRed: "High risk of hypothermia. Go out only as long as they need, with a coat if they tolerate one, and come straight back.",
    },
    notes: {
      aboveTable:
        "Above 22 °C the risk does not fall. We keep the chart level at 22 °C for this humidity, and raise it if the international guidance is stricter.",
      belowTable: "Below 5 °C the heat chart does not apply. This is the cold guidance.",
    },
  },
} as const;

export type Copy = (typeof copy)[Lang];

export function messages(lang: Lang): Copy {
  return copy[lang];
}

export function levelName(lang: Lang, level: Level): string {
  return copy[lang].levels[level];
}

export function adviceFor(lang: Lang, result: RiskResult): string {
  const text = copy[lang].advice;
  if (result.band === "cold") {
    if (result.level === "red") return text.coldRed;
    if (result.roundedTempC < 0) return text.coldAll;
    return text.coldVulnerable;
  }
  if (result.level === "red") return text.heatRed;
  if (result.level === "yellow") return text.heatYellow;
  return text.heatGreen;
}

export function bandNote(lang: Lang, result: RiskResult): string | null {
  if (result.band === "heat") return copy[lang].notes.aboveTable;
  if (result.band === "cold") return copy[lang].notes.belowTable;
  return null;
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
