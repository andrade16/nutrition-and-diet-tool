/**
 * Calculate which page numbers to display with smart truncation
 * @param currentPage - The current active page (1-indexed)
 * @param totalPages - Total number of pages
 * @returns Array of page numbers and 'ellipsis' strings
 */
export function getVisiblePageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  // Show all pages if there are 7 or fewer
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Near the start of the list (pages 1 - 4)
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  // Near the end of the list (last 4 pages)
  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // In the middle of the list
  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

/**
 * Calculate the range of results being displayed
 * @param currentPage - Current page number
 * @param pageSize - Number of items per page
 * @param totalResults - Total number of results
 */
export function getResultsRange(
  currentPage: number,
  pageSize: number,
  totalResults: number,
): { start: number; end: number } {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalResults);
  return { start, end };
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}
