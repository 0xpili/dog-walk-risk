import { messages, sourceItems, type Lang } from "../lib/i18n.ts";

export function SourcesScreen({ lang }: { lang: Lang }) {
  const text = messages(lang);
  const items = sourceItems(lang);
  const groups = ["weather", "walk", "sport"] as const;
  const groupLabel = { weather: text.groupWeather, walk: text.groupWalk, sport: text.groupSport };

  return (
    <div className="panel">
      <h2 className="large-title">{text.tabs.sources}</h2>
      <p className="lead">{text.sourcesLead}</p>
      {groups.map((group) => (
        <section key={group}>
          <h3 className="group-label">{groupLabel[group]}</h3>
          <div className="group">
            {items
              .filter((source) => source.group === group)
              .map((source) => {
                const body = (
                  <span className="row-copy">
                    <strong>{source.name}</strong>
                    <span>{source.detail}</span>
                  </span>
                );
                return source.href ? (
                  <a key={source.name} className="row" href={source.href} rel="noreferrer">
                    {body}
                  </a>
                ) : (
                  <div key={source.name} className="row">
                    {body}
                  </div>
                );
              })}
          </div>
        </section>
      ))}
      <p className="footnote">{text.sourcesNote}</p>
      <p className="footnote">
        <a href="https://fontawesome.com/license/free" rel="noreferrer">
          {text.iconCredit}
        </a>
      </p>
    </div>
  );
}
