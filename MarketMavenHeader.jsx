// Import necessary dependencies from React and Supabase
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import ProductCategory from "./ProductCategory";

// Supabase configuration
const supabaseUrl = "https://ocimdzpalqvkaseuoyrj.supabase.co";
const supabaseKey = "###";
const supabase = createClient(supabaseUrl, supabaseKey);

// MarketMavenHeader component definition
const MarketMavenHeader = ({
  handleSearchChange,
  handleSearchSubmit,
  handleCategoryClick,
}) => {
  // State for managing active tab and product categories
  const [activeTab, setActiveTab] = useState("all");
  const [productCategories, setproductCategories] = useState([]);

  // Handle tab click and category selection
  const handleTabClick = (category) => {
    setActiveTab(category.id);
    handleCategoryClick(category.id);
  };

  // Fetch product categories on component mount
  useEffect(() => {
    fetchProductCategories();
  }, []);

  // Function to fetch product categories from Supabase
  const fetchProductCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("Product Category")
        .select("*");

      if (data) {
        setproductCategories(data);
      }

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  // Render the header component
  return (
    <header className="header">
      <div>Welcome to MarketMaven</div>
      {/* Search form */}
      <form className="search-form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          onChange={handleSearchChange}
        />
        <button type="submit" className="browse-button">
          Search
        </button>
      </form>
      {/* Category tab bar */}
      <div className="tab-bar">
        <button
          className={activeTab === "all" ? "active" : ""}
          onClick={() => handleTabClick("all")}
        >
          All
        </button>
        {/* Render ProductCategory components for each category */}
        {productCategories.map((category, index) => (
          <ProductCategory
            key={index}
            id={category.id}
            CategoryName={category.CategoryName}
            handleCategoryClick={handleCategoryClick}
          />
        ))}
      </div>
    </header>
  );
};

export default MarketMavenHeader;
