"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectFavoritedFoods } from "@/store/slices/favoritesSlice";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const favoritedFoods = useAppSelector(selectFavoritedFoods);
  console.log("Favorited foods ===> ", favoritedFoods);
  return (
    <div>
      <div>test</div>
    </div>
  );
}
