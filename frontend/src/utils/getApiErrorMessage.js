function firstNonEmptyString(...values) {
  for (const value of values) {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) return trimmed;
    }
  }
  return null;
}

function serverMessageFromData(data) {
  if (!data) return null;
  if (typeof data === 'string') return firstNonEmptyString(data);

  return firstNonEmptyString(
    data.message,
    data.data?.message,
    data.error,
    data.errors?.[0]?.message,
  );
}

function isNetworkLikeError(error) {
  const code = error?.code;
  return (
    code === 'ERR_NETWORK' ||
    code === 'ECONNABORTED' ||
    code === 'ERR_CANCELED' ||
    code === 'ECONNREFUSED' ||
    error?.message === 'Network Error'
  );
}

export default function getApiErrorMessage(
  error,
  fallback = 'خطایی رخ داد. لطفاً دوباره تلاش کنید.',
) {
  const serverMessage = serverMessageFromData(error?.response?.data);
  if (serverMessage) return serverMessage;

  if (error?.response) {
    const status = error.response.status;
    if (status === 401) return fallback;
    if (status >= 500) {
      return 'الان سرویس در دسترس نیست. لطفاً کمی بعد دوباره تلاش کنید.';
    }
    return fallback;
  }

  if (error?.code === 'ECONNABORTED') {
    return 'زمان پاسخ سرور به پایان رسید. لطفاً دوباره تلاش کنید.';
  }

  if (isNetworkLikeError(error) || error?.request) {
    return 'ارتباط با سرور برقرار نشد. لطفاً مطمئن شوید backend روی پورت 5000 در حال اجراست.';
  }

  return firstNonEmptyString(error?.message) || fallback;
}
