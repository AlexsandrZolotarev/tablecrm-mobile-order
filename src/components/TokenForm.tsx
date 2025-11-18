import { useState } from "react";

interface TokenFormProps {
  token: string | null;
  onTokenChange: (token: string) => void;
}

export const TokenForm: React.FC<TokenFormProps> = ({
  token,
  onTokenChange,
}) => {
  const [value, setValue] = useState(token ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onTokenChange(value.trim());
  };

  return (
    <form
      className="order-page__section order-page__section--token"
      onSubmit={handleSubmit}
    >
      <div className="order-page__field">
        <label className="order-page__label">Токен кассы</label>
        <input
          className="order-page__input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Введите токен"
        />
      </div>

      <button
        type="submit"
        className="order-page__button order-page__button--primary order-page__button--full"
      >
        Продолжить
      </button>
    </form>
  );
};
