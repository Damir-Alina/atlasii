import type { Region } from "@/types";

/**
 * Kazakhstan's 17 primary study regions used across UNT Geography prep
 * (14 oblasts + 3 cities of republican significance), each represented by
 * its administrative center.
 *
 * NOTE ON ACCURACY: coordinates are approximate city-level positions, good
 * enough for placing an interactive marker and flying the camera to it.
 * They are NOT precise administrative boundary polygons — real oblast
 * borders require a proper GeoJSON boundary dataset (e.g. GADM or Natural
 * Earth admin-1 level for Kazakhstan), which wasn't available to fetch in
 * this build environment. Swapping in real polygons later only touches
 * this file and the region-fill layer in `kazakhstan-map.tsx`; every
 * consumer of the `Region` type is unaffected.
 */
export const KAZAKHSTAN_REGIONS: Region[] = [
  {
    id: "astana",
    name: "Астана",
    capital: "город республиканского значения",
    lng: 71.449,
    lat: 51.169,
    fact: "Столица Казахстана с 1997 года, расположена на реке Ишим.",
  },
  {
    id: "almaty-city",
    name: "Алматы",
    capital: "город республиканского значения",
    lng: 76.889,
    lat: 43.238,
    fact: "Крупнейший город страны, бывшая столица, у подножия гор Заилийского Алатау.",
  },
  {
    id: "shymkent",
    name: "Шымкент",
    capital: "город республиканского значения",
    lng: 69.586,
    lat: 42.315,
    fact: "Один из древнейших городов Казахстана на Великом Шёлковом пути.",
  },
  {
    id: "akmola",
    name: "Акмолинская область",
    capital: "Кокшетау",
    lng: 69.393,
    lat: 53.284,
    fact: "Область на севере страны, богата озёрами и лесостепью.",
  },
  {
    id: "aktobe",
    name: "Актюбинская область",
    capital: "Актобе",
    lng: 57.167,
    lat: 50.283,
    fact: "Западная область на границе Европы и Азии по реке Урал.",
  },
  {
    id: "almaty-region",
    name: "Алматинская область",
    capital: "Талдыкорган",
    lng: 78.373,
    lat: 45.0,
    fact: "Граничит с Китаем и Кыргызстаном, включает озеро Балхаш.",
  },
  {
    id: "atyrau",
    name: "Атырауская область",
    capital: "Атырау",
    lng: 51.923,
    lat: 47.094,
    fact: "Расположена на стыке Европы и Азии, у Каспийского моря.",
  },
  {
    id: "west-kazakhstan",
    name: "Западно-Казахстанская область",
    capital: "Уральск",
    lng: 51.366,
    lat: 51.233,
    fact: "Граничит с Россией, крупная нефтегазовая провинция Карачаганак.",
  },
  {
    id: "zhambyl",
    name: "Жамбылская область",
    capital: "Тараз",
    lng: 71.366,
    lat: 42.9,
    fact: "Южная область с плодородными долинами и предгорьями Таласского Алатау.",
  },
  {
    id: "karaganda",
    name: "Карагандинская область",
    capital: "Караганда",
    lng: 73.087,
    lat: 49.806,
    fact: "Крупнейшая по площади область, центр угольной промышленности.",
  },
  {
    id: "kostanay",
    name: "Костанайская область",
    capital: "Костанай",
    lng: 63.628,
    lat: 53.214,
    fact: "Северная область, один из главных зерновых регионов страны.",
  },
  {
    id: "kyzylorda",
    name: "Кызылординская область",
    capital: "Кызылорда",
    lng: 65.502,
    lat: 44.848,
    fact: "Расположена в низовьях Сырдарьи, рядом — усыхающее Аральское море.",
  },
  {
    id: "mangystau",
    name: "Мангистауская область",
    capital: "Актау",
    lng: 51.2,
    lat: 43.65,
    fact: "Полуостров на Каспии с уникальными меловыми останцами плато Устюрт.",
  },
  {
    id: "pavlodar",
    name: "Павлодарская область",
    capital: "Павлодар",
    lng: 76.941,
    lat: 52.285,
    fact: "Промышленный регион на Иртыше на северо-востоке страны.",
  },
  {
    id: "north-kazakhstan",
    name: "Северо-Казахстанская область",
    capital: "Петропавловск",
    lng: 69.146,
    lat: 54.875,
    fact: "Самая северная область, зона лесостепи и берёзовых колков.",
  },
  {
    id: "turkestan",
    name: "Туркестанская область",
    capital: "Туркестан",
    lng: 68.251,
    lat: 43.297,
    fact: "Историческая область с мавзолеем Ходжи Ахмеда Ясави.",
  },
  {
    id: "east-kazakhstan",
    name: "Восточно-Казахстанская область",
    capital: "Усть-Каменогорск",
    lng: 82.628,
    lat: 49.948,
    fact: "Горная область на Алтае, богата полезными ископаемыми.",
  },
];

export function searchRegions(query: string): Region[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return KAZAKHSTAN_REGIONS.filter((region) =>
    region.name.toLowerCase().includes(normalized),
  );
}

/** Rough geographic center of Kazakhstan, used as the map's initial view. */
export const KAZAKHSTAN_CENTER: [number, number] = [67.0, 48.0];
export const KAZAKHSTAN_INITIAL_ZOOM = 4.2;
export const KAZAKHSTAN_BOUNDS: [[number, number], [number, number]] = [
  [43.0, 38.0],
  [92.0, 58.0],
];
