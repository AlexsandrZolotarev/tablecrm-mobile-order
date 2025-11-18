interface Option {
  value: number;
  label: string;
}

interface Props {
  label: string;
  value: number | null;
  options: Option[];
  onChange: (v: number) => void;
}

export const SelectField: React.FC<Props> = ({
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <div className="order-page__section">
      <div className="order-page__field">
        <label className="order-page__label">{label}</label>
        <select
          className="order-page__select"
          value={value ?? ""}
          onChange={(e) => onChange(Number(e.target.value))}
        >
          <option value="">Выберите...</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
