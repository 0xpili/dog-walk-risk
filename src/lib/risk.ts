import {
  APPARENT_C,
  HUMIDITIES,
  LEVELS,
  TEMPS_C,
  type Level,
} from "../data/apparentTempTable.ts";

export type RiskBand = "table" | "heat" | "cold";

export type RiskResult = {
  level: Level;
  /** Apparent °C from the chart, or a Steadman estimate above 22 °C. Null in the cold band. */
  apparentC: number | null;
  airC: number;
  humidity: number;
  roundedTempC: number;
  roundedHumidity: number;
  band: RiskBand;
};

const RANK: Record<Level, number> = { green: 0, yellow: 1, red: 2 };

export function roundTempC(tempC: number): number {
  return Math.round(tempC);
}

/** Nearest 5%, clamped to the chart's 0–100 range. */
export function roundHumidity(rh: number): number {
  const stepped = Math.round(rh / 5) * 5;
  return Math.min(100, Math.max(0, stepped));
}

function maxLevel(a: Level, b: Level): Level {
  return RANK[a] >= RANK[b] ? a : b;
}

function chartCell(tempC: number, rh: number): { apparentC: number; level: Level } {
  const t = TEMPS_C.findIndex((value) => value === tempC);
  const h = HUMIDITIES.findIndex((value) => value === rh);
  if (t < 0 || h < 0) {
    throw new Error(`Outside the chart: ${tempC} °C, ${rh}%`);
  }
  return { apparentC: APPARENT_C[h]![t]!, level: LEVELS[h]![t]! };
}

/**
 * Australian Bureau of Meteorology / Steadman apparent temperature, wind = 0.
 * Used only to extend the chart above 22 °C. Inside the chart, the table wins.
 */
export function steadmanApparentC(tempC: number, rh: number): number {
  const vapourPressure = (rh / 100) * 6.105 * Math.exp((17.27 * tempC) / (237.7 + tempC));
  return tempC + 0.33 * vapourPressure - 4;
}

function roundHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

/**
 * International heat floor, applied only when air temperature is above the chart.
 * Risk can rise above the 22 °C cell. It cannot fall.
 *
 * - From just over 22 °C: at least caution. Tufts TACC already scores medium dogs
 *   as potentially unsafe through the mid-70s °F, and RSPCA, Dogs Trust, AVMA
 *   and BVA treat that heat as a reason to shorten exercise.
 * - °F + relative humidity above 150: high risk (Dr Justine Lee).
 * - At or above about 26.7 °C (80 °F): high risk (AAHA; Tufts calls this dangerous).
 */
export function internationalHeatLevel(tempC: number, rh: number): Level {
  if (tempC >= 26.7) return "red";
  const fahrenheit = (tempC * 9) / 5 + 32;
  if (fahrenheit + rh > 150) return "red";
  if (tempC > 22) return "yellow";
  return "green";
}

/**
 * Cold guidance below the chart.
 * 0–4 °C: caution, aimed at small, short-coated, thin and older dogs.
 * Below 0 °C: caution for every dog.
 * At or below about −7 °C: high risk.
 */
export function coldLevel(roundedTempC: number): Level {
  if (roundedTempC <= -7) return "red";
  return "yellow";
}

export function assess(tempC: number, rh: number): RiskResult {
  const roundedTempC = roundTempC(tempC);
  const roundedHumidity = roundHumidity(rh);

  if (roundedTempC > 22) {
    const atChartEdge = chartCell(22, roundedHumidity);
    const level = maxLevel(atChartEdge.level, internationalHeatLevel(roundedTempC, roundedHumidity));
    const extrapolated = roundHalf(steadmanApparentC(roundedTempC, roundedHumidity));
    return {
      level,
      apparentC: Math.max(atChartEdge.apparentC, extrapolated),
      airC: tempC,
      humidity: rh,
      roundedTempC,
      roundedHumidity,
      band: "heat",
    };
  }

  if (roundedTempC < 5) {
    return {
      level: coldLevel(roundedTempC),
      apparentC: null,
      airC: tempC,
      humidity: rh,
      roundedTempC,
      roundedHumidity,
      band: "cold",
    };
  }

  const hit = chartCell(roundedTempC, roundedHumidity);
  return {
    level: hit.level,
    apparentC: hit.apparentC,
    airC: tempC,
    humidity: rh,
    roundedTempC,
    roundedHumidity,
    band: "table",
  };
}
