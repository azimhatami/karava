import { Link, useParams } from 'react-router-dom';
import {
  HiOutlineArrowRight,
  HiOutlineBriefcase,
  HiOutlineUser,
} from 'react-icons/hi2';
import HomeHeader from '../home/HomeHeader';
import Loading from '../../ui/Loading';
import QueryErrorState from '../../ui/QueryErrorState';
import useUserReviews from '../review/useUserReviews';
import StarRating from '../review/StarRating';
import ReviewsList from '../review/ReviewsList';
import RatingBadge from '../review/RatingBadge';
import { toPersianNumbers } from '../../utils/toPersianNumbers';

const ROLE_LABELS = {
  FREELANCER: 'فریلنسر / کارجو',
  OWNER: 'کارفرما',
  ADMIN: 'مدیر سیستم',
};

function PublicProfilePage() {
  const { userId } = useParams();
  const {
    isLoading,
    isError,
    error,
    refetch,
    user,
    reviews,
    averageRating,
    totalReviews,
  } = useUserReviews(userId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ink-paper">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 md:px-8 xl:px-[140px]">
          <HomeHeader variant="paper" />
          <div className="flex justify-center py-20">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-ink-paper">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 md:px-8 xl:px-[140px]">
          <HomeHeader variant="paper" />
          <div className="mt-10">
            <QueryErrorState
              error={error}
              message={
                error?.response?.status === 404
                  ? 'پروفایل یافت نشد یا در دسترس نیست.'
                  : undefined
              }
              onRetry={refetch}
            />
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="inline-flex text-sm font-bold text-ink-mint-mid hover:text-ink-mint-deep"
              >
                بازگشت به صفحه اصلی
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const roleLabel = ROLE_LABELS[user.role] || 'کاربر';

  return (
    <div className="min-h-screen bg-ink-paper">
      <div className="mx-auto w-full max-w-[1440px] space-y-6 px-4 pb-16 pt-6 md:px-8 xl:px-[140px]">
        <HomeHeader variant="paper" />

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[13.5px] font-bold text-ink-mint-mid transition-colors hover:text-ink-mint-deep"
        >
          <HiOutlineArrowRight className="h-4 w-4" />
          بازگشت
        </Link>

        <section className="ink-card p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-raised text-ink-mint">
                <HiOutlineUser className="h-7 w-7" />
              </span>
              <div>
                <h1 className="text-2xl font-black tracking-[-0.015em] text-ink-text">
                  {user.name || 'کاربر کارآوا'}
                </h1>
                <p className="mt-1.5 text-[13px] text-ink-muted">{roleLabel}</p>
              </div>
            </div>
            <div className="rounded-xl border border-ink-hair bg-ink-well px-4 py-3 text-right">
              <StarRating value={Math.round(averageRating)} readOnly />
              <div className="mt-2">
                <RatingBadge
                  averageRating={averageRating}
                  totalReviews={totalReviews}
                />
              </div>
            </div>
          </div>

          {user.companyName ? (
            <p className="mt-5 flex items-center gap-2 text-sm text-ink-body">
              <HiOutlineBriefcase className="h-4 w-4 text-ink-mint-mid" />
              {user.companyName}
            </p>
          ) : null}

          {user.biography || user.companyDescription ? (
            <p className="mt-5 whitespace-pre-wrap text-[15px] leading-[2.1] text-ink-body">
              {user.biography || user.companyDescription}
            </p>
          ) : null}

          {user.role === 'FREELANCER' && (user.skills || []).length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <span
                  key={skill}
                  className="flex h-8 items-center rounded-lg border border-ink-line px-3.5 font-['Sora',_sans-serif] text-[13px] text-ink-body"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : null}
        </section>

        <section className="ink-card overflow-hidden">
          <div className="border-b border-ink-hair px-5 py-4">
            <h2 className="text-[15px] font-bold text-ink-text">
              نظرات ({toPersianNumbers(totalReviews)})
            </h2>
          </div>
          <ReviewsList reviews={reviews} />
        </section>
      </div>
    </div>
  );
}

export default PublicProfilePage;
