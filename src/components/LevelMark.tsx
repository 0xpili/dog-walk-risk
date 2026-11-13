import type { Level } from "../data/apparentTempTable.ts";

type Props = {
  level: Level;
  label: string;
};

export function LevelIcon({ level }: { level: Level }) {
  if (level === "green") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <path d="M10 16.5 14.2 21 22 12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (level === "yellow") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 4.5 29 27.5H3L16 4.5Z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M16 13v7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="16" cy="23.2" r="1.3" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M11 3.5h10l7.5 7.5v10L21 28.5H11L3.5 21v-10L11 3.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M11 11l10 10M21 11 11 21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function LevelMark({ level, label }: Props) {
  return (
    <div className={`level-mark level-${level}`}>
      <LevelIcon level={level} />
      <span>{label}</span>
    </div>
  );
}
