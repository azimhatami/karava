const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/**
 * Convert Persian (۰-۹) and Arabic-Indic (٠-٩) digits to Latin digits (0-9).
 * Leaves other characters untouched.
 */
export function toEnglishDigits(value = '') {
  return String(value ?? '')
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)));
}

/**
 * Normalize to English digits, then keep only 0-9 (optionally one decimal point).
 */
export function digitsOnly(value = '', { allowDecimal = false } = {}) {
  const english = toEnglishDigits(value);
  if (!allowDecimal) return english.replace(/[^\d]/g, '');

  const cleaned = english.replace(/[^\d.]/g, '');
  const [integerPart, ...rest] = cleaned.split('.');
  if (!rest.length) return integerPart;
  return `${integerPart}.${rest.join('').replace(/\./g, '')}`;
}

/**
 * Parse a localized numeric string into a Number (or NaN).
 */
export function parseLocalizedNumber(value, { allowDecimal = false } = {}) {
  const normalized = digitsOnly(value, { allowDecimal });
  if (!normalized || normalized === '.') return NaN;
  return Number(normalized);
}

/**
 * react-hook-form helpers: normalize value as the user types / on submit.
 */
export function numericFieldOptions(validationSchema = {}, options = {}) {
  const { allowDecimal = false } = options;

  return {
    ...validationSchema,
    setValueAs: (value) => digitsOnly(value, { allowDecimal }),
  };
}

/**
 * Normalize an event target value in-place for controlled/uncontrolled inputs.
 * Returns the normalized string.
 */
export function normalizeInputEvent(event, options = {}) {
  const normalized = digitsOnly(event?.target?.value, options);
  if (event?.target) event.target.value = normalized;
  return normalized;
}
