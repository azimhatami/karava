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
}) {
  const fieldClassName = 'karava-form-input';
  const errorMessage = errors?.[name]?.message;

  return (
    <div className="karava-form-field">
      <label htmlFor={name} className="karava-form-label">
        {label}
        {required ? <span className="text-karava-red"> *</span> : null}
      </label>

      {multiline ? (
        <textarea
          {...register(name, validationSchema)}
          id={name}
          rows={rows}
          placeholder={placeholder}
          className={`${fieldClassName} min-h-[96px] resize-none`}
          autoComplete="off"
        />
      ) : (
        <input
          {...register(name, validationSchema)}
          id={name}
          type={type}
          placeholder={placeholder}
          className={fieldClassName}
          autoComplete="off"
        />
      )}

      {errorMessage ? (
        <span className="mt-1 block text-right text-xs text-karava-red">{errorMessage}</span>
      ) : null}
    </div>
  );
}

export default TextField;
