import Link from "next/link";
import {
  getVisiblePageNumbers,
  getResultsRange,
  formatNumber,
} from "@/lib/pagination";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  baseUrl: string;
  pageSize: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalResults,
  baseUrl,
  pageSize = 100,
}: PaginationProps) {
  // Don't render pagination if there's only 1 page
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePageNumbers(currentPage, totalPages);
  const { start, end } = getResultsRange(currentPage, pageSize, totalResults);

  // Build URL for a given page number
  const buildPageUrl = (page: number) => {
    return `${baseUrl}&page=${page}`;
  };

  return (
    <nav className={styles.pagination} aria-label='Search results pagination'>
      {/* Controls: Prev + Page Numbers + Next */}
      <div className={styles.controls}>
        {/*Previous Button */}
        {currentPage > 1 ? (
          <Link
            href={buildPageUrl(currentPage - 1)}
            className={styles.button}
            aria-label='Go to previous page'
          >
            ← Prev
          </Link>
        ) : (
          <span
            className={`${styles.button} ${styles.disabled}`}
            aria-disabled='true'
          >
            ← Prev
          </span>
        )}

        {/* Page Numbers (Desktop only) */}
        <div className={styles.pageNumbers}>
          {visiblePages.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className={styles.ellipsis}
                  aria-hidden='true'
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <Link
                key={page}
                href={buildPageUrl(page)}
                className={`${styles.button} ${styles.pageButton} ${
                  isActive ? styles.active : ""
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={isActive ? "page" : undefined}
              >
                {page}
              </Link>
            );
          })}
        </div>

        {/* Mobile Page Indicator */}
        <span className={styles.mobileIndicator} aria-live='polite'>
          Page {currentPage} of {totalPages}
        </span>

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Link
            href={buildPageUrl(currentPage + 1)}
            className={styles.button}
            aria-label='Go to next page'
          >
            Next →
          </Link>
        ) : (
          <span
            className={`${styles.button} ${styles.disabled}`}
            aria-disabled='true'
          >
            Next →
          </span>
        )}
      </div>

      {/* Results Info */}
      <p className={styles.resultsInfo} aria-live='polite'>
        Showing{" "}
        <strong>
          {formatNumber(start)}-{formatNumber(end)}
        </strong>{" "}
        of <strong>{formatNumber(totalResults)}</strong> results
      </p>
    </nav>
  );
}
