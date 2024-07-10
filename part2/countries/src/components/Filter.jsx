import React from "react";

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      Find countries: <input value={filter} onChange={handleFilterChange} />
    </div>
  );
};

export default Filter;
