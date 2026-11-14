type Props = { name: "walk" | "sport" };

export function ActivityIcon({ name }: Props) {
  if (name === "walk") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="7.2" cy="4.6" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
        <path
          d="M7.1 6.4 6.2 11.2 4 16.4M6.2 11.2 9.6 13.4 8.6 18.2M6.5 8.4 10.2 7.6c2.4.3 4.4 1.1 6.4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="18" cy="7.4" r="1.35" fill="none" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="7.2" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 4.8c2.4 2.3 2.4 12.1 0 14.4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
