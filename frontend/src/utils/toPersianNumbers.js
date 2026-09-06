import { digitsOnly, toEnglishDigits } from './normalizeDigits';

const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export { toEnglishDigits, digitsOnly };

export function toPersianNumbersWithComma(numbers) {
  const numWithComma = numberWithComma(numbers);
  return toPersianNumbers(numWithComma);
}

function numberWithComma(numbers) {
  return numbers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function toPersianNumbers(number) {
  return number.toString().replace(/\d/g, (n) => persianDigits[parseInt(n, 10)]);
}

/** Strip formatting and return a plain integer (or NaN). */
export function parseCurrencyInput(value) {
  const digits = digitsOnly(value);
  if (!digits) return NaN;
  return Number(digits);
}

/** Format a raw number/string for display while typing: ۲,۵۰۰,۰۰۰ */
export function formatCurrencyInput(value) {
  const amount = parseCurrencyInput(value);
  if (Number.isNaN(amount)) return '';
  return toPersianNumbersWithComma(amount);
}
