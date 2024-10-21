// Import necessary dependencies from React
import React, { useState } from "react";

// Define a functional component named ProductCategory
// It receives props: id, CategoryName, and handleCategoryClick
const ProductCategory = ({ id, CategoryName, handleCategoryClick }) => {
  // Define a function to handle the button click
  const handleClick = () => {
    // Call the handleCategoryClick function passed as a prop
    // Pass the id of the category when clicked
    handleCategoryClick(id);
  };

  // Render a button element
  return (
    <button onClick={handleClick}>
      {/* Display the category name as the button text */}
      {CategoryName}
    </button>
  );
};

// Export the ProductCategory component as the default export
export default ProductCategory;
