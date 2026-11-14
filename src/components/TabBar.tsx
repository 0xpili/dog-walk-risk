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

/** Font Awesome Free solid icons (CC BY 4.0): clock, dog, file-lines. */
const tabIcons: Record<"now" | "dog" | "sources", { w: number; h: number; d: string }> = {
  now: { w: 512, h: 512, d: "M256 0a256 256 0 1 1 0 512 256 256 0 1 1 0-512zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" },
  dog: { w: 576, h: 512, d: "M32 112c16.6 0 30.2 12.6 31.8 28.7l.3 6.6C65.8 163.4 79.4 176 96 176l179.1 0 140.9 60.4 0 243.6c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-131.3C296 361 268.8 368 240 368s-56-7-80-19.3L160 480c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-245.6c-37.3-13.2-64-48.6-64-90.4 0-17.7 14.3-32 32-32zM355.8-32c7.7 0 14.9 3.6 19.6 9.8L392 0 444.1 0c12.7 0 24.9 5.1 33.9 14.1L496 32 552 32c13.3 0 24 10.7 24 24l0 24c0 44.2-35.8 80-80 80l-64 0-7 28-124.7-53.4 31.6-147.2C334.3-23.9 344.2-32 355.8-32zM448 44a20 20 0 1 0 0 40 20 20 0 1 0 0-40z" },
  sources: { w: 384, h: 512, d: "M0 64C0 28.7 28.7 0 64 0L213.5 0c17 0 33.3 6.7 45.3 18.7L365.3 125.3c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm208-5.5l0 93.5c0 13.3 10.7 24 24 24L325.5 176 208 58.5zM120 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z" },
};

function TabIcon({ name }: { name: "now" | "dog" | "sources" }) {
  const icon = tabIcons[name];
  return (
    <svg viewBox={`0 0 ${icon.w} ${icon.h}`} aria-hidden="true">
      <path d={icon.d} fill="currentColor" />
    </svg>
  );
}
