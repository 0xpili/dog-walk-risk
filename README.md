# Salimos?

A small, mobile-first check for dog owners: is a long walk or a dog sport a bad idea in this weather?

You search for a city or use your location. The app reads air temperature and relative humidity from [Open-Meteo](https://open-meteo.com/) (no key) and looks up an apparent temperature and a risk level.

## Risk table

Inside 5–22 °C the numbers and colours come from the **Australian mushing regulations** apparent-temperature chart (*Tabla de Temperatura Aparente*). Humidity runs from 0 to 100% in steps of 5, and air temperature from 5 to 22 °C. Wind is taken as zero. The chart is for **working and sport dogs**, so it is stricter than everyday pet advice: it limits hard work earlier than most pet guides.

There is no official URL stored here. The chart is the one published with those regulations (the ASSA temperature / humidity reference).

Above 22 °C the level never drops below the chart cell at 22 °C for the same humidity. It is raised when international guidance is stricter:

- Tufts Animal Care and Condition (TACC): at least caution above 22 °C, high risk from about 26.7 °C, and high risk at or below about −7 °C
- Dr Justine Lee’s rule: above 22 °C, temperature in °F plus relative humidity over 150 raises the level to high
- AAHA: at or above about 26.7 °C (80 °F) is high risk

Below 5 °C the heat chart does not apply. From 0 to 4 °C the app shows caution for small, short-coated, thin and older dogs. Below 0 °C the caution is for every dog. At or below about −7 °C the level is high risk.

## Run it

```bash
npm install
npm run dev
```

The dev server listens on port **43123**.

```bash
npm test
npm run build
```

The interface starts in Spanish (Argentine voseo). There is an English toggle, and a light / dark toggle. Saved places stay in `localStorage` on this device.

The walk and exercise icons are built from Font Awesome Free (`person-walking`, `person-running`, and `dog`), licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See the [Font Awesome Free license](https://fontawesome.com/license/free).
