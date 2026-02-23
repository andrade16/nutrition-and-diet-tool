"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import styles from "./error.module.css";

export default function FoodDetailError({
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
        <h1 className={styles.heading}>Couldn&apos;t load food details</h1>
        <p className={styles.subheading}>
          We couldn&apos;t fetch the nutrition info for this item. Try again or
          go back to search.
        </p>
        <div className={styles.actions}>
          <button
            className={styles.retryBtn}
            onClick={() =>
              startTransition(() => {
                router.refresh();
                reset();
              })
            }
            disabled={isPending}
          >
            {isPending ? "Retrying..." : "Try again"}
          </button>
          <button
            className={styles.backBtn}
            onClick={() => router.back()}
            disabled={isPending}
          >
            Back to search
          </button>
        </div>
      </div>
    </div>
  );
}
