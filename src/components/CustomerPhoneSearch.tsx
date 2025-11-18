import { useState } from "react";
import type { Customer } from "../types/tablecrm";
import { searchCustomerByName } from "../api/tablecrmApi";

interface Props {
  token: string;
  customer: Customer | null;
  onCustomerChange: (c: Customer | null) => void;
}

export const CustomerPhoneSearch: React.FC<Props> = ({
  token,
  customer,
  onCustomerChange,
}) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const list = await searchCustomerByName(token, query.trim());

      if (list.length === 0) {
        alert("Контрагенты не найдены");
        onCustomerChange(null);
      } else if (list.length === 1) {
        onCustomerChange(list[0]);
      } else {
        onCustomerChange(list[0]);
      }
    } catch (e) {
      console.error(e);
      alert("Ошибка поиска контрагента");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-page__section order-page__section--customer">
      <div className="order-page__field">
        <label className="order-page__label">Контрагент (поиск по имени)</label>
        <div className="order-page__row">
          <input
            className="order-page__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Введите имя"
          />
          <button
            type="button"
            className="order-page__button order-page__button--secondary"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Поиск..." : "Найти"}
          </button>
        </div>
      </div>

      {customer && (
        <div className="order-page__hint">
          Выбран контрагент: <strong>{customer.name}</strong>
        </div>
      )}
    </div>
  );
};
