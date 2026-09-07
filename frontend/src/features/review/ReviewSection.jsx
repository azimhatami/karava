import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import ReviewsList from './ReviewsList';
import useProjectReviews from './useProjectReviews';
import Loading from '../../ui/Loading';

function ReviewSection({ project, canParticipate = false }) {
  const projectId = project?._id;
  const isCompleted = project?.status === 'COMPLETED';
  const { isLoading, reviews, myReview, canReview } = useProjectReviews(
    projectId,
    Boolean(projectId),
  );

  if (!projectId) return null;

  if (isLoading) {
    return (
      <section className="rounded-[12px] border border-[#D1D5DB] bg-white p-4">
        <Loading />
      </section>
    );
  }

  return (
    <section className="rounded-[12px] border border-[#D1D5DB] bg-white p-4">
      <h3 className="text-sm font-bold text-[#222020]">نظرات این پروژه</h3>

      {canParticipate && isCompleted && canReview && !myReview ? (
        <div className="mt-4 rounded-[8px] border border-[#006045] bg-[#F8FFFC] p-4">
          <p className="mb-3 text-sm text-[#374151]">
            پروژه تکمیل شده است. امتیاز و نظر خود را ثبت کنید. پس از ثبت قابل
            ویرایش نیست.
          </p>
          <ReviewForm projectId={projectId} />
        </div>
      ) : null}

      {canParticipate && isCompleted && myReview ? (
        <div className="mt-4 rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] p-4">
          <p className="mb-2 text-sm font-bold text-[#006045]">نظر ثبت‌شده شما</p>
          <StarRating value={myReview.rating} readOnly />
          {myReview.comment ? (
            <p className="mt-2 text-sm leading-6 text-[#4B5563]">
              {myReview.comment}
            </p>
          ) : (
            <p className="mt-2 text-xs text-[#9CA3AF]">بدون متن نظر</p>
          )}
        </div>
      ) : null}

      {canParticipate && !isCompleted ? (
        <p className="mt-3 text-sm text-[#6E6E6E]">
          ثبت نظر پس از تکمیل پروژه امکان‌پذیر است.
        </p>
      ) : null}

      <div className="mt-4">
        <ReviewsList reviews={reviews} />
      </div>
    </section>
  );
}

export default ReviewSection;
