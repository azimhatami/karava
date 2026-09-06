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
import toast from '../../ui/toast';
import getApiErrorMessage from '../../utils/getApiErrorMessage';
import { getProfileCompletion } from '../../utils/profileCompleteness';
import { digitsOnly } from '../../utils/normalizeDigits';

const ROLE_LABELS = {
  FREELANCER: 'فریلنسر / کارجو',
  OWNER: 'کارفرما',
  ADMIN: 'مدیر سیستم',
};

const STATUS_META = {
  0: { label: 'رد شده', className: 'border-[#C9093D] bg-[#FFF1F2] text-[#BE185D]' },
  1: { label: 'در انتظار تایید', className: 'border-[#F59E0B] bg-[#FFFBEB] text-[#B45309]' },
  2: { label: 'تایید شده', className: 'border-[#00D281] bg-[#ECFDF5] text-[#006045]' },
};

function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'ک';
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]}${parts[1][0]}`;
}

function ProfilePage() {
  const { user, isLoading } = useUser();
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState([]);

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
  if (!user) {
    return (
      <p className="py-10 text-center font-bold text-red-500">
        اطلاعات کاربر دریافت نشد
      </p>
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
        <h2 className="text-base font-bold leading-none text-[#222020]">
          پروفایل من
        </h2>
        <p className="text-base font-bold leading-none text-[#222020]">
          مشاهده و ویرایش اطلاعات حساب کاربری
        </p>
      </div>

      <section className="flex w-full flex-col gap-6 rounded-[12px] border border-[#222020] bg-white p-6">
        <div className="flex flex-col gap-4 rounded-[10px] border border-[#0E6A50] bg-[#F8FFFC] p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#E6F4EC] text-lg font-bold text-[#006045]">
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
              <h3 className="truncate text-base font-bold text-[#222020]">
                {user.name || 'کاربر بدون نام'}
              </h3>
              <p className="mt-1 truncate text-sm text-[#6E6E6E]">
                {user.email || 'ایمیل ثبت نشده'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#006045] bg-white px-2.5 py-1.5 text-xs font-medium text-[#006045]">
              <HiOutlineBriefcase className="h-4 w-4" />
              {roleLabel}
            </span>
            <span
              className={`inline-flex items-center rounded-[6px] border px-2.5 py-1.5 text-xs font-medium ${statusMeta.className}`}
            >
              {statusMeta.label}
            </span>
          </div>
        </div>

        <div className="rounded-[10px] border border-[#D1D5DB] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="text-sm font-bold text-[#222020]">درصد تکمیل پروفایل</h4>
            <span className="text-sm font-bold text-[#006045]">
              {completion.percent}٪
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
            <div
              className="h-full rounded-full bg-[#006045] transition-all"
              style={{ width: `${completion.percent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-[#6E6E6E]">
            {completion.filled} از {completion.total} فیلد مهم تکمیل شده است
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-[8px] border border-[#D1D5DB] bg-[#F9FAFB] p-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#E8F3EE] text-[#006045]">
              <HiOutlinePhone className="h-5 w-5" />
            </span>
            <div className="min-w-0 text-right">
              <p className="text-xs text-[#6E6E6E]">شماره موبایل</p>
              <p className="mt-1 truncate text-sm font-bold text-[#222020]" dir="ltr">
                {user.phoneNumber || '—'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-[8px] border border-[#D1D5DB] bg-[#F9FAFB] p-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#E8F3EE] text-[#006045]">
              <HiOutlineEnvelope className="h-5 w-5" />
            </span>
            <div className="min-w-0 text-right">
              <p className="text-xs text-[#6E6E6E]">ایمیل</p>
              <p className="mt-1 truncate text-sm font-bold text-[#222020]">
                {user.email || '—'}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 rounded-[10px] border border-[#D1D5DB] p-4"
        >
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
            <HiOutlineUser className="h-5 w-5 text-[#006045]" />
            <h4 className="text-sm font-bold text-[#222020]">ویرایش اطلاعات</h4>
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
            <p className="text-xs text-[#6E6E6E]">
              برای ارسال پیشنهاد، بیوگرافی (حداقل ۲۰ کاراکتر) و حداقل یک مهارت لازم است.
            </p>
          ) : null}

          {isOwner ? (
            <p className="text-xs text-[#6E6E6E]">
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
                className="karava-form-submit w-full max-w-[220px]"
              >
                ذخیره تغییرات
              </button>
            )}
          </div>
        </form>

        {isFreelancer ? (
          <div className="flex flex-col gap-4 rounded-[10px] border border-[#D1D5DB] p-4">
            <div className="border-b border-[#E5E7EB] pb-3 text-right">
              <h4 className="text-sm font-bold text-[#222020]">نمونه‌کارها</h4>
              <p className="mt-1 text-xs text-[#6E6E6E]">
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
    </div>
  );
}

export default ProfilePage;
