/** Quran API Client — يستخدم api.alquran.cloud كمصدر رئيسي */

const API_BASE = "https://api.alquran.cloud/v1";

export interface ApiAyah {
  number: number;          // الرقم العام في المصحف
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
}

export interface ApiSurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: ApiAyah[];
  edition: { identifier: string; language: string; name: string; type: string };
}

/** Helper مع caching على مستوى Next.js (revalidate يومياً) */
async function fetchAPI<T>(path: string, revalidate = 86400): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    next: { revalidate },
    headers: { "Accept": "application/json" },
  });
  if (!res.ok) throw new Error(`API error: ${res.status} on ${path}`);
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.status || "API failed");
  return json.data as T;
}

/** سورة كاملة بنص محدد (عثماني، ميسر، ترجمة، تفسير...) */
export async function getSurahByEdition(
  surahNum: number,
  edition: string = "quran-uthmani"
): Promise<ApiSurahData> {
  return fetchAPI<ApiSurahData>(`/surah/${surahNum}/${edition}`);
}

/** سورة بعدة "إصدارات" دفعة واحدة (نص + ترجمة + تفسير...) */
export async function getSurahMultiEdition(
  surahNum: number,
  editions: string[]
): Promise<ApiSurahData[]> {
  const eds = editions.join(",");
  return fetchAPI<ApiSurahData[]>(`/surah/${surahNum}/editions/${eds}`);
}

/** آية واحدة */
export async function getAyah(
  surah: number,
  ayah: number,
  edition: string = "quran-uthmani"
): Promise<ApiAyah & { surah: any }> {
  return fetchAPI(`/ayah/${surah}:${ayah}/${edition}`);
}

/** آية واحدة بعدة إصدارات (للمقارنة بين التفاسير) */
export async function getAyahMultiEdition(
  surah: number,
  ayah: number,
  editions: string[]
): Promise<Array<ApiAyah & { edition: any }>> {
  const eds = editions.join(",");
  return fetchAPI(`/ayah/${surah}:${ayah}/editions/${eds}`);
}

/** بحث في النص القرآني أو الترجمة */
export async function searchQuran(
  query: string,
  surahFilter: number | "all" = "all",
  edition: string = "ar"
): Promise<{ count: number; matches: Array<{ surah: any; numberInSurah: number; text: string; edition: any }> }> {
  const q = encodeURIComponent(query);
  return fetchAPI(`/search/${q}/${surahFilter}/${edition}`);
}
