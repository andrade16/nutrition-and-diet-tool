import type { FoodDetail, SearchResponse } from "@/lib/types/usda";

const BASE_URL = "https://api.nal.usda.gov/fdc/v1";
const USDA_API_KEY = process.env.USDA_API_KEY;

function buildUrl(endpoint: string, params: Record<string, string>): string {
  if (!USDA_API_KEY) {
    throw new Error("USDA_API_KEY is not set in environment variables");
  }

  const searchParams = new URLSearchParams({
    ...params,
    api_key: USDA_API_KEY!,
  });
  return `${BASE_URL}${endpoint}?${searchParams}`;
}

export async function searchFoods(
  query: string,
  page: number = 1,
  pageSize: number = 100,
): Promise<SearchResponse> {
  const url = buildUrl("/foods/search", {
    query,
    pageSize: String(pageSize),
    pageNumber: String(page),
    dataType: "Branded",
  });

  const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1 hr
  if (!res.ok)
    throw new Error(`USDA API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function getFoodById(fdcId: string): Promise<FoodDetail> {
  const url = buildUrl(`/food/${fdcId}`, {});

  const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1 hr
  if (!res.ok)
    throw new Error(`USDA API error: ${res.status} ${res.statusText}`);
  return res.json();
}
