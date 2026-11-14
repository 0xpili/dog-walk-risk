import { exerciseCopy, walkCopy } from "../i18n/advice.ts";
import type { Level } from "../data/apparentTempTable.ts";
import {
  bestTimeLine,
  formatNumber,
  hourLabel,
  messages,
  shortLabel,
  type Lang,
} from "../lib/i18n.ts";
import { assess, type RiskResult } from "../lib/risk.ts";
import type { WalkResult } from "../lib/walk.ts";
import { assessWalk } from "../lib/walk.ts";
import type { WeatherHour } from "../lib/weather.ts";
import { ActivityIcon } from "./ActivityIcons.tsx";

const rank: Record<Level, number> = { green: 0, yellow: 1, red: 2 };

type Props = {
  lang: Lang;
  placeName: string;
  sport: RiskResult;
  walk: WalkResult;
  tempC: number;
  hours: WeatherHour[];
  saved: boolean;
  onSave: () => void;
};

export function NowScreen({ lang, placeName, sport, walk, tempC, hours, saved, onSave }: Props) {
  const text = messages(lang);
  const sportCopy = exerciseCopy(lang, sport);
  const walkText = walkCopy(lang, tempC, walk.level, walk.coldSide);
  const air = formatNumber(lang, sport.airC);
  const humidity = formatNumber(lang, sport.humidity);
  const feels = sport.apparentC === null ? null : formatNumber(lang, sport.apparentC);

  let bestIndex = 0;
  let bestRank = Number.POSITIVE_INFINITY;
  hours.forEach((hour, index) => {
    const sportLevel = assess(hour.tempC, hour.rh).level;
    const walkLevel = assessWalk(hour.tempC, hour.rh).level;
    const level = rank[sportLevel] >= rank[walkLevel] ? sportLevel : walkLevel;
    if (rank[level] < bestRank) {
      bestRank = rank[level];
      bestIndex = index;
    }
  });
  const best = hours[bestIndex];
  const bestLevel = best
    ? higher(assess(best.tempC, best.rh).level, assessWalk(best.tempC, best.rh).level)
    : "green";
  const when = best
    ? bestTimeLine(lang, bestLevel, bestIndex === 0, hourLabel(best.time))
    : null;

  return (
    <div className="now">
      <div className="place-line">
        <p className="place-name">{placeName}</p>
        {saved ? null : (
          <button type="button" className="text-btn" onClick={onSave}>
            {text.save}
          </button>
        )}
      </div>

      <div className="scores">
        <ScoreCard kind="walk" label={text.paseo} level={walk.level} title={walkText.title} tip={walkText.tip} />
        <ScoreCard kind="sport" label={text.ejercicio} level={sport.level} title={sportCopy.title} tip={sportCopy.tip} />
      </div>

      <div className={`stats ${feels === null ? "stats-two" : ""}`}>
        <p>
          <strong>{air}°</strong>
          <span>{text.air}</span>
        </p>
        <p>
          <strong>{humidity}%</strong>
          <span>{text.humidity}</span>
        </p>
        {feels === null ? null : (
          <p>
            <strong>{feels}°</strong>
            <span>{text.feels}</span>
          </p>
        )}
      </div>

      {when ? <p className="best">{when}</p> : null}
      {hours.length > 0 ? (
        <div className="hours" aria-label={when ?? text.tabs.now}>
          {hours.map((hour, index) => {
            const sportLevel = assess(hour.tempC, hour.rh).level;
            const walkLevel = assessWalk(hour.tempC, hour.rh).level;
            return (
              <div key={hour.time} className={`hour ${index === bestIndex ? "hour-best" : ""}`}>
                <p className="hour-time">{index === 0 ? text.tabs.now : hourLabel(hour.time)}</p>
                <p className="hour-temp">{Math.round(hour.tempC)}°</p>
                <HourMark kind="walk" label={text.paseo} level={walkLevel} word={shortLabel(lang, walkLevel)} />
                <HourMark kind="sport" label={text.ejercicio} level={sportLevel} word={shortLabel(lang, sportLevel)} />
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function higher(a: Level, b: Level): Level {
  return rank[a] >= rank[b] ? a : b;
}

function ScoreCard({
  kind,
  label,
  level,
  title,
  tip,
}: {
  kind: "walk" | "sport";
  label: string;
  level: Level;
  title: string;
  tip: string;
}) {
  return (
    <article className={`score score-${level}`}>
      <p className="score-kicker">
        <ActivityIcon name={kind} />
        <span>{label}</span>
      </p>
      <h2>
        <span className="dot" />
        <span>{title}</span>
      </h2>
      <p>{tip}</p>
    </article>
  );
}

function HourMark({
  kind,
  label,
  level,
  word,
}: {
  kind: "walk" | "sport";
  label: string;
  level: Level;
  word: string;
}) {
  return (
    <p className={`hour-level level-${level}`}>
      <ActivityIcon name={kind} />
      <span className="sr">{label}</span>
      <span>{word}</span>
    </p>
  );
}
