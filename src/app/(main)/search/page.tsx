import SearchBar from "@/components/Search/SearchBar/SearchBar";
import SearchResults from "@/components/Search/SearchResults/SearchResults";
import styles from "./page.module.css";
import { searchFoods } from "@/lib/usda";

interface SearchPageProps {
  searchParams: Promise<{ query?: string; page: number }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { query, page } = await searchParams;

  const currentPage = Number(page) || 1;
  const data = query ? await searchFoods(query, currentPage) : null;
  console.log("DATA ===> ", data);

  const searchResults = data?.foods ?? [];
  const totalHits = data?.totalHits ?? 0;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Find nutritional info</h1>
        <p className={styles.subheading}>
          Search any food to see calories, macros, and more.
        </p>
        <SearchBar initialQuery={query} />
        <SearchResults
          results={searchResults}
          totalHits={totalHits}
          query={query}
          currentPage={currentPage}
          totalPages={data?.totalPages ?? 1}
        />
      </div>
    </div>
  );
}
