"use client";

import StarIcon from "@/components/Icons/StarIcon";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectFavoriteIngredients,
  addFavoriteIngredient,
  removeFavoriteIngredient,
} from "@/store/slices/favorites/favoritesSlice";
import styles from "./IngredientPill.module.css";

interface IngredientPillProps {
  name: string;
}

export default function IngredientPill({ name }: IngredientPillProps) {
  const dispatch = useAppDispatch();
  const savedIngredients = useAppSelector(selectFavoriteIngredients);
  const isSaved =
    Array.isArray(savedIngredients) && savedIngredients.includes(name);

  return (
    <li className={`${styles.pill} ${isSaved ? styles.saved : ""}`}>
      <span className={styles.name}>{name}</span>
      <button
        className={styles.starBtn}
        onClick={(e) => {
          e.preventDefault();
          if (isSaved) {
            dispatch(removeFavoriteIngredient(name));
          } else {
            dispatch(addFavoriteIngredient(name));
          }
        }}
        aria-label={
          isSaved ? "Remove from saved ingredients" : "Save ingredient"
        }
      >
        <StarIcon isFavorited={isSaved} size={12} />
      </button>
    </li>
  );
}
