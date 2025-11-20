import React, { useEffect, useMemo, useState } from "react";
import type { OrderItem, Product } from "../types/tablecrm";
import { searchProducts, fetchProductPrice } from "../api/tablecrmApi";

interface Props {
  token: string;
  priceTypeId: number | null;
  items: OrderItem[];
  onChangeItems: (items: OrderItem[]) => void;
  onShowToast?: (message: string, type?: "success" | "error" | "info") => void;
}

export const ProductsPicker: React.FC<Props> = ({
  token,
  priceTypeId,
  items,
  onChangeItems,
  onShowToast,
}) => {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!token) return;

    setIsLoading(true);
    searchProducts(token, "")
      .then((p) => setAllProducts(p))
      .catch(() => onShowToast?.("Ошибка загрузки товаров", "error"))
      .finally(() => setIsLoading(false));
  }, [token]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allProducts.slice(0, 20);

    return allProducts
      .filter((p) => typeof p.name === "string")
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 20);
  }, [allProducts, query]);

  const handleAdd = async (product: Product) => {
    try {
      let price = product.price ?? 0;

      if (priceTypeId != null) {
        try {
          const res = await fetchProductPrice(token, product.id, priceTypeId);
          price = res.price ?? price;
        } catch {}
      }

      const newItem: OrderItem = {
        product_id: product.id,
        name: product.name,
        quantity: 1,
        price: price,
        total: price,
      };

      onChangeItems([...items, newItem]);
      setQuery("");
      setIsOpen(false);
    } catch (e) {
      onShowToast?.("Ошибка добавления товара", "error");
    }
  };

  return (
    <div className="order-page__section">
      <div className="order-page__field">
        <label className="order-page__label">Поиск товара</label>

        <div className="order-page__product-search">
          <div className="order-page__product-input-wrapper">
            <input
              className="order-page__input order-page__product-input"
              placeholder="Введите название"
              value={query}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 150)}
              onChange={(e) => setQuery(e.target.value)}
            />

            {isLoading && <span className="order-page__product-spinner" />}
          </div>

          {isOpen && filtered.length > 0 && (
            <div className="order-page__product-dropdown">
              {filtered.map((p) => (
                <div key={p.id} className="order-page__product-option">
                  <div className="order-page__product-option-name">
                    {p.name}
                  </div>
                  <button
                    type="button"
                    className="order-page__button order-page__button--secondary order-page__product-add-btn"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleAdd(p);
                    }}
                  >
                    Добавить
                  </button>
                </div>
              ))}
            </div>
          )}
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
                onClick={() =>
                  onChangeItems(
                    items.map((x) =>
                      x.product_id === p.product_id
                        ? {
                            ...x,
                            quantity: Math.max(1, x.quantity - 1),
                            total: Math.max(1, x.quantity - 1) * x.price,
                          }
                        : x
                    )
                  )
                }
              >
                −
              </button>

              <span className="order-page__qty">{p.quantity}</span>

              <button
                type="button"
                className="order-page__button order-page__button--icon"
                onClick={() =>
                  onChangeItems(
                    items.map((x) =>
                      x.product_id === p.product_id
                        ? {
                            ...x,
                            quantity: x.quantity + 1,
                            total: (x.quantity + 1) * x.price,
                          }
                        : x
                    )
                  )
                }
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
