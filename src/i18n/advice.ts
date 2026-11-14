import type { Level } from "../data/apparentTempTable.ts";
import type { Lang } from "../lib/i18n.ts";
import type { RiskResult } from "../lib/risk.ts";

/**
 * All user-facing advice: headlines and tips.
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
      tip: "Hacé un paseo corto, en las horas más frescas. Caminá por la sombra y evitá el asfalto caliente.",
    },
    cold: {
      title: "Hace frío",
      tip: "Los perros chicos, de pelo corto, cachorros o mayores sienten más el frío.",
    },
    coldHard: {
      title: "Mucho frío",
      tip: "Salí solo lo necesario, cuidale las patas del hielo y la sal, y abrigalo.",
    },
    exercise: {
      green: "Buen momento para correr o jugar. Llevá agua y hacé pausas.",
      yellow: "Corré a ritmo suave y por menos tiempo. Hacé pausas a la sombra.",
      heatRed: "Hoy no es día para correr. Mejor un juego tranquilo y corto a la sombra.",
      cold: "Calentá unos minutos antes de correr y no lo dejes quieto mojado.",
      coldHard: "Corré poco y por superficies sin hielo. Cuidale las patas.",
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
      tip: "Take a short walk, in the cooler hours. Walk in the shade and avoid hot pavement.",
    },
    cold: {
      title: "Cold",
      tip: "Small, short-coated, young, or older dogs feel the cold more.",
    },
    coldHard: {
      title: "Very cold",
      tip: "Go out only as long as you need to, watch their paws for ice and salt, and put a coat on them.",
    },
    exercise: {
      green: "A good time to run or play. Bring water and take breaks.",
      yellow: "Run at an easy pace, and for less time. Take breaks in the shade.",
      heatRed: "Today isn’t a day for running. A short, calm game in the shade is better.",
      cold: "Warm up for a few minutes before running, and don’t leave them standing still while wet.",
      coldHard: "Run only a little, and stay off ice. Watch their paws.",
    },
  },
} as const;

type Situation = "green" | "yellow" | "heatRed" | "cold" | "coldHard";

function sportSituation(result: RiskResult): Situation {
  if (result.band === "cold") return result.roundedTempC < 0 ? "coldHard" : "cold";
  if (result.level === "red") return "heatRed";
  if (result.level === "yellow") return "yellow";
  return "green";
}

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

/** Exercise card: same short headlines, exercise-specific tips. */
export function exerciseCopy(lang: Lang, result: RiskResult): { title: string; tip: string } {
  const copy = adviceCopy[lang];
  const situation = sportSituation(result);
  return { title: copy[situation].title, tip: copy.exercise[situation] };
}
