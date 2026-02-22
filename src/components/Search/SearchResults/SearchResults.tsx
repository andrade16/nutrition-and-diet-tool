import type { FoodItem } from "@/lib/types/usda";
import FoodListItem from "@/components/FoodListItem/FoodListItem";
import styles from "./SearchResults.module.css";
import { formatNumber } from "@/lib/pagination";
import Pagination from "@/components/Pagination/Pagination";

interface SearchResultsProps {
  results: FoodItem[];
  totalHits: number;
  query?: string;
  currentPage: number;
  totalPages: number;
}

export default function SearchResults({
  results,
  totalHits,
  query,
  currentPage,
  totalPages,
}: SearchResultsProps) {
  if (!query) return null;

  if (results.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>
          No results for &ldquo;{query}&rdquo;
        </p>
        <p className={styles.emptyHint}>
          Try a different name or check the spelling.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <p className={styles.count}>
          {formatNumber(totalHits)} results for &ldquo;{query}&rdquo;
        </p>
      </div>
      <ul className={styles.list}>
        {results.map((food) => (
          <li key={food.fdcId}>
            <FoodListItem food={food} />
          </li>
        ))}
      </ul>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={totalHits}
        baseUrl={`/search?query=${encodeURIComponent(query)}`}
        pageSize={100}
      />
    </div>
  );
}
