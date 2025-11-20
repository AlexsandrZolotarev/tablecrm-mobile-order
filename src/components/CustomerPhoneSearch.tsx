import React, { useMemo, useState } from "react";
import type { Customer } from "../types/tablecrm";

interface Props {
  customers: Customer[];
  customer: Customer | null;
  isLoading: boolean;
  onCustomerChange: (c: Customer | null) => void;
  onShowToast?: (message: string) => void;
}

export const CustomerPhoneSearch: React.FC<Props> = ({
  customers,
  customer,
  onCustomerChange,
  isLoading,
  onShowToast,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return customers;
    return customers.filter((c) => c.phone?.includes(q));
  }, [customers, query]);

  const handleSelect = (c: Customer) => {
    setQuery(c.phone ?? "");
    onCustomerChange(c);
    setIsOpen(false);
    onShowToast?.(`Выбран клиент: ${c.name}`);
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setQuery("");
    onCustomerChange(null);
    setIsOpen(true);
  };

  return (
    <div className="order-page__section order-page__section--customer">
      <div className="order-page__field">
        <label className="order-page__label">
          Контрагент (поиск по телефону)
        </label>

        <div className="order-page__customer-select">
          <div className="order-page__customer-input-wrapper">
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              className="order-page__input order-page__customer-input"
              placeholder="Введите номер телефона"
              value={query}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 150)}
              onChange={(e) => setQuery(e.target.value.replace(/\D/g, ""))}
            />

            {query && (
              <button
                type="button"
                className="order-page__customer-clear"
                onMouseDown={handleClear}
                aria-label="Очистить номер"
              >
                ✕
              </button>
            )}
          </div>
          {isLoading ? (
            <span className="order-page__customer-spinner" />
          ) : (
            query && (
              <button
                type="button"
                className="order-page__customer-clear"
                onMouseDown={handleClear}
              >
                ✕
              </button>
            )
          )}
          {isOpen && filtered.length > 0 && (
            <ul className="order-page__customer-dropdown">
              {filtered.map((c) => (
                <li
                  key={c.id}
                  className="order-page__customer-option"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(c);
                  }}
                >
                  <span className="order-page__customer-phone">{c.phone}</span>
                  <span className="order-page__customer-name"> — {c.name}</span>
                </li>
              ))}
            </ul>
          )}
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
