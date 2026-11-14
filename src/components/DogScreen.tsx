import { dogOptions, messages, type Lang } from "../lib/i18n.ts";

export function DogScreen({ lang }: { lang: Lang }) {
  const text = messages(lang);
  return (
    <div className="panel">
      <h2 className="large-title">{text.tabs.dog}</h2>
      <p className="lead">{text.dogLead}</p>
      <div className="group">
        {dogOptions(lang).map((option) => (
          <div key={option.id} className="row">
            <span className="row-copy">
              <strong>{option.title}</strong>
              <span>{option.examples}</span>
              <span className="row-tip">{option.tip}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
