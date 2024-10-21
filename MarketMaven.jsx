// Import necessary dependencies and components
import React, { useState, useEffect } from "react";
import MarketMavenHeader from "./MarketMavenHeader";
import Product from "./Product";
import GoogleMap from "./GoogleMap";
import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = "https://ocimdzpalqvkaseuoyrj.supabase.co";
const supabaseKey = "###";
const supabase = createClient(supabaseUrl, supabaseKey);

const MarketMaven = () => {
  // State variables
  const [products, setProducts] = useState([]); // All products
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products based on search
  const [searchQuery, setSearchQuery] = useState(""); // Search query string
  const [selectedCategory, setSelectedCategory] = useState(null); // Selected category ID

  // Fetch products when selectedCategory changes
  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  // Function to fetch products from Supabase
  const fetchProducts = async (categoryId) => {
    try {
      let { data, error } = {};

      // Query products based on category or fetch all products
      if (categoryId) {
        ({ data, error } = await supabase
          .from("Products")
          .select("*")
          .eq("ProductCategoryId", categoryId));
      } else {
        ({ data, error } = await supabase.from("Products").select("*"));
      }

      // Update state with fetched products
      if (data) {
        setProducts(data);
        setFilteredProducts(data);
      }

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error fetching products data:", error.message);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    filterProducts();
  };

  // Handle category selection
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Filter products based on search query
  const filterProducts = () => {
    const filtered = products.filter((product) =>
      product.ProductName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Render component
  return (
    <div>
      <MarketMavenHeader
        handleSearchChange={handleSearchChange}
        handleSearchSubmit={handleSearchSubmit}
        handleCategoryClick={handleCategoryClick}
      />
      <div className="product-list">
        {filteredProducts.map((product, index) => (
          <Product
            key={index}
            id={product.id}
            ProductImage={product.ProductImage}
            ProductName={product.ProductName}
            ProductCategory={product.ProductCategory}
            Quantity={product.Quantity}
            pricePerUnit={product.pricePerUnit}
          />
        ))}
      </div>
      <GoogleMap />
    </div>
  );
};

export default MarketMaven;
