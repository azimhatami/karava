import { digitsOnly, numericFieldOptions } from '../utils/normalizeDigits';

function TextField({
  label,
  name,
  register,
  type = 'text',
  required,
  validationSchema,
  errors,
  placeholder,
  multiline = false,
  rows = 4,
  numeric = false,
  inputMode,
}) {
  const fieldClassName = 'karava-form-input';
  const errorMessage = errors?.[name]?.message;
  const isNumeric = numeric || type === 'number';
  const resolvedType = isNumeric ? 'text' : type;
  const resolvedInputMode = inputMode || (isNumeric ? 'numeric' : undefined);

  const registration = register(
    name,
    isNumeric ? numericFieldOptions(validationSchema) : validationSchema,
  );

  const handleChange = (event) => {
    if (isNumeric) {
      event.target.value = digitsOnly(event.target.value);
    }
    registration.onChange(event);
  };

  return (
    <div className="karava-form-field">
      <label htmlFor={name} className="karava-form-label">
        {label}
        {required ? <span className="text-karava-red"> *</span> : null}
      </label>

      {multiline ? (
        <textarea
          {...registration}
          id={name}
          rows={rows}
          placeholder={placeholder}
          className={`${fieldClassName} min-h-[96px] resize-none`}
          autoComplete="off"
        />
      ) : (
        <input
          {...registration}
          id={name}
          type={resolvedType}
          inputMode={resolvedInputMode}
          placeholder={placeholder}
          className={fieldClassName}
          autoComplete="off"
          onChange={handleChange}
        />
      )}

      {errorMessage ? (
        <span className="mt-1 block text-right text-xs text-karava-red">
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
}

export default TextField;
