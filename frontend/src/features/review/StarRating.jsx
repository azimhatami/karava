import { useState } from 'react';
import { HiStar } from 'react-icons/hi2';

function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = 'md',
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  const iconClass = size === 'sm' ? 'h-4 w-4' : 'h-7 w-7';

  return (
    <div
      className="inline-flex items-center gap-0.5"
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={readOnly ? `امتیاز ${value} از ۵` : 'انتخاب امتیاز'}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= shown;
        const starEl = (
          <HiStar
            className={`${iconClass} ${
              filled ? 'text-[#EAB308]' : 'text-[#E4E1D6]'
            }`}
          />
        );

        if (readOnly) {
          return (
            <span key={star} className="inline-flex">
              {starEl}
            </span>
          );
        }

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} ستاره`}
            className="rounded-sm p-0.5 transition-transform hover:scale-110"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange?.(star)}
          >
            {starEl}
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;
