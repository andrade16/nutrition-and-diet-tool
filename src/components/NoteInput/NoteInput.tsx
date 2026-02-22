"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectFavoritedFoods,
  updateFavoriteNote,
} from "@/store/slices/favorites/favoritesSlice";
import type { FavoriteItem } from "@/lib/types/usda";
import styles from "./NoteInput.module.css";

export default function NoteInput({ fdcId }: { fdcId: number }) {
  const dispatch = useAppDispatch();

  // Read the saved note directly from Redux, its always current
  const savedNote = useAppSelector(
    (state) =>
      selectFavoritedFoods(state).find((f: FavoriteItem) => f.fdcId === fdcId)
        ?.note ?? "",
  );

  const [inputValue, setInputValue] = useState(savedNote);

  const hasNoteChanged = inputValue.trim() !== savedNote;

  const handleSave = () => {
    dispatch(updateFavoriteNote({ fdcId, note: inputValue.trim() }));
  };

  return (
    <div className={styles.noteRow}>
      <input
        type='text'
        className={styles.noteInput}
        placeholder='Add a note...'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {hasNoteChanged && (
        <button className={styles.saveBtn} onClick={handleSave}>
          Save
        </button>
      )}
    </div>
  );
}
