"use client";

import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import IngredientPill from "@/components/IngredientPill/IngredientPill";
import {
  selectFavoritedFoods,
  selectFavoriteIngredients,
  clearFavorites,
  clearFavoriteIngredients,
} from "@/store/slices/favorites/favoritesSlice";
import FavoriteCategoryGroup from "@/components/FavoriteCategoryGroup/FavoriteCategoryGroup";
import StarIcon from "@/components/Icons/StarIcon";
import EmptyState from "@/components/EmptyState/EmptyState";
import type { FavoriteItem } from "@/lib/types/usda";
import styles from "./page.module.css";
import { selectUserRole } from "@/store/slices/user/userSlice";

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<"foods" | "ingredients">("foods");
  const dispatch = useAppDispatch();
  const favoritedFoods = useAppSelector(selectFavoritedFoods);
  const favoritedIngredients = useAppSelector(selectFavoriteIngredients);
  const role = useAppSelector(selectUserRole);

  const hasItems =
    activeTab === "foods"
      ? favoritedFoods.length > 0
      : (favoritedIngredients as string[]).length > 0;

  const handleClear = () => {
    if (activeTab === "foods") dispatch(clearFavorites());
    else dispatch(clearFavoriteIngredients());
  };

  const grouped: Record<string, FavoriteItem[]> = {};
  for (const item of favoritedFoods as FavoriteItem[]) {
    const key = item.foodCategory || "Uncategorized";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  }

  // Always render "Uncategorized" last
  const sorted = Object.entries(grouped).sort(([a], [b]) => {
    if (a === "Uncategorized") return 1;
    if (b === "Uncategorized") return -1;
    return a.localeCompare(b);
  });

  const isEmpty = favoritedFoods.length === 0;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Favorite Foods and Ingredients</h1>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "foods" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("foods")}
          >
            Foods · {(favoritedFoods as FavoriteItem[]).length}
          </button>
          <button
            className={`${styles.tab} ${activeTab === "ingredients" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("ingredients")}
          >
            Ingredients · {(favoritedIngredients as string[]).length}
          </button>
        </div>

        {hasItems && (
          <button className={styles.clearAllBtn} onClick={handleClear}>
            Clear all
          </button>
        )}

        {activeTab === "foods" ? (
          isEmpty ? (
            <EmptyState
              icon={<StarIcon size={48} />}
              title='No favorited foods yet'
              subtitle='Search for foods and tap the star icon to save them here.'
              action={{ label: "Search foods", href: "/search" }}
            />
          ) : (
            <div className={styles.groups}>
              {sorted.map(([category, items]) => (
                <FavoriteCategoryGroup
                  key={category}
                  category={category}
                  items={items}
                  isDietitian={role === "dietitian"}
                />
              ))}
            </div>
          )
        ) : (favoritedIngredients as string[]).length === 0 ? (
          <EmptyState
            icon={<StarIcon size={48} />}
            title='No saved ingredients yet'
            subtitle="Tap the star on any ingredient from a food's detail page."
          />
        ) : (
          <div className={styles.ingredientContainer}>
            <ul className={styles.ingredientList}>
              {(favoritedIngredients as string[]).map((name) => (
                <IngredientPill key={name} name={name} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
