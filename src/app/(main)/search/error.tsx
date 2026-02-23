"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import styles from "./error.module.css";

export default function SearchError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <p className={styles.icon}>⚠️</p>
        <h1 className={styles.heading}>Search unavailable</h1>
        <p className={styles.subheading}>
          We couldn&apos;t reach the food database. This is usually temporary.
        </p>
        <button
          className={styles.retryBtn}
          onClick={() =>
            startTransition(() => {
              router.refresh(); // clear route cache to retry fetch
              reset();
            })
          }
          disabled={isPending}
        >
          {isPending ? "Retrying..." : "Try again"}
        </button>
      </div>
    </div>
  );
}
