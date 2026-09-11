import { HiChevronDown } from 'react-icons/hi2';

function RHFSelect({
  label,
  name,
  register,
  options,
  required,
  placeholder = 'همه دسته بندی',
  validationSchema,
  errors,
}) {
  const errorMessage = errors?.[name]?.message;

  return (
    <div className="karava-form-field">
      <label htmlFor={name} className="karava-form-label">
        {label}
        {required ? <span className="text-[#C9093D]"> *</span> : null}
      </label>

      <div className="relative">
        <select
          {...register(name, validationSchema)}
          id={name}
          className="karava-form-input appearance-none pl-10"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <HiChevronDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
      </div>

      {errorMessage ? (
        <span className="mt-1 block text-right text-xs text-[#C9093D]">{errorMessage}</span>
      ) : null}
    </div>
  );
}

export default RHFSelect;
