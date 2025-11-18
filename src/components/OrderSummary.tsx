import type { Customer, OrderItem } from "../types/tablecrm";

interface Props {
  customer: Customer | null;
  items: OrderItem[];
  onCreate: () => void;
  onCreateAndConduct: () => void;
}

export const OrderSummary: React.FC<Props> = ({
  customer,
  items,
  onCreate,
  onCreateAndConduct,
}) => {
  const total = items.reduce((acc, i) => acc + i.total, 0);

  return (
    <div className="order-page__section order-page__section--summary">
      <div className="order-page__summary">
        {customer && (
          <div className="order-page__summary-line">
            <span>Контрагент:</span>
            <span className="order-page__summary-value">{customer.name}</span>
          </div>
        )}

        <div className="order-page__summary-line">
          <span>Итого товаров:</span>
          <span className="order-page__summary-value">{items.length}</span>
        </div>

        <div className="order-page__summary-line">
          <span>Сумма:</span>
          <span className="order-page__summary-value">{total} ₽</span>
        </div>
      </div>

      <div className="order-page__actions">
        <button
          type="button"
          className="order-page__button order-page__button--primary order-page__button--full"
          onClick={onCreate}
        >
          Создать продажу
        </button>

        <button
          type="button"
          className="order-page__button order-page__button--secondary order-page__button--full"
          onClick={onCreateAndConduct}
        >
          Создать и провести
        </button>
      </div>
    </div>
  );
};
