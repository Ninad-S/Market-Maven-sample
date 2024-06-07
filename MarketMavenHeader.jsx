import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import ProductCategory from "./ProductCategory";
const supabaseUrl = "https://ocimdzpalqvkaseuoyrj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jaW1kenBhbHF2a2FzZXVveXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcxODM3MjIsImV4cCI6MjAzMjc1OTcyMn0.0CSciehOKHh4hlx9KnivMUr9MSAem-S_IIdqVBPbAcU";
const supabase = createClient(supabaseUrl, supabaseKey);
const MarketMavenHeader = ({
  handleSearchChange,
  handleSearchSubmit,
  handleCategoryClick,
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [productCategories, setproductCategories] = useState([]);
  const handleTabClick = (category) => {
    setActiveTab(category.id);
    handleCategoryClick(category.id);
  };
  useEffect(() => {
    fetchProductCategories();
  }, []);
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
  return (
    <header className="header">
      <div>Welcome to MarketMaven</div>
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
      <div className="tab-bar">
        <button
          className={activeTab === "all" ? "active" : ""}
          onClick={() => handleTabClick("all")}
        >
          All
        </button>
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
