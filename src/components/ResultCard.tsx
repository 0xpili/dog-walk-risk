import { adviceFor, bandNote, formatNumber, levelName, type Lang } from "../lib/i18n.ts";
import type { RiskResult } from "../lib/risk.ts";
import { LevelMark } from "./LevelMark.tsx";

type Props = {
  lang: Lang;
  placeName: string;
  result: RiskResult;
};

export function ResultCard({ lang, placeName, result }: Props) {
  const name = levelName(lang, result.level);
  const advice = adviceFor(lang, result);
  const note = bandNote(lang, result);
  const air = formatNumber(lang, result.airC);
  const humidity = formatNumber(lang, result.humidity);
  const roundedTemp = formatNumber(lang, result.roundedTempC);
  const roundedHumidity = formatNumber(lang, result.roundedHumidity);
  const apparent =
    result.apparentC === null ? null : formatNumber(lang, result.apparentC);
  const headline =
    apparent === null
      ? lang === "es"
        ? `${name}. Aire ${air} °C.`
        : `${name}. Air ${air} °C.`
      : lang === "es"
        ? `${name}. Temperatura aparente ${apparent} °C.`
        : `${name}. Apparent temperature ${apparent} °C.`;

  return (
    <section className={`result level-${result.level}`} aria-label={headline}>
      <p className="kicker">{placeName}</p>
      <LevelMark level={result.level} label={name} />
      {apparent !== null ? (
        <p className="apparent">
          <span className="num">{apparent}</span>
          <span className="deg">°C</span>
          <span className="apparent-label">
            {lang === "es" ? "temperatura aparente" : "apparent temperature"}
          </span>
        </p>
      ) : (
        <p className="apparent">
          <span className="num">{air}</span>
          <span className="deg">°C</span>
          <span className="apparent-label">{lang === "es" ? "aire" : "air"}</span>
        </p>
      )}
      <p className="meta">
        {lang === "es" ? "Aire" : "Air"} {air} °C · {lang === "es" ? "Humedad" : "Humidity"} {humidity}%
      </p>
      <p className="rounded">
        {lang === "es"
          ? `Para la tabla usamos ${roundedTemp} °C y ${roundedHumidity}% de humedad.`
          : `The chart uses ${roundedTemp} °C and ${roundedHumidity}% humidity.`}
      </p>
      <p className="advice">{advice}</p>
      {note ? <p className="note">{note}</p> : null}
    </section>
  );
}
