import { useState, useMemo } from "react";

/**
 * Hook for managing search/filter functionality
 * @param items - Array of items to search through
 * @param searchKeys - Keys to search in each item
 * @returns Search state and filtered results
 */
export function useSearch<T extends Record<string, any>>(
  items: T[],
  searchKeys: (keyof T)[],
) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }

    const query = searchQuery.toLowerCase();

    return items.filter((item) => {
      return searchKeys.some((key) => {
        const value = item[key];
        if (typeof value === "string") {
          return value.toLowerCase().includes(query);
        }
        if (typeof value === "number") {
          return value.toString().includes(query);
        }
        return false;
      });
    });
  }, [items, searchQuery, searchKeys]);

  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
    hasResults: filteredItems.length > 0,
    resultCount: filteredItems.length,
  };
}
