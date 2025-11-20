import { useState } from "react";

interface TokenFormProps {
  token: string | null;
  isLoading: boolean;
  onTokenChange: (token: string) => void;
}

export const TokenForm: React.FC<TokenFormProps> = ({
  token,
  isLoading,
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
        <label className="order-page__label">Токен</label>
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
        {isLoading ? <span className="loader"></span> : "Продолжить"}
      </button>
    </form>
  );
};
