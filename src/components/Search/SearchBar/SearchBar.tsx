"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLastQuery, selectLastQuery } from "@/store/slices/searchSlice";
import styles from "./SearchBar.module.css";
import SearchIcon from "@/components/Icons/SearchIcon";
import ClearSearchIcon from "@/components/Icons/ClearSearchIcon";

const QUICK_PICKS = [
  "Chicken breast",
  "Avocado",
  "Brown rice",
  "Salmon",
  "Broccoli",
  "Greek yogurt",
  "Eggs",
  "Oats",
];

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const lastQuery = useAppSelector(selectLastQuery);
  // Pre-fill with the last query if there's nothing in the URL
  const [query, setQuery] = useState(initialQuery || lastQuery);

  const submit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    document.cookie = `lastSearchQuery=${encodeURIComponent(trimmed)}; path=/; max-age=300`;
    dispatch(setLastQuery(trimmed));
    router.push(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  const clear = () => {
    document.cookie = "lastSearchQuery=; path=/; max-age=0";
    dispatch(setLastQuery(""));
    setQuery("");
    router.push("/search");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submit(query);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputRow}>
        <div className={styles.inputWrap}>
          <SearchIcon className={styles.searchIcon} />
          <input
            className={styles.input}
            type='text'
            placeholder='Search for a food...'
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              if (!value) clear();
            }}
            onKeyDown={handleKeyDown}
            autoFocus
          />

          {query && (
            <button
              className={styles.clearBtn}
              onClick={clear}
              aria-label='Clear search'
            >
              <ClearSearchIcon />
            </button>
          )}
        </div>

        <button className={styles.searchBtn} onClick={() => submit(query)}>
          Search
        </button>
      </div>

      <div className={styles.quickPicks}>
        <span className={styles.quickPicksLabel}>Try:</span>
        {QUICK_PICKS.map((item) => (
          <button
            key={item}
            className={styles.chip}
            onClick={() => {
              setQuery(item);
              submit(item);
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
