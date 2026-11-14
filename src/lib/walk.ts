import type { Level } from "../data/apparentTempTable.ts";

/**
 * Walk score ("Paseo").
 *
 * Temperature comes from the Tufts TACC weather safety scale (Patronek, 1998;
 * diagonal chart in Animal Sheltering, July–August 1998). We read the
 * medium/large bar at the nearest 5 °F, using the standard table form of that
 * chart (small | medium/large | giant). Scores mean:
 * 1 no evidence of risk, 2 risk unlikely, 3 potentially unsafe,
 * 4 dangerous, 5 potentially life-threatening.
 *
 * We map 1–2 → low, 3 → caution, 4–5 → high. Point adjustments on the chart
 * (shade, water, coat, age) are not applied: they depend on the moment, not
 * the forecast.
 *
 * Humidity is Dr Justine Lee's rule, extended the way it is often cited:
 * °F + relative humidity > 150 → at least caution; > 180 → high.
 * The walk level is the higher of the Tufts level and this humidity level.
 */

const RANK: Record<Level, number> = { green: 0, yellow: 1, red: 2 };

/** Medium/large score by °F, in steps of 5, from 95 down to −30. */
const MEDIUM_LARGE: Readonly<Record<number, number>> = {
  95: 5,
  90: 5,
  85: 5,
  80: 4,
  75: 3,
  70: 2,
  65: 2,
  60: 1,
  55: 1,
  50: 1,
  45: 1,
  40: 1,
  35: 1,
  30: 2,
  25: 2,
  20: 3,
  15: 3,
  10: 3,
  5: 3,
  0: 3,
  [-5]: 3,
  [-10]: 4,
  [-15]: 4,
  [-20]: 4,
  [-25]: 5,
  [-30]: 5,
};

export type WalkResult = {
  level: Level;
  tuftsScore: number;
  humidityLevel: Level;
  /** Cold side of the Tufts chart (at or below 45 °F), used to pick the tip. */
  coldSide: boolean;
};

export function tempF(tempC: number): number {
  return (tempC * 9) / 5 + 32;
}

export function tuftsScore(tempC: number): number {
  const nearest = Math.round(tempF(tempC) / 5) * 5;
  const stepped = Math.min(95, Math.max(-30, nearest));
  return MEDIUM_LARGE[stepped] ?? 5;
}

export function scoreToLevel(score: number): Level {
  if (score >= 4) return "red";
  if (score >= 3) return "yellow";
  return "green";
}

/** Lee: °F + RH% > 150 caution, > 180 high. Otherwise low. */
export function humidityLevel(tempC: number, rh: number): Level {
  const sum = tempF(tempC) + rh;
  if (sum > 180) return "red";
  if (sum > 150) return "yellow";
  return "green";
}

function higher(a: Level, b: Level): Level {
  return RANK[a] >= RANK[b] ? a : b;
}

export function assessWalk(tempC: number, rh: number): WalkResult {
  const tufts = tuftsScore(tempC);
  const fromHumidity = humidityLevel(tempC, rh);
  return {
    level: higher(scoreToLevel(tufts), fromHumidity),
    tuftsScore: tufts,
    humidityLevel: fromHumidity,
    coldSide: tempF(tempC) <= 45,
  };
}
