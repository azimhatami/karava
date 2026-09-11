import {
  formatCurrencyInput,
  parseCurrencyInput,
} from '../utils/toPersianNumbers';

function PriceField({
  label = 'قیمت (تومان)',
  name = 'price',
  value,
  onChange,
  required = false,
  error,
  placeholder = 'مثلاً ۲,۵۰۰,۰۰۰',
}) {
  return (
    <div className="karava-form-field">
      <label htmlFor={name} className="karava-form-label">
        {label}
        {required ? <span className="text-[#C9093D]"> *</span> : null}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          dir="ltr"
          placeholder={placeholder}
          value={value}
          onChange={(event) => {
            const formatted = formatCurrencyInput(event.target.value);
            onChange(formatted);
          }}
          className="karava-form-input pl-16 text-left"
        />
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#5C6E66]">
          تومان
        </span>
      </div>

      {error ? (
        <span className="mt-1 block text-right text-xs text-[#C9093D]">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export function getPriceNumber(formattedValue) {
  return parseCurrencyInput(formattedValue);
}

export default PriceField;
