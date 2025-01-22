import React from "react";

interface SortOptionsProps {
  sortCriterion: string;
  sortOrder: string;
  onSortChange: (criterion: string) => void;
  onSortOrderChange: (order: string) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({
  sortCriterion,
  sortOrder,
  onSortChange,
  onSortOrderChange,
}) => (
  <div className="sort-options">
    <label>Ordenar por:</label>
    <select
      onChange={(e) => onSortChange(e.target.value)}
      value={sortCriterion}
    >
      <option value="date">Fecha</option>
      <option value="topic">Tema</option>
      <option value="type">Tipo</option>
      <option value="difficulty">Dificultad</option>
    </select>
    <select
      onChange={(e) => onSortOrderChange(e.target.value)}
      value={sortOrder}
    >
      <option value="asc">Ascendente</option>
      <option value="desc">Descendente</option>
    </select>
  </div>
);

export default SortOptions;
