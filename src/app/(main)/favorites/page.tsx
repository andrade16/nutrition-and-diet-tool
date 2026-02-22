"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import {
  selectFavoritedFoods,
  selectFavoriteIngredients,
} from "@/store/slices/favoritesSlice";
import FavoriteCategoryGroup from "@/components/FavoriteCategoryGroup/FavoriteCategoryGroup";
import StarIcon from "@/components/Icons/StarIcon";
import type { FavoriteItem } from "@/lib/types/usda";
import styles from "./page.module.css";

export default function FavoritesPage() {
  const favoritedFoods = useAppSelector(selectFavoritedFoods);
  const favoritedIngredients = useAppSelector(selectFavoriteIngredients);
  console.log("FAVORITED FOODS:", favoritedFoods);
  console.log("FAVORITED INGREDIENTS:", favoritedIngredients);

  const grouped: Record<string, FavoriteItem[]> = {};
  for (const item of favoritedFoods as FavoriteItem[]) {
    const key = item.foodCategory || "Uncategorized";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  }

  // always render "Uncategorized" last
  const sorted = Object.entries(grouped).sort(([a], [b]) => {
    if (a === "Uncategorized") return 1;
    if (b === "Uncategorized") return -1;
    return a.localeCompare(b);
  });

  const isEmpty = favoritedFoods.length === 0;

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
            <span className={styles.emptyIcon}>
              <StarIcon size={48} />
            </span>
            <p className={styles.emptyText}>No saved foods yet</p>
            <p className={styles.emptySubtext}>
              Search for foods and tap the star icon to save them here.
            </p>
            <Link href='/search' className={styles.searchLink}>
              Search foods
            </Link>
          </div>
        ) : (
          <div className={styles.groups}>
            {sorted.map(([category, items]) => (
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
