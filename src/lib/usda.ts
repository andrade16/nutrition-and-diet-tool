const BASE_URL = "https://api.nal.usda.gov/fdc/v1";

function buildUrl(endpoint: string, params: Record<string, string>): string {
  const key = process.env.USDA_API_KEY;
  if (!key) throw new Error("USDA_API_KEY is not set in environment variables");
  const searchParams = new URLSearchParams({ ...params, api_key: key });
  return `${BASE_URL}${endpoint}?${searchParams}`;
}

export async function searchFoods(query: string, pageSize = 10) {
  const url = buildUrl("/foods/search", {
    query,
    pageSize: String(pageSize),
    dataType: "Branded",
  });

  const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5 min
  if (!res.ok)
    throw new Error(`USDA API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function getFoodById(fdcId: string) {
  const url = buildUrl(`/food/${fdcId}`, {});

  const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1 hr — food data rarely changes
  if (!res.ok)
    throw new Error(`USDA API error: ${res.status} ${res.statusText}`);
  return res.json();
}
