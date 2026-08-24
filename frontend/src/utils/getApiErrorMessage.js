export default function getApiErrorMessage(
  error,
  fallback = 'خطایی رخ داد. لطفاً دوباره تلاش کنید.',
) {
  const message = error?.response?.data?.message;
  if (message) return message;

  if (!error?.response) {
    return 'ارتباط با سرور برقرار نشد. لطفاً مطمئن شوید backend روی پورت 5000 در حال اجراست.';
  }

  return fallback;
}
