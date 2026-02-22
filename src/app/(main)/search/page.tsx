import { cookies } from "next/headers";
import SearchBar from "@/components/Search/SearchBar/SearchBar";
import SearchResults from "@/components/Search/SearchResults/SearchResults";
import styles from "./page.module.css";
import { searchFoods } from "@/lib/usda-api";

interface SearchPageProps {
  searchParams: Promise<{ query?: string; page?: number }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { query, page } = await searchParams;

  // Fall back to the last search cookie so results render in a single request
  const cookieStore = await cookies();
  const effectiveQuery = query || cookieStore.get("lastSearchQuery")?.value;

  const currentPage = Number(page) || 1;
  const data = effectiveQuery
    ? await searchFoods(effectiveQuery, currentPage)
    : null;

  const searchResults = data?.foods ?? [];
  const totalHits = data?.totalHits ?? 0;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Find Nutritional Info</h1>
        <p className={styles.subheading}>
          Search any food to see calories, macros, and more.
        </p>
        <SearchBar initialQuery={effectiveQuery} />
        <SearchResults
          results={searchResults}
          totalHits={totalHits}
          query={effectiveQuery}
          currentPage={currentPage}
          totalPages={data?.totalPages ?? 1}
        />
      </div>
    </div>
  );
}
