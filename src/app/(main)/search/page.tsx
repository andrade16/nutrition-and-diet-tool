import SearchBar from "@/components/Search/SearchBar";
import SearchResults from "@/components/Search/SearchResults/SearchResults";
import styles from "./page.module.css";
import { searchFoods } from "@/lib/usda";

interface SearchPageProps {
  searchParams: Promise<{ query?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { query } = await searchParams;

  const data = query ? await searchFoods(query) : null;

  const searchResults = data?.foods ?? [];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Find nutritional info</h1>
        <p className={styles.subheading}>
          Search any food to see calories, macros, and more.
        </p>
        <SearchBar initialQuery={query} />
        <SearchResults results={searchResults} query={query} />
      </div>
    </div>
  );
}
