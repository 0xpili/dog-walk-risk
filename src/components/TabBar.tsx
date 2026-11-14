import { messages, type Lang } from "../lib/i18n.ts";

export type TabId = "now" | "dog" | "sources";

type Props = {
  lang: Lang;
  tab: TabId;
  onChange: (tab: TabId) => void;
};

export function TabBar({ lang, tab, onChange }: Props) {
  const labels = messages(lang).tabs;
  const items: { id: TabId; icon: "now" | "dog" | "sources" }[] = [
    { id: "now", icon: "now" },
    { id: "dog", icon: "dog" },
    { id: "sources", icon: "sources" },
  ];
  return (
    <nav className="tabbar" aria-label={labels.now}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={tab === item.id ? "tab tab-on" : "tab"}
          aria-current={tab === item.id ? "page" : undefined}
          onClick={() => onChange(item.id)}
        >
          <TabIcon name={item.icon} />
          <span>{labels[item.id]}</span>
        </button>
      ))}
    </nav>
  );
}

function TabIcon({ name }: { name: "now" | "dog" | "sources" }) {
  if (name === "now") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "dog") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 10.5c0-2.8 1.8-5 4-5s4 2.2 4 5-1.8 6-4 6-4-3.2-4-6Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 9.2 7 6.2M15 9.2l2-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4.5h8.5L19 8v11.5H7v-15Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M15 4.8V8h3.2M9.5 12h5M9.5 15.5h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
