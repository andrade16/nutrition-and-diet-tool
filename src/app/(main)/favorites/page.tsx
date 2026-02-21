"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { selectFavoritedFoods } from "@/store/slices/favoritesSlice";
import FavoriteCategoryGroup from "@/components/FavoriteCategoryGroup/FavoriteCategoryGroup";
import type { FavoriteItem } from "@/lib/types/usda";
import styles from "./page.module.css";

export default function FavoritesPage() {
  const favoritedFoods = useAppSelector(selectFavoritedFoods);

  // TODO: Implement grouping logic
  // Group favoritedFoods by foodCategory.
  // Items without a category should fall under "Uncategorized" at the end.
  // Expected shape: Record<string, FavoriteItem[]>
  const grouped: Record<string, FavoriteItem[]> = {};

  const isEmpty = favoritedFoods.length === 0;
  const groupEntries = Object.entries(grouped);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Saved Foods</h1>
        <p className={styles.subheading}>
          {isEmpty
            ? "Foods you save will appear here."
            : `${favoritedFoods.length} saved food${favoritedFoods.length !== 1 ? "s" : ""}`}
        </p>

        {isEmpty ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>♡</span>
            <p className={styles.emptyText}>No saved foods yet</p>
            <p className={styles.emptySubtext}>
              Search for foods and tap the heart icon to save them here.
            </p>
            <Link href="/search" className={styles.searchLink}>
              Search foods
            </Link>
          </div>
        ) : (
          <div className={styles.groups}>
            {groupEntries.map(([category, items]) => (
              <FavoriteCategoryGroup
                key={category}
                category={category}
                items={items}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
