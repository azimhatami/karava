import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import shortDate from '../../utils/shortDate';
import Empty from '../../ui/Empty';

function ReviewsList({ reviews = [] }) {
  if (!reviews.length) {
    return (
      <div className="p-4">
        <Empty resourceName="نظری" />
      </div>
    );
  }

  return (
    <ul className="divide-y divide-[#E5E7EB]">
      {reviews.map((review) => {
        const reviewerId = review.reviewer?._id;
        const reviewerName = review.reviewer?.name || 'کاربر';
        const projectTitle = review.project?.title;

        return (
          <li key={review._id} className="px-4 py-4 text-right">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {reviewerId ? (
                <Link
                  to={`/users/${reviewerId}`}
                  className="text-sm font-bold text-[#006045] hover:underline"
                >
                  {reviewerName}
                </Link>
              ) : (
                <span className="text-sm font-bold text-[#222020]">
                  {reviewerName}
                </span>
              )}
              <StarRating value={review.rating} readOnly size="sm" />
            </div>
            {review.comment ? (
              <p className="mt-2 text-sm leading-6 text-[#4B5563]">
                {review.comment}
              </p>
            ) : (
              <p className="mt-2 text-xs text-[#9CA3AF]">بدون متن نظر</p>
            )}
            <p className="mt-2 text-xs text-[#9CA3AF]">
              {projectTitle ? `پروژه «${projectTitle}» · ` : ''}
              {review.createdAt ? shortDate(review.createdAt) : '—'}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

export default ReviewsList;
