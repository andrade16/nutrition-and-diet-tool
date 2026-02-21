"use client";

import Link from "next/link";
import type { FoodItem } from "@/lib/types/usda";
import styles from "./FoodListItem.module.css";
import RightArrow from "../Icons/RightArrow";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import { toTitleCase } from "@/lib/strings";
interface FoodListItemProps {
  food: FoodItem;
}

export default function FoodListItem({ food }: FoodListItemProps) {
  const serving =
    food.servingSize && food.servingSizeUnit
      ? `${food.servingSize}${food.servingSizeUnit.toLowerCase()}`
      : null;

  return (
    <Link href={`/food/${food.fdcId}`} className={styles.card}>
      <div className={styles.text}>
        <h3 className={styles.name}>{toTitleCase(food.description)}</h3>
        <p className={styles.meta}>
          {[food.brandOwner, food.foodCategory].filter(Boolean).join(" · ")}
        </p>
      </div>

      <div className={styles.right}>
        {serving && <span className={styles.serving}>{serving}</span>}
        <FavoriteButton
          food={food}
          className={styles.heartBtn}
          showLabel={false}
          iconSize={20}
        />
        <RightArrow className={styles.arrow} />
      </div>
    </Link>
  );
}
