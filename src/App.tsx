import { useEffect, useMemo, useRef, useState } from "react";
import { DogScreen } from "./components/DogScreen.tsx";
import { NowScreen } from "./components/NowScreen.tsx";
import { SourcesScreen } from "./components/SourcesScreen.tsx";
import { TabBar, type TabId } from "./components/TabBar.tsx";
import { messages, type Lang } from "./lib/i18n.ts";
import { assess } from "./lib/risk.ts";
import { assessWalk } from "./lib/walk.ts";
import {
  loadLang,
  loadLastPlace,
  loadPlaces,
  loadTheme,
  saveLang,
  saveLastPlace,
  savePlaces,
  saveTheme,
  type SavedPlace,
} from "./lib/storage.ts";
import { fetchWeather, placeLabel, reversePlace, searchCities, type GeoHit, type WeatherReport } from "./lib/weather.ts";

function applyTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  const color = theme === "dark" ? "#000000" : "#F2F2F7";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
}

function applyLang(lang: Lang) {
  document.documentElement.lang = lang === "es" ? "es" : "en";
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => loadLang());
  const [theme, setTheme] = useState<"light" | "dark">(() => loadTheme());
  const [tab, setTab] = useState<TabId>("now");
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<GeoHit[]>([]);
  const [searchState, setSearchState] = useState<"idle" | "loading" | "empty" | "error">("idle");
  const [places, setPlaces] = useState<SavedPlace[]>(() => loadPlaces());
  const [place, setPlace] = useState<SavedPlace | null>(() => loadLastPlace());
  const [weather, setWeather] = useState<WeatherReport | null>(null);
  const [weatherState, setWeatherState] = useState<"idle" | "loading" | "error">(() =>
    loadLastPlace() ? "loading" : "idle",
  );
  const [locating, setLocating] = useState(false);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);
  const skipSearch = useRef(false);

  const text = messages(lang);

  useEffect(() => {
    applyTheme(theme);
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    applyLang(lang);
    saveLang(lang);
  }, [lang]);

  useEffect(() => {
    const trimmed = query.trim();
    if (skipSearch.current) {
      skipSearch.current = false;
      return;
    }
    if (trimmed.length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setSearchState("loading");
      searchCities(trimmed, lang, controller.signal)
        .then((results) => {
          setHits(results);
          setSearchState(results.length ? "idle" : "empty");
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") return;
          setSearchState("error");
        });
    }, 280);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, lang]);

  useEffect(() => {
    if (!place) return;
    const controller = new AbortController();
    fetchWeather(place.latitude, place.longitude, controller.signal)
      .then((report) => {
        setWeather(report);
        setWeatherState("idle");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setWeatherState("error");
      });
    return () => controller.abort();
  }, [place]);

  const sport = useMemo(
    () => (weather ? assess(weather.current.tempC, weather.current.rh) : null),
    [weather],
  );
  const walk = useMemo(
    () => (weather ? assessWalk(weather.current.tempC, weather.current.rh) : null),
    [weather],
  );

  function choose(next: SavedPlace) {
    setWeather(null);
    setWeatherState("loading");
    setPlace(next);
    saveLastPlace(next);
    skipSearch.current = true;
    setQuery("");
    setHits([]);
    setSearchState("idle");
    setGeoMessage(null);
    setTab("now");
  }

  function chooseHit(hit: GeoHit) {
    choose({
      id: `city:${hit.id}`,
      name: hit.name,
      detail: placeLabel(hit),
      latitude: hit.latitude,
      longitude: hit.longitude,
    });
  }

  function saveCurrent() {
    if (!place) return;
    const next = [place, ...places.filter((item) => item.id !== place.id)].slice(0, 8);
    setPlaces(next);
    savePlaces(next);
  }

  function removePlace(id: string) {
    const next = places.filter((item) => item.id !== id);
    setPlaces(next);
    savePlaces(next);
  }

  async function locateMe() {
    setGeoMessage(null);
    if (!navigator.geolocation) {
      setGeoMessage(text.geoMissing);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        let name: string = text.here;
        let detail = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
        try {
          const hit = await reversePlace(latitude, longitude, new AbortController().signal);
          if (hit) {
            name = hit.name;
            detail = placeLabel(hit) || detail;
          }
        } catch {
          // Coordinates are enough when reverse geocoding is unavailable.
        }
        choose({
          id: `geo:${latitude.toFixed(3)},${longitude.toFixed(3)}`,
          name,
          detail,
          latitude,
          longitude,
        });
        setLocating(false);
      },
      () => {
        setGeoMessage(text.geoDenied);
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  const alreadySaved = place ? places.some((item) => item.id === place.id) : false;
  const showHits = query.trim().length >= 2 && hits.length > 0;
  const status =
    geoMessage ??
    (searchState === "error"
      ? text.searchError
      : searchState === "empty"
        ? text.noCities
        : searchState === "loading"
          ? text.searching
          : weatherState === "error"
            ? text.weatherError
            : weatherState === "loading"
              ? text.reading
              : null);

  return (
    <div className="app">
      <header className="nav">
        <h1>{text.app}</h1>
        <div className="nav-actions">
          <button type="button" className="icon-btn" onClick={() => setLang(lang === "es" ? "en" : "es")} aria-label={text.langLabel}>
            {text.langSwitch}
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? text.themeToLight : text.themeToDark}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      <main>
        {tab === "now" ? (
          <div className="panel" key="now">
            <form
              className="search"
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                if (hits[0]) chooseHit(hits[0]);
              }}
            >
              <label className="sr" htmlFor="city">
                {text.cityLabel}
              </label>
              <input
                id="city"
                value={query}
                placeholder={text.cityPlaceholder}
                autoComplete="off"
                enterKeyHint="search"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setHits([]);
                  setSearchState("idle");
                }}
              />
              <button type="button" className="locate" aria-label={text.locate} onClick={() => void locateMe()} disabled={locating}>
                <PinIcon />
              </button>
            </form>

            {status && !showHits ? <p className={geoMessage || searchState === "error" || weatherState === "error" ? "status error" : "status"}>{status}</p> : null}

            {showHits ? (
              <div className="group hits">
                {hits.map((hit) => (
                  <button key={hit.id} type="button" className="row" onClick={() => chooseHit(hit)}>
                    <span className="row-copy">
                      <strong>{hit.name}</strong>
                      <span>{placeLabel(hit)}</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : null}

            {places.length > 0 ? (
              <div className="saved">
                {places.map((item) => (
                  <div key={item.id} className={place?.id === item.id ? "chip chip-on" : "chip"}>
                    <button type="button" onClick={() => choose(item)}>
                      {item.name}
                    </button>
                    <button type="button" aria-label={`${text.remove} ${item.name}`} onClick={() => removePlace(item.id)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            {!place && !showHits && weatherState !== "loading" && !status ? <p className="empty">{text.empty}</p> : null}

            {place && sport && walk ? (
              <NowScreen
                lang={lang}
                placeName={place.name}
                sport={sport}
                walk={walk}
                tempC={weather?.current.tempC ?? sport.airC}
                hours={weather?.hours ?? []}
                saved={alreadySaved}
                onSave={saveCurrent}
              />
            ) : null}
          </div>
        ) : null}

        {tab === "dog" ? <DogScreen lang={lang} /> : null}
        {tab === "sources" ? <SourcesScreen lang={lang} /> : null}
      </main>

      <TabBar lang={lang} tab={tab} onChange={setTab} />
    </div>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="11" r="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 3.5A8 8 0 1 0 20.5 14 6.5 6.5 0 0 1 16 3.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
