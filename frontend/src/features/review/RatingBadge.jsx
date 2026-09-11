import { HiStar } from 'react-icons/hi2';
import { toPersianNumbers } from '../../utils/toPersianNumbers';

function RatingBadge({
  averageRating = 0,
  totalReviews = 0,
  emptyLabel = 'بدون امتیاز',
  className = '',
}) {
  if (!totalReviews) {
    return (
      <span className={`text-xs text-[#8CA69B] ${className}`}>{emptyLabel}</span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-bold text-[#854D0E] ${className}`}
      title={`${averageRating} از ۵`}
    >
      <HiStar className="h-3.5 w-3.5 text-[#EAB308]" />
      {toPersianNumbers(averageRating)} از {toPersianNumbers(totalReviews)} نظر
    </span>
  );
}

export default RatingBadge;
