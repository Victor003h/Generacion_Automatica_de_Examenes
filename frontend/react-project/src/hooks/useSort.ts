import { useState } from "react";

type SortOrder = "asc" | "desc";

interface SortConfig<T> {
  key: keyof T;
  order: SortOrder;
}

const useSort = <T>(items: T[], config: SortConfig<T>) => {
  const [sortedItems, setSortedItems] = useState<T[]>([...items]);

  const sortItems = (key: keyof T, order: SortOrder) => {
    const sorted = [...items].sort((a, b) => {
      if (a[key] < b[key]) {
        return order === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
    setSortedItems(sorted);
  };

  return { sortedItems, sortItems };
};

export default useSort;
