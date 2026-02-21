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
          {currentPage > 1 && (
            <Link className={styles.pageLink} href={`/search?query=${query}&page=${currentPage - 1}`}>
              ← Prev
            </Link>
          )}
          <span className={styles.pageIndicator}>
            {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link className={styles.pageLink} href={`/search?query=${query}&page=${currentPage + 1}`}>
              Next →
            </Link>
          )}
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
