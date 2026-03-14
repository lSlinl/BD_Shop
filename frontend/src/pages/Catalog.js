import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api";
import ProductCard from "../components/ProductCard";

function Catalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const ordering = searchParams.get("ordering") || "";
  const search = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(search);

  /* ===============================
     Синхронизация URL → input
  =============================== */
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  /* ===============================
     Загрузка товаров
  =============================== */
  useEffect(() => {
    setLoading(true);

    api.get("catalog/items/", {
      params: {
        ordering,
        search,
      },
    })
      .then(res => {
        setItems(res.data.results || res.data);
      })
      .catch(err => {
        console.error("Ошибка загрузки каталога", err);
      })
      .finally(() => setLoading(false));

  }, [ordering, search]);

  /* ===============================
     Debounce поиска
  =============================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        setSearchParams(prev => {
          const params = Object.fromEntries(prev);
          return { ...params, search: searchInput };
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, search, setSearchParams]);

  /* ===============================
     Сортировка
  =============================== */
  const handleSort = (value) => {
    setSearchParams(prev => {
      const params = Object.fromEntries(prev);
      return { ...params, ordering: value };
    });
  };

  if (loading) {
    return <p>Загрузка товаров...</p>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <h2>Каталог товаров</h2>

      <input
        type="text"
        placeholder="Поиск..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        style={{ marginBottom: "12px", marginRight: "12px" }}
      />

      <select
        value={ordering}
        onChange={(e) => handleSort(e.target.value)}
        style={{ marginBottom: "12px" }}
      >
        <option value="">Без сортировки</option>
        <option value="price">Цена ↑</option>
        <option value="-price">Цена ↓</option>
      </select>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {items.map(item => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Catalog;
