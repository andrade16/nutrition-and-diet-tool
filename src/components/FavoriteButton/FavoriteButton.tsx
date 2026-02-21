"use client";

import HeartIcon from "@/components/Icons/HeartIcon";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectFavoriteIds,
  addFavorite,
  removeFavorite,
} from "@/store/slices/favoritesSlice";

interface FavoriteButtonProps {
  fdcId: number;
  className?: string;
  showLabel?: boolean;
  iconSize?: number;
}

export default function FavoriteButton({
  fdcId,
  className,
  showLabel = false,
  iconSize = 20,
}: FavoriteButtonProps) {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(selectFavoriteIds);
  const isFavorited = favoriteIds.includes(fdcId);

  return (
    <button
      className={className}
      onClick={(e) => {
        e.preventDefault();
        if (isFavorited) {
          dispatch(removeFavorite(fdcId));
        } else {
          dispatch(addFavorite(fdcId));
        }
      }}
    >
      <HeartIcon isFavorited={isFavorited} size={iconSize} />
      {showLabel && <span>{isFavorited ? "Saved" : "Save"}</span>}
    </button>
  );
}
