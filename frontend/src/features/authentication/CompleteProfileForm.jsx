import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  HiOutlineXCircle,
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineUserGroup,
  HiOutlineBuildingOffice2,
  HiArrowLeft,
} from 'react-icons/hi2';
import { completeProfile } from '../../services/authService';
import toast from '../../ui/toast';
import getApiErrorMessage from '../../utils/getApiErrorMessage';
import Loading from '../../ui/Loading';

const roleOptions = [
  {
    value: 'OWNER',
    label: 'کارفرما',
    description: 'ایجاد پروژه و مدیریت درخواست‌ها',
    icon: HiOutlineBuildingOffice2,
  },
  {
    value: 'FREELANCER',
    label: 'فریلنسر',
    description: 'جستجوی پروژه و ارسال پیشنهاد',
    icon: HiOutlineUserGroup,
  },
];

function CompleteProfileForm() {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      role: '',
    },
  });

  const selectedRole = watch('role');

  const { isPending, mutateAsync } = useMutation({
    mutationFn: completeProfile,
  });

  const onSubmit = async (data) => {
    try {
      const { user, message } = await mutateAsync(data);
      toast.success(message);

      if (user.status !== 2) {
        navigate('/');
        toast.info('پروفایل شما در انتظار تایید است');
        return;
      }

      if (user.role === 'OWNER') return navigate('/owner');
      if (user.role === 'FREELANCER') return navigate('/freelancer');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'تکمیل پروفایل انجام نشد.'));
    }
  };

  return (
    <div className="flex w-full max-w-[520px] flex-col gap-6 rounded-[6px] border border-[#D1D5DB] bg-white p-4">
      <div className="relative flex flex-col items-center gap-3 border-b border-[#E5E7EB] pb-4 pt-1">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="absolute left-0 top-0 h-11 w-11"
          aria-label="بستن"
        >
          <HiOutlineXCircle className="absolute left-[2.29px] top-[2.29px] h-[39px] w-[39px] text-[#0E6A50]" />
        </button>

        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ECFDF5] text-[#006045]">
          <HiOutlineUser className="h-7 w-7" />
        </span>

        <div className="space-y-2 text-center">
          <h1 className="text-base font-bold text-[#222020]">تکمیل پروفایل</h1>
          <p className="text-sm leading-6 text-[#6E6E6E]">
            برای ادامه، اطلاعات حساب کاربری خود را تکمیل کنید
          </p>
        </div>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-right text-sm font-normal text-[#222020]"
          >
            نام و نام خانوادگی
            <span className="text-karava-red"> *</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="مثلاً علی رضایی"
            className="box-border h-[42px] w-full rounded-[12px] border border-[#6E6E6E] bg-white px-3 text-right text-sm text-[#111827] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-karava-green focus:ring-1 focus:ring-karava-green"
            {...register('name', {
              required: 'نام و نام خانوادگی ضروری است',
              minLength: {
                value: 5,
                message: 'نام باید حداقل ۵ کاراکتر باشد',
              },
            })}
          />
          {errors.name ? (
            <span className="block text-right text-xs text-karava-red">
              {errors.name.message}
            </span>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-right text-sm font-normal text-[#222020]"
          >
            ایمیل
            <span className="text-karava-red"> *</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            className="box-border h-[42px] w-full rounded-[12px] border border-[#6E6E6E] bg-white px-3 text-right text-sm text-[#111827] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-karava-green focus:ring-1 focus:ring-karava-green"
            {...register('email', {
              required: 'ایمیل ضروری است',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'ایمیل نامعتبر است',
              },
            })}
          />
          {errors.email ? (
            <span className="block text-right text-xs text-karava-red">
              {errors.email.message}
            </span>
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-end gap-2 text-[#222020]">
            <span className="text-sm font-normal">
              نقش شما
              <span className="text-karava-red"> *</span>
            </span>
            <HiOutlineBriefcase className="h-4 w-4 text-[#006045]" />
          </div>

          <input
            type="hidden"
            {...register('role', { required: 'انتخاب نقش ضروری است' })}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {roleOptions.map((option) => {
              const Icon = option.icon;
              const isActive = selectedRole === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setValue('role', option.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  className={`flex flex-col items-start gap-2 rounded-[10px] border p-3 text-right transition-colors ${
                    isActive
                      ? 'border-[#006045] bg-[#ECFDF5]'
                      : 'border-[#6E6E6E] bg-white hover:bg-[#F9FAFB]'
                  }`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#E8F3EE] text-[#007A55]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-bold text-[#222020]">
                    {option.label}
                  </span>
                  <span className="text-xs leading-5 text-[#6E6E6E]">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>

          {errors.role ? (
            <span className="block text-right text-xs text-karava-red">
              {errors.role.message}
            </span>
          ) : null}
        </div>

        <div className="pt-1">
          {isPending ? (
            <div className="flex h-[44px] items-center justify-center">
              <Loading />
            </div>
          ) : (
            <button
              type="submit"
              className="flex h-[44px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#00573F] p-2.5 text-white transition-colors hover:bg-karava-green-dark"
            >
              <span className="text-sm">تایید و ادامه</span>
              <HiArrowLeft className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CompleteProfileForm;
