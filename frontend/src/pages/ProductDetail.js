import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { CartContext } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addItem } = useContext(CartContext);

  useEffect(() => {
    api.get(`catalog/items/${id}/`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <p>Загрузка...</p>;

  return (
    <div className="product-detail">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>{product.price} silver</p>
      <button onClick={() => addItem(product.id, 1)}>В корзину</button>
    </div>
  );
}

export default ProductDetail;