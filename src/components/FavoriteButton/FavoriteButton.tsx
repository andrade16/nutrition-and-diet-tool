"use client";

import StarIcon from "@/components/Icons/StarIcon";
import { FoodItem, FavoriteItem } from "@/lib/types/usda";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectFavoritedFoods,
  addFavorite,
  removeFavorite,
} from "@/store/slices/favorites/favoritesSlice";

interface FavoriteButtonProps {
  food?: FoodItem;
  className?: string;
  showLabel?: boolean;
  iconSize?: number;
}

export default function FavoriteButton({
  food,
  className,
  showLabel = false,
  iconSize = 20,
}: FavoriteButtonProps) {
  const dispatch = useAppDispatch();
  const favoritedFoods = useAppSelector(selectFavoritedFoods);
  const isFavorited = favoritedFoods.some(
    (favoritedFood: FoodItem) => favoritedFood.fdcId === food?.fdcId,
  );

  if (!food) return null;

  return (
    <button
      className={className}
      onClick={(e) => {
        e.preventDefault();

        const favoriteItem: FavoriteItem = {
          fdcId: food.fdcId,
          description: food.description,
          brandName: food.brandName,
          brandOwner: food.brandOwner,
          foodCategory: food.foodCategory,
          servingSize: food.servingSize,
          servingSizeUnit: food.servingSizeUnit,
          dataType: food.dataType,
        };

        if (isFavorited) {
          dispatch(removeFavorite(favoriteItem.fdcId));
        } else {
          dispatch(addFavorite(favoriteItem));
        }
      }}
    >
      <StarIcon isFavorited={isFavorited} size={iconSize} />
      {showLabel && <span>{isFavorited ? "Saved" : "Save"}</span>}
    </button>
  );
}
