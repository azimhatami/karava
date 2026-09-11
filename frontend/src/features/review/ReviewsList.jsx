import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import shortDate from '../../utils/shortDate';
import Empty from '../../ui/Empty';
import { HiOutlineChatBubbleBottomCenterText } from 'react-icons/hi2';

function ReviewsList({ reviews = [] }) {
  if (!reviews.length) {
    return (
      <Empty
        resourceName="نظری"
        title="هنوز نظری ثبت نشده است"
        description="پس از تکمیل پروژه، کاربران می‌توانند امتیاز و نظر خود را ثبت کنند."
        icon={HiOutlineChatBubbleBottomCenterText}
      />
    );
  }

  return (
    <ul className="divide-y divide-[#EEEBE3]">
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
                  className="text-sm font-bold text-[#1E7C50] hover:underline"
                >
                  {reviewerName}
                </Link>
              ) : (
                <span className="text-sm font-bold text-[#0E1F1A]">
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
              <p className="mt-2 text-xs text-[#8CA69B]">بدون متن نظر</p>
            )}
            <p className="mt-2 text-xs text-[#8CA69B]">
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
