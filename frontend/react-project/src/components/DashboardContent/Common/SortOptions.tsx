import React from "react";
import "../../../styles/DashboardContent/SortOptions.css";

interface SortOptionsProps {
  sortKey: string;
  setSortKey: (key: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  options: { value: string; label: string }[];
}

// Component for sorting options
const SortOptions: React.FC<SortOptionsProps> = ({
  sortKey,
  setSortKey,
  sortOrder,
  setSortOrder,
  options,
}) => {
  return (
    <div className="sort-options">
      <label htmlFor="sort-key">Ordenar por:</label>
      <select
        id="sort-key"
        value={sortKey}
        onChange={(e) => setSortKey(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        className="sort-order-button"
        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
      >
        {sortOrder === "asc" ? "Ascendente" : "Descendente"}
      </button>
    </div>
  );
};

export default SortOptions;
