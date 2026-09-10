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
      <div className="min-h-screen bg-karava-bg-subtle">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 md:px-8 md:py-8 xl:px-[108px]">
          <HomeHeader />
          <div className="flex justify-center py-20">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-karava-bg-subtle">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 md:px-8 md:py-8 xl:px-[108px]">
          <HomeHeader />
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
                className="inline-flex text-sm font-bold text-[#006045] hover:text-[#004d37]"
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
    <div className="min-h-screen bg-karava-bg-subtle">
      <div className="mx-auto w-full max-w-[1440px] space-y-6 px-4 py-6 md:px-8 md:py-8 xl:px-[108px]">
        <HomeHeader />

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#006045] hover:text-[#004d37]"
        >
          <HiOutlineArrowRight className="h-4 w-4" />
          بازگشت
        </Link>

        <section className="rounded-[12px] border border-[#222020] bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F3EE] text-[#006045]">
                <HiOutlineUser className="h-7 w-7" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-[#222020]">
                  {user.name || 'کاربر کارآوا'}
                </h1>
                <p className="mt-1 text-sm text-[#006045]">{roleLabel}</p>
              </div>
            </div>
            <div className="rounded-[8px] border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-right">
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
            <p className="mt-4 flex items-center gap-2 text-sm text-[#374151]">
              <HiOutlineBriefcase className="h-4 w-4 text-[#006045]" />
              {user.companyName}
            </p>
          ) : null}

          {user.biography || user.companyDescription ? (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#4B5563]">
              {user.biography || user.companyDescription}
            </p>
          ) : null}

          {user.role === 'FREELANCER' && (user.skills || []).length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-[6px] border border-[#007A55] bg-[#8EC3A9] px-2.5 py-1.5 text-xs text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : null}
        </section>

        <section className="overflow-hidden rounded-[12px] border border-[#D1D5DB] bg-white">
          <div className="border-b border-[#E5E7EB] px-4 py-3">
            <h2 className="text-sm font-bold text-[#222020]">
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
