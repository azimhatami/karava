import { HiOutlineExclamationTriangle } from 'react-icons/hi2';
import getApiErrorMessage from '../utils/getApiErrorMessage';

function QueryErrorState({
  error,
  message,
  onRetry,
  retryLabel = 'تلاش مجدد',
}) {
  const text =
    message ||
    getApiErrorMessage(error, 'بارگذاری اطلاعات انجام نشد. لطفاً دوباره تلاش کنید.');

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[12px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#C9093D]">
        <HiOutlineExclamationTriangle className="h-6 w-6" />
      </span>
      <p className="max-w-md text-sm font-bold leading-6 text-[#9F1239]">{text}</p>
      {typeof onRetry === 'function' ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 inline-flex h-10 items-center justify-center rounded-[6px] border border-karava-green bg-white px-4 text-sm font-bold text-karava-green transition-colors hover:bg-[#F2FFF8]"
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}

export default QueryErrorState;
