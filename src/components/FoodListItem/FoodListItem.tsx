"use client";

import Link from "next/link";
import type { FoodItem } from "@/lib/types/usda";
import styles from "./FoodListItem.module.css";
import RightArrow from "../Icons/RightArrow";
import HeartIcon from "../Icons/HeartIcon";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectFavoriteIds,
  addFavorite,
  removeFavorite,
} from "@/store/slices/favoritesSlice";

interface FoodListItemProps {
  food: FoodItem;
}

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function FoodListItem({ food }: FoodListItemProps) {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(selectFavoriteIds);
  console.log("Favorite IDs:", favoriteIds);
  const isFavorited = favoriteIds.includes(food.fdcId);

  const serving =
    food.servingSize && food.servingSizeUnit
      ? `${food.servingSize}${food.servingSizeUnit.toLowerCase()}`
      : null;

  return (
    <Link href={`/food/${food.fdcId}`} className={styles.card}>
      <div className={styles.text}>
        <h3 className={styles.name}>
          {toTitleCase(food.brandName ?? food.description)}
        </h3>
        <p className={styles.meta}>
          {[food.brandOwner, food.foodCategory].filter(Boolean).join(" · ")}
        </p>
      </div>

      <div className={styles.right}>
        {serving && <span className={styles.serving}>{serving}</span>}
        <button
          className={styles.heartBtn}
          onClick={(e) => {
            e.preventDefault();
            if (isFavorited) {
              dispatch(removeFavorite(food.fdcId));
            } else {
              dispatch(addFavorite(food.fdcId));
            }
          }}
        >
          <HeartIcon isFavorited={isFavorited} />
        </button>
        <RightArrow className={styles.arrow} />
      </div>
    </Link>
  );
}
