import React, { useState } from "react";

function Product(props) {
  
  return (
    <div className="product">
      <img src={props.ProductImage} />
      <h1>{props.ProductName}</h1>
      <p>{props.ProductCategory}</p>
      <h1> Quantity: {props.Quantity} </h1>
      <h1> Price: ${props.pricePerUnit} per unit </h1>
    </div>
  );
}
export default Product;
