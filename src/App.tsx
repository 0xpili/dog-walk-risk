import { useEffect, useMemo, useRef, useState } from "react";
import { ForecastStrip } from "./components/ForecastStrip.tsx";
import { Guide } from "./components/Guide.tsx";
import { ResultCard } from "./components/ResultCard.tsx";
import { messages, type Lang } from "./lib/i18n.ts";
import { assess } from "./lib/risk.ts";
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
}

function applyLang(lang: Lang) {
  document.documentElement.lang = lang === "es" ? "es" : "en";
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => loadLang());
  const [theme, setTheme] = useState<"light" | "dark">(() => loadTheme());
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

  const result = useMemo(
    () => (weather ? assess(weather.current.tempC, weather.current.rh) : null),
    [weather],
  );

  function choose(next: SavedPlace) {
    setWeather(null);
    setWeatherState("loading");
    setPlace(next);
    saveLastPlace(next);
    skipSearch.current = true;
    setQuery(next.name);
    setHits([]);
    setSearchState("idle");
    setGeoMessage(null);
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

  return (
    <div className="app">
      <header className="top">
        <div>
          <h1 className="wordmark">{text.title}</h1>
          <p className="tagline">{text.tagline}</p>
        </div>
        <div className="toggles">
          <button
            type="button"
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            aria-label={text.langLabel}
          >
            {text.langSwitch}
          </button>
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? text.themeToLight : text.themeToDark}
          >
            {theme === "dark" ? text.themeLight : text.themeDark}
          </button>
        </div>
      </header>

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
        <button type="button" className="locate" onClick={() => void locateMe()} disabled={locating}>
          {locating ? text.locateBusy : text.locate}
        </button>
      </form>

      {searchState === "loading" ? <p className="status">{text.searching}</p> : null}
      {searchState === "empty" ? <p className="status">{text.noCities}</p> : null}
      {searchState === "error" ? <p className="status error">{text.searchError}</p> : null}
      {geoMessage ? <p className="status error">{geoMessage}</p> : null}

      {query.trim().length >= 2 && hits.length > 0 ? (
        <ul className="hits">
          {hits.map((hit) => (
            <li key={hit.id}>
              <button type="button" onClick={() => chooseHit(hit)}>
                <strong>{hit.name}</strong>
                <span>{placeLabel(hit)}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {places.length > 0 ? (
        <div className="places">
          <p>{text.saved}</p>
          <div className="place-row">
            {places.map((item) => (
              <div key={item.id} className="place" data-active={place?.id === item.id}>
                <button type="button" className="pick" onClick={() => choose(item)}>
                  {item.name}
                </button>
                <button type="button" className="remove" aria-label={`${text.remove} ${item.name}`} onClick={() => removePlace(item.id)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {!place && weatherState !== "loading" ? <p className="empty">{text.empty}</p> : null}
      {weatherState === "loading" ? <p className="status">{text.reading}</p> : null}
      {weatherState === "error" ? <p className="status error">{text.weatherError}</p> : null}

      {place && result ? (
        <>
          <ResultCard lang={lang} placeName={place.detail ? `${place.name} · ${place.detail}` : place.name} result={result} />
          {alreadySaved ? null : (
            <button type="button" className="save" onClick={saveCurrent}>
              {text.save}
            </button>
          )}
          {weather && weather.hours.length > 0 ? (
            <ForecastStrip lang={lang} hours={weather.hours} title={text.forecast} />
          ) : null}
        </>
      ) : null}

      <Guide lang={lang} />
    </div>
  );
}
