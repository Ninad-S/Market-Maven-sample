import React, { useState, useEffect } from "react";
import MarketMavenHeader from "./MarketMavenHeader";
import Product from "./Product";
import GoogleMap from "./GoogleMap";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ocimdzpalqvkaseuoyrj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jaW1kenBhbHF2a2FzZXVveXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcxODM3MjIsImV4cCI6MjAzMjc1OTcyMn0.0CSciehOKHh4hlx9KnivMUr9MSAem-S_IIdqVBPbAcU";
const supabase = createClient(supabaseUrl, supabaseKey);

const MarketMaven = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  const fetchProducts = async (categoryId) => {
    try {
      let { data, error } = {};

      if (categoryId) {
        ({ data, error } = await supabase
          .from("Products")
          .select("*")
          .eq("ProductCategoryId", categoryId));
      } else {
        ({ data, error } = await supabase.from("Products").select("*"));
      }

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    filterProducts();
  };
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  const filterProducts = () => {
    const filtered = products.filter((product) =>
      product.ProductName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

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
