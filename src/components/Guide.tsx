import { messages, type Lang } from "../lib/i18n.ts";

const sources = [
  {
    name: "Australian mushing regulations",
    detailEs:
      "Tabla de Temperatura Aparente. La usa el mushing australiano para perros de trabajo y deporte, con viento en cero. Es más estricta que la guía habitual para perros de casa: limita el esfuerzo bastante antes.",
    detailEn:
      "Apparent temperature chart used for Australian mushing, for working and sport dogs, with wind at zero. It is stricter than everyday pet advice and limits hard work earlier.",
  },
  {
    name: "Tufts TACC",
    href: "https://vermonthumane.org/wp-content/uploads/2016/02/TACC.pdf",
    detailEs:
      "Escala de seguridad meteorológica de Tufts (Animal Care and Condition). En calor, un perro mediano ya entra en zona insegura cerca de los 24 °C y en zona peligrosa cerca de los 27 °C. En frío, cerca de −7 °C (20 °F) el riesgo sube para perros chicos y medianos.",
    detailEn:
      "Tufts Animal Care and Condition weather safety scale. In heat, a medium dog is already in an unsafe band near 24 °C and a dangerous band near 27 °C. In cold, risk rises for small and medium dogs near −7 °C (20 °F).",
  },
  {
    name: "Dr Justine Lee",
    href: "https://drjustinelee.com/how-far-can-i-run-with-my-dog-dr-justine-lee/",
    detailEs:
      "Si la temperatura en °F más la humedad relativa pasa de 150, no conviene un esfuerzo fuerte. La regla sale de su trabajo con perros de trineo.",
    detailEn:
      "If temperature in °F plus relative humidity is over 150, skip hard exercise. The rule comes from her work with sled dogs.",
  },
  {
    name: "AAHA",
    detailEs:
      "Por encima de unos 26,7 °C (80 °F) el riesgo de calor ya es alto para ejercitar perros.",
    detailEn: "Above about 26.7 °C (80 °F), heat risk for exercising dogs is high.",
  },
  {
    name: "RSPCA, Dogs Trust, AVMA, BVA",
    detailEs:
      "Agua, sombra, no al mediodía, cuidado extra con hocico corto, y nunca en el auto. El piso caliente quema las patas.",
    detailEn:
      "Water, shade, avoid midday, extra care for short muzzles, and never a car. Hot pavement burns paws.",
  },
];

export function Guide({ lang }: { lang: Lang }) {
  const text = messages(lang);
  return (
    <>
      <section className="guide">
        <h2>{text.guideTitle}</h2>
        <details>
          <summary>{text.heatTitle}</summary>
          <p>{text.heatBreeds}</p>
          <ul>
            {text.heatSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </details>
        <details>
          <summary>{text.coldTitle}</summary>
          <p>{text.coldBreeds}</p>
          <ul>
            {text.coldSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </details>
      </section>
      <section className="info">
        <h2>{text.infoTitle}</h2>
        <ul>
          {sources.map((source) => (
            <li key={source.name}>
              {source.href ? (
                <a href={source.href} rel="noreferrer">
                  {source.name}
                </a>
              ) : (
                <strong>{source.name}</strong>
              )}
              <span>{lang === "es" ? source.detailEs : source.detailEn}</span>
            </li>
          ))}
        </ul>
        <p className="disclaimer">
          {lang === "es"
            ? "No reemplaza a tu veterinario. La tabla apunta a perros de trabajo y deporte, así que es más estricta que la guía para un perro de casa."
            : "This does not replace your vet. The chart is for working and sport dogs, so it is stricter than everyday pet guidance."}
        </p>
      </section>
    </>
  );
}
