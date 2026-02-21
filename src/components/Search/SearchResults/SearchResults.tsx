import type { FoodItem } from "@/lib/types/usda";
import FoodListItem from "@/components/FoodListItem/FoodListItem";
import styles from "./SearchResults.module.css";
import Link from "next/link";

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
          {totalHits} results for &ldquo;{query}&rdquo;
        </p>
        <div className={styles.pagination}>
          <Link
            className={`${styles.pageLink} ${currentPage <= 1 ? styles.pageLinkDisabled : ""}`}
            href={`/search?query=${query}&page=${currentPage - 1}`}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
          >
            ← Prev
          </Link>
          <span className={styles.pageIndicator}>
            {currentPage} of {totalPages}
          </span>
          <Link
            className={`${styles.pageLink} ${currentPage >= totalPages ? styles.pageLinkDisabled : ""}`}
            href={`/search?query=${query}&page=${currentPage + 1}`}
            aria-disabled={currentPage >= totalPages}
            tabIndex={currentPage >= totalPages ? -1 : undefined}
          >
            Next →
          </Link>
        </div>
      </div>
      <ul className={styles.list}>
        {results.map((food) => (
          <li key={food.fdcId}>
            <FoodListItem food={food} />
          </li>
        ))}
      </ul>
    </div>
  );
}
