"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.css";

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
  const [query, setQuery] = useState(initialQuery);

  const submit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submit(query);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputRow}>
        <div className={styles.inputWrap}>
          <svg
            className={styles.searchIcon}
            xmlns='http://www.w3.org/2000/svg'
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <circle cx='11' cy='11' r='8' />
            <line x1='21' y1='21' x2='16.65' y2='16.65' />
          </svg>

          <input
            className={styles.input}
            type='text'
            placeholder='Search for a food...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />

          {query && (
            <button
              className={styles.clearBtn}
              onClick={() => { setQuery(""); router.push("/search"); }}
              aria-label='Clear search'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <line x1='18' y1='6' x2='6' y2='18' />
                <line x1='6' y1='6' x2='18' y2='18' />
              </svg>
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
