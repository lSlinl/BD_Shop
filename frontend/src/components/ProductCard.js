import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({ item }) {
  const { cart, setCart } = useContext(CartContext);

  const addToCart = () => {
    const existing = cart.find(ci => ci.id === item.id);

    if (existing) {
      setCart(
        cart.map(ci =>
          ci.id === item.id
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  return (
    <div className="product-card">
      <div className="product-img-container">
        <img src={item.image || "https://via.placeholder.com/150"} className="product-img" alt={item.name} />
      </div>
      <div className="product-info">
        <h3 className="product-title">{item.name}</h3>
        <p className="product-desc">{item.description}</p>
        <p className="product-price">{item.price} silver</p>
        <button className="btn btn-primary" onClick={() => addToCart(item)}>В корзину</button>
      </div>
    </div>
  );
}

export default ProductCard;
