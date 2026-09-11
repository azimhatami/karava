import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineUser,
  HiOutlineBriefcase,
} from 'react-icons/hi2';
import useUser from '../authentication/useUser';
import { updateProfile } from '../../services/authService';
import {
  deletePortfolioFile,
  uploadPortfolioFile,
} from '../../services/uploadService';
import TextField from '../../ui/TextField';
import KaravaTagsInput from '../../ui/KaravaTagsInput';
import FileUploadField, { FileList } from '../../ui/FileUploadField';
import Loading from '../../ui/Loading';
import QueryErrorState from '../../ui/QueryErrorState';
import { StatusChip } from '../../ui/DataTable';
import toast from '../../ui/toast';
import getApiErrorMessage from '../../utils/getApiErrorMessage';
import { getProfileCompletion } from '../../utils/profileCompleteness';
import { digitsOnly } from '../../utils/normalizeDigits';
import { Link } from 'react-router-dom';
import useUserReviews from '../review/useUserReviews';
import RatingBadge from '../review/RatingBadge';
import ReviewsList from '../review/ReviewsList';

const ROLE_LABELS = {
  FREELANCER: 'فریلنسر / کارجو',
  OWNER: 'کارفرما',
  ADMIN: 'مدیر سیستم',
};

const STATUS_META = {
  0: { label: 'رد شده', status: 'rejected' },
  1: { label: 'در انتظار تایید', status: 'pending' },
  2: { label: 'تایید شده', status: 'accepted' },
};

function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'ک';
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]}${parts[1][0]}`;
}

function ProfilePage() {
  const { user, isLoading, isError, error, refetch } = useUser();
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState([]);
  const {
    reviews,
    averageRating,
    totalReviews,
    isLoading: reviewsLoading,
    isError: reviewsError,
    error: reviewsErr,
    refetch: refetchReviews,
  } = useUserReviews(user?._id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      biography: '',
      companyName: '',
      companyDescription: '',
    },
  });

  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      biography: user.biography || '',
      companyName: user.companyName || '',
      companyDescription: user.companyDescription || '',
    });
    setSkills(user.skills || []);
  }, [user, reset]);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        phoneNumber: digitsOnly(data.phoneNumber).slice(0, 11),
        skills: user?.role === 'FREELANCER' ? skills : undefined,
      };
      const { message } = await mutateAsync(payload);
      toast.success(message || 'اطلاعات با موفقیت آپدیت شد');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'ویرایش پروفایل انجام نشد.'));
    }
  };

  if (isLoading) return <Loading />;
  if (isError || !user) {
    return (
      <QueryErrorState
        error={error}
        message="اطلاعات کاربر دریافت نشد"
        onRetry={refetch}
      />
    );
  }

  const statusMeta = STATUS_META[Number(user.status)] || STATUS_META[1];
  const roleLabel = ROLE_LABELS[user.role] || user.role || 'کاربر';
  const completion = getProfileCompletion(user);
  const isFreelancer = user.role === 'FREELANCER';
  const isOwner = user.role === 'OWNER';
  const skillsDirty =
    JSON.stringify(skills) !== JSON.stringify(user.skills || []);
  const canSubmit = isDirty || skillsDirty;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-2.5 p-2.5 text-right">
        <h2 className="text-[15px] font-bold text-ink-text">
          پروفایل من
        </h2>
        <p className="text-[15px] font-bold text-ink-text">
          مشاهده و ویرایش اطلاعات حساب کاربری
        </p>
      </div>

      <section className="flex w-full flex-col gap-6 ink-card p-6 md:p-8">
        <div className="flex flex-col gap-4 rounded-xl border border-ink-hair bg-ink-well p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink-raised text-lg font-bold text-ink-mint">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name || 'avatar'}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                getInitials(user.name)
              )}
            </div>
            <div className="min-w-0 text-right">
              <h3 className="truncate text-[15px] font-bold text-ink-text">
                {user.name || 'کاربر بدون نام'}
              </h3>
              <p className="mt-1 truncate text-[13px] text-ink-muted">
                {user.email || 'ایمیل ثبت نشده'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-ink-line px-3 py-1.5 text-[12.5px] font-medium text-ink-muted transition-colors hover:bg-ink-well">
              <HiOutlineBriefcase className="h-4 w-4" />
              {roleLabel}
            </span>
            <StatusChip status={statusMeta.status} label={statusMeta.label} />
            <RatingBadge
              averageRating={user.averageRating ?? averageRating}
              totalReviews={user.totalReviews ?? totalReviews}
            />
            <Link
              to={`/users/${user._id}`}
              className="text-[12.5px] font-bold text-ink-mint-mid underline"
            >
              پروفایل عمومی
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-ink-line p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="text-[14.5px] font-bold text-ink-text">درصد تکمیل پروفایل</h4>
            <span className="text-[13px] font-bold text-ink-mint-mid">
              {completion.percent}٪
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-ink-well">
            <div
              className="h-full rounded-full bg-ink-mint-mid transition-all"
              style={{ width: `${completion.percent}%` }}
            />
          </div>
          <p className="mt-2 text-[12.5px] text-ink-muted">
            {completion.filled} از {completion.total} فیلد مهم تکمیل شده است
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-ink-hair bg-ink-card p-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-well text-ink-mint-deep">
              <HiOutlinePhone className="h-5 w-5" />
            </span>
            <div className="min-w-0 text-right">
              <p className="text-[12.5px] text-ink-muted">شماره موبایل</p>
              <p className="mt-1 truncate text-[14.5px] font-bold text-ink-text" dir="ltr">
                {user.phoneNumber || '—'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-ink-hair bg-ink-card p-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-well text-ink-mint-deep">
              <HiOutlineEnvelope className="h-5 w-5" />
            </span>
            <div className="min-w-0 text-right">
              <p className="text-[12.5px] text-ink-muted">ایمیل</p>
              <p className="mt-1 truncate text-[14.5px] font-bold text-ink-text">
                {user.email || '—'}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 rounded-xl border border-ink-line p-4"
        >
          <div className="flex items-center gap-2 border-b border-[#EEEBE3] pb-3">
            <HiOutlineUser className="h-5 w-5 text-ink-mint-mid" />
            <h4 className="text-[14.5px] font-bold text-ink-text">ویرایش اطلاعات</h4>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              label="نام و نام خانوادگی"
              name="name"
              register={register}
              required
              validationSchema={{
                required: 'نام و نام خانوادگی ضروری است',
                minLength: {
                  value: 5,
                  message: 'نام باید حداقل ۵ کاراکتر باشد',
                },
              }}
              errors={errors}
              placeholder="مثلاً علی رضایی"
            />
            <TextField
              label="ایمیل"
              name="email"
              type="email"
              register={register}
              required
              validationSchema={{
                required: 'ایمیل ضروری است',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'ایمیل نامعتبر است',
                },
              }}
              errors={errors}
              placeholder="name@example.com"
            />
            <TextField
              label="شماره موبایل"
              name="phoneNumber"
              numeric
              inputMode="tel"
              register={register}
              required
              validationSchema={{
                required: 'شماره موبایل ضروری است',
                pattern: {
                  value: /^09[0-9]{9}$/,
                  message: 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود',
                },
              }}
              errors={errors}
              placeholder="09123456789"
            />

            {isFreelancer ? (
              <TextField
                label="بیوگرافی"
                name="biography"
                register={register}
                multiline
                rows={3}
                validationSchema={{
                  maxLength: {
                    value: 500,
                    message: 'حداکثر ۵۰۰ کاراکتر',
                  },
                }}
                errors={errors}
                placeholder="درباره مهارت‌ها و تجربه کاری‌تان بنویسید (حداقل ۲۰ کاراکتر برای ارسال پیشنهاد)"
              />
            ) : null}

            {isOwner ? (
              <>
                <TextField
                  label="نام شرکت/کسب‌وکار"
                  name="companyName"
                  register={register}
                  validationSchema={{
                    maxLength: {
                      value: 100,
                      message: 'حداکثر ۱۰۰ کاراکتر',
                    },
                  }}
                  errors={errors}
                  placeholder="مثلاً استارتاپ کارآوا"
                />
                <TextField
                  label="معرفی کسب‌وکار"
                  name="companyDescription"
                  register={register}
                  multiline
                  rows={3}
                  validationSchema={{
                    maxLength: {
                      value: 500,
                      message: 'حداکثر ۵۰۰ کاراکتر',
                    },
                  }}
                  errors={errors}
                  placeholder="توضیح کوتاه درباره فعالیت کسب‌وکار (حداقل ۲۰ کاراکتر برای ثبت پروژه)"
                />
              </>
            ) : null}
          </div>

          {isFreelancer ? (
            <KaravaTagsInput
              label="مهارت‌ها"
              placeholder="افزودن مهارت (مثلا React)"
              tags={skills}
              onChange={setSkills}
            />
          ) : null}

          {isFreelancer ? (
            <p className="text-[12.5px] text-ink-muted">
              برای ارسال پیشنهاد، بیوگرافی (حداقل ۲۰ کاراکتر) و حداقل یک مهارت لازم است.
            </p>
          ) : null}

          {isOwner ? (
            <p className="text-[12.5px] text-ink-muted">
              برای ثبت پروژه، نام شرکت و معرفی کسب‌وکار (حداقل ۲۰ کاراکتر) لازم است.
            </p>
          ) : null}

          <div className="flex justify-end">
            {isPending ? (
              <div className="flex h-[46px] w-full max-w-[220px] items-center justify-center">
                <Loading />
              </div>
            ) : (
              <button
                type="submit"
                disabled={!canSubmit}
                className="ink-btn-accent w-full max-w-[220px]"
              >
                ذخیره تغییرات
              </button>
            )}
          </div>
        </form>

        {isFreelancer ? (
          <div className="flex flex-col gap-4 rounded-xl border border-ink-line p-4">
            <div className="border-b border-[#EEEBE3] pb-3 text-right">
              <h4 className="text-[14.5px] font-bold text-ink-text">نمونه‌کارها</h4>
              <p className="mt-1 text-[12.5px] text-ink-muted">
                تصاویر پروژه‌های قبلی خود را آپلود کنید (jpg، png، webp — حداکثر ۵ مگابایت)
              </p>
            </div>

            <FileUploadField
              kind="portfolio"
              label="افزودن نمونه‌کار"
              hint="می‌توانید فایل را بکشید و رها کنید"
              onUpload={async (file) => {
                try {
                  const { message } = await uploadPortfolioFile(file);
                  toast.success(message || 'نمونه‌کار آپلود شد');
                  queryClient.invalidateQueries({ queryKey: ['user'] });
                } catch (error) {
                  toast.error(getApiErrorMessage(error, 'آپلود نمونه‌کار انجام نشد'));
                  throw error;
                }
              }}
            />

            <FileList
              files={user.portfolio || []}
              canDelete
              emptyText="هنوز نمونه‌کاری آپلود نشده است"
              onDelete={async (file) => {
                try {
                  const { message } = await deletePortfolioFile(file._id);
                  toast.success(message || 'نمونه‌کار حذف شد');
                  queryClient.invalidateQueries({ queryKey: ['user'] });
                } catch (error) {
                  toast.error(getApiErrorMessage(error, 'حذف نمونه‌کار انجام نشد'));
                }
              }}
            />
          </div>
        ) : null}
      </section>

      <section className="overflow-hidden ink-card">
        <div className="border-b border-[#EEEBE3] px-4 py-3">
          <h3 className="text-[14.5px] font-bold text-ink-text">نظرات دریافتی</h3>
        </div>
        {reviewsLoading ? (
          <div className="flex justify-center py-8">
            <Loading />
          </div>
        ) : reviewsError ? (
          <QueryErrorState error={reviewsErr} onRetry={refetchReviews} />
        ) : (
          <ReviewsList reviews={reviews} />
        )}
      </section>
    </div>
  );
}

export default ProfilePage;
