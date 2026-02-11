import { useEffect, useState } from "react";
import api from "../api/api";
import ProductCard from "../components/ProductCard";

function Catalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("catalog/items/")
      .then(res => {
        setItems(res.data.results || res.data);
      })
      .catch(err => {
        console.error("Ошибка загрузки каталога", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Загрузка товаров...</p>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <h2>Каталог товаров</h2>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {items.map(item => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Catalog;
