import type { Level } from "../data/apparentTempTable.ts";
import type { Lang } from "../lib/i18n.ts";
import type { RiskResult } from "../lib/risk.ts";
import type { DogKind } from "../lib/storage.ts";

/**
 * All user-facing advice: headlines, tips, and dog-type lines.
 * Edit this file to change the wording. Risk levels stay in src/lib/risk.ts.
 */
export const adviceCopy = {
  es: {
    green: {
      title: "Ideal",
      tip: "Disfruten el paseo. Llevá agua si van a estar mucho tiempo.",
    },
    yellow: {
      title: "Con cuidado",
      tip: "Hacé paseos más cortos y tranquilos, buscá sombra y llevá agua.",
    },
    heatRed: {
      title: "Mejor corto",
      tip: "Hoy evitá correr o hacer deporte. Elegí las horas más frescas, caminá por la sombra y evitá el asfalto caliente.",
    },
    cold: {
      title: "Hace frío",
      tip: "Los perros chicos, de pelo corto, cachorros o mayores sienten más el frío.",
    },
    coldHard: {
      title: "Mucho frío",
      tip: "Salí solo lo necesario, cuidale las patas del hielo y la sal, y abrigalo.",
    },
    dog: {
      brachy: "Los perros de hocico corto (bulldog, pug) sufren más el calor: sé más prudente.",
      youngOld: "Cachorros y perros mayores se cansan antes: acortá el paseo.",
      heavy: "Con tanto pelo, el calor le pega más: buscá horas frescas.",
      smallShort: "Los perros chicos o de pelo corto se resienten más con el frío y el piso: acortá si hace falta.",
    },
  },
  en: {
    green: {
      title: "Great",
      tip: "Enjoy the walk. Bring water if you’ll be out for a while.",
    },
    yellow: {
      title: "Take care",
      tip: "Keep the walks shorter and calmer, find shade, and bring water.",
    },
    heatRed: {
      title: "Keep it short",
      tip: "Skip running or sport today. Pick the cooler hours, walk in the shade, and avoid hot pavement.",
    },
    cold: {
      title: "Cold",
      tip: "Small, short-coated, young, or older dogs feel the cold more.",
    },
    coldHard: {
      title: "Very cold",
      tip: "Go out only as long as you need to, watch their paws for ice and salt, and put a coat on them.",
    },
    dog: {
      brachy: "Short-muzzled dogs (bulldogs, pugs) suffer more in the heat: be more careful.",
      youngOld: "Puppies and seniors tire sooner: shorten the walk.",
      heavy: "With a coat that thick, heat hits harder: pick cooler hours.",
      smallShort: "Small or short-coated dogs feel the cold and the pavement more: shorten it if you need to.",
    },
  },
} as const;

export type SpokenAdvice = {
  title: string;
  tip: string;
  dogLine: string | null;
};

/** Headline and tip for a walk, from the approved copy. */
export function walkCopy(lang: Lang, tempC: number, level: Level, coldSide: boolean): { title: string; tip: string } {
  const copy = adviceCopy[lang];
  if (coldSide && level !== "green") {
    return tempC < 0 ? copy.coldHard : copy.cold;
  }
  if (level === "red") return copy.heatRed;
  if (level === "yellow") return copy.yellow;
  return copy.green;
}

export function spokenAdvice(lang: Lang, result: RiskResult, dog: DogKind): SpokenAdvice {
  const copy = adviceCopy[lang];
  const heat = result.band !== "cold";
  const situation = !heat
    ? result.roundedTempC < 0
      ? copy.coldHard
      : copy.cold
    : result.level === "red"
      ? copy.heatRed
      : result.level === "yellow"
        ? copy.yellow
        : copy.green;

  let dogLine: string | null = null;
  if (dog === "youngOld") dogLine = copy.dog.youngOld;
  else if (dog === "smallShort") dogLine = copy.dog.smallShort;
  else if (heat && dog === "brachy") dogLine = copy.dog.brachy;
  else if (heat && dog === "heavy") dogLine = copy.dog.heavy;

  return { title: situation.title, tip: situation.tip, dogLine };
}
