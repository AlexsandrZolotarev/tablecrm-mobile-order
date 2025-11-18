import { useState } from "react";
import type { OrderItem } from "../types/tablecrm";
import { searchProducts, fetchProductPrice } from "../api/tablecrmApi";

interface Props {
  token: string;
  priceTypeId: number | null;
  items: OrderItem[];
  onChangeItems: (items: OrderItem[]) => void;
}

export const ProductsPicker: React.FC<Props> = ({
  token,
  priceTypeId,
  items,
  onChangeItems,
}) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const products = await searchProducts(token, query.trim());
      if (products.length === 0) {
        alert("Товары не найдены");
        return;
      }

      const p = products[0];

      let price = 0;
      if (priceTypeId != null) {
        try {
          const priceInfo = await fetchProductPrice(token, p.id, priceTypeId);
          price = priceInfo.price ?? 0;
        } catch {
          price = p.price ?? 0;
        }
      } else {
        price = p.price ?? 0;
      }

      const newItem: OrderItem = {
        product_id: p.id,
        name: p.name,
        quantity: 1,
        price,
        total: price,
      };

      onChangeItems([...items, newItem]);
      setQuery("");
    } catch (e) {
      console.error(e);
      alert("Ошибка поиска товара");
    } finally {
      setLoading(false);
    }
  };

  const changeQuantity = (id: number, delta: number) => {
    const updated = items.map((p) =>
      p.product_id === id
        ? {
            ...p,
            quantity: Math.max(1, p.quantity + delta),
            total: Math.max(1, p.quantity + delta) * p.price,
          }
        : p
    );
    onChangeItems(updated);
  };

  return (
    <div className="order-page__section order-page__section--products">
      <div className="order-page__field">
        <label className="order-page__label">Поиск товара</label>
        <div className="order-page__row">
          <input
            className="order-page__input"
            placeholder="Введите название"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            className="order-page__button order-page__button--secondary"
            onClick={handleAddProduct}
            disabled={loading}
          >
            {loading ? "..." : "Добавить"}
          </button>
        </div>
      </div>

      <div className="order-page__products-list">
        {items.map((p) => (
          <div key={p.product_id} className="order-page__product">
            <div className="order-page__product-info">
              <div className="order-page__product-name">{p.name}</div>
              <div className="order-page__product-price">{p.total} ₽</div>
            </div>

            <div className="order-page__qty-controls">
              <button
                type="button"
                className="order-page__button order-page__button--icon"
                onClick={() => changeQuantity(p.product_id, -1)}
              >
                −
              </button>
              <span className="order-page__qty">{p.quantity}</span>
              <button
                type="button"
                className="order-page__button order-page__button--icon"
                onClick={() => changeQuantity(p.product_id, +1)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
