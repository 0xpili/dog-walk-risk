// Tabla de Temperatura Aparente (°C).
// Source of truth: Australian mushing regulations (ASSA apparent temperature chart).
// Humidity 0–100% step 5, air temperature 5–22 °C. Wind assumed 0.
// Each cell: apparent temperature and the chart colour (green / yellow / red).

export type Level = "green" | "yellow" | "red";

export const TEMPS_C = [
  5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
] as const;

export const HUMIDITIES = [
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
] as const;

/** Apparent °C, row = humidity index, column = temperature index. */
export const APPARENT_C: readonly (readonly number[])[] = [
  [1, 1, 3, 3, 4, 6, 6, 8, 8, 9, 11, 11, 12, 14, 14, 16, 17, 18],
  [1, 1, 3, 3, 4, 6, 6.5, 8, 8.5, 9.5, 11, 11.5, 12.5, 14, 14.5, 16, 17, 18],
  [1, 1.5, 3, 3.5, 4.5, 6, 6.5, 8, 8.5, 9.5, 11.5, 11.5, 12.5, 14.5, 15, 17, 18, 19],
  [1, 1.5, 3.5, 3.5, 4.5, 6.5, 6.5, 8.5, 9, 10, 11.5, 12, 13, 15, 15, 17, 18, 19],
  [1.5, 1.5, 3.5, 3.5, 5, 6.5, 7, 8.5, 9, 10, 12, 12.5, 13.5, 15, 15.5, 17, 18, 20],
  [1.5, 2, 3.5, 4, 5, 7, 7, 9, 9.5, 10.5, 12, 12.5, 13.5, 15.5, 16, 18, 19, 20],
  [1.5, 2, 4, 4, 5, 7, 7.5, 9, 9.5, 10.5, 12.5, 13.5, 14, 16, 16.5, 18, 19, 21],
  [1.5, 2, 4, 4.5, 5.5, 7, 7.5, 9.5, 10, 11, 13, 13.5, 14.5, 16.5, 16.5, 19, 20, 21],
  [2, 2.5, 4, 4.5, 5.5, 7.5, 8, 10, 10, 11.5, 13, 13.5, 14.5, 16.5, 17, 19, 20, 21],
  [2, 2.5, 4.5, 4.5, 6, 7.5, 8, 10, 10.5, 11.5, 13.5, 14, 15, 17, 17.5, 19, 21, 22],
  [2.5, 2.5, 4.5, 5, 6, 8, 8.5, 10, 10.5, 11.5, 13.5, 14, 15.5, 17.5, 18, 20, 21, 22],
  [2.5, 3, 4.5, 5, 6, 8, 8.5, 10.5, 11, 12, 14, 14.5, 16, 17.5, 18, 20, 22, 23],
  [2.5, 3, 5, 5.5, 6.5, 8, 9, 10.5, 11, 12.5, 14.5, 15, 16, 18, 18.5, 21, 22, 23],
  [2.5, 3, 5, 5.5, 6.5, 8.5, 9, 11, 11.5, 12.5, 14.5, 15, 16.5, 18.5, 19, 21, 22, 24],
  [3, 3.5, 5, 5.5, 7, 8.5, 9, 11, 11.5, 13, 15, 15.5, 17, 19, 19.5, 21, 23, 24],
  [3, 3.5, 5.5, 6, 7, 9, 9.5, 11.5, 12, 13, 16, 16, 17, 19, 20, 22, 23, 25],
  [3, 3.5, 5.5, 6, 7, 9, 9.5, 11.5, 12, 13.5, 16.5, 16, 17.5, 19.5, 20, 22, 24, 25],
  [3.5, 4, 5.5, 6, 7.5, 9.5, 10, 12, 12.5, 14, 16, 16.5, 18, 20, 20.5, 23, 24, 26],
  [3.5, 4, 6, 6.5, 7.5, 9.5, 10, 12, 12.5, 14, 16, 16.5, 18, 20, 21, 23, 25, 26],
  [3.5, 4, 6, 6.5, 8, 10, 10.5, 12.5, 13, 14.5, 16.5, 17, 18.5, 20.5, 21.5, 23, 25, 26],
  [4, 4.5, 6, 7, 8, 10, 10.5, 12.5, 13.5, 14.5, 17, 17.5, 19, 21, 21.5, 24, 25, 27],
];

/** Chart level, same indexing as APPARENT_C. */
export const LEVELS: readonly (readonly Level[])[] = [
  ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "yellow", "green", "green", "green", "green", "green", "green", "yellow"],
  ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "yellow", "green", "green", "green", "green", "green", "green", "yellow"],
  ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "yellow", "green", "green", "green", "green", "green", "green", "yellow"],
  ["green", "green", "green", "green", "green", "green", "green", "green", "green", "yellow", "yellow", "green", "green", "yellow", "green", "green", "yellow", "yellow"],
  ["green", "green", "green", "green", "green", "green", "green", "green", "green", "yellow", "yellow", "green", "green", "yellow", "green", "green", "yellow", "yellow"],
  ["green", "green", "green", "green", "green", "green", "green", "green", "green", "yellow", "yellow", "green", "green", "yellow", "green", "yellow", "yellow", "yellow"],
  ["green", "green", "green", "green", "green", "green", "green", "green", "green", "yellow", "yellow", "green", "green", "yellow", "green", "yellow", "yellow", "yellow"],
  ["green", "green", "green", "green", "green", "green", "green", "green", "yellow", "yellow", "yellow", "green", "green", "yellow", "green", "yellow", "yellow", "yellow"],
  ["green", "green", "green", "green", "green", "green", "green", "yellow", "yellow", "yellow", "yellow", "green", "green", "yellow", "green", "yellow", "yellow", "yellow"],
  ["green", "green", "green", "green", "green", "green", "green", "yellow", "yellow", "yellow", "yellow", "green", "yellow", "yellow", "green", "yellow", "yellow", "red"],
  ["green", "green", "green", "green", "green", "green", "green", "yellow", "yellow", "yellow", "yellow", "green", "yellow", "yellow", "yellow", "yellow", "yellow", "red"],
  ["green", "green", "green", "green", "green", "green", "green", "yellow", "yellow", "yellow", "yellow", "green", "yellow", "yellow", "yellow", "yellow", "red", "red"],
  ["green", "green", "green", "green", "green", "green", "green", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "red", "yellow", "yellow", "red", "red"],
  ["green", "green", "green", "green", "green", "green", "green", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "red", "yellow", "yellow", "red", "red"],
  ["green", "green", "green", "green", "green", "green", "green", "yellow", "yellow", "yellow", "red", "yellow", "yellow", "red", "yellow", "yellow", "red", "red"],
  ["green", "green", "green", "green", "green", "green", "green", "yellow", "yellow", "yellow", "red", "yellow", "yellow", "red", "yellow", "red", "red", "red"],
  ["green", "green", "green", "green", "green", "green", "green", "yellow", "yellow", "yellow", "red", "yellow", "yellow", "red", "yellow", "red", "red", "red"],
  ["green", "green", "green", "green", "green", "green", "yellow", "yellow", "yellow", "yellow", "red", "yellow", "red", "red", "yellow", "red", "red", "red"],
  ["green", "green", "green", "green", "green", "green", "yellow", "yellow", "yellow", "yellow", "red", "yellow", "red", "red", "yellow", "red", "red", "red"],
  ["green", "green", "green", "green", "green", "yellow", "yellow", "yellow", "yellow", "yellow", "red", "yellow", "red", "red", "yellow", "red", "red", "red"],
  ["green", "green", "green", "green", "green", "yellow", "yellow", "yellow", "yellow", "yellow", "red", "yellow", "red", "red", "yellow", "red", "red", "red"],
];
