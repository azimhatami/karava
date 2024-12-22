const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianNumbersWithComma(numbers) {
  const numWithComma = numberWithComma(numbers);
  const persianNumbers = toPersianNumbers(numWithComma);
  return persianNumbers;
}

function numberWithComma(numbers) {
  return numbers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
}

function toPersianNumbers(number) {
  return number.toString().replace(/\d/g, (n) => persianDigits[parseInt(n)]);
}
