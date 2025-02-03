import { useState } from "react";

// Tipo para definir el orden de clasificación
type SortOrder = "asc" | "desc";

// Interfaz para la configuración de clasificación
interface SortConfig<T> {
  key: keyof T;
  order: SortOrder;
}

// Hook personalizado para ordenar elementos
const useSort = <T>(items: T[], config: SortConfig<T>) => {
  // Estado para almacenar los elementos ordenados
  const [sortedItems, setSortedItems] = useState<T[]>([...items]);

  // Función para ordenar los elementos
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

  // Retornar los elementos ordenados y la función de ordenar
  return { sortedItems, sortItems };
};

export default useSort;
