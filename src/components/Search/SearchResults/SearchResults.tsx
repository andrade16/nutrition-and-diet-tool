"use client";

import type { FoodItem } from "@/lib/types/usda";
import FoodListItem from "@/components/FoodListItem/FoodListItem";
import styles from "./SearchResults.module.css";

interface SearchResultsProps {
  results: FoodItem[];
  query?: string;
}

export default function SearchResults({ results, query }: SearchResultsProps) {
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
      <p className={styles.count}>
        {results.length} results for &ldquo;{query}&rdquo;
      </p>
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
