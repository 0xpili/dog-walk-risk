import type { Level } from "../data/apparentTempTable.ts";
import { hourLabel, levelName, type Lang } from "../lib/i18n.ts";
import { assess } from "../lib/risk.ts";
import type { WeatherHour } from "../lib/weather.ts";
import { LevelIcon } from "./LevelMark.tsx";

type Props = {
  lang: Lang;
  hours: WeatherHour[];
  title: string;
};

export function ForecastStrip({ lang, hours, title }: Props) {
  return (
    <section className="forecast" aria-label={title}>
      <h2>{title}</h2>
      <div className="hours">
        {hours.map((hour) => {
          const result = assess(hour.tempC, hour.rh);
          const label = levelName(lang, result.level);
          return (
            <article key={hour.time} className={`hour level-${result.level as Level}`}>
              <p className="hour-time">{hourLabel(hour.time)}</p>
              <p className="hour-temp">
                {Math.round(hour.tempC)}°
              </p>
              <p className="hour-level">
                <LevelIcon level={result.level} />
                <span>{label}</span>
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
