import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({ item }) {
  const { addItem } = useContext(CartContext);

  const handleAdd = () => {
    addItem(item.id, 1);
  };

  return (
    <div className="product-card">
      <div className="product-img-container">
        <img
          src={item.image}
          className="product-img"
          alt={item.name}
        />
      </div>

      <div className="product-info">
        <h3 className="product-title">{item.name}</h3>
        <p className="product-desc">{item.description}</p>
        <p className="product-price">{item.price} silver</p>

        <button className="btn btn-primary" onClick={handleAdd}>
          В корзину
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
