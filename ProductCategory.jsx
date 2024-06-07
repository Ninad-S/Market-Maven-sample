import React, { useState } from "react";

const ProductCategory = ({ id, CategoryName, handleCategoryClick }) => {
  const handleClick = () => {
    handleCategoryClick(id);
  };

  return <button onClick={handleClick}>{CategoryName}</button>;
};

export default ProductCategory;
