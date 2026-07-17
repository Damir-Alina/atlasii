import type { GeoObject, GeoObjectCategory } from "@/types";

import { KAZAKHSTAN_REGIONS } from "./regions";

/**
 * Approximate coordinates, same caveat as regions.ts: these are
 * representative points (a city on the river, a point on the lake shore,
 * a named peak), not precise cartographic data. Good enough for placing a
 * clickable marker and grading "did the student click near the right
 * feature" — not for cartographic accuracy.
 */
const CITIES: GeoObject[] = [
  {
    id: "city-semey",
    name: "Семей",
    category: "city",
    lng: 80.249,
    lat: 50.411,
    fact: "Город на Иртыше, бывшая столица Семипалатинской области.",
  },
  {
    id: "city-ekibastuz",
    name: "Экибастуз",
    category: "city",
    lng: 75.322,
    lat: 51.726,
    fact: "Центр угольного бассейна и крупных ГРЭС Казахстана.",
  },
  {
    id: "city-zhezkazgan",
    name: "Жезказган",
    category: "city",
    lng: 67.714,
    lat: 47.784,
    fact: "Центр медной промышленности в центральном Казахстане.",
  },
  {
    id: "city-balqash",
    name: "Балхаш",
    category: "city",
    lng: 74.995,
    lat: 46.843,
    fact: "Город на берегу одноимённого озера, центр медеплавильной отрасли.",
  },
  {
    id: "city-kentau",
    name: "Кентау",
    category: "city",
    lng: 68.507,
    lat: 43.51,
    fact: "Город в предгорьях Каратау на юге страны.",
  },
];

const RIVERS: GeoObject[] = [
  {
    id: "river-irtysh",
    name: "Иртыш",
    category: "river",
    lng: 77.5,
    lat: 52.5,
    fact: "Одна из крупнейших рек Казахстана, приток Оби, начинается на Алтае.",
  },
  {
    id: "river-ishim",
    name: "Есиль (Ишим)",
    category: "river",
    lng: 70.9,
    lat: 50.9,
    fact: "Река, на которой стоит Астана, приток Иртыша.",
  },
  {
    id: "river-ural",
    name: "Урал (Жайык)",
    category: "river",
    lng: 51.8,
    lat: 46.8,
    fact: "Условная граница Европы и Азии, впадает в Каспийское море.",
  },
  {
    id: "river-syrdarya",
    name: "Сырдарья",
    category: "river",
    lng: 64.5,
    lat: 45.2,
    fact: "Одна из крупнейших рек Средней Азии, впадает в Аральское море.",
  },
  {
    id: "river-ili",
    name: "Или",
    category: "river",
    lng: 77.07,
    lat: 43.85,
    fact: "Главный приток озера Балхаш, берёт начало в горах Китая.",
  },
];

const LAKES: GeoObject[] = [
  {
    id: "lake-balkhash",
    name: "Балхаш",
    category: "lake",
    lng: 75.5,
    lat: 46.6,
    fact: "Уникальное озеро: западная половина пресная, восточная — солёная.",
  },
  {
    id: "lake-alakol",
    name: "Алаколь",
    category: "lake",
    lng: 81.6,
    lat: 46.13,
    fact: "Солёное озеро на востоке страны, известное лечебными грязями.",
  },
  {
    id: "lake-zaysan",
    name: "Зайсан",
    category: "lake",
    lng: 84.0,
    lat: 47.9,
    fact: "Озеро на востоке Казахстана, часть Иртышского каскада водохранилищ.",
  },
  {
    id: "lake-tengiz",
    name: "Тенгиз",
    category: "lake",
    lng: 69.0,
    lat: 50.4,
    fact: "Бессточное солёное озеро, часть заповедника Коргалжын.",
  },
];

const MOUNTAINS: GeoObject[] = [
  {
    id: "mountain-khan-tengri",
    name: "Хан-Тенгри",
    category: "mountain",
    lng: 80.17,
    lat: 42.2,
    fact: "Одна из высочайших вершин Тянь-Шаня, символ природы Казахстана.",
  },
  {
    id: "mountain-zailiyskiy-alatau",
    name: "Заилийский Алатау",
    category: "mountain",
    lng: 77.05,
    lat: 43.05,
    fact: "Горный хребет над Алматы, часть северного Тянь-Шаня.",
  },
  {
    id: "mountain-karatau",
    name: "Каратау",
    category: "mountain",
    lng: 69.8,
    lat: 43.7,
    fact: "Горный хребет на юге страны, богат полезными ископаемыми.",
  },
  {
    id: "mountain-tarbagatai",
    name: "Тарбагатай",
    category: "mountain",
    lng: 83.0,
    lat: 47.4,
    fact: "Горный хребет на востоке, естественная граница с Китаем.",
  },
  {
    id: "mountain-ulytau",
    name: "Улытау",
    category: "mountain",
    lng: 66.95,
    lat: 48.65,
    fact: "Древние невысокие горы в центре Казахстана, колыбель казахской государственности.",
  },
];

const REGIONS_AS_GEO_OBJECTS: GeoObject[] = KAZAKHSTAN_REGIONS.map(
  (region) => ({
    id: region.id,
    name: region.name,
    category: "region" as const,
    lng: region.lng,
    lat: region.lat,
    fact: region.fact,
  }),
);

export const GEO_OBJECTS_BY_CATEGORY: Record<GeoObjectCategory, GeoObject[]> = {
  region: REGIONS_AS_GEO_OBJECTS,
  city: CITIES,
  river: RIVERS,
  lake: LAKES,
  mountain: MOUNTAINS,
};

export const CATEGORY_LABELS: Record<GeoObjectCategory, string> = {
  region: "Области",
  city: "Города",
  river: "Реки",
  lake: "Озёра",
  mountain: "Горы",
};

export const CATEGORY_QUESTION_PROMPTS: Record<GeoObjectCategory, string> = {
  region: "Найдите на карте область",
  city: "Найдите на карте город",
  river: "Найдите на карте реку",
  lake: "Найдите на карте озеро",
  mountain: "Найдите на карте горный объект",
};

export function getObjectsForCategories(
  categories: GeoObjectCategory[],
): GeoObject[] {
  return categories.flatMap((category) => GEO_OBJECTS_BY_CATEGORY[category]);
}
