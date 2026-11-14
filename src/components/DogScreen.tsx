import { dogOptions, messages, type Lang } from "../lib/i18n.ts";
import type { DogKind } from "../lib/storage.ts";

type Props = {
  lang: Lang;
  dog: DogKind;
  onChange: (dog: DogKind) => void;
};

export function DogScreen({ lang, dog, onChange }: Props) {
  const text = messages(lang);
  return (
    <div className="panel">
      <h2 className="large-title">{text.tabs.dog}</h2>
      <p className="lead">{text.dogLead}</p>
      <div className="group" role="radiogroup" aria-label={text.tabs.dog}>
        {dogOptions(lang).map((option) => {
          const selected = option.id === dog;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className="row"
              onClick={() => onChange(option.id)}
            >
              <span className="row-copy">
                <strong>{option.title}</strong>
                <span>{option.detail}</span>
              </span>
              {selected ? (
                <svg className="check" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12.5 10 17.5 19 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span className="check-spacer" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
